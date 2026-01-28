import { useEffect, useMemo, useRef, useCallback } from "react";
import { baseStore } from "../@baseStore";

/**
 * React hook that observes a DOM element using IntersectionObserver and
 * reports whether it is currently inside the viewport (or a custom root).
 *
 * If IntersectionObserver is not available, the hook gracefully falls back
 * to `inViewport: true`.
 *
 * @typedef {Object} UseObserverOptions
 * @property {(entry: IntersectionObserverEntry) => void} [onEnter]
 * Callback fired when the element enters the viewport
 * @property {(entry: IntersectionObserverEntry) => void} [onExit]
 * Callback fired when the element exits the viewport
 * @property {number | number[]} [threshold=0.1]
 * Intersection threshold(s) that trigger the observer
 * @property {number | string} [rootMargin=0]
 * Root margin (px number or CSS-like string: "0px 0px -80px 0px")
 * @property {Element | null} [root=null]
 * Optional root element instead of the viewport
 *
 * @returns {{ ref: (node: HTMLElement | null) => void, inViewport: boolean }}
 *
 * @example
 * const { ref, inViewport } = useObserver();
 *
 * @example
 * const { ref } = useObserver({
 *   onEnter: () => console.log("Entered viewport"),
 *   onExit: () => console.log("Exited viewport"),
 *   threshold: 0.5,
 * });
 *
 * return <section ref={ref}>Observed content</section>;
 */
export const useObserver = (options = {}) => {
    const { onEnter, onExit, threshold = 0.1, rootMargin = 0, root = null } = options;

    const supportsIO = typeof window !== "undefined" && typeof IntersectionObserver !== "undefined";

    const { inViewport, node, setLocal } = baseStore.useLocal({
        inViewport: supportsIO ? false : true,
        node: null,
    });

    const onEnterRef = useRef(onEnter);
    const onExitRef = useRef(onExit);

    useEffect(() => {
        onEnterRef.current = onEnter;
        onExitRef.current = onExit;
    }, [onEnter, onExit]);

    const ref = useCallback(
        (el) => {
            setLocal?.({ node: el });
        },
        [setLocal],
    );

    useEffect(() => {
        if (!supportsIO) return;
        if (!node) return;

        const margin = typeof rootMargin === "number" ? `${rootMargin}px` : String(rootMargin);

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isIn = !!entry.isIntersecting;

                setLocal?.((d) => {
                    if (d.inViewport !== isIn) {
                        d.inViewport = isIn;
                    }
                });

                if (isIn) onEnterRef.current?.(entry);
                else onExitRef.current?.(entry);
            },
            { threshold, rootMargin: margin, root },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [supportsIO, node, threshold, rootMargin, root, setLocal]);

    return useMemo(() => ({ ref, inViewport: !!inViewport }), [ref, inViewport]);
};
