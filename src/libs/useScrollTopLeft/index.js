import { useEffect, useCallback, useRef } from "react";
import { useEventListener } from "../useEventListener";
import { baseStore } from "../@baseStore";

/*

const {scrollTop, scrollLeft, directionX, directionY, calc} = useScrollTopLeft({source = window, delay = 0});

*/

/**
 * React hook that tracks the current scroll position (top/left) of either
 * the window or a scrollable element, with optional debounce/throttle delay.
 * Also provides scroll direction for both axes.
 *
 * @typedef {Object} UseScrollTopLeftOptions
 * @property {Window | HTMLElement} [source=window]
 * Scroll source. Use `window` for page scroll or a scrollable element for container scroll.
 * @property {number} [delay=0]
 * Optional debounce/throttle delay in milliseconds (handled by useEventListener).
 */

/**
 * @param {UseScrollTopLeftOptions} [options={}]
 * Configuration options.
 *
 * @returns {[number, number, ("left"|"right"|"none"), ("top"|"bottom"|"none"), () => void]}
 * Returns `[top, left, directionX, directionY, recalc]`.
 */
export const useScrollTopLeft = (options = {}) => {
    const { source = typeof window !== "undefined" ? window : undefined, delay = 0 } = options;

    const { top, left, directionX, directionY, setLocal } = baseStore.useLocal({
        top: 0,
        left: 0,
        directionX: "none",
        directionY: "none",
    });

    const prevRef = useRef({ top: 0, left: 0, inited: false });

    const calc = useCallback(() => {
        if (!source) return;

        const nextTop =
            source === window
                ? (window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? 0)
                : (source.scrollTop ?? 0);

        const nextLeft =
            source === window
                ? (window.scrollX ?? window.pageXOffset ?? document.documentElement.scrollLeft ?? 0)
                : (source.scrollLeft ?? 0);

        if (!prevRef.current.inited) {
            prevRef.current = { top: nextTop, left: nextLeft, inited: true };
            setLocal?.({ top: nextTop, left: nextLeft, directionX: "none", directionY: "none" });
            return;
        }

        const dy = nextTop - prevRef.current.top;
        const dx = nextLeft - prevRef.current.left;

        if (dy === 0 && dx === 0) {
            return;
        }

        const nextDirectionY = dy > 0 ? "bottom" : "top";
        const nextDirectionX = dx > 0 ? "right" : "left";

        prevRef.current.top = nextTop;
        prevRef.current.left = nextLeft;

        setLocal?.({
            top: nextTop,
            left: nextLeft,
            directionX: nextDirectionX,
            directionY: nextDirectionY,
        });
    }, [source, setLocal]);

    useEventListener("scroll", calc, {
        source,
        delay,
        passive: true,
        isThrottle: true,
    });

    useEffect(() => {
        calc();
    }, [calc]);

    return { scrollTop: top, scrollLeft: left, directionX, directionY, calc };
};
