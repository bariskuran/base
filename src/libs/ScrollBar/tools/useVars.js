import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { baseStore } from "../../@baseStore";
import { colorGet } from "../../colorGet";
import { disableBrowserScrollBar, enableBrowserScrollBar } from "./manageBrowsersScrollBar";
import getScrollHost from "./getScrollHost";
import getThumbProps from "./getThumbProps";
import { useEventListener } from "../../useEventListener";
import { delayedFunction } from "../../delayedFunction";
import { useExportData } from "../../useExportedData";

const getViewportSize = () => {
    const docEl = typeof document !== "undefined" ? document.documentElement : null;

    return {
        width: docEl?.clientWidth ?? (typeof window !== "undefined" ? window.innerWidth : 0),
        height: docEl?.clientHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0),
    };
};

const getAxisOverflow = ({ source, isWindowLike }) => {
    if (typeof document === "undefined" || !source) {
        return {
            isOverflowingX: false,
            isOverflowingY: false,
        };
    }

    if (isWindowLike) {
        const docEl = document.documentElement;
        const body = document.body;
        const viewport = getViewportSize();

        return {
            isOverflowingX: Math.max(docEl.scrollWidth, body.scrollWidth) > viewport.width,
            isOverflowingY: Math.max(docEl.scrollHeight, body.scrollHeight) > viewport.height,
        };
    }

    return {
        isOverflowingX: source.scrollWidth > source.clientWidth,
        isOverflowingY: source.scrollHeight > source.clientHeight,
    };
};

