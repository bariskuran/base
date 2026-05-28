import { useEffect, useRef } from "react";
import { baseStore } from "../@baseStore";

/*

const isReady = useImagesReady(() => {
  console.log("All images are ready");
});

*/

/**
 * React hook that detects when all matching DOM images
 * have finished loading (or errored, optionally).
 *
 * Useful for triggering animations, layout measurements,
 * or logic that depends on images being fully rendered.
 *
 * @typedef {Object} UseImagesReadyOptions
 * @property {string} [selector="img"]
 * CSS selector used to query images in the document
 *
 * @property {boolean} [includeErrors=true]
 * Whether images that fail to load should still be considered "ready"
 */

/**
 * @param {() => void} [onReady]
 * Optional callback executed once when all images are ready
 *
 * @param {UseImagesReadyOptions} [options={}]
 * Configuration options
 *
 * @returns {boolean}
 * Returns `true` once all images are considered ready
 */
export const useImagesReady = (fn, options = {}) => {
    const {
        selector = "img",
        includeErrors = true, // true: error olsa bile "ready" say
    } = options;

    const { isLoaded, set } = baseStore.useLocal({ isLoaded: false });
    const fnRef = useRef(fn);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    useEffect(() => {
        let active = true;
        const imgs = Array.from(document.querySelectorAll(selector));
        const isImgDone = (img) => {
            if (!img.complete) return false;
            if (includeErrors) return true;
            return img.naturalWidth > 0;
        };

        const allDone = () => imgs.every(isImgDone);

        const finishOnce = () => {
            if (!active) return;
            active = false;
            set?.({ isLoaded: true });
            fnRef.current?.();
            cleanup();
        };

        const handlers = new Map();

        const onAny = () => {
            if (allDone()) finishOnce();
        };

        const cleanup = () => {
            for (const [img, handler] of handlers) {
                img.removeEventListener("load", handler);
                img.removeEventListener("error", handler);
            }
            handlers.clear();
        };

        if (imgs.length === 0) {
            finishOnce();
            return () => {};
        }

        if (allDone()) {
            finishOnce();
            return () => {};
        }

        for (const img of imgs) {
            const handler = () => onAny();
            handlers.set(img, handler);
            img.addEventListener("load", handler, { passive: true });
            img.addEventListener("error", handler, { passive: true });
        }

        return () => {
            active = false;
            cleanup();
        };
    }, [selector, includeErrors]);

    return isLoaded;
};
