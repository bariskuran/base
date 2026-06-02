import { useEffect, useMemo, useRef, useCallback } from "react";
import { useDebouncedFunction } from "../useDebouncedFunction";

export const useEventListener = (event, handler, settings = {}) => {
    const {
        enabled = true,
        delay = 500,
        isThrottle = true,
        getFirst = false,
        source = typeof window !== "undefined" ? window : undefined,
        capture,
        once,
        passive,
        onStart,
        onEnd,
    } = settings;

    const handlerRef = useRef(handler);
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    const events = useMemo(() => {
        if (Array.isArray(event)) return event.filter(Boolean);
        return event ? [event] : [];
    }, [event]);

    const options = useMemo(() => {
        const o = {};
        if (capture !== undefined) o.capture = capture;
        if (once !== undefined) o.once = once;
        if (passive !== undefined) o.passive = passive;
        return o;
    }, [capture, once, passive]);

    const debounceSettings = useMemo(
        () => ({ delay, isThrottle, getFirst, onStart, onEnd }),
        [delay, isThrottle, getFirst, onStart, onEnd],
    );
    const delayed = useDebouncedFunction((e) => handlerRef.current(e), debounceSettings);

    const listener = useCallback(
        (e) => {
            if (delay > 0) delayed(e);
            else handlerRef.current(e);
        },
        [delay, delayed],
    );

    useEffect(() => {
        if (!enabled) return;

        const target = source;
        if (!target?.addEventListener || events.length === 0) return;

        for (const ev of events) {
            target.addEventListener(ev, listener, options);
        }

        return () => {
            for (const ev of events) {
                target.removeEventListener?.(ev, listener, options?.capture);
            }
        };
    }, [enabled, source, events, listener, options]);

    return null;
};
