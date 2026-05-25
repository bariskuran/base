import { addBarGutterToCssSize } from "./scrollBarLayout";
import { getLayoutSizeCss } from "./cssSizeUtils";

export const buildVariantOuterStyle = ({
    width,
    height,
    maxWidth,
    maxHeight,
    intrinsicWidth,
    hasExplicitContainerWidth,
    hasExplicitContainerHeight,
    hasMaxWidthBound,
    hasMaxHeightBound,
    hasWidthRefOrId,
    hasHeightRefOrId,
    autoWidthEnabled,
    autoHeightEnabled,
    autoWidthFlexGrow,
    autoWidthCapsToParent,
    autoHeightCapsToParent,
    measuredWidth,
    measuredHeight,
    contentWidthPx,
    contentHeightPx,
    barGutters,
    getContainerExtraInsetPx,
    needsShellViewport,
    restPropsWithoutShellPadding,
    resolveContainerWidthSource,
    resolveContainerHeightSource,
}) => {
    const containerWidthSource = resolveContainerWidthSource({
        width,
        restProps: restPropsWithoutShellPadding,
        measuredWidth,
        hasWidthRefOrId,
    });

    const containerHeightSource = resolveContainerHeightSource({
        height,
        measuredHeight,
        hasHeightRefOrId,
    });

    const { gutterX, gutterY } = barGutters;
    const out = {};

    if (
        hasExplicitContainerWidth &&
        containerWidthSource != null &&
        containerWidthSource !== ""
    ) {
        const w = getLayoutSizeCss(containerWidthSource);

        out.width = w;

        if (String(containerWidthSource).trim() !== "100%") {
            out.maxWidth = w;
        }
    } else if (autoWidthEnabled && autoWidthFlexGrow) {
        out.flex = "1 1 0";
        out.minWidth = 0;
    } else if (autoWidthEnabled && measuredWidth != null && measuredWidth !== "") {
        out.width = getLayoutSizeCss(measuredWidth);

        if (autoWidthCapsToParent) {
            out.maxWidth = "100%";
        }
    } else if (autoWidthEnabled) {
        out.width = "100%";
        out.maxWidth = "100%";
        out.minWidth = 0;
    } else if (contentWidthPx > 0) {
        out.width = `${Math.ceil(contentWidthPx + getContainerExtraInsetPx("x"))}px`;
    } else if (intrinsicWidth) {
        out.width = "max-content";
    }

    if (hasMaxWidthBound && !hasExplicitContainerWidth) {
        out.maxWidth = addBarGutterToCssSize(maxWidth, gutterX);
    } else if (maxWidth === null) {
        delete out.maxWidth;
    }

    if (
        hasExplicitContainerHeight &&
        containerHeightSource != null &&
        containerHeightSource !== ""
    ) {
        out.height = getLayoutSizeCss(containerHeightSource);
    } else if (autoHeightEnabled && measuredHeight != null && measuredHeight !== "") {
        out.height = getLayoutSizeCss(measuredHeight);

        if (autoHeightCapsToParent) {
            out.maxHeight = "100%";
        }
    } else if (contentHeightPx > 0) {
        out.height = `${Math.round(contentHeightPx + getContainerExtraInsetPx("y"))}px`;

        if (!hasExplicitContainerWidth) {
            out.width = out.width ?? "100%";
            out.maxWidth = out.maxWidth ?? "100%";
            out.minWidth = out.minWidth ?? 0;
        }
    }

    if (hasMaxHeightBound && !hasExplicitContainerHeight) {
        out.maxHeight = addBarGutterToCssSize(maxHeight, gutterY);
    }

    if (needsShellViewport) {
        out.display ??= "flex";
        out.flexDirection ??= "column";
        out.minHeight ??= 0;
        out.minWidth ??= 0;
        out.overflow ??= "hidden";
    }

    const merged = {
        ...out,
        ...(restPropsWithoutShellPadding.style || {}),
    };

    return Object.keys(merged).length ? merged : undefined;
};
