import { useEffect } from "react";
import { baseStore } from "../baseStore";

export const useImagePreloader = (images = [], options = {}) => {
    const { delayAfterLoad = 0 } = options;
    const { isLoaded, set } = baseStore.useLocal({ isLoaded: false });

    useEffect(() => {
        let cancelled = false;

        if (typeof window === "undefined") {
            set?.({ isLoaded: true });
            return;
        }

        if (!Array.isArray(images) || images.length === 0) {
            set?.({ isLoaded: true });
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
                        if (!cancelled) set?.({ isLoaded: true });
                    }, delayAfterLoad);

                    return () => clearTimeout(t);
                }

                set?.({ isLoaded: true });
            } catch (error) {
                if (cancelled) return;
                console.error("Error preloading images:", error);
                set?.({ isLoaded: true });
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
    }, [set, delayAfterLoad, JSON.stringify(images)]);

    return isLoaded;
};
