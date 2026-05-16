export const getContainerBorderInsetsPx = (node) => {
    if (!node || typeof getComputedStyle === "undefined") {
        return { x: 0, y: 0 };
    }

    const cs = getComputedStyle(node);

    return {
        x: (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0),
        y: (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0),
    };
};

export const getPaddingInsetsFromElement = (el) => {
    if (!el || typeof getComputedStyle === "undefined") {
        return { x: 0, y: 0 };
    }

    const cs = getComputedStyle(el);

    return {
        x: Math.round((parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0)),
        y: Math.round((parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)),
    };
};
