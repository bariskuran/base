export const toBodyEdgeMargin = (value) => (value < 0 ? Math.abs(value) : value);

export const getBarPositionForAxis = (axis, { effectiveOpposite } = {}) => {
    if (axis === "y") return effectiveOpposite ? "horizontal" : "vertical";
    return effectiveOpposite ? "vertical" : "horizontal";
};

export const getClientValueForAxis = (axis, e, { effectiveOpposite } = {}) => {
    const barPosition = getBarPositionForAxis(axis, { effectiveOpposite });
    return barPosition === "vertical" ? e.clientY : e.clientX;
};

export const getVisibleEdge = (isVisible, barPosition, effectiveMirror) => {
    if (!isVisible) return {};
    if (barPosition === "vertical") return effectiveMirror ? { left: true } : { right: true };
    return effectiveMirror ? { top: true } : { bottom: true };
};
