import { useCallback, useEffect, useRef } from "react";
import { useImagesReady } from "../useImagesReady";
import { useEventListener } from "../useEventListener";
import { baseStore } from "../@baseStore";

/*

const [w, h, recalc] = useScrollWidthHeight();

*/

/**
 * React hook that measures the scrollable document size (width/height),
 * or the size of a provided DOM element, and keeps it updated on image-load
 * and window resize.
 *
 * @typedef {Object} UseScrollWidthHeightOptions
 * @property {number} [settleDelay=250]
 * Delay in milliseconds before reading measurements (helps after layout settles)
 * @property {number} [resizeDelay=1000]
 * Throttle delay for resize recalculations
 */

/**
 * @param {HTMLElement | null | undefined} [source]
 * Optional DOM element to measure. If omitted, the document size is measured.
 *
 * @param {UseScrollWidthHeightOptions} [options={}]
 * Configuration options
 *
 * @returns {[number, number, () => void]}
 * Returns `[width, height, recalc]`
 */
export const useScrollWidthHeight = (source, options = {}) => {
    const { settleDelay = 250, resizeDelay = 1000 } = options;

    const { width, height, store: { set } = {} } = baseStore.useLocal({ width: 0, height: 0 });
    const timeoutRef = useRef(null);

    const recalc = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            const next =
                source && source.getBoundingClientRect
                    ? (() => {
                          const rect = source.getBoundingClientRect();
                          return { width: Math.round(rect.width), height: Math.round(rect.height) };
                      })()
                    : {
                          width: Math.max(
                              document.body.scrollWidth,
                              document.documentElement.scrollWidth,
                              document.body.offsetWidth,
                              document.documentElement.offsetWidth,
                              document.body.clientWidth,
                              document.documentElement.clientWidth,
                          ),
                          height: Math.max(
                              document.body.scrollHeight,
                              document.documentElement.scrollHeight,
                              document.body.offsetHeight,
                              document.documentElement.offsetHeight,
                              document.body.clientHeight,
                              document.documentElement.clientHeight,
                          ),
                      };

            set(next);
        }, settleDelay);
    }, [source, settleDelay, set]);

    useImagesReady(recalc);
    useEventListener("resize", recalc, { delay: resizeDelay, isThrottle: true, passive: true });
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return [width, height, recalc];
};
