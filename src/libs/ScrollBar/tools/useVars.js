import { baseStore } from "../../@baseStore";
import { DefaultVariant } from "../DefaultVariant";
import { useEffect, useRef } from "react";
import { colorGet } from "../../colorGet";
import { disableBrowserScrollBar, enableBrowserScrollBar } from "./manageBrowsersScrollBar";
import getThumbProps from "./getThumbProps";
import { useEventListener } from "../../useEventListener";
import { useCheckOverflow } from "../../useCheckOverflow";

const useVars = (p) => {
    /**
     *
     * Incoming Props
     *
     */
    const {
        variant,
        position = "vertical",
        align = "right",
        direction = "y",
        truckColor,
        thumbColor,
    } = p || {};

    /**
     *
     * Store
     **
     */
    const truckRef = useRef(null);
    const thumbRef = useRef(null);
    const [theme, defaultVariants] = baseStore.useGlobal((s) => [s.theme, s.defaultVariants]);
    const {
        thumbLength,
        thumbPosition,
        maxScroll,
        scrollPos,
        previousOverflowValues,
        isTruckMounted,
        setLocal,
        scrollHost,
        isDragging,
        dragStartClient,
        dragStartScroll,
    } = baseStore.useLocal({
        previousOverflowValues: {},
        isTruckMounted: false,
        isDragging: false,
        dragStartClient: 0,
        dragStartScroll: 0,
    });
    const colors = colorGet(truckColor || theme.foreground);

    /**
     *
     * Overflow Hidden onMount and return original onUnmount
     **
     */
    const root = typeof document !== "undefined" ? document.getElementById("root") : null;
    const normalizedScrollSource =
        typeof document === "undefined" ||
        scrollHost == null ||
        scrollHost === root ||
        scrollHost === document.body ||
        scrollHost === document.documentElement
            ? window
            : scrollHost;
    const isWindowLike =
        normalizedScrollSource === window ||
        normalizedScrollSource === document.body ||
        normalizedScrollSource === document.documentElement;
    const { isOverflowing } = useCheckOverflow({ target: normalizedScrollSource });

    useEffect(() => {
        const styleEl = document.createElement("style");
        disableBrowserScrollBar({ truckRef, isTruckMounted, setLocal, styleEl });
        return () => {
            enableBrowserScrollBar({ styleEl, previousOverflowValues });
        };
    }, [isOverflowing]);

    /**
     *
     * Vars
     **
     */
    const Variant = variant || defaultVariants?.scrollBar || DefaultVariant;
    const [defaultWidth, defaultHeight, defaultMargin, minThumbLength] = [8, 96, 5, 24];

    const getThumbP = () => {
        const { thumbLength, thumbPosition, maxScroll, scrollPos } = getThumbProps({
            direction,
            position,
            defaultWidth,
            defaultHeight,
            minThumbLength,
            source: normalizedScrollSource,
        });

        setLocal((s) => {
            s.thumbLength = thumbLength;
            s.thumbPosition = thumbPosition;
            s.maxScroll = maxScroll;
            s.scrollPos = scrollPos;
        });
    };

    useEffect(() => {
        getThumbP();
    }, [scrollHost, direction, position]);

    useEventListener("scroll", getThumbP, {
        delay: 50,
        passive: true,
        source: normalizedScrollSource,
    });

    /* DRAG HANDLERS */
    const setScrollTo = (nextScroll, { behavior = "auto" } = {}) => {
        const safeScroll = Math.max(0, Math.min(maxScroll, nextScroll));

        if (isWindowLike) {
            window.scrollTo({
                ...(direction === "y" ? { top: safeScroll } : { left: safeScroll }),
                behavior,
            });
            return;
        }

        if (!normalizedScrollSource) return;

        if (typeof normalizedScrollSource.scrollTo === "function") {
            normalizedScrollSource.scrollTo({
                ...(direction === "y" ? { top: safeScroll } : { left: safeScroll }),
                behavior,
            });
            return;
        }
    };

    const getTrackMetrics = () => {
        const truckEl = truckRef.current;
        if (!truckEl) return null;

        const rect = truckEl.getBoundingClientRect();

        const trackLength = direction === "y" ? rect.height : rect.width;
        const trackStart = direction === "y" ? rect.top : rect.left;
        const clientPosKey = direction === "y" ? "clientY" : "clientX";

        return {
            rect,
            trackLength,
            trackStart,
            clientPosKey,
            movableArea: Math.max(0, trackLength - thumbLength),
        };
    };
    const onTruckMouseDown = (e) => {
        if (!isOverflowing) return;
        if (thumbRef.current?.contains(e.target)) return;

        const metrics = getTrackMetrics();
        if (!metrics) return;

        const clickPos = direction === "y" ? e.clientY : e.clientX;
        const clickOffset = clickPos - metrics.trackStart;

        const desiredThumbPos = clickOffset - thumbLength / 2;

        const clampedThumbPos = Math.max(0, Math.min(metrics.movableArea, desiredThumbPos));

        const nextScroll =
            metrics.movableArea <= 0 ? 0 : (clampedThumbPos / metrics.movableArea) * maxScroll;

        setScrollTo(nextScroll, { behavior: "smooth" });
    };

    const onThumbMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const client = direction === "y" ? e.clientY : e.clientX;

        setLocal((s) => {
            s.isDragging = true;
            s.dragStartClient = client;
            s.dragStartScroll = scrollPos;
        });
    };

    const onDragMove = (e) => {
        if (!isDragging) return;

        const metrics = getTrackMetrics();
        if (!metrics) return;

        const currentClient = direction === "y" ? e.clientY : e.clientX;
        const deltaClient = currentClient - dragStartClient;

        if (metrics.movableArea <= 0 || maxScroll <= 0) return;

        const scrollPerPixel = maxScroll / metrics.movableArea;
        const nextScroll = dragStartScroll + deltaClient * scrollPerPixel;

        setScrollTo(nextScroll, { behavior: "auto" });
    };

    const onDragEnd = () => {
        if (!isDragging) return;

        setLocal((s) => {
            s.isDragging = false;
        });
    };

    useEventListener("mousemove", onDragMove, {
        delay: 50,
        passive: false,
        source: typeof window !== "undefined" ? window : undefined,
    });

    useEventListener("mouseup", onDragEnd, {
        delay: 0,
        passive: true,
        source: typeof window !== "undefined" ? window : undefined,
    });

    useEffect(() => {
        if (typeof document === "undefined") return;

        const html = document.documentElement;
        const body = document.body;

        const prevHtmlCursor = html.style.cursor;
        const prevBodyCursor = body.style.cursor;
        const prevHtmlUserSelect = html.style.userSelect;
        const prevBodyUserSelect = body.style.userSelect;

        if (isDragging) {
            html.style.setProperty("cursor", "grabbing", "important");
            body.style.setProperty("cursor", "grabbing", "important");
            html.style.setProperty("user-select", "none", "important");
            body.style.setProperty("user-select", "none", "important");
        } else {
            html.style.cursor = prevHtmlCursor;
            body.style.cursor = prevBodyCursor;
            html.style.userSelect = prevHtmlUserSelect;
            body.style.userSelect = prevBodyUserSelect;
        }

        return () => {
            html.style.cursor = prevHtmlCursor;
            body.style.cursor = prevBodyCursor;
            html.style.userSelect = prevHtmlUserSelect;
            body.style.userSelect = prevBodyUserSelect;
        };
    }, [isDragging]);

    /* Return */
    return {
        ...p,
        theme,
        Variant,
        position,
        align,
        defaultWidth,
        defaultHeight,
        defaultMargin,
        direction,
        defaultSideMargin: (100 - defaultHeight) / 2,
        truckRef,
        truckColor,
        thumbColor,
        colors,
        minThumbLength,
        thumbLength,
        thumbPosition,
        maxScroll,
        scrollPos,
        isOverflowing,
        thumbRef,
        onTruckMouseDown,
        onThumbMouseDown,
        isDragging,
    };
};
export default useVars;
