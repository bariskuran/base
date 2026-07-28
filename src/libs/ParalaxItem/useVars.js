import { useCallback, useEffect, useRef, useState } from "react";
import {
    attachScrollListener,
    isDocumentScrollElement,
    isWindowLike,
} from "helpers/getScrollParent";
import { useScrollTarget } from "helpers/getScrollParent/useScrollTarget";

const SPEED_FACTOR = 100;
/** Start/stop scroll listening this many viewport heights outside the visible area. */
const VIEWPORT_LISTEN_MULTIPLIER = 2;

export const normalizeSpeed = (speed) => {
    const value = Number(speed);
    return Number.isFinite(value) ? value : 0;
};

export const getViewportCenterY = (source) => {
    if (typeof window === "undefined") return 0;

    if (!source || isWindowLike(source) || isDocumentScrollElement(source)) {
        return window.innerHeight / 2;
    }

    const rect = source.getBoundingClientRect();
    return rect.top + rect.height / 2;
};

export const resolveObserverRoot = (source) => {
    if (!source || isWindowLike(source) || isDocumentScrollElement(source)) return null;
    return source;
};

export const getViewportHeight = (source) => {
    if (typeof window === "undefined") return 0;

    if (!source || isWindowLike(source) || isDocumentScrollElement(source)) {
        return window.innerHeight || 0;
    }

    return source.clientHeight || 0;
};

/** rootMargin expands the observer box by N× viewport height on top and bottom. */
export const getListenRootMargin = (source, multiplier = VIEWPORT_LISTEN_MULTIPLIER) => {
    const band = Math.max(0, getViewportHeight(source) * multiplier);
    return `${band}px 0px ${band}px 0px`;
};

export const calcParalaxOffset = ({ rect, offsetY, viewportCenterY, speed }) => {
    const naturalCenterY = rect.top + rect.height / 2 - offsetY;
    const distanceFromOrigin = naturalCenterY - viewportCenterY;
    return distanceFromOrigin * (speed / SPEED_FACTOR);
};

export const useVars = ({ speed = 0 } = {}) => {
    const normalizedSpeed = normalizeSpeed(speed);
    const isActive = normalizedSpeed !== 0;

    const offsetRef = useRef(0);
    const rafRef = useRef(0);
    const nodeRef = useRef(null);
    const sourceRef = useRef(null);
    const reducedMotionRef = useRef(false);
    const listeningRef = useRef(false);
    const detachListeningRef = useRef(null);
    const [observedNode, setObservedNode] = useState(null);
    const [viewportBand, setViewportBand] = useState(0);

    const { ref: scrollTargetRef, source } = useScrollTarget();
    sourceRef.current = source;

    const applyOffset = useCallback((value) => {
        const node = nodeRef.current;
        offsetRef.current = value;
        if (!node) return;
        node.style.setProperty("--paralax-y", `${value}px`);
    }, []);

    const update = useCallback(() => {
        rafRef.current = 0;
        const node = nodeRef.current;
        if (!node || reducedMotionRef.current) return;

        const nextOffset = calcParalaxOffset({
            rect: node.getBoundingClientRect(),
            offsetY: offsetRef.current,
            viewportCenterY: getViewportCenterY(sourceRef.current),
            speed: normalizedSpeed,
        });

        applyOffset(nextOffset);
    }, [applyOffset, normalizedSpeed]);

    const scheduleUpdate = useCallback(() => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(update);
    }, [update]);

    const stopListening = useCallback(() => {
        if (!listeningRef.current) return;
        listeningRef.current = false;
        detachListeningRef.current?.();
        detachListeningRef.current = null;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        }
    }, []);

    const startListening = useCallback(() => {
        if (listeningRef.current || typeof window === "undefined") return;

        const scrollSource = sourceRef.current;
        if (!scrollSource) return;

        listeningRef.current = true;
        const onScrollOrResize = () => scheduleUpdate();
        const detachScroll = attachScrollListener(scrollSource, onScrollOrResize);
        window.addEventListener("resize", onScrollOrResize);
        detachListeningRef.current = () => {
            detachScroll();
            window.removeEventListener("resize", onScrollOrResize);
        };
        scheduleUpdate();
    }, [scheduleUpdate]);

    const ref = useCallback(
        (el) => {
            nodeRef.current = el;
            setObservedNode((prev) => (Object.is(prev, el) ? prev : el));
            scrollTargetRef(el);
        },
        [scrollTargetRef],
    );

    useEffect(() => {
        if (!isActive || typeof window === "undefined" || !window.matchMedia) return undefined;

        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => {
            reducedMotionRef.current = media.matches;
            if (media.matches) applyOffset(0);
            else if (listeningRef.current) scheduleUpdate();
        };

        sync();
        media.addEventListener?.("change", sync);
        return () => media.removeEventListener?.("change", sync);
    }, [applyOffset, isActive, scheduleUpdate]);

    // Keep observer rootMargin in sync with viewport / scroll-parent height (2× band).
    useEffect(() => {
        if (!isActive || typeof window === "undefined") return undefined;

        const syncBand = () => {
            const next = getViewportHeight(sourceRef.current);
            setViewportBand((prev) => (prev === next ? prev : next));
        };

        syncBand();
        window.addEventListener("resize", syncBand);
        return () => window.removeEventListener("resize", syncBand);
    }, [isActive, source]);

    useEffect(() => {
        if (!isActive || !observedNode) {
            stopListening();
            return undefined;
        }

        if (typeof IntersectionObserver === "undefined") {
            startListening();
            return () => stopListening();
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) startListening();
                else stopListening();
            },
            {
                threshold: 0,
                root: resolveObserverRoot(source),
                rootMargin: getListenRootMargin(source, VIEWPORT_LISTEN_MULTIPLIER),
            },
        );

        observer.observe(observedNode);
        return () => {
            observer.disconnect();
            stopListening();
        };
    }, [isActive, observedNode, source, viewportBand, startListening, stopListening]);

    useEffect(() => {
        if (isActive) return undefined;
        applyOffset(0);
        return undefined;
    }, [applyOffset, isActive]);

    return {
        isActive,
        ref,
        source,
        speed: normalizedSpeed,
    };
};
