import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { baseStore } from "../@baseStore";

export const useObserver = (options = {}) => {
    const {
        onEnter,
        onExit,
        threshold = 0.2,
        customViewportMargin = 0,
        customViewport = null,
        disable = false,
    } = options;

    const supportsIO = typeof window !== "undefined" && typeof IntersectionObserver !== "undefined";

    const { inViewport, set } = baseStore.useLocal({
        inViewport: supportsIO ? false : true,
    });

    const setRef = useRef(set);
    setRef.current = set;

    const nodeRef = useRef(null);
    const [observedNode, setObservedNode] = useState(null);

    const onEnterRef = useRef(onEnter);
    const onExitRef = useRef(onExit);

    useEffect(() => {
        onEnterRef.current = onEnter;
        onExitRef.current = onExit;
    }, [onEnter, onExit]);

    const ref = useCallback((el) => {
        if (Object.is(nodeRef.current, el)) return;
        nodeRef.current = el;
        setObservedNode(el);
    }, []);

    useEffect(() => {
        if (disable) return;
        if (!supportsIO) return;
        const node = observedNode;
        if (!node) return;

        const margin =
            typeof customViewportMargin === "number"
                ? `${customViewportMargin}px`
                : String(customViewportMargin);

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isIn = !!entry.isIntersecting;

                setRef.current?.((d) => {
                    if (d.inViewport !== isIn) {
                        d.inViewport = isIn;
                    }
                });

                if (isIn) onEnterRef.current?.(entry);
                else onExitRef.current?.(entry);
            },
            { threshold, rootMargin: margin, root: customViewport },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [supportsIO, observedNode, threshold, customViewportMargin, customViewport, disable]);

    return useMemo(() => ({ ref, inViewport: !!inViewport }), [ref, inViewport]);
};
