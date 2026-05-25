import { useLayoutEffect } from "react";
import { getBarAxisGutterPx } from "./scrollBarLayout";
import { getContainerBorderInsetsPx, getPaddingInsetsFromElement } from "./domInsets";
import {
    createResizeObserver,
    measureContentIntrinsicAxisPx,
    resolveAutoAxisPx,
} from "./contentMeasure";
import {
    getAncestorAuthoredHeightWithoutSelf,
    getParentHeightWithoutSelf,
    getParentWidthWithoutSelf,
} from "./parentMeasure";
import { getRefSize, getTargetByRefOrId } from "./refUtils";
import { isFlexRowParent } from "./containerDimensions";

export const useScrollFlexMeasureEffects = ({
    setLocal,
    containerRef,
    shellRef,
    contentRef,
    hasExplicitContainerWidth,
    hasExplicitContainerHeight,
    hasWidthRefOrId,
    hasHeightRefOrId,
    autoWidthEnabled,
    autoHeightEnabled,
    widthByRef,
    widthById,
    heightByRef,
    heightById,
    scrollBarExportedData,
    scrollBarProps,
    barGutters,
}) => {
    useLayoutEffect(() => {
        if (hasExplicitContainerWidth && hasExplicitContainerHeight) return;

        const syncContentSize = () => {
            const content = contentRef.current;
            const container = containerRef.current;

            if (!content) return;

            const border = container ? getContainerBorderInsetsPx(container) : { x: 0, y: 0 };
            const nextW = hasExplicitContainerWidth
                ? null
                : measureContentIntrinsicAxisPx(content, "x");
            const nextH = hasExplicitContainerHeight
                ? null
                : measureContentIntrinsicAxisPx(content, "y");

            setLocal((s) => {
                if (nextW != null && s.contentWidthPx !== nextW) {
                    s.contentWidthPx = nextW;
                }

                if (nextH != null && s.contentHeightPx !== nextH) {
                    s.contentHeightPx = nextH;
                }

                if (
                    s.containerBorderInsetsPx.x !== border.x ||
                    s.containerBorderInsetsPx.y !== border.y
                ) {
                    s.containerBorderInsetsPx = border;
                }
            });
        };

        syncContentSize();

        const ro = createResizeObserver(syncContentSize, [
            contentRef.current,
            containerRef.current,
            shellRef.current,
        ]);

        return () => ro?.disconnect();
    }, [
        barGutters.gutterX,
        barGutters.gutterY,
        hasExplicitContainerHeight,
        hasExplicitContainerWidth,
        scrollBarExportedData.left,
        scrollBarExportedData.right,
        scrollBarExportedData.top,
        scrollBarExportedData.bottom,
        setLocal,
        containerRef,
        contentRef,
        shellRef,
    ]);

    useLayoutEffect(() => {
        if (hasHeightRefOrId) {
            const source = getTargetByRefOrId({
                ref: heightByRef,
                id: heightById,
            });

            const syncRefHeight = () => {
                const refHeight = getRefSize({ ref: source, axis: "y" });
                const ancestorHeight = refHeight
                    ? 0
                    : getAncestorAuthoredHeightWithoutSelf(containerRef.current);
                const parentHeight =
                    refHeight || ancestorHeight
                        ? 0
                        : getParentHeightWithoutSelf(containerRef.current);

                const nextHeight =
                    refHeight ||
                    (ancestorHeight > 0 ? `min(${ancestorHeight}px, 100vh)` : null) ||
                    (parentHeight > 0 ? `min(${parentHeight}px, 100vh)` : null) ||
                    "200px";

                setLocal((s) => {
                    if (s.hasMeasuredHeight && s.measuredHeight === nextHeight) return;

                    s.hasMeasuredHeight = true;
                    s.measuredHeight = nextHeight;
                    s.autoHeightCapsToParent = true;
                });
            };

            syncRefHeight();

            const ro = createResizeObserver(syncRefHeight, [source]);

            return () => ro?.disconnect();
        }

        if (!autoHeightEnabled) return;

        const syncAutoHeight = () => {
            const container = containerRef.current;
            const content = contentRef.current;

            if (!container || !content) return;

            const barGutter = getBarAxisGutterPx(scrollBarExportedData, scrollBarProps);
            const reserveY = !!(
                scrollBarExportedData.showX ||
                scrollBarExportedData.top ||
                scrollBarExportedData.bottom
            );
            const contentH = measureContentIntrinsicAxisPx(content, "y");
            const border = getContainerBorderInsetsPx(container);
            const shellPad = getPaddingInsetsFromElement(shellRef.current);
            const ancestorH = getAncestorAuthoredHeightWithoutSelf(container);
            const parentH = ancestorH > 0 ? ancestorH : getParentHeightWithoutSelf(container);

            const { px, capToParentPercent } = resolveAutoAxisPx({
                contentPx: contentH,
                parentPx: parentH,
                barGutterPx: barGutter,
                reserveBarGutter: reserveY,
                fallbackPx: 200,
                borderInsetPx: border.y + shellPad.y,
            });

            const nextHeight = `${px}px`;

            setLocal((s) => {
                if (
                    s.hasMeasuredHeight &&
                    s.measuredHeight === nextHeight &&
                    s.autoHeightCapsToParent === capToParentPercent
                ) {
                    return;
                }

                s.hasMeasuredHeight = true;
                s.measuredHeight = nextHeight;
                s.autoHeightCapsToParent = capToParentPercent;
            });
        };

        syncAutoHeight();

        const ro = createResizeObserver(syncAutoHeight, [
            containerRef.current,
            contentRef.current,
            containerRef.current?.parentElement,
        ]);

        return () => ro?.disconnect();
    }, [
        autoHeightEnabled,
        containerRef,
        contentRef,
        hasHeightRefOrId,
        heightById,
        heightByRef,
        scrollBarExportedData,
        scrollBarProps,
        setLocal,
        shellRef,
    ]);

    useLayoutEffect(() => {
        if (hasWidthRefOrId) {
            const source = getTargetByRefOrId({
                ref: widthByRef,
                id: widthById,
            });

            const syncRefWidth = () => {
                const nextWidth = getRefSize({ ref: source, axis: "x" });

                setLocal((s) => {
                    if (s.measuredWidth === nextWidth) return;

                    s.measuredWidth = nextWidth;
                    s.autoWidthCapsToParent = true;
                });
            };

            syncRefWidth();

            const ro = createResizeObserver(syncRefWidth, [source]);

            return () => ro?.disconnect();
        }

        if (!autoWidthEnabled) return;

        const syncAutoWidth = () => {
            const container = containerRef.current;
            const content = contentRef.current;

            if (!container || !content) return;

            const parent = container.parentElement;
            const useFlexGrow = isFlexRowParent(parent);

            if (useFlexGrow) {
                setLocal((s) => {
                    if (s.autoWidthFlexGrow && s.measuredWidth == null) return;

                    s.autoWidthFlexGrow = true;
                    s.measuredWidth = null;
                    s.autoWidthCapsToParent = true;
                });

                return;
            }

            const barGutter = getBarAxisGutterPx(scrollBarExportedData, scrollBarProps);
            const reserveX = !!(
                scrollBarExportedData.showY ||
                scrollBarExportedData.left ||
                scrollBarExportedData.right
            );
            const contentW = measureContentIntrinsicAxisPx(content, "x");
            const border = getContainerBorderInsetsPx(container);
            const shellPad = getPaddingInsetsFromElement(shellRef.current);
            const parentW = getParentWidthWithoutSelf(container);

            const { px, capToParentPercent } = resolveAutoAxisPx({
                contentPx: contentW,
                parentPx: parentW,
                barGutterPx: barGutter,
                reserveBarGutter: reserveX,
                fallbackPx: 200,
                borderInsetPx: border.x + shellPad.x,
            });

            const nextWidth = `${px}px`;

            setLocal((s) => {
                if (
                    s.autoWidthFlexGrow === false &&
                    s.measuredWidth === nextWidth &&
                    s.autoWidthCapsToParent === capToParentPercent
                ) {
                    return;
                }

                s.autoWidthFlexGrow = false;
                s.measuredWidth = nextWidth;
                s.autoWidthCapsToParent = capToParentPercent;
            });
        };

        syncAutoWidth();

        const ro = createResizeObserver(syncAutoWidth, [
            containerRef.current,
            contentRef.current,
            containerRef.current?.parentElement,
        ]);

        return () => ro?.disconnect();
    }, [
        autoWidthEnabled,
        containerRef,
        contentRef,
        hasWidthRefOrId,
        scrollBarExportedData,
        scrollBarProps,
        setLocal,
        shellRef,
        widthById,
        widthByRef,
    ]);
};
