import { useEffect, useRef } from "react";
import { attachScrollListener } from "../getScrollParent";
import { useScrollTarget } from "../getScrollParent/useScrollTarget";

export const useScrollThrottle = (callback, delay = 100, options = {}) => {
    const { source: sourceProp } = options;

    const lastCall = useRef(0);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const { ref, source } = useScrollTarget(sourceProp);

    useEffect(() => {
        if (!source) return;

        const handleScroll = () => {
            const now = Date.now();
            if (now - lastCall.current >= delay) {
                callbackRef.current?.();
                lastCall.current = now;
            }
        };

        return attachScrollListener(source, handleScroll);
    }, [delay, source]);

    return { ref, source };
};