const useVars = (p) => {
    const {
        Variant,
        body = false,
        disableX = false,
        disableY = false,
        opposite = false,
        mirror = false,
        truckColor,
        thumbColor,
        thickness = 6,
        maxLength,
        trackMargin: trackMarginProp,
        edgeMargin: edgeMarginProp,
        minThumbLength = 24,
        exactThumbSize,
        fillMode = false,
        exportData,
    } = p || {};

    const trackMargin = trackMarginProp ?? 5;
    const edgeMargin = edgeMarginProp ?? 5;

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const {
        resolvedHost,
        hostRect,
        x,
        y,
        dragAxis,
        dragStartClient,
        dragStartScroll,
        isScrollbarActive,
        setLocal,
    } = baseStore.useLocal({
        resolvedHost: null,
        hostRect: null,
        dragAxis: null,
        dragStartClient: 0,
        dragStartScroll: 0,
        isScrollbarActive: false,
        x: {
            thumbLength: 0,
            thumbPosition: 0,
            trackLength: 0,
            maxScroll: 0,
            scrollPos: 0,
            isOverflowing: false,
        },
        y: {
            thumbLength: 0,
            thumbPosition: 0,
            trackLength: 0,
            maxScroll: 0,
            scrollPos: 0,
            isOverflowing: false,
        },
    });

    const anchorRef = useRef(null);
    const xTruckRef = useRef(null);
    const yTruckRef = useRef(null);
    const xThumbRef = useRef(null);
    const yThumbRef = useRef(null);
    const rafRef = useRef(null);

    const colors = colorGet(truckColor || theme.foreground);

    const getBarPositionForAxis = (axis) => {
        if (axis === "y") return opposite ? "horizontal" : "vertical";
        return opposite ? "vertical" : "horizontal";
    };

    const getClientValueForAxis = (axis, e) => {
        const barPosition = getBarPositionForAxis(axis);
        return barPosition === "vertical" ? e.clientY : e.clientX;
    };

    const xBarPosition = getBarPositionForAxis("x");
    const yBarPosition = getBarPositionForAxis("y");

    useLayoutEffect(() => {
        if (typeof document === "undefined") return;

        const host = getScrollHost({
            node: anchorRef.current,
            body,
        });

        if (!host) return;

        setLocal((s) => {
            s.resolvedHost = host;
        });
    }, [body, setLocal]);

    const normalizedScrollSource =
        typeof document === "undefined" ||
        !resolvedHost ||
        resolvedHost === document.body ||
        resolvedHost === document.documentElement
            ? window
            : resolvedHost;

    const isWindowLike =
        normalizedScrollSource === window ||
        normalizedScrollSource === document.body ||
        normalizedScrollSource === document.documentElement;

    const deactivateScrollbar = useMemo(
        () =>
            delayedFunction(
                () => {
                    setLocal((s) => {
                        s.isScrollbarActive = false;
                    });
                },
                { delay: 500 },
            ),
        [setLocal],
    );

    const activateScrollbar = () => {
        deactivateScrollbar.cancel();
        setLocal((s) => {
            s.isScrollbarActive = true;
        });
    };

    const getCurrentHostRect = () => {
        const viewport = getViewportSize();

        if (isWindowLike || !resolvedHost) {
            return {
                top: 0,
                left: 0,
                right: viewport.width,
                bottom: viewport.height,
                width: viewport.width,
                height: viewport.height,
            };
        }

        const rect = resolvedHost.getBoundingClientRect();

        return {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
        };
    };

    const syncHostRect = () => {
        if (typeof document === "undefined") return;

        const rect = getCurrentHostRect();

        setLocal((s) => {
            s.hostRect = rect;
        });
    };

    const applyBarPositionToRef = (axis) => {
        const el = axis === "y" ? yTruckRef.current : xTruckRef.current;
        if (!el) return;

        const barPosition = axis === "y" ? yBarPosition : xBarPosition;
        const isBarVertical = barPosition === "vertical";

        const rect = getCurrentHostRect();
        const viewport = getViewportSize();

        const hostW = rect.width || viewport.width;
        const hostH = rect.height || viewport.height;

        const barLength = isBarVertical
            ? maxLength
                ? (hostH * maxLength) / 100
                : Math.max(0, hostH - trackMargin * 2)
            : maxLength
              ? (hostW * maxLength) / 100
              : Math.max(0, hostW - trackMargin * 2);

        const trackStartOffset = maxLength
            ? ((isBarVertical ? hostH : hostW) - barLength) / 2
            : trackMargin;

        el.style.top = "";
        el.style.right = "";
        el.style.bottom = "";
        el.style.left = "";

        if (isBarVertical) {
            el.style.top = `${rect.top + trackStartOffset}px`;

            if (mirror) {
                el.style.left = isWindowLike ? `${edgeMargin}rem` : `${rect.left + edgeMargin}px`;
            } else {
                el.style.right = isWindowLike
                    ? `${edgeMargin}rem`
                    : `${viewport.width - rect.right + edgeMargin}px`;
            }

            return;
        }

        el.style.left = `${rect.left + trackStartOffset}px`;

        if (mirror) {
            el.style.top = isWindowLike ? `${edgeMargin}rem` : `${rect.top + edgeMargin}px`;
        } else {
            el.style.bottom = isWindowLike
                ? `${edgeMargin}rem`
                : `${viewport.height - rect.bottom + edgeMargin}px`;
        }
    };

    const applyBarPositions = () => {
        applyBarPositionToRef("x");
        applyBarPositionToRef("y");
    };

    const syncMetrics = () => {
        if (!resolvedHost || !normalizedScrollSource) return;

        const overflow = getAxisOverflow({
            source: normalizedScrollSource,
            isWindowLike,
        });

        const xProps = getThumbProps({
            scrollAxis: "x",
            visualAxis: xBarPosition === "vertical" ? "y" : "x",
            maxLength,
            trackMargin,
            minThumbLength,
            exactThumbSize,
            fillMode,
            source: normalizedScrollSource,
        });

        const yProps = getThumbProps({
            scrollAxis: "y",
            visualAxis: yBarPosition === "vertical" ? "y" : "x",
            maxLength,
            trackMargin,
            minThumbLength,
            exactThumbSize,
            fillMode,
            source: normalizedScrollSource,
        });

        setLocal((s) => {
            s.x = {
                ...xProps,
                isOverflowing: overflow.isOverflowingX,
            };
            s.y = {
                ...yProps,
                isOverflowing: overflow.isOverflowingY,
            };
        });
    };

    const syncAll = () => {
        syncHostRect();
        syncMetrics();
        applyBarPositions();
    };

    const syncAllRaf = () => {
        if (rafRef.current) return;

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            syncAll();
        });
    };

    useLayoutEffect(() => {
        if (!resolvedHost) return;
        syncAll();
    }, [
        resolvedHost,
        isWindowLike,
        maxLength,
        trackMargin,
        minThumbLength,
        exactThumbSize,
        fillMode,
        opposite,
        mirror,
        edgeMargin,
    ]);

    useLayoutEffect(() => {
        if (typeof document === "undefined") return;
        if (!resolvedHost) return;

        const targets = isWindowLike
            ? [document.documentElement, document.body]
            : [normalizedScrollSource];

        const prevValues = targets.map((target) => ({
            target,
            overflow: target.style.overflow,
            overflowX: target.style.overflowX,
            overflowY: target.style.overflowY,
            overscrollBehavior: target.style.overscrollBehavior,
        }));

        targets.forEach((target) => {
            if (!target?.style) return;

            if (!body) {
                const computed = window.getComputedStyle(target);

                const hasScrollableOverflow =
                    ["auto", "scroll", "overlay"].includes(computed.overflow) ||
                    ["auto", "scroll", "overlay"].includes(computed.overflowX) ||
                    ["auto", "scroll", "overlay"].includes(computed.overflowY);

                if (!hasScrollableOverflow) {
                    target.style.overflow = "auto";
                }
            }

            target.style.overscrollBehavior = "contain";

            if (disableX) target.style.overflowX = "hidden";
            if (disableY) target.style.overflowY = "hidden";
        });

        return () => {
            prevValues.forEach(({ target, overflow, overflowX, overflowY, overscrollBehavior }) => {
                if (!target?.style) return;

                target.style.overflow = overflow;
                target.style.overflowX = overflowX;
                target.style.overflowY = overflowY;
                target.style.overscrollBehavior = overscrollBehavior;
            });
        };
    }, [resolvedHost, normalizedScrollSource, isWindowLike, body, disableX, disableY]);

    useEffect(() => {
        if (typeof document === "undefined") return;
        if (!resolvedHost) return;

        const hostForHide =
            normalizedScrollSource === window ? document.documentElement : normalizedScrollSource;

        const styleEl = document.createElement("style");
        const previousValues = disableBrowserScrollBar({
            host: hostForHide,
            styleEl,
        });

        return () => {
            enableBrowserScrollBar({
                styleEl,
                previousValues,
            });
        };
    }, [resolvedHost, normalizedScrollSource]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!resolvedHost) return;

        const onWindowScrollOrResize = () => {
            applyBarPositions();
            syncAllRaf();
        };

        window.addEventListener("scroll", onWindowScrollOrResize, {
            passive: true,
            capture: true,
        });

        window.addEventListener("resize", onWindowScrollOrResize, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", onWindowScrollOrResize, {
                capture: true,
            });

            window.removeEventListener("resize", onWindowScrollOrResize);

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [
        resolvedHost,
        normalizedScrollSource,
        isWindowLike,
        opposite,
        mirror,
        maxLength,
        trackMargin,
        edgeMargin,
    ]);

    useEffect(() => {
        if (typeof document === "undefined") return;
        if (!resolvedHost) return;

        const onObservedChange = () => {
            syncAllRaf();
        };

        const resizeObserver =
            typeof ResizeObserver !== "undefined" ? new ResizeObserver(onObservedChange) : null;

        const observerTargets = isWindowLike
            ? [document.documentElement, document.body]
            : [resolvedHost];

        observerTargets.forEach((target) => {
            if (target && resizeObserver) resizeObserver.observe(target);
        });

        const mutationObserver =
            typeof MutationObserver !== "undefined" ? new MutationObserver(onObservedChange) : null;

        if (mutationObserver) {
            mutationObserver.observe(isWindowLike ? document.body : resolvedHost, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true,
            });
        }

        syncAllRaf();

        return () => {
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
        };
    }, [
        resolvedHost,
        isWindowLike,
        opposite,
        mirror,
        maxLength,
        trackMargin,
        edgeMargin,
        exactThumbSize,
        fillMode,
    ]);

    useEventListener(
        "scroll",
        () => {
            syncMetrics();
            applyBarPositions();
            activateScrollbar();
            deactivateScrollbar.run();
        },
        {
            delay: 0,
            passive: true,
            source: resolvedHost ? normalizedScrollSource : undefined,
        },
    );

    const onWheelPreventDisabledAxes = (e) => {
        const absY = Math.abs(e.deltaY);
        const absX = Math.abs(e.deltaX);

        const yCanDriveX = disableY && x.isOverflowing && absY >= absX;

        const hasDisabledXDelta = disableX && absX > 0;
        const hasDisabledYDelta = disableY && absY > 0 && !yCanDriveX;

        if (!hasDisabledXDelta && !hasDisabledYDelta) return;

        e.preventDefault();
        e.stopPropagation();
    };

    useEventListener("wheel", onWheelPreventDisabledAxes, {
        delay: 0,
        passive: false,
        source: resolvedHost ? normalizedScrollSource : undefined,
    });

    const setScrollTo = (axis, nextScroll, { behavior = "auto" } = {}) => {
        const axisState = axis === "x" ? x : y;
        const safeScroll = Math.max(0, Math.min(axisState.maxScroll, nextScroll));

        if (isWindowLike) {
            window.scrollTo({
                ...(axis === "y" ? { top: safeScroll } : { left: safeScroll }),
                behavior,
            });
            return;
        }

        if (!normalizedScrollSource) return;

        if (typeof normalizedScrollSource.scrollTo === "function") {
            normalizedScrollSource.scrollTo({
                ...(axis === "y" ? { top: safeScroll } : { left: safeScroll }),
                behavior,
            });
            return;
        }

        if (axis === "y") {
            // eslint-disable-next-line react-hooks/immutability
            normalizedScrollSource.scrollTop = safeScroll;
        } else {
            normalizedScrollSource.scrollLeft = safeScroll;
        }
    };

    const onWheelTranslateYToX = (e) => {
        if (isWindowLike) return;
        if (!x.isOverflowing) return;

        const shouldTranslateYToX = !y.isOverflowing || disableY;
        if (!shouldTranslateYToX) return;

        const absY = Math.abs(e.deltaY);
        const absX = Math.abs(e.deltaX);

        if (absY === 0) return;
        if (absX > absY) return;

        e.preventDefault();
        e.stopPropagation();

        const currentLeft = normalizedScrollSource.scrollLeft;
        const maxLeft = Math.max(
            0,
            normalizedScrollSource.scrollWidth - normalizedScrollSource.clientWidth,
        );

        const nextLeft = Math.max(0, Math.min(maxLeft, currentLeft + e.deltaY));

        if (nextLeft === currentLeft) return;

        // eslint-disable-next-line react-hooks/immutability
        normalizedScrollSource.scrollLeft = nextLeft;
    };

    useEventListener("wheel", onWheelTranslateYToX, {
        delay: 0,
        passive: false,
        source: resolvedHost && !isWindowLike ? normalizedScrollSource : undefined,
    });

    const getTrackMetrics = (axis) => {
        const truckEl = axis === "y" ? yTruckRef.current : xTruckRef.current;
        const axisState = axis === "y" ? y : x;
        const barPosition = getBarPositionForAxis(axis);

        if (!truckEl) return null;

        const rect = truckEl.getBoundingClientRect();
        const trackLength = barPosition === "vertical" ? rect.height : rect.width;
        const trackStart = barPosition === "vertical" ? rect.top : rect.left;

        return {
            rect,
            trackLength,
            trackStart,
            movableArea: Math.max(0, trackLength - axisState.thumbLength),
        };
    };

    const onTruckMouseDownFactory = (axis) => (e) => {
        const axisState = axis === "y" ? y : x;

        if (!axisState.isOverflowing) return;

        const thumbEl = axis === "y" ? yThumbRef.current : xThumbRef.current;
        if (!fillMode && thumbEl?.contains(e.target)) return;

        const metrics = getTrackMetrics(axis);
        if (!metrics) return;

        const clickPos = getClientValueForAxis(axis, e);
        const clickOffset = clickPos - metrics.trackStart;

        let nextScroll;

        if (fillMode) {
            const progress = Math.max(0, Math.min(1, clickOffset / metrics.trackLength));
            nextScroll = progress * axisState.maxScroll;
        } else {
            const desiredThumbPos = clickOffset - axisState.thumbLength / 2;
            const clampedThumbPos = Math.max(0, Math.min(metrics.movableArea, desiredThumbPos));

            nextScroll =
                metrics.movableArea <= 0
                    ? 0
                    : (clampedThumbPos / metrics.movableArea) * axisState.maxScroll;
        }

        setScrollTo(axis, nextScroll, { behavior: "smooth" });
    };

    const onThumbMouseDownFactory = (axis) => (e) => {
        if (fillMode) return;

        e.preventDefault();
        e.stopPropagation();

        const client = getClientValueForAxis(axis, e);
        const axisState = axis === "y" ? y : x;

        setLocal((s) => {
            s.dragAxis = axis;
            s.dragStartClient = client;
            s.dragStartScroll = axisState.scrollPos;
        });
    };

    const onDragMove = (e) => {
        if (!dragAxis) return;

        const axis = dragAxis;
        const axisState = axis === "y" ? y : x;
        const metrics = getTrackMetrics(axis);

        if (!metrics) return;

        const currentClient = getClientValueForAxis(axis, e);
        const deltaClient = currentClient - dragStartClient;

        if (metrics.movableArea <= 0 || axisState.maxScroll <= 0) return;

        const scrollPerPixel = axisState.maxScroll / metrics.movableArea;
        const nextScroll = dragStartScroll + deltaClient * scrollPerPixel;

        setScrollTo(axis, nextScroll, { behavior: "auto" });
    };

    const onDragEnd = () => {
        if (!dragAxis) return;

        setLocal((s) => {
            s.dragAxis = null;
        });
    };

    useEventListener("mousemove", onDragMove, {
        delay: 0,
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
        const bodyEl = document.body;

        const prevHtmlCursor = html.style.cursor;
        const prevBodyCursor = bodyEl.style.cursor;
        const prevHtmlUserSelect = html.style.userSelect;
        const prevBodyUserSelect = bodyEl.style.userSelect;

        if (dragAxis) {
            html.style.setProperty("cursor", "grabbing", "important");
            bodyEl.style.setProperty("cursor", "grabbing", "important");
            html.style.setProperty("user-select", "none", "important");
            bodyEl.style.setProperty("user-select", "none", "important");
        } else {
            html.style.cursor = prevHtmlCursor;
            bodyEl.style.cursor = prevBodyCursor;
            html.style.userSelect = prevHtmlUserSelect;
            bodyEl.style.userSelect = prevBodyUserSelect;
        }

        return () => {
            html.style.cursor = prevHtmlCursor;
            bodyEl.style.cursor = prevBodyCursor;
            html.style.userSelect = prevHtmlUserSelect;
            bodyEl.style.userSelect = prevBodyUserSelect;
        };
    }, [dragAxis]);

    const handleOnMouseEnter = () => {
        activateScrollbar();
    };

    const handleOnMouseLeave = () => {
        deactivateScrollbar.run();
    };

    const showX = x.isOverflowing && !disableX;
    const showY = y.isOverflowing && !disableY;
    const isDraggingX = dragAxis === "x";
    const isDraggingY = dragAxis === "y";

    return useExportData(
        {
            exportData,
            ...p,
            theme,
            Variant,
            body,
            disableX,
            disableY,
            opposite,
            mirror,
            xBarPosition,
            yBarPosition,
            truckColor,
            thumbColor,
            colors,
            thickness,
            maxLength,
            edgeMargin,
            trackMargin,
            minThumbLength,
            exactThumbSize,
            fillMode,
            resolvedHost,
            normalizedScrollSource,
            isWindowLike,
            hostRect,
            anchorRef,
            xTruckRef,
            yTruckRef,
            xThumbRef,
            yThumbRef,
            onXTruckMouseDown: onTruckMouseDownFactory("x"),
            onYTruckMouseDown: onTruckMouseDownFactory("y"),
            onXThumbMouseDown: onThumbMouseDownFactory("x"),
            onYThumbMouseDown: onThumbMouseDownFactory("y"),
            handleOnMouseEnter,
            handleOnMouseLeave,
            setScrollTo,
        },
        {
            x,
            y,
            showX,
            showY,
            isDraggingX,
            isDraggingY,
            isScrollbarActive: isScrollbarActive || !!dragAxis,
        },
    );
};

export default useVars;
