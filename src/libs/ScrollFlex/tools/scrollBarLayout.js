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

const clampEdgeMarginRem = (value) => {
    if (value == null || value === "") return 0;
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
};

export const resolveScrollBarPropsForContentSizedLayout = (
    scrollBarProps,
    { contentSizedHeight = false, contentSizedWidth = false } = {},
) => {
    if (!contentSizedHeight && !contentSizedWidth) return {};

    const pickAxis = (axis) => {
        const key = axis === "X" ? "edgeMarginX" : "edgeMarginY";
        const direct = scrollBarProps[key];
        if (direct != null && direct !== "") return clampEdgeMarginRem(direct);
        if (scrollBarProps.edgeMargin != null && scrollBarProps.edgeMargin !== "") {
            return clampEdgeMarginRem(scrollBarProps.edgeMargin);
        }
        return 0;
    };

    const out = {};

    if (contentSizedHeight) {
        out.edgeMarginX = pickAxis("X");
        out.edgeMarginY = pickAxis("Y");
    }

    if (contentSizedWidth) {
        out.edgeMarginX = pickAxis("X");
        out.edgeMarginY = pickAxis("Y");
    }

    return out;
};

export const getBarGutterInsets = (scrollBarData, scrollBarProps) => {
    const gutter = getBarAxisGutterPx(scrollBarData, scrollBarProps);
    const showX = !!scrollBarData?.showX;
    const showY = !!scrollBarData?.showY;

    return {
        gutterX: showY || scrollBarData?.left || scrollBarData?.right ? gutter : 0,
        gutterY: showX || scrollBarData?.top || scrollBarData?.bottom ? gutter : 0,
    };
};

export const addBarGutterToCssSize = (size, gutterPx) => {
    if (size == null || size === "") return undefined;
    if (!gutterPx) return getLayoutSizeCss(size);

    return normalizeCalcValue(`calc(${getLayoutSizeCss(size)} + ${gutterPx}px)`);
};

export const getShellLayoutStyle = (scrollBarData, scrollBarProps, layoutMode = {}) => {
    const { contentSizedHeight = false, contentSizedWidth = false } = layoutMode;
    const barSpace = getBarAxisGutterPx(scrollBarData, scrollBarProps);

    const hasVerticalBarEdge = !!(scrollBarData?.top || scrollBarData?.bottom);
    const hasHorizontalBarEdge = !!(scrollBarData?.left || scrollBarData?.right);

    const shrinkShellHeight = hasVerticalBarEdge && !contentSizedHeight;
    const shrinkShellWidth = hasHorizontalBarEdge && !contentSizedWidth;

    return {
        width: shrinkShellWidth ? `calc(100% - ${barSpace}px)` : "100%",
        height: shrinkShellHeight ? `calc(100% - ${barSpace}px)` : "100%",
        ...(scrollBarData?.top ? { alignSelf: "end" } : {}),
        ...(scrollBarData?.left ? { justifySelf: "end" } : {}),
    };
};
