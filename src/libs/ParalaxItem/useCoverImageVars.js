import { useCallback, useEffect, useRef } from "react";
import {
    attachScrollListener,
    isDocumentScrollElement,
    isWindowLike,
} from "helpers/getScrollParent";
import { useScrollTarget } from "helpers/getScrollParent/useScrollTarget";

const getViewportBounds = (source) => {
    if (
        typeof window === "undefined" ||
        !source ||
        isWindowLike(source) ||
        isDocumentScrollElement(source)
    ) {
        return { top: 0, height: window?.innerHeight || 0 };
    }

    const rect = source.getBoundingClientRect();
    return { top: rect.top, height: source.clientHeight || rect.height };
};

export const useCoverImageVars = ({ axis = "y", threshold = 25 } = {}) => {
    const nodeRef = useRef(null);
    const rafRef = useRef(0);
    const sourceRef = useRef(null);
    const { ref: scrollTargetRef, source } = useScrollTarget();
    sourceRef.current = source;

    const update = useCallback(() => {
        rafRef.current = 0;
        const node = nodeRef.current;
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const viewport = getViewportBounds(sourceRef.current);
        const image = node.querySelector("img");
        if (!image) return;
        const rawProgress = Math.min(
            1,
            Math.max(
                0,
                (viewport.top + viewport.height - rect.top) / (viewport.height + rect.height),
            ),
        );
        const normalizedThreshold = Math.min(50, Math.max(0, Number(threshold) || 0)) / 100;
        const start = (viewport.height * normalizedThreshold) / (viewport.height + rect.height);
        const end =
            (viewport.height * (1 - normalizedThreshold) + rect.height) /
            (viewport.height + rect.height);
        const progress = Math.min(1, Math.max(0, (rawProgress - start) / (end - start)));
        const imageRect = image.getBoundingClientRect();
        const availableDistance = Math.max(
            0,
            axis === "x" ? imageRect.width - rect.width : imageRect.height - rect.height,
        );

        node.style.setProperty(
            axis === "x" ? "--paralax-cover-x" : "--paralax-cover-y",
            `${-progress * availableDistance}px`,
        );
    }, [axis, threshold]);

    const scheduleUpdate = useCallback(() => {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    }, [update]);

    const ref = useCallback(
        (node) => {
            nodeRef.current = node;
            scrollTargetRef(node);
        },
        [scrollTargetRef],
    );

    useEffect(() => {
        if (typeof window === "undefined" || !source) return undefined;

        const detachScroll = attachScrollListener(source, scheduleUpdate);
        window.addEventListener("resize", scheduleUpdate);
        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(nodeRef.current);
        const image = nodeRef.current?.querySelector("img");
        if (image) resizeObserver.observe(image);
        nodeRef.current?.addEventListener("load", scheduleUpdate, true);
        scheduleUpdate();

        return () => {
            detachScroll();
            window.removeEventListener("resize", scheduleUpdate);
            resizeObserver.disconnect();
            nodeRef.current?.removeEventListener("load", scheduleUpdate, true);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [scheduleUpdate, source]);

    return { ref };
};
