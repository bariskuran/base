import { useCallback, useEffect, useMemo, useRef } from "react";
import { baseStore } from "../../@baseStore";
import { baseFetch } from "../baseFetch";
import { useTimer } from "../../useTimer";

/**
 * React hook wrapper around `baseFetch` with auto-start, refresh polling, and cancel/play controls.
 *
 * Key features:
 * - Uses `baseFetch` internally (supports single call, parallel multi-call, and pipeline multi-call via `baseFetch` settings).
 * - Auto-starts on mount by default (can be disabled with `disableAutoStart`).
 * - Optional refresh/polling via `refreshTime` (minutes). If `refreshTime > 0`, it re-fetches after each completion.
 * - Exposes `player.play()` / `player.pause()` for runtime control.
 * - Exposes `cancelFetch(reason)` to cancel current request(s).
 *
 * Notes:
 * - `refreshTime` and `disableAutoStart` are taken from the `joint` argument for convenience.
 * - `player.pause()` cancels the current request (reason: `"paused"`) and stops the refresh timer.
 * - `cancelFetch("replaced")` is called before starting a new run to ensure only one active run.
 *
 * @function useBaseFetch
 *
 * @param {Object|Object[]} callOrCalls
 * Single call object or an array of call objects (same shape as `baseFetch`).
 *
 * Call object shape (handled by `baseFetch`, shown here for reference):
 * @param {string} callOrCalls.url - Endpoint URL.
 * @param {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"HEAD"|"OPTIONS"} [callOrCalls.method="GET"]
 * @param {*} [callOrCalls.body]
 * @param {"include"|"omit"|"same-origin"} [callOrCalls.credentials]
 * @param {Object} [callOrCalls.headers]
 * @param {boolean} [callOrCalls.useCache=false]
 * @param {number} [callOrCalls.cacheTime] - Minutes.
 * @param {Object} [callOrCalls.payload]
 * @param {Function} [callOrCalls.payloadAdaptor] - For pipeline payload derivation.
 * @param {boolean} [callOrCalls.disableAuth]
 * @param {Function} [callOrCalls.getTokenFrom]
 * @param {string} [callOrCalls.token]
 * @param {Function} [callOrCalls.onStart]
 * @param {Function} [callOrCalls.onEnd]
 *
 * @param {Object} [joint={}]
 * BaseFetch joint settings + hook extras (merged in this argument):
 * @param {boolean} [joint.enableSynchronousCalls=false]
 * When `callOrCalls` is an array: `false` => parallel, `true` => pipeline.
 * @param {boolean} [joint.disableLoadingApi=false]
 * @param {string|null} [joint.envUrl=null]
 * @param {Function} [joint.onSuccess]
 * @param {Function} [joint.onError]
 * @param {Function} [joint.onCancel]
 *
 * Hook extras (consumed by this hook; removed from joint settings before passing to `baseFetch`):
 * @param {number} [joint.refreshTime=0]
 * Minutes. `0` => no auto refresh. `>0` => schedules next fetch after completion.
 * @param {boolean} [joint.disableAutoStart=false]
 * If `true`, will not run on mount. Use `player.play()` to start.
 *
 * @returns {Object}
 * @returns {"idle"|"loading"|"success"|"error"|"canceled"} returns.status
 * @returns {boolean|null} returns.isOk
 * `true` on success, `false` on error/canceled, `null` while idle/loading.
 * @returns {*} returns.response
 * For single-call runs: processed response (after per-call `onEnd`), otherwise `undefined`.
 * @returns {Array|undefined} returns.responses
 * For multi-call runs: processed responses in call order (after per-call `onEnd`), otherwise `undefined`.
 * @returns {Array|undefined} returns.errors
 * Present when status is `"error"` and `baseFetch` produced errors.
 * @returns {Promise|undefined} returns.promise
 * The currently-running promise (best-effort reference; updated on each run).
 * @returns {(reason?: string) => void} returns.cancelFetch
 * Cancels the in-flight fetch and stops refresh timer. (Internally forwards to `baseFetch.cancelFetch`.)
 * @returns {{ play: Function, pause: Function, readonly isPlaying: boolean }} returns.player
 * Playback-style control:
 * - `play()` sets `isPlaying=true` and starts a run immediately
 * - `pause()` sets `isPlaying=false`, cancels in-flight request, stops refresh
 * @returns {() => (Promise|undefined)} returns.refetch
 * Manually triggers a new run and returns the new run's promise.
 *
 * @example
 * // 1) Single call (auto-start on mount)
 * const { status, response, isOk } = useBaseFetch(
 *   { url: "/users/me", method: "GET" },
 *   {
 *     onSuccess: (res) => console.log("ok", res.response),
 *     onError: (res) => console.log("err", res.errors),
 *   }
 * );
 *
 * @example
 * // 2) Manual start (disableAutoStart) + play/pause
 * const { player, status, response } = useBaseFetch(
 *   { url: "/report", method: "GET" },
 *   { disableAutoStart: true }
 * );
 *
 * // later...
 * // player.play();
 * // player.pause();
 *
 * @example
 * // 3) Polling every 1 minute (refreshTime is minutes)
 * const { status, response } = useBaseFetch(
 *   { url: "/notifications", method: "GET" },
 *   { refreshTime: 1 }
 * );
 *
 * @example
 * // 4) Parallel multi-call (default: enableSynchronousCalls=false)
 * const { responses, errors, status } = useBaseFetch(
 *   [
 *     { url: "/profile", method: "GET" },
 *     { url: "/settings", method: "GET" },
 *   ],
 *   {
 *     onSuccess: (res) => console.log(res.responses),
 *     onError: (res) => console.log(res.errors),
 *   }
 * );
 *
 * @example
 * // 5) Pipeline multi-call (enableSynchronousCalls=true)
 * // call2 payloadAdaptor receives previous results in order: (res1, res2, ...)
 * const { responses, status } = useBaseFetch(
 *   [
 *     { url: "/auth/session", method: "GET" },
 *     {
 *       url: "/projects",
 *       method: "GET",
 *       payloadAdaptor: (session) => ({ userId: session?.user?.id }),
 *     },
 *     {
 *       url: "/project/details",
 *       method: "GET",
 *       payloadAdaptor: (session, projects) => ({ id: projects?.[0]?.id }),
 *     },
 *   ],
 *   { enableSynchronousCalls: true }
 * );
 *
 * @example
 * // 6) Transforming per-call output with onEnd
 * // Whatever onEnd returns becomes the call's "data" and is used by later pipeline calls.
 * const { response } = useBaseFetch(
 *   {
 *     url: "/users",
 *     method: "GET",
 *     onEnd: (data, err) => {
 *       if (err) return null;
 *       return (data?.users || []).map((u) => ({ id: u.id, name: u.name }));
 *     },
 *   },
 *   {}
 * );
 *
 * @example
 * // 7) Cancel manually (e.g. on button click)
 * const { cancelFetch, status } = useBaseFetch({ url: "/slow", method: "GET" }, {});
 * // cancelFetch("user_clicked_cancel");
 */
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
