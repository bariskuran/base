import { baseStore } from "../../@baseStore";
import { useEffect, useRef, useLayoutEffect, useMemo } from "react";
import { colorGet } from "../../colorGet";
import { disableBrowserScrollBar, enableBrowserScrollBar } from "./manageBrowsersScrollBar";
import getThumbProps from "./getThumbProps";
import { useEventListener } from "../../useEventListener";
import { useCheckOverflow } from "../../useCheckOverflow";
import { delayedFunction } from "../../delayedFunction";
import { useExportData } from "../../useExportedData";

const useVars = (p) => {
    const {
        Variant,
        position = "vertical",
        align = "right",
        direction = "y",
        truckColor,
        thumbColor,
        containerRef,
        maxLength,
        marginToBorder,
        size,
        exportData, // advanced return for jsx components implementation is done.
    } = p || {};

    const truckRef = useRef(null);
    const thumbRef = useRef(null);

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const {
        thumbLength,
        thumbPosition,
        maxScroll,
        scrollPos,
        previousOverflowValues,
        setLocal,
        isDragging,
        dragStartClient,
        dragStartScroll,
        resolvedHost,
        isScrollbarActive,
    } = baseStore.useLocal({
        previousOverflowValues: {},
        isDragging: false,
        dragStartClient: 0,
        dragStartScroll: 0,
        thumbLength: 0,
        thumbPosition: 0,
        maxScroll: 0,
        scrollPos: 0,
        resolvedHost: null,
        isScrollbarActive: false,
    });

    const colors = colorGet(truckColor || theme.foreground);

    const root = typeof document !== "undefined" ? document.getElementById("root") : null;
    const hasExternalContainerRef = !!containerRef;

    /**
     * Host resolve
     * - containerRef varsa onun dolmasını bekle
     * - yoksa body/window modu
     */
    useLayoutEffect(() => {
        if (typeof document === "undefined") return;

        if (hasExternalContainerRef) {
            if (!containerRef?.current) return;

            setLocal((s) => {
                s.resolvedHost = containerRef.current;
            });
            return;
        }

        setLocal((s) => {
            s.resolvedHost = document.documentElement;
        });
    }, [hasExternalContainerRef, containerRef, setLocal]);

    const normalizedScrollSource =
        typeof document === "undefined" ||
        resolvedHost == null ||
        resolvedHost === root ||
        resolvedHost === document.body ||
        resolvedHost === document.documentElement
            ? window
            : resolvedHost;

    const isWindowLike =
        normalizedScrollSource === window ||
        normalizedScrollSource === document.body ||
        normalizedScrollSource === document.documentElement;

    const { isOverflowing } = useCheckOverflow({
        target: resolvedHost ? normalizedScrollSource : null,
    });

    /**
     * Native browser scrollbar hide
     */
    useEffect(() => {
        if (typeof document === "undefined") return;
        if (!resolvedHost) return;

        const styleEl = document.createElement("style");

        disableBrowserScrollBar({
            host:
                normalizedScrollSource === window
                    ? document.documentElement
                    : normalizedScrollSource,
            setLocal,
            styleEl,
        });

        return () => {
            enableBrowserScrollBar({ styleEl, previousOverflowValues });
        };
    }, [resolvedHost, normalizedScrollSource]);

    const [defaultWidth, defaultHeight, defaultMargin, minThumbLength] = [
        size || 6,
        maxLength ?? 95,
        marginToBorder ?? 2,
        24,
    ];

    /**
     * Thumb metrics
     */
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
    const getThumbP = () => {
        if (!resolvedHost) return;

        const { thumbLength, thumbPosition, maxScroll, scrollPos } = getThumbProps({
            direction,
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
        if (!resolvedHost) return;
        getThumbP();
    }, [resolvedHost, normalizedScrollSource, direction, position]);

    useEventListener(
        "scroll",
        () => {
            getThumbP();
            activateScrollbar();
            deactivateScrollbar.run();
        },
        {
            delay: 50,
            passive: true,
            source: resolvedHost ? normalizedScrollSource : undefined,
        },
    );

    /**
     * Scroll setters
     */
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
        }
    };

    const getTrackMetrics = () => {
        const truckEl = truckRef.current;
        if (!truckEl) return null;

        const rect = truckEl.getBoundingClientRect();

        const trackLength = direction === "y" ? rect.height : rect.width;
        const trackStart = direction === "y" ? rect.top : rect.left;

        return {
            rect,
            trackLength,
            trackStart,
            movableArea: Math.max(0, trackLength - thumbLength),
        };
    };

    /**
     * Click on truck
     */
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

    /**
     * Drag thumb
     */
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

    /**
     * Global cursor while dragging
     */
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

    const handleOnMouseEnter = () => {
        activateScrollbar();
    };
    const handleOnMouseLeave = () => {
        deactivateScrollbar.run();
    };

    return useExportData(
        {
            exportData,
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
            thumbRef,
            truckColor,
            thumbColor,
            colors,
            onTruckMouseDown,
            onThumbMouseDown,
            handleOnMouseEnter,
            handleOnMouseLeave,
        },
        {
            minThumbLength,
            thumbLength,
            thumbPosition,
            maxScroll,
            scrollPos,
            isOverflowing,
            isDragging,
            isWindowLike,
            isBoxMode: !isWindowLike,
            isScrollbarActive: isScrollbarActive || isDragging,
            containerRef,
        },
    );
};

export default useVars;
