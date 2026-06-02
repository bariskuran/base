import { useCallback, useEffect, useRef } from "react";
import { useImagesReady } from "../useImagesReady";
import { useEventListener } from "../useEventListener";
import { baseStore } from "../baseStore";
import { getDocumentScrollElement, readScrollSize } from "../getScrollParent";
import { useScrollTarget } from "../getScrollParent/useScrollTarget";

export const useScrollWidthHeight = (sourceOrOptions, legacyOptions = {}) => {
    const isOptionsObject =
        sourceOrOptions != null &&
        typeof sourceOrOptions === "object" &&
        !sourceOrOptions.nodeType &&
        !sourceOrOptions.addEventListener;

    const sourceProp = isOptionsObject ? sourceOrOptions.source : sourceOrOptions;
    const options = isOptionsObject ? sourceOrOptions : legacyOptions;
    const { settleDelay = 250, resizeDelay = 1000 } = options;

    const { width, height, set } = baseStore.useLocal({ width: 0, height: 0 });
    const timeoutRef = useRef(null);

    const { ref, source: resolvedSource } = useScrollTarget(sourceProp);
    const source = sourceProp ?? resolvedSource ?? getDocumentScrollElement();

    const manualTrigger = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            set?.(readScrollSize(source));
        }, settleDelay);
    }, [source, settleDelay, set]);

    useImagesReady(manualTrigger);
    useEventListener("resize", manualTrigger, { delay: resizeDelay, isThrottle: true, passive: true });

    useEffect(() => {
        manualTrigger();
    }, [manualTrigger]);

    useEffect(() => {
        if (!source || typeof ResizeObserver === "undefined") return;

        const ro = new ResizeObserver(() => manualTrigger());
        ro.observe(source);

        return () => ro.disconnect();
    }, [source, manualTrigger]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return { width, height, manualTrigger, ref, source };
};
