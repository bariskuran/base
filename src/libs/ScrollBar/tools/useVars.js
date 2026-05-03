import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { baseStore } from "../../@baseStore";
import { colorGet } from "../../colorGet";
import { disableBrowserScrollBar, enableBrowserScrollBar } from "./manageBrowsersScrollBar";
import getScrollHost from "./getScrollHost";
import { getAxisOverflow, getHostRect } from "./getScrollMetrics";
import getThumbProps from "./getThumbProps";
import { useEventListener } from "../../useEventListener";
import { delayedFunction } from "../../delayedFunction";
import { useExportData } from "../../useExportedData";

const useVars = (p) => {
    const {
        Variant,
        body = false,
        sourceByRef,
        sourceById,
        positionSourceByRef,
        disableX = false,
        disableY = false,
        opposite = false,
        mirror = false,
        truckColor,
        thumbColor,
        thickness = 4,
        maxLength,
        trackMargin: trackMarginProp,
        edgeMargin: edgeMarginProp,
        edgeMarginX: edgeMarginXProp,
        edgeMarginY: edgeMarginYProp,
        minThumbLength = 24,
        exactThumbSize,
        fillMode = false,
        enableThumbScale = false,
        disableOpacityEffect = false,
        exportData,
    } = p || {};

    const trackMargin = trackMarginProp ?? 5;
    const edgeMargin = edgeMarginProp ?? 5;
    const edgeMarginX = edgeMarginXProp;
    const edgeMarginY = edgeMarginYProp;
    const hasExternalSource =
        sourceByRef != null || (typeof sourceById === "string" && sourceById.trim() !== "");
    const hasExternalPositionSource = positionSourceByRef != null;
    const hasSplitPositionSource = hasExternalSource && hasExternalPositionSource;
    const isExternalInlineMode = hasExternalSource && !hasExternalPositionSource;
    const effectiveTrackMargin = isExternalInlineMode ? 0 : trackMargin;
    const effectiveEdgeMargin = isExternalInlineMode ? 0 : edgeMargin;
    const effectiveEdgeMarginX =
        isExternalInlineMode ? 0 : edgeMarginX != null ? edgeMarginX : edgeMargin;
    const effectiveEdgeMarginY =
        isExternalInlineMode ? 0 : edgeMarginY != null ? edgeMarginY : edgeMargin;
    const effectiveOpposite = isExternalInlineMode ? false : opposite;
    const effectiveMirror = isExternalInlineMode ? false : mirror;

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const {
        resolvedHost,
        resolvedSource,
        overlayHost,
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
        resolvedSource: null,
        overlayHost: null,
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
        if (axis === "y") return effectiveOpposite ? "horizontal" : "vertical";
        return effectiveOpposite ? "vertical" : "horizontal";
    };

    const getClientValueForAxis = (axis, e) => {
        const barPosition = getBarPositionForAxis(axis);
        return barPosition === "vertical" ? e.clientY : e.clientX;
    };

    const xBarPosition = getBarPositionForAxis("x");
    const yBarPosition = getBarPositionForAxis("y");

    const resolveExternalSource = () => {
        if (typeof document === "undefined") return null;

        const refEl = sourceByRef?.current || sourceByRef || null;
        if (refEl?.nodeType === 1) return refEl;

        if (sourceById) {
            const idEl = document.getElementById(sourceById);
            if (idEl) return idEl;
        }

        return null;
    };
    const resolvePositionSource = () => {
        if (typeof document === "undefined") return null;
        const refEl = positionSourceByRef?.current || positionSourceByRef || null;
        return refEl?.nodeType === 1 ? refEl : null;
    };

    const resolveLayoutHostEl = () => {
        if (typeof document === "undefined") return null;
        return getScrollHost({
            node: anchorRef.current,
            body,
        });
    };

    useLayoutEffect(() => {
        if (typeof document === "undefined") return;

        const host = resolveLayoutHostEl();

        if (!host) return;

        const source = resolveExternalSource() || host;
        const positionSource = resolvePositionSource() || source;

        setLocal((s) => {
            s.resolvedHost = positionSource;
            s.resolvedSource = source;
            s.overlayHost = positionSource?.parentElement || null;
        });
    }, [body, setLocal, sourceByRef, sourceById, positionSourceByRef]);

    const normalizedScrollSource =
        typeof document === "undefined" ||
        !resolvedSource ||
        resolvedSource === document.body ||
        resolvedSource === document.documentElement
            ? window
            : resolvedSource;

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

    const syncHostRect = () => {
        if (typeof document === "undefined") return;
        if (!resolvedHost) return;

        const rect = getHostRect({
            host: resolvedHost,
            isWindowLike,
        });

        setLocal((s) => {
            s.hostRect = rect;
        });
    };

    const syncMetrics = () => {
        if (!normalizedScrollSource) return;

        const visualHost = resolvedHost;
        if (!visualHost && !isWindowLike) return;

        const overflow = getAxisOverflow({
            source: normalizedScrollSource,
            isWindowLike,
        });

        const xProps = getThumbProps({
            scrollAxis: "x",
            visualAxis: xBarPosition === "vertical" ? "y" : "x",
            maxLength,
            trackMargin: effectiveTrackMargin,
            minThumbLength,
            exactThumbSize,
            fillMode,
            source: normalizedScrollSource,
            visualSource: visualHost,
        });

        const yProps = getThumbProps({
            scrollAxis: "y",
            visualAxis: yBarPosition === "vertical" ? "y" : "x",
            maxLength,
            trackMargin: effectiveTrackMargin,
            minThumbLength,
            exactThumbSize,
            fillMode,
            source: normalizedScrollSource,
            visualSource: visualHost,
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
        effectiveTrackMargin,
        minThumbLength,
        exactThumbSize,
        fillMode,
        effectiveOpposite,
        effectiveMirror,
        effectiveEdgeMargin,
    ]);

    useLayoutEffect(() => {
        if (typeof document === "undefined") return;
        if (!resolvedHost) return;

        if (!isWindowLike && overlayHost) {
            const previousPosition = overlayHost.style.position;
            const computedPosition = window.getComputedStyle(overlayHost).position;
            const shouldRestore = computedPosition === "static";

            if (shouldRestore) {
                overlayHost.style.setProperty("position", "relative");
            }

            return () => {
                if (shouldRestore) {
                    if (previousPosition) {
                        overlayHost.style.setProperty("position", previousPosition);
                    } else {
                        overlayHost.style.removeProperty("position");
                    }
                }
            };
        }
    }, [resolvedHost, overlayHost, isWindowLike]);

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

            if (disableX) target.style.overflowX = "hidden";
            if (disableY) target.style.overflowY = "hidden";
        });

        const overflowNow = getAxisOverflow({
            source: normalizedScrollSource,
            isWindowLike,
        });

        const shouldApplyOverscrollContain =
            isWindowLike ||
            (!disableX && overflowNow.isOverflowingX) ||
            (!disableY && overflowNow.isOverflowingY);

        targets.forEach((target, index) => {
            if (!target?.style) return;

            const prev = prevValues[index];
            target.style.overscrollBehavior = shouldApplyOverscrollContain
                ? "contain"
                : prev.overscrollBehavior;
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
    }, [
        resolvedHost,
        normalizedScrollSource,
        isWindowLike,
        body,
        disableX,
        disableY,
        x.isOverflowing,
        y.isOverflowing,
    ]);

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

        const onWindowChange = () => {
            syncAllRaf();
        };

        if (isWindowLike) {
            window.addEventListener("scroll", onWindowChange, {
                passive: true,
            });
        }

        window.addEventListener("resize", onWindowChange, {
            passive: true,
        });

        return () => {
            if (isWindowLike) {
                window.removeEventListener("scroll", onWindowChange);
            }

            window.removeEventListener("resize", onWindowChange);

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [
        resolvedHost,
        normalizedScrollSource,
        isWindowLike,
        effectiveOpposite,
        effectiveMirror,
        maxLength,
        effectiveTrackMargin,
        effectiveEdgeMargin,
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
        effectiveOpposite,
        effectiveMirror,
        maxLength,
        effectiveTrackMargin,
        effectiveEdgeMargin,
        exactThumbSize,
        fillMode,
    ]);

    useEventListener(
        "scroll",
        () => {
            syncMetrics();
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

        Reflect.set(normalizedScrollSource, axis === "y" ? "scrollTop" : "scrollLeft", safeScroll);
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

        Reflect.set(normalizedScrollSource, "scrollLeft", nextLeft);
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
            html.style.cursor = "grabbing";
            bodyEl.style.cursor = "grabbing";
            html.style.userSelect = "none";
            bodyEl.style.userSelect = "none";
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
    const getVisibleEdge = (isVisible, barPosition) => {
        if (!isVisible) return {};
        if (barPosition === "vertical") return effectiveMirror ? { left: true } : { right: true };
        return effectiveMirror ? { top: true } : { bottom: true };
    };
    const visibleEdges = {
        top: false,
        bottom: false,
        left: false,
        right: false,
        ...getVisibleEdge(showY, yBarPosition),
        ...getVisibleEdge(showX, xBarPosition),
    };

    return useExportData(
        {
            exportData,
            ...p,
            theme,
            Variant,
            body,
            disableX,
            disableY,
            opposite: effectiveOpposite,
            mirror: effectiveMirror,
            xBarPosition,
            yBarPosition,
            truckColor,
            thumbColor,
            colors,
            thickness,
            maxLength,
            edgeMargin: effectiveEdgeMargin,
            edgeMarginX: effectiveEdgeMarginX,
            edgeMarginY: effectiveEdgeMarginY,
            trackMargin: effectiveTrackMargin,
            minThumbLength,
            exactThumbSize,
            fillMode,
            enableThumbScale,
            disableOpacityEffect,
            resolvedHost,
            overlayHost,
            normalizedScrollSource,
            isWindowLike,
            hasExternalSource,
            hasSplitPositionSource,
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
            top: visibleEdges.top,
            bottom: visibleEdges.bottom,
            left: visibleEdges.left,
            right: visibleEdges.right,
            edgeMargin: effectiveEdgeMargin,
            edgeMarginX: effectiveEdgeMarginX,
            edgeMarginY: effectiveEdgeMarginY,
            thickness,
            isDraggingX,
            isDraggingY,
            isScrollbarActive: isScrollbarActive || !!dragAxis,
        },
    );
};

export default useVars;
