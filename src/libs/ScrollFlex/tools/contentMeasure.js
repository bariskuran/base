export const measureContentAxisPx = (el, axis) => {
    if (!el?.getBoundingClientRect) return 0;

    const rect = el.getBoundingClientRect();
    const roundAxis = axis === "x" ? Math.ceil : Math.round;
    const layout = roundAxis(axis === "x" ? rect.width || 0 : rect.height || 0);
    const scroll = roundAxis(axis === "x" ? el.scrollWidth || 0 : el.scrollHeight || 0);

    return Math.max(layout, scroll);
};

export const measureContentIntrinsicAxisPx = (el, axis) => {
    if (!el?.getBoundingClientRect) return 0;

    const isX = axis === "x";
    const saved = {
        width: el.style.width,
        maxWidth: el.style.maxWidth,
        minWidth: el.style.minWidth,
        height: el.style.height,
        maxHeight: el.style.maxHeight,
        minHeight: el.style.minHeight,
        alignSelf: el.style.alignSelf,
    };

    try {
        if (isX) {
            el.style.width = "max-content";
            el.style.maxWidth = "none";
            el.style.minWidth = "0";
            el.style.alignSelf = "flex-start";
        } else {
            el.style.height = "max-content";
            el.style.maxHeight = "none";
            el.style.minHeight = "0";
        }

        return measureContentAxisPx(el, axis);
    } finally {
        el.style.width = saved.width;
        el.style.maxWidth = saved.maxWidth;
        el.style.minWidth = saved.minWidth;
        el.style.height = saved.height;
        el.style.maxHeight = saved.maxHeight;
        el.style.minHeight = saved.minHeight;
        el.style.alignSelf = saved.alignSelf;
    }
};

export const resolveAutoAxisPx = ({
    contentPx,
    parentPx,
    barGutterPx,
    reserveBarGutter,
    fallbackPx,
    borderInsetPx = 0,
}) => {
    const content = Math.max(0, contentPx);
    const parent = Math.max(0, parentPx);
    const gutter = reserveBarGutter ? Math.max(0, barGutterPx) : 0;
    const border = Math.max(0, borderInsetPx);

    if (parent <= 0 && content <= 0) {
        return {
            px: fallbackPx,
            capToParentPercent: false,
        };
    }

    if (parent <= 0) {
        return {
            px: Math.round(content + gutter + border),
            capToParentPercent: false,
        };
    }

    return {
        px: Math.round(parent),
        capToParentPercent: true,
    };
};

export const createResizeObserver = (callback, nodes = []) => {
    if (typeof ResizeObserver === "undefined") return null;

    const ro = new ResizeObserver(callback);
    const seen = new Set();

    for (const node of nodes) {
        if (!node || seen.has(node)) continue;
        seen.add(node);
        ro.observe(node);
    }

    return ro;
};
