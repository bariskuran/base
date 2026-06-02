import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { baseStore } from "../baseStore";

const isRefLike = (value) => value != null && typeof value === "object" && "current" in value;

const resolveElement = (value) => {
    if (value == null) return null;
    if (isRefLike(value)) return value.current ?? null;
    return value;
};

export const useObserver = (options = {}) => {
    const wantsCustomViewport = "customViewport" in options || "root" in options;

    const {
        onEnter,
        onExit,
        threshold = 0.2,
        customViewportMargin: customViewportMarginOption,
        rootMargin: rootMarginOption,
        customViewport: customViewportOption = null,
        root: rootOption = null,
        disable = false,
    } = options;

    const customViewport = customViewportOption ?? rootOption ?? null;
    const customViewportMargin = customViewportMarginOption ?? rootMarginOption ?? 0;

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

        const root = resolveElement(customViewport);

        if (wantsCustomViewport && !root) return;

        const margin =
            typeof customViewportMargin === "number"
                ? `${customViewportMargin}px`
                : String(customViewportMargin);

        const observerOptions = { threshold, rootMargin: margin };
        if (root) observerOptions.root = root;

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
            observerOptions,
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [
        supportsIO,
        observedNode,
        threshold,
        customViewportMargin,
        customViewport,
        wantsCustomViewport,
        disable,
    ]);

    return useMemo(() => ({ ref, inViewport: !!inViewport }), [ref, inViewport]);
};
