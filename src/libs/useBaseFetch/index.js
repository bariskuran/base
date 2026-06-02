import { useCallback, useEffect, useMemo, useRef } from "react";
import { baseStore } from "../baseStore";
import { baseFetch } from "../baseFetch";
import { useTimer } from "../useTimer";

export const useBaseFetch = (callOrCalls, joint = {}) => {
    const { refreshTime = 0, disableAutoStart = false, ...jointSettings } = joint || {};

    const { status, isOk, response, responses, errors, set } = baseStore.useLocal({
        status: "idle",
        isOk: null,
        response: undefined,
        responses: undefined,
        errors: undefined,
    });

    const playingRef = useRef(!disableAutoStart);
    const currentCancelRef = useRef(null);
    const currentPromiseRef = useRef(null);
    const callRef = useRef(callOrCalls);
    const jointRef = useRef(jointSettings);
    const hookRef = useRef({ refreshTime, disableAutoStart });

    useEffect(() => {
        callRef.current = callOrCalls;
    }, [callOrCalls]);

    useEffect(() => {
        jointRef.current = jointSettings || {};
    }, [jointSettings]);

    useEffect(() => {
        hookRef.current = { refreshTime, disableAutoStart };
    }, [refreshTime, disableAutoStart]);

    const stopTimerSafe = useRef(() => {});
    const startTimerSafe = useRef(() => {});

    const { start: startTimer, stop: stopTimer } = useTimer({
        timerName: "baseFetchRefresh",
        startOnLoad: false,
        loop: false,
        refreshTime: 1000,
        onEnd: () => {
            if (!playingRef.current) return;
            runRef.current?.({ reason: "refreshTime" });
        },
    });

    useEffect(() => {
        stopTimerSafe.current = stopTimer;
        startTimerSafe.current = startTimer;
    }, [startTimer, stopTimer]);

    const cancelFetch = useCallback((reason = "canceled") => {
        stopTimerSafe.current?.();
        try {
            currentCancelRef.current?.(reason);
        } catch (e) {
            console.error("[useBaseFetch] cancelFetch error:", e);
        }
    }, []);

    const scheduleNext = useCallback(() => {
        const mins = Number(hookRef.current?.refreshTime || 0);
        if (!mins || mins <= 0) return;
        startTimerSafe.current?.({ refreshTime: mins * 60 * 1000, loop: false });
    }, []);

    const runOnce = useCallback(
        (options = {}) => {
            const calls = callRef.current;
            const joint = jointRef.current || {};

            cancelFetch("replaced");

            set?.((s) => {
                s.status = "loading";
                s.isOk = null;
                s.errors = undefined;
                s.response = undefined;
                s.responses = undefined;
            });

            const userOnSuccess = joint.onSuccess;
            const userOnError = joint.onError;
            const userOnCancel = joint.onCancel;

            const wrappedJoint = {
                ...joint,
                onSuccess: (res) => {
                    set?.((s) => {
                        s.status = "success";
                        s.isOk = true;
                        s.errors = undefined;

                        if (res && "response" in res) {
                            s.response = res.response;
                            s.responses = undefined;
                        } else {
                            s.responses = res?.responses;
                            s.response = undefined;
                        }
                    });

                    try {
                        userOnSuccess?.(res);
                    } catch (e) {
                        console.error("[useBaseFetch] onSuccess callback error:", e);
                    }

                    scheduleNext();
                },
                onError: (res) => {
                    set?.((s) => {
                        s.status = "error";
                        s.isOk = false;
                        s.errors = res?.errors?.length ? res.errors : undefined;

                        if (res && "response" in res) {
                            s.response = res.response;
                            s.responses = undefined;
                        } else {
                            s.responses = res?.responses;
                            s.response = undefined;
                        }
                    });

                    try {
                        userOnError?.(res);
                    } catch (e) {
                        console.error("[useBaseFetch] onError callback error:", e);
                    }

                    scheduleNext();
                },
                onCancel: (info) => {
                    set?.((s) => {
                        s.status = "canceled";
                        s.isOk = false;
                        s.errors = undefined;
                    });

                    try {
                        userOnCancel?.(info);
                    } catch (e) {
                        console.error("[useBaseFetch] onCancel callback error:", e);
                    }
                },
            };

            const { promise, cancelFetch: cancelInner } = baseFetch(calls, wrappedJoint);

            currentCancelRef.current = cancelInner;
            currentPromiseRef.current = promise;

            return { promise, cancelFetch: cancelInner, meta: options };
        },
        [cancelFetch, scheduleNext, set],
    );

    const runRef = useRef(null);
    useEffect(() => {
        runRef.current = (options) => runOnce(options);
    }, [runOnce]);

    const player = useMemo(() => {
        return {
            play: () => {
                playingRef.current = true;
                runRef.current?.({ reason: "play" });
            },
            pause: () => {
                playingRef.current = false;
                cancelFetch("paused");
            },
            get isPlaying() {
                return Boolean(playingRef.current);
            },
        };
    }, [cancelFetch]);

    useEffect(() => {
        if (disableAutoStart) {
            playingRef.current = false;
            return;
        }

        playingRef.current = true;
        runRef.current?.({ reason: "autoStart" });

        return () => {
            cancelFetch("unmount");
        };
    }, []);

    return {
        status,
        isOk,
        response,
        responses,
        errors,
        promise: currentPromiseRef.current,
        cancelFetch,
        player,
        refetch: () => runRef.current?.({ reason: "refetch" })?.promise,
    };
};
