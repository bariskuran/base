import { useEffect, useMemo, useRef, useCallback } from "react";
import { useDebouncedFunction } from "../useDebouncedFunction";

/*

useEventListener(
    "scroll",
    () => {console.log("scrolling...")},
    {delay: 300},
);


*/

/**
 * @typedef {Object} UseEventListenerSettings
 * @property {boolean} [enabled=true] - Enable or disable the event listener
 * @property {number} [delay=0] - Debounce / throttle delay in milliseconds
 * @property {boolean} [isThrottle=false] - Use throttle instead of debounce
 * @property {boolean} [getFirst=true] - Run the first call immediately
 * @property {EventTarget} [source=window] - Event source (window, document, element, etc.)
 * @property {boolean} [capture] - Whether the event should be captured during the capture phase
 * @property {boolean} [once] - Whether the listener should be invoked at most once
 * @property {boolean} [passive] - Whether the listener is passive
 */

/**
 * React hook for attaching an event listener with optional debounce or throttle behavior.
 *
 * @param {string | string[]} event - Event name(s) (e.g. "scroll", "resize", "click")
 * @param {(event: Event) => void} handler - Event handler function
 * @param {Partial<UseEventListenerSettings>} [settings={}] - Listener configuration
 * @returns {null}
 */
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
        () => ({ delay, isThrottle, getFirst }),
        [delay, isThrottle, getFirst],
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
