export const getRefElement = (ref) => ref?.current || ref || null;

export const getRefSize = ({ ref, axis }) => {
    const el = getRefElement(ref);
    if (!el?.getBoundingClientRect) return null;

    const rect = el.getBoundingClientRect();
    const value = axis === "x" ? rect.width : rect.height;

    return value > 0 ? `${value}px` : null;
};

export const getTargetByRefOrId = ({ ref, id }) => {
    const refEl = getRefElement(ref);

    if (refEl) return refEl;

    if (typeof document !== "undefined" && typeof id === "string" && id.trim()) {
        return document.getElementById(id);
    }

    return null;
};
