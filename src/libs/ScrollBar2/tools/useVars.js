import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useExportData } from "../../useExportedData";
import { clamp } from "./clamp";
import { getAutoOverlayRect } from "./getAutoOverlayRect";
import { getThumb } from "./getThumb";
import { getTrackLength } from "./getTrackLength";
import { hideNativeScrollbar } from "./hideNativeScrollbar";
import { isBrowser } from "./isBrowser";
import { resolveSourceByRefOrId } from "./resolveSourceByRefOrId";
import { setScroll } from "./setScroll";

const emptyMetrics = {
    visible: 0,
    content: 0,
    scroll: 0,
    maxScroll: 0,
    isOverflowing: false,
    thumbLength: 0,
    thumbPosition: 0,
    movable: 0,
};

const useVars = (p) => {
    const {
        Variant,
        body = false,
        sourceByRef,
        sourceById,
        disableX = false,
        disableY = false,
        opposite = false,
        mirror = false,
        truckColor,
        thumbColor,
        thickness = 4,
        maxLength,
        trackMargin = 5,
        edgeMargin = 5,
        minThumbLength = 24,
        exactThumbSize,
        fillMode = false,
        enableThumbScale = false,
        disableOpacityEffect = false,
        zIndex,
        exportData,
    } = p || {};

    const anchorRef = useRef(null);
    const xTrackRef = useRef(null);
    const yTrackRef = useRef(null);
    const xThumbRef = useRef(null);
    const yThumbRef = useRef(null);
    const rafRef = useRef(null);
    const activeTimerRef = useRef(null);

    const [source, setSource] = useState(null);
    const [overlayHost, setOverlayHost] = useState(null);
    const [overlayRect, setOverlayRect] = useState(null);
    const [active, setActive] = useState(false);
    const [drag, setDrag] = useState(null);
    const [metrics, setMetrics] = useState({
        x: emptyMetrics,
        y: emptyMetrics,
    });

    const hasExternalSource =
        sourceByRef != null || (typeof sourceById === "string" && sourceById.trim() !== "");
    const mode = body ? "body" : hasExternalSource ? "external" : "auto";

    const effectiveMirror = mode === "external" ? false : mirror;
    const effectiveOpposite = mode === "external" ? false : opposite;
    const effectiveTrackMargin = mode === "external" ? 0 : trackMargin;
    const effectiveEdgeMargin = mode === "external" ? 0 : edgeMargin;
    const finalZIndex = zIndex ?? (mode === "body" ? 2 : 999999999);

    const xBarPosition = effectiveOpposite ? "vertical" : "horizontal";
    const yBarPosition = effectiveOpposite ? "horizontal" : "vertical";

    const activate = useCallback(() => {
        if (!isBrowser()) return;

        window.clearTimeout(activeTimerRef.current);
        setActive(true);
    }, []);

    const deactivateSoon = useCallback(() => {
        if (!isBrowser()) return;

        window.clearTimeout(activeTimerRef.current);

        activeTimerRef.current = window.setTimeout(() => {
            setActive(false);
        }, 600);
    }, []);

    const sync = useCallback(() => {
        if (!isBrowser() || !source) return;

        const nextOverlayRect =
            mode === "auto"
                ? getAutoOverlayRect({
                      source,
                      overlayHost,
                  })
                : null;

        const xTrackLength = getTrackLength({
            mode,
            barPosition: xBarPosition,
            source,
            body,
            maxLength,
            trackMargin: effectiveTrackMargin,
            trackEl: xTrackRef.current,
            overlayRect: nextOverlayRect,
        });

        const yTrackLength = getTrackLength({
            mode,
            barPosition: yBarPosition,
            source,
            body,
            maxLength,
            trackMargin: effectiveTrackMargin,
            trackEl: yTrackRef.current,
            overlayRect: nextOverlayRect,
        });

        setOverlayRect(nextOverlayRect);

        setMetrics({
            x: getThumb({
                source,
                axis: "x",
                body,
                trackLength: xTrackLength,
                minThumbLength,
                exactThumbSize,
                fillMode,
            }),
            y: getThumb({
                source,
                axis: "y",
                body,
                trackLength: yTrackLength,
                minThumbLength,
                exactThumbSize,
                fillMode,
            }),
        });
    }, [
        source,
        overlayHost,
        mode,
        body,
        xBarPosition,
        yBarPosition,
        maxLength,
        effectiveTrackMargin,
        minThumbLength,
        exactThumbSize,
        fillMode,
    ]);

    const syncRaf = useCallback(() => {
        if (!isBrowser()) return;
        if (rafRef.current) return;

        rafRef.current = window.requestAnimationFrame(() => {
            rafRef.current = null;
            sync();
        });
    }, [sync]);

    useLayoutEffect(() => {
        if (!isBrowser()) return;

        if (body) {
            const rootSource = document.scrollingElement || document.documentElement;

            setSource(rootSource);
            setOverlayHost(document.body);
            return;
        }

        const externalSource = resolveSourceByRefOrId({
            sourceByRef,
            sourceById,
        });

        if (externalSource) {
            setSource(externalSource);
            setOverlayHost(null);
            return;
        }

        const ownSource = anchorRef.current?.parentElement || null;

        setSource(ownSource);
        setOverlayHost(ownSource?.parentElement || null);
    }, [body, sourceByRef, sourceById]);

    useLayoutEffect(() => {
        if (!isBrowser()) return;
        if (mode !== "auto") return;
        if (!overlayHost) return;

        const previousPosition = overlayHost.style.position;
        const computedPosition = window.getComputedStyle(overlayHost).position;
        const shouldSetRelative = computedPosition === "static";

        if (shouldSetRelative) {
            // eslint-disable-next-line react-hooks/immutability
            overlayHost.style.position = "relative";
        }

        return () => {
            if (!shouldSetRelative) return;

            if (previousPosition) {
                overlayHost.style.position = previousPosition;
            } else {
                overlayHost.style.removeProperty("position");
            }
        };
    }, [mode, overlayHost]);

    useLayoutEffect(() => {
        if (!isBrowser()) return;
        if (!source) return;

        const previous = {
            overflow: source.style.overflow,
            overflowX: source.style.overflowX,
            overflowY: source.style.overflowY,
            overscrollBehavior: source.style.overscrollBehavior,
        };

        if (!body) {
            const computed = window.getComputedStyle(source);

            const hasScrollableOverflow =
                ["auto", "scroll", "overlay"].includes(computed.overflow) ||
                ["auto", "scroll", "overlay"].includes(computed.overflowX) ||
                ["auto", "scroll", "overlay"].includes(computed.overflowY);

            if (!hasScrollableOverflow) {
                // eslint-disable-next-line react-hooks/immutability
                source.style.overflow = "auto";
            }
        }

        source.style.overscrollBehavior = "contain";

        if (disableX) source.style.overflowX = "hidden";
        if (disableY) source.style.overflowY = "hidden";

        return () => {
            source.style.overflow = previous.overflow;
            source.style.overflowX = previous.overflowX;
            source.style.overflowY = previous.overflowY;
            source.style.overscrollBehavior = previous.overscrollBehavior;
        };
    }, [source, body, disableX, disableY]);

    useEffect(() => {
        if (!isBrowser()) return;
        if (!source) return;

        return hideNativeScrollbar({
            source,
            body,
        });
    }, [source, body]);

    useEffect(() => {
        if (!isBrowser()) return;
        if (!source) return;

        syncRaf();

        const onScroll = () => {
            syncRaf();
            activate();
            deactivateSoon();
        };

        const scrollTarget = body ? window : source;

        scrollTarget.addEventListener("scroll", onScroll, {
            passive: true,
        });

        window.addEventListener("resize", syncRaf, {
            passive: true,
        });

        const resizeObserver =
            typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncRaf) : null;

        if (resizeObserver) {
            resizeObserver.observe(source);

            if (mode === "external") {
                if (xTrackRef.current) resizeObserver.observe(xTrackRef.current);
                if (yTrackRef.current) resizeObserver.observe(yTrackRef.current);
            }

            if (mode === "auto" && overlayHost) {
                resizeObserver.observe(overlayHost);
            }

            if (body) {
                resizeObserver.observe(document.documentElement);
                resizeObserver.observe(document.body);
            }
        }

        const mutationObserver =
            typeof MutationObserver !== "undefined" ? new MutationObserver(syncRaf) : null;

        if (mutationObserver) {
            mutationObserver.observe(body ? document.body : source, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true,
            });
        }

        return () => {
            scrollTarget.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", syncRaf);
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();

            if (rafRef.current) {
                window.cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [source, overlayHost, body, mode, syncRaf, activate, deactivateSoon]);
    useEffect(() => {
        if (!isBrowser()) return;
        if (!source) return;
        if (disableX) return;

        const canDriveXWithWheelY = metrics.x.isOverflowing && (disableY || !metrics.y.isOverflowing);
        if (!canDriveXWithWheelY) return;

        const wheelTarget = body ? window : source;

        const onWheelTranslateYToX = (event) => {
            const absY = Math.abs(event.deltaY);
            const absX = Math.abs(event.deltaX);

            if (absY === 0) return;
            if (absX > absY) return;

            event.preventDefault();
            event.stopPropagation();

            setScroll({
                source,
                axis: "x",
                body,
                value: metrics.x.scroll + event.deltaY,
                behavior: "auto",
            });
        };

        wheelTarget.addEventListener("wheel", onWheelTranslateYToX, {
            passive: false,
        });

        return () => {
            wheelTarget.removeEventListener("wheel", onWheelTranslateYToX);
        };
    }, [
        source,
        body,
        disableX,
        disableY,
        metrics.x.isOverflowing,
        metrics.x.scroll,
        metrics.y.isOverflowing,
    ]);

    const getAxisFromBarPosition = useCallback(
        (axis, event) => {
            const barPosition = axis === "x" ? xBarPosition : yBarPosition;

            return barPosition === "vertical" ? event.clientY : event.clientX;
        },
        [xBarPosition, yBarPosition],
    );

    const getTrackRect = useCallback(
        (axis) => {
            const el = axis === "x" ? xTrackRef.current : yTrackRef.current;
            const barPosition = axis === "x" ? xBarPosition : yBarPosition;

            if (!el) return null;

            const rect = el.getBoundingClientRect();

            return {
                rect,
                length: barPosition === "vertical" ? rect.height : rect.width,
                start: barPosition === "vertical" ? rect.top : rect.left,
            };
        },
        [xBarPosition, yBarPosition],
    );

    const handleTrackMouseDown = useCallback(
        (axis) => (event) => {
            if (!source) return;

            const axisMetrics = metrics[axis];

            if (!axisMetrics.isOverflowing) return;

            const thumbEl = axis === "x" ? xThumbRef.current : yThumbRef.current;

            if (!fillMode && thumbEl?.contains(event.target)) return;

            event.preventDefault();

            const track = getTrackRect(axis);
            if (!track) return;

            const pointer = getAxisFromBarPosition(axis, event);
            const offset = pointer - track.start;

            let nextScroll;

            if (fillMode) {
                const progress = clamp(offset / track.length, 0, 1);
                nextScroll = axisMetrics.maxScroll * progress;
            } else {
                const targetThumbPosition = offset - axisMetrics.thumbLength / 2;
                const clampedThumbPosition = clamp(targetThumbPosition, 0, axisMetrics.movable);

                nextScroll =
                    axisMetrics.movable <= 0
                        ? 0
                        : (clampedThumbPosition / axisMetrics.movable) * axisMetrics.maxScroll;
            }

            setScroll({
                source,
                axis,
                body,
                value: nextScroll,
                behavior: "smooth",
            });

            syncRaf();
            activate();
        },
        [source, body, metrics, fillMode, getTrackRect, getAxisFromBarPosition, syncRaf, activate],
    );

    const handleThumbMouseDown = useCallback(
        (axis) => (event) => {
            if (!source || fillMode) return;

            event.preventDefault();
            event.stopPropagation();

            const axisMetrics = metrics[axis];

            setDrag({
                axis,
                startClient: getAxisFromBarPosition(axis, event),
                startScroll: axisMetrics.scroll,
            });

            activate();
        },
        [source, fillMode, metrics, getAxisFromBarPosition, activate],
    );

    useEffect(() => {
        if (!isBrowser()) return;
        if (!drag) return;

        const onMove = (event) => {
            const axis = drag.axis;
            const axisMetrics = metrics[axis];
            const track = getTrackRect(axis);

            if (!track) return;
            if (axisMetrics.movable <= 0 || axisMetrics.maxScroll <= 0) return;

            const currentClient = getAxisFromBarPosition(axis, event);
            const delta = currentClient - drag.startClient;
            const scrollPerPx = axisMetrics.maxScroll / axisMetrics.movable;
            const nextScroll = drag.startScroll + delta * scrollPerPx;

            setScroll({
                source,
                axis,
                body,
                value: nextScroll,
                behavior: "auto",
            });

            syncRaf();
        };

        const onUp = () => {
            setDrag(null);
            deactivateSoon();
        };

        const html = document.documentElement;
        const bodyEl = document.body;

        const previous = {
            htmlCursor: html.style.cursor,
            bodyCursor: bodyEl.style.cursor,
            htmlUserSelect: html.style.userSelect,
            bodyUserSelect: bodyEl.style.userSelect,
        };

        html.style.cursor = "grabbing";
        bodyEl.style.cursor = "grabbing";
        html.style.userSelect = "none";
        bodyEl.style.userSelect = "none";

        window.addEventListener("mousemove", onMove, {
            passive: false,
        });

        window.addEventListener("mouseup", onUp, {
            passive: true,
        });

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);

            html.style.cursor = previous.htmlCursor;
            bodyEl.style.cursor = previous.bodyCursor;
            html.style.userSelect = previous.htmlUserSelect;
            bodyEl.style.userSelect = previous.bodyUserSelect;
        };
    }, [
        drag,
        metrics,
        source,
        body,
        getTrackRect,
        getAxisFromBarPosition,
        syncRaf,
        deactivateSoon,
    ]);

    useEffect(() => {
        return () => {
            if (isBrowser() && activeTimerRef.current) {
                window.clearTimeout(activeTimerRef.current);
            }
        };
    }, []);

    /* Return */
    return useExportData(
        {
            exportData,
            ...p,
            Variant,
            body,
            source,
            overlayHost,
            overlayRect,
            anchorRef,
            xTrackRef,
            yTrackRef,
            xThumbRef,
            yThumbRef,
            mode,
            hasExternalSource,
            disableX,
            disableY,
            mirror: effectiveMirror,
            opposite: effectiveOpposite,
            xBarPosition,
            yBarPosition,
            truckColor,
            thumbColor,
            thickness,
            maxLength,
            trackMargin: effectiveTrackMargin,
            edgeMargin: effectiveEdgeMargin,
            minThumbLength,
            exactThumbSize,
            fillMode,
            enableThumbScale,
            disableOpacityEffect,
            zIndex: finalZIndex,
            active,
            drag,
            activate,
            deactivateSoon,
            onXTrackMouseDown: handleTrackMouseDown("x"),
            onYTrackMouseDown: handleTrackMouseDown("y"),
            onXThumbMouseDown: handleThumbMouseDown("x"),
            onYThumbMouseDown: handleThumbMouseDown("y"),
        },
        {
            metrics,
            x: metrics.x,
            y: metrics.y,
            isDraggingX: drag?.axis === "x",
            isDraggingY: drag?.axis === "y",
            isScrollbarActive: active || !!drag,
            showX: !disableX,
            showY: !disableY,
        },
    );
};
export default useVars;
