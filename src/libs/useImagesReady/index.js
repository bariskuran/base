import { useEffect, useRef } from "react";
import { baseStore } from "../baseStore";

export const useImagesReady = (fn, options = {}) => {
    const {
        selector = "img",
        includeErrors = true,
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
