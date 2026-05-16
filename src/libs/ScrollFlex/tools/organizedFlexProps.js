import { getLayoutSizeCss } from "./cssSizeUtils";
import { getContainerHeight } from "./containerDimensions";
import { applyContentFlexProps, mergeDefaultAlignment } from "./contentFlexProps";

export const buildOrganizedFlexProps = ({
    flexProps,
    height,
    width,
    intrinsicWidth,
    hasMeasuredHeight,
    measuredHeight,
    hasExplicitContainerHeight,
    hasMaxHeightBound,
    autoHeightEnabled,
    explicitContainerWidthValue,
    restPropsWithoutShellPadding,
}) => {
    const explicitContainerHeight = getContainerHeight({ height });
    const hasFlexContentHeight = flexProps.height != null && flexProps.height !== "";
    const hasFlexContentWidth = flexProps.width != null && flexProps.width !== "";

    const resolvedHeight = explicitContainerHeight ?? measuredHeight;

    const shouldRender =
        intrinsicWidth ||
        explicitContainerHeight != null ||
        measuredHeight != null ||
        !hasMeasuredHeight ||
        (hasMeasuredHeight && explicitContainerHeight == null && measuredHeight == null);

    const style = {
        ...(restPropsWithoutShellPadding.style || {}),
        ...(flexProps.style || {}),
        ...(explicitContainerHeight != null ? { maxHeight: "100vh" } : {}),
    };

    if (explicitContainerWidthValue != null && !hasFlexContentWidth && style.width == null) {
        style.width = getLayoutSizeCss(explicitContainerWidthValue);
    }

    const mergedFlexProps = {
        ...restPropsWithoutShellPadding,
        ...flexProps,
        ...(shouldRender &&
        resolvedHeight != null &&
        resolvedHeight !== "" &&
        !hasFlexContentHeight
            ? { height: resolvedHeight }
            : {}),
        style,
    };

    const alignedFlexProps = mergeDefaultAlignment(mergedFlexProps);

    const shellHeightBounded =
        hasExplicitContainerHeight ||
        hasMaxHeightBound ||
        (autoHeightEnabled && measuredHeight != null && measuredHeight !== "");

    const hasBoundedScrollHeight = shouldRender && shellHeightBounded;

    if (!hasBoundedScrollHeight || hasFlexContentHeight) {
        return {
            shouldRender,
            flexProps: applyContentFlexProps(alignedFlexProps),
        };
    }

    const {
        height: _height,
        maxHeight: _maxHeight,
        style: alignedStyle,
        ...restAligned
    } = alignedFlexProps;

    const nextStyle = { ...(alignedStyle || {}) };

    delete nextStyle.height;
    delete nextStyle.maxHeight;

    if (nextStyle.minHeight == null && nextStyle.minBlockSize == null) {
        nextStyle.minHeight = "100%";
    }

    return {
        shouldRender,
        flexProps: applyContentFlexProps({
            ...restAligned,
            style: nextStyle,
        }),
    };
};
