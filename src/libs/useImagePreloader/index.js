import { useEffect } from "react";
import { baseStore } from "../@baseStore";

/*

const isLoaded = useImagePreloader([ image1, image2, image3, ]);

*/

/**
 * Preloads a list of image URLs and exposes a boolean flag when loading is complete.
 *
 * Notes:
 * - If `imageUrls` is empty, `isLoaded` becomes true immediately.
 * - In case of any error, the hook still resolves `isLoaded` to true (fail-open),
 *   but logs the error for debugging.
 *
 * @typedef {Object} UseIsLoadedOptions
 * @property {number} [delayAfterLoad=0]
 * Optional delay (ms) before setting `isLoaded` to true (useful to avoid flicker)
 *
 * @param {string[]} [imageUrls=[]]
 * List of image URLs to preload
 * @param {UseIsLoadedOptions} [options={}]
 * Hook options
 *
 * @returns {boolean}
 * Whether all images have finished preloading (or the preload phase has completed)
 */
export const useImagePreloader = (images = [], options = {}) => {
    const { delayAfterLoad = 0 } = options;
    const { isLoaded, setLocal } = baseStore.useLocal({ isLoaded: false });

    useEffect(() => {
        let cancelled = false;

        if (typeof window === "undefined") {
            setLocal?.({ isLoaded: true });
            return;
        }

        if (!Array.isArray(images) || images.length === 0) {
            setLocal?.({ isLoaded: true });
            return;
        }

        const preload = async () => {
            try {
                await Promise.all(
                    images.filter(Boolean).map(
                        (src) =>
                            new Promise((resolve, reject) => {
                                const img = new window.Image();
                                img.onload = () => resolve(src);
                                img.onerror = () => reject(new Error(`Failed to load: ${src}`));
                                img.src = src;
                            }),
                    ),
                );

                if (cancelled) return;

                if (delayAfterLoad > 0) {
                    const t = setTimeout(() => {
                        if (!cancelled) setLocal?.({ isLoaded: true });
                    }, delayAfterLoad);

                    return () => clearTimeout(t);
                }

                setLocal?.({ isLoaded: true });
            } catch (error) {
                if (cancelled) return;
                console.error("Error preloading images:", error);
                setLocal?.({ isLoaded: true });
            }
        };

        let cleanupDelay = null;
        preload().then((maybeCleanup) => {
            if (typeof maybeCleanup === "function") cleanupDelay = maybeCleanup;
        });

        return () => {
            cancelled = true;
            if (cleanupDelay) cleanupDelay();
        };
    }, [setLocal, delayAfterLoad, JSON.stringify(images)]);

    return isLoaded;
};
