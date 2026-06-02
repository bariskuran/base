import { useRef, useEffect, useCallback } from "react";
import { baseStore } from "../baseStore";

const _timers = new Map();
const _listeners = new Set();

const _emit = () => {
    for (const fn of _listeners) {
        try {
            fn(getTimersSnapshot());
        } catch (e) {
            console.error("Timer registry subscriber error:", e);
        }
    }
};

export const subscribeTimers = (listener) => {
    if (typeof listener !== "function") return () => {};
    _listeners.add(listener);
    return () => _listeners.delete(listener);
};

export const getTimersSnapshot = () => {

    return Array.from(_timers.values()).map((t) => ({ ...t }));
};

export const getTimer = (idOrName) => {
    const key = String(idOrName || "");
    if (!key) return null;


    if (_timers.has(key)) return { ..._timers.get(key) };


    for (const t of _timers.values()) {
        if (t?.timerName === key) return { ...t };
    }
    return null;
};

const _upsertTimer = (meta) => {
    if (!meta?.timerId) return;
    _timers.set(meta.timerId, meta);
    _emit();
};

const _removeTimer = (timerId) => {
    if (!timerId) return;
    _timers.delete(timerId);
    _emit();
};

const generateTimerId = () => {
    if (typeof crypto !== "undefined" && crypto?.randomUUID) return crypto.randomUUID();
    return `timer_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const useTimer = (settings = {}) => {
    const {
        onStart,
        onEnd,
        refreshTime = 1000,
        loop = true,
        startOnLoad = false,
        timerName,
    } = settings;

    const { isRunning, set } = baseStore.useLocal({ isRunning: false });

    const timerIdRef = useRef(null);
    if (timerIdRef.current == null) {
        timerIdRef.current = timerName || generateTimerId();
    }

    const timeoutRef = useRef(null);
    const onStartRef = useRef(onStart);
    const onEndRef = useRef(onEnd);
    const refreshRef = useRef(refreshTime);
    const loopRef = useRef(loop);
    const startRef = useRef(null);


    useEffect(() => {
        onStartRef.current = onStart;
        onEndRef.current = onEnd;
        refreshRef.current = refreshTime;
        loopRef.current = loop;

        _upsertTimer({
            timerId: timerIdRef.current,
            timerName: timerName || timerIdRef.current,
            refreshTime: refreshRef.current,
            loop: loopRef.current,
            isRunning: !!isRunning,
        });
    }, [onStart, onEnd, refreshTime, loop, timerName, isRunning]);

    useEffect(() => {
        _upsertTimer({
            timerId: timerIdRef.current,
            timerName: timerName || timerIdRef.current,
            refreshTime: refreshRef.current,
            loop: loopRef.current,
            isRunning: !!isRunning,
        });

        return () => {
            _removeTimer(timerIdRef.current);
        };
    }, []);

    const stop = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        set?.({ isRunning: false });

        _upsertTimer({
            timerId: timerIdRef.current,
            timerName: timerName || timerIdRef.current,
            refreshTime: refreshRef.current,
            loop: loopRef.current,
            isRunning: false,
        });
    }, [set, timerName]);

    const start = useCallback(
        (overrides = {}) => {
            const { refreshTime: refreshOverride, loop: loopOverride } = overrides;

            if (typeof refreshOverride === "number") refreshRef.current = refreshOverride;
            if (typeof loopOverride === "boolean") loopRef.current = loopOverride;

            stop();

            set?.({ isRunning: true });

            _upsertTimer({
                timerId: timerIdRef.current,
                timerName: timerName || timerIdRef.current,
                refreshTime: refreshRef.current,
                loop: loopRef.current,
                isRunning: true,
            });

            onStartRef.current?.();

            timeoutRef.current = setTimeout(() => {
                onEndRef.current?.();

                if (loopRef.current) startRef.current?.();
                else {
                    set?.({ isRunning: false });
                    _upsertTimer({
                        timerId: timerIdRef.current,
                        timerName: timerName || timerIdRef.current,
                        refreshTime: refreshRef.current,
                        loop: loopRef.current,
                        isRunning: false,
                    });
                }
            }, refreshRef.current);
        },
        [stop, set, timerName],
    );

    useEffect(() => {
        startRef.current = start;
    }, [start]);

    useEffect(() => {
        if (startOnLoad) start();
        return () => stop();
    }, [startOnLoad, start, stop]);

    return {
        start,
        stop,
        isRunning,
        timerId: timerIdRef,
        timerName: timerName || timerIdRef,
        refreshTime: refreshRef,
    };
};
