import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { baseStore } from "../baseStore";

const isRefLike = (value) => value != null && typeof value === "object" && "current" in value;
const MOVEMENT_EPSILON = 0.001;

const resolveElement = (value) => {
    if (value == null) return null;
    if (isRefLike(value)) return value.current ?? null;
    return value;
};

const resolveRootBounds = (entry) => {
    if (entry?.rootBounds) return entry.rootBounds;
    if (typeof window === "undefined") return null;

    return {
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
    };
};

export const getObserverDirection = (entry) => {
    const rect = entry?.boundingClientRect;
    const rootBounds = resolveRootBounds(entry);
    if (!rect || !rootBounds) return "bottom";

    const overflow = {
        top: Math.max(0, rootBounds.top - rect.top),
        right: Math.max(0, rect.right - rootBounds.right),
        bottom: Math.max(0, rect.bottom - rootBounds.bottom),
        left: Math.max(0, rootBounds.left - rect.left),
    };
    const horizontalOverflow = Math.max(overflow.left, overflow.right);
    const verticalOverflow = Math.max(overflow.top, overflow.bottom);

    if (horizontalOverflow > verticalOverflow && horizontalOverflow > 0) {
        return overflow.left > overflow.right ? "left" : "right";
    }

    const rootCenterY = rootBounds.top + rootBounds.height / 2;
    const rectCenterY = rect.top + rect.height / 2;
    return rectCenterY < rootCenterY ? "top" : "bottom";
};

export const getObserverPhase = ({ entry, previousRatio = 0, previousIntersecting = false }) => {
    const ratio = entry?.intersectionRatio ?? 0;
    const isIntersecting = Boolean(entry?.isIntersecting);

    if (!isIntersecting) return "outside";
    if (!previousIntersecting) return "entering";
    if (ratio < previousRatio - MOVEMENT_EPSILON) return "exiting";
    if (ratio >= 0.99) return "inside";
    if (ratio > previousRatio + MOVEMENT_EPSILON) return "entering";
    return "inside";
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

    const { inViewport, phase, direction, intersectionRatio, set } = baseStore.useLocal({
        inViewport: supportsIO ? false : true,
        phase: supportsIO ? "outside" : "inside",
        direction: "bottom",
        intersectionRatio: supportsIO ? 0 : 1,
    });

    const setRef = useRef(set);
    setRef.current = set;

    const nodeRef = useRef(null);
    const [observedNode, setObservedNode] = useState(null);

    const onEnterRef = useRef(onEnter);
    const onExitRef = useRef(onExit);
    const previousEntryRef = useRef({
        isIntersecting: false,
        intersectionRatio: 0,
    });

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

        // Remount / HMR: don't carry a stale "already intersecting" flag into a fresh observer.
        previousEntryRef.current = {
            isIntersecting: false,
            intersectionRatio: 0,
        };

        const applyEntry = (entry) => {
            if (!entry) return;

            const isIn = !!entry.isIntersecting;
            const previousEntry = previousEntryRef.current;
            const nextPhase = getObserverPhase({
                entry,
                previousRatio: previousEntry.intersectionRatio,
                previousIntersecting: previousEntry.isIntersecting,
            });
            const nextDirection = getObserverDirection(entry);

            setRef.current?.((d) => {
                d.inViewport = isIn;
                d.phase = nextPhase;
                d.direction = nextDirection;
                d.intersectionRatio = entry.intersectionRatio ?? 0;
            });

            if (isIn && !previousEntry.isIntersecting) onEnterRef.current?.(entry);
            if (!isIn && previousEntry.isIntersecting) onExitRef.current?.(entry);

            previousEntryRef.current = {
                isIntersecting: isIn,
                intersectionRatio: entry.intersectionRatio ?? 0,
            };
        };

        const observer = new IntersectionObserver(([entry]) => {
            applyEntry(entry);
        }, observerOptions);

        observer.observe(node);

        // IO callbacks are async. After HMR/remount, the first callback can be skipped while the
        // node is already on screen — ScrollAnimatedItem would stay at opacity 0 until a refresh.
        const pending = observer.takeRecords?.() || [];
        if (pending.length > 0) {
            applyEntry(pending[pending.length - 1]);
        }

        let rafId = 0;
        if (!previousEntryRef.current.isIntersecting) {
            rafId = requestAnimationFrame(() => {
                const latePending = observer.takeRecords?.() || [];
                if (latePending.length > 0) {
                    applyEntry(latePending[latePending.length - 1]);
                    return;
                }

                if (previousEntryRef.current.isIntersecting) return;

                const rect = node.getBoundingClientRect();
                const rootRect = root?.getBoundingClientRect?.() || {
                    top: 0,
                    left: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
                const isIn =
                    rect.bottom > rootRect.top &&
                    rect.right > rootRect.left &&
                    rect.top < rootRect.bottom &&
                    rect.left < rootRect.right;

                if (!isIn) return;

                applyEntry({
                    isIntersecting: true,
                    intersectionRatio: 1,
                    boundingClientRect: rect,
                    rootBounds: rootRect,
                });
            });
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, [
        supportsIO,
        observedNode,
        threshold,
        customViewportMargin,
        customViewport,
        wantsCustomViewport,
        disable,
    ]);

    return useMemo(
        () => ({
            ref,
            inViewport: !!inViewport,
            phase,
            direction,
            intersectionRatio,
        }),
        [ref, inViewport, phase, direction, intersectionRatio],
    );
};
