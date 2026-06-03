export const FULL_WIDTH_FLEX_IN_FLEX_PARENT = "1 1 100%";

export const isFlexDisplayValue = (display) => display === "flex" || display === "inline-flex";

export const readParentIsFlexContainer = (node) => {
    const parent = node?.parentElement;
    if (!parent || typeof getComputedStyle === "undefined") return false;
    return isFlexDisplayValue(getComputedStyle(parent).display);
};
