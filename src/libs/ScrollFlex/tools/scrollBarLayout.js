import { getLayoutSizeCss, normalizeCalcValue, remToPx } from "./cssSizeUtils";

export const pickScrollBarLayoutData = (data = {}) => ({
    showX: !!data.showX,
    showY: !!data.showY,
    top: !!data.top,
    bottom: !!data.bottom,
    left: !!data.left,
    right: !!data.right,
    edgeMargin: data.edgeMargin,
    thickness: data.thickness,
});

export const getBarAxisGutterPx = (scrollBarData, scrollBarProps) => {
    const thickness = Number(scrollBarData?.thickness ?? scrollBarProps?.thickness ?? 4);
    const edgeMargin = Number(
        scrollBarData?.edgeMargin ??
            scrollBarProps?.edgeMargin ??
            scrollBarProps?.edgeMarginX ??
            scrollBarProps?.edgeMarginY ??
            -4 - thickness,
    );

    if (!Number.isFinite(thickness)) return 9;

    const thicknessPx = remToPx(thickness);

    if (!Number.isFinite(edgeMargin)) {
        return Math.round(thicknessPx);
    }

    const edgePx = remToPx(edgeMargin);
    const overlapPx = Math.max(0, thicknessPx + edgePx);
    const legacyPx = Math.abs(edgeMargin) + thickness;

    if (Math.abs(edgeMargin) <= 24 && thickness <= 24) {
        return Math.round(legacyPx);
    }

    return Math.round(Math.max(thicknessPx, overlapPx));
};

export const getBarGutterInsets = (scrollBarData, scrollBarProps) => {
    const gutter = getBarAxisGutterPx(scrollBarData, scrollBarProps);

    return {
        gutterX: scrollBarData?.left || scrollBarData?.right ? gutter : 0,
        gutterY: scrollBarData?.top || scrollBarData?.bottom ? gutter : 0,
    };
};

export const addBarGutterToCssSize = (size, gutterPx) => {
    if (size == null || size === "") return undefined;
    if (!gutterPx) return getLayoutSizeCss(size);

    return normalizeCalcValue(`calc(${getLayoutSizeCss(size)} + ${gutterPx}px)`);
};

export const getShellLayoutStyle = (scrollBarData, scrollBarProps) => {
    const barSpace = getBarAxisGutterPx(scrollBarData, scrollBarProps);

    const hasVerticalBarEdge = !!(scrollBarData?.top || scrollBarData?.bottom);
    const hasHorizontalBarEdge = !!(scrollBarData?.left || scrollBarData?.right);

    return {
        width: hasHorizontalBarEdge ? `calc(100% - ${barSpace}px)` : "100%",
        height: hasVerticalBarEdge ? `calc(100% - ${barSpace}px)` : "100%",
        ...(scrollBarData?.top ? { alignSelf: "end" } : {}),
        ...(scrollBarData?.left ? { justifySelf: "end" } : {}),
    };
};
