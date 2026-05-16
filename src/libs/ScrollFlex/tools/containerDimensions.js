export const getContainerHeight = ({ height }) => (height != null && height !== "" ? height : null);

export const getContainerWidth = ({ width, restProps }) => {
    if (width != null && width !== "") return width;
    if (restProps?.width != null && restProps.width !== "") return restProps.width;

    return null;
};

export const isFlexRowParent = (parent) => {
    if (!parent || typeof getComputedStyle === "undefined") return false;

    const cs = getComputedStyle(parent);

    if (!cs.display.includes("flex")) return false;

    const dir = cs.flexDirection;

    return dir === "row" || dir === "row-reverse";
};

export const resolveContainerWidthSource = ({ width, restProps, measuredWidth, hasWidthRefOrId }) => {
    if (width != null && width !== "") return width;
    if (hasWidthRefOrId && measuredWidth != null && measuredWidth !== "") return measuredWidth;

    return getContainerWidth({ width, restProps });
};

export const resolveContainerHeightSource = ({ height, measuredHeight, hasHeightRefOrId }) => {
    if (height != null && height !== "") return height;
    if (hasHeightRefOrId && measuredHeight != null && measuredHeight !== "") return measuredHeight;

    return getContainerHeight({ height });
};
