import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { baseStore } from "../../@baseStore";
import { colorGet } from "../../colorGet";
import { disableBrowserScrollBar, enableBrowserScrollBar } from "./manageBrowsersScrollBar";
import getScrollHost from "./getScrollHost";
import getThumbProps from "./getThumbProps";
import { useEventListener } from "../../useEventListener";
import { delayedFunction } from "../../delayedFunction";
import { useExportData } from "../../useExportedData";

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

        return {
            isOverflowingX: Math.max(docEl.scrollWidth, body.scrollWidth) > window.innerWidth,
            isOverflowingY: Math.max(docEl.scrollHeight, body.scrollHeight) > window.innerHeight,
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
        xOnTop = false,
        yOnLeft = false,
        truckColor,
        thumbColor,
        thickness = 6,
        maxLength,
        marginToSide = 5,
        marginToBorder = 2,
        minThumbLength = 24,
        exportData,
    } = p || {};

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

    const colors = colorGet(truckColor || theme.foreground);

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

    const activateScrollbar = () => {
        deactivateScrollbar.cancel();
        setLocal((s) => {
            s.isScrollbarActive = true;
        });
    };

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

    const syncHostRect = () => {
        if (typeof document === "undefined") return;

        if (isWindowLike) {
            setLocal((s) => {
                s.hostRect = {
                    top: 0,
                    left: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            });
            return;
        }

        if (!resolvedHost) return;

        const rect = resolvedHost.getBoundingClientRect();

        setLocal((s) => {
            s.hostRect = {
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height,
            };
        });
    };

    const syncMetrics = () => {
        if (!resolvedHost || !normalizedScrollSource) return;

        const overflow = getAxisOverflow({
            source: normalizedScrollSource,
            isWindowLike,
        });

        const xProps = getThumbProps({
            direction: "x",
            maxLength,
            marginToSide,
            minThumbLength,
            source: normalizedScrollSource,
        });

        const yProps = getThumbProps({
            direction: "y",
            maxLength,
            marginToSide,
            minThumbLength,
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

    useLayoutEffect(() => {
        if (!resolvedHost) return;
        syncHostRect();
        syncMetrics();
    }, [resolvedHost, isWindowLike, maxLength, marginToSide, minThumbLength]);

    useLayoutEffect(() => {
        if (typeof document === "undefined") return;
        if (!resolvedHost) return;
        if (body) return;

        const host = resolvedHost;
        const style = host.style;
        const computed = window.getComputedStyle(host);

        const prev = {
            overflow: style.overflow,
            overflowX: style.overflowX,
            overflowY: style.overflowY,
            paddingTop: style.paddingTop,
            paddingRight: style.paddingRight,
            paddingBottom: style.paddingBottom,
            paddingLeft: style.paddingLeft,
        };

        const hasScrollableOverflow =
            ["auto", "scroll", "overlay"].includes(computed.overflow) ||
            ["auto", "scroll", "overlay"].includes(computed.overflowX) ||
            ["auto", "scroll", "overlay"].includes(computed.overflowY);

        if (!hasScrollableOverflow) {
            // eslint-disable-next-line react-hooks/immutability
            style.overflow = "auto";
        }

        const paddingSize = thickness + marginToBorder + 6;

        if (y.isOverflowing && !disableY) {
            if (yOnLeft) {
                style.paddingLeft = `calc(${computed.paddingLeft} + ${paddingSize}px)`;
            } else {
                style.paddingRight = `calc(${computed.paddingRight} + ${paddingSize}px)`;
            }
        }

        if (x.isOverflowing && !disableX) {
            if (xOnTop) {
                style.paddingTop = `calc(${computed.paddingTop} + ${paddingSize}px)`;
            } else {
                style.paddingBottom = `calc(${computed.paddingBottom} + ${paddingSize}px)`;
            }
        }

        return () => {
            style.overflow = prev.overflow;
            style.overflowX = prev.overflowX;
            style.overflowY = prev.overflowY;
            style.paddingTop = prev.paddingTop;
            style.paddingRight = prev.paddingRight;
            style.paddingBottom = prev.paddingBottom;
            style.paddingLeft = prev.paddingLeft;
        };
    }, [
        resolvedHost,
        body,
        disableX,
        disableY,
        xOnTop,
        yOnLeft,
        x.isOverflowing,
        y.isOverflowing,
        thickness,
        marginToBorder,
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

    useEventListener(
        "scroll",
        () => {
            syncMetrics();
            syncHostRect();
            activateScrollbar();
            deactivateScrollbar.run();
        },
        {
            delay: 0,
            passive: true,
            source: resolvedHost ? normalizedScrollSource : undefined,
        },
    );

    useEventListener("resize", syncHostRect, {
        delay: 0,
        passive: true,
        source: typeof window !== "undefined" ? window : undefined,
    });

    useEventListener("scroll", syncHostRect, {
        delay: 0,
        passive: true,
        source: typeof window !== "undefined" ? window : undefined,
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
        if (!x.isOverflowing || y.isOverflowing) return;

        const absY = Math.abs(e.deltaY);
        const absX = Math.abs(e.deltaX);

        if (absY === 0) return;
        if (absX > absY) return;

        e.preventDefault();

        const currentLeft = normalizedScrollSource.scrollLeft;
        const maxLeft = Math.max(
            0,
            normalizedScrollSource.scrollWidth - normalizedScrollSource.clientWidth,
        );
        const nextLeft = Math.max(0, Math.min(maxLeft, currentLeft + e.deltaY));

        // eslint-disable-next-line react-hooks/immutability
        normalizedScrollSource.scrollLeft = nextLeft;
    };

    useEventListener("wheel", onWheelTranslateYToX, {
        delay: 0,
        passive: false,
        source: resolvedHost && !isWindowLike ? normalizedScrollSource : undefined,
    });

    const getTrackMetrics = (axis) => {
        const isY = axis === "y";
        const truckEl = isY ? yTruckRef.current : xTruckRef.current;
        const axisState = isY ? y : x;

        if (!truckEl) return null;

        const rect = truckEl.getBoundingClientRect();
        const trackLength = isY ? rect.height : rect.width;
        const trackStart = isY ? rect.top : rect.left;

        return {
            rect,
            trackLength,
            trackStart,
            movableArea: Math.max(0, trackLength - axisState.thumbLength),
        };
    };

    const onTruckMouseDownFactory = (axis) => (e) => {
        const axisState = axis === "y" ? y : x;
        const thumbEl = axis === "y" ? yThumbRef.current : xThumbRef.current;

        if (!axisState.isOverflowing) return;
        if (thumbEl?.contains(e.target)) return;

        const metrics = getTrackMetrics(axis);
        if (!metrics) return;

        const clickPos = axis === "y" ? e.clientY : e.clientX;
        const clickOffset = clickPos - metrics.trackStart;
        const desiredThumbPos = clickOffset - axisState.thumbLength / 2;
        const clampedThumbPos = Math.max(0, Math.min(metrics.movableArea, desiredThumbPos));

        const nextScroll =
            metrics.movableArea <= 0
                ? 0
                : (clampedThumbPos / metrics.movableArea) * axisState.maxScroll;

        setScrollTo(axis, nextScroll, { behavior: "smooth" });
    };

    const onThumbMouseDownFactory = (axis) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const client = axis === "y" ? e.clientY : e.clientX;
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

        const currentClient = axis === "y" ? e.clientY : e.clientX;
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
            xOnTop,
            yOnLeft,
            truckColor,
            thumbColor,
            colors,
            thickness,
            maxLength,
            marginToSide,
            marginToBorder,
            minThumbLength,
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
