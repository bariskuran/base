export const getViewportSize = () => {
    const docEl = typeof document !== "undefined" ? document.documentElement : null;

    return {
        width: docEl?.clientWidth ?? (typeof window !== "undefined" ? window.innerWidth : 0),
        height: docEl?.clientHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0),
    };
};

export const getAxisOverflow = ({ source, isWindowLike }) => {
    if (typeof document === "undefined" || !source) {
        return {
            isOverflowingX: false,
            isOverflowingY: false,
        };
    }

    if (isWindowLike) {
        const docEl = document.documentElement;
        const body = document.body;
        const viewport = getViewportSize();

        return {
            isOverflowingX: Math.max(docEl.scrollWidth, body.scrollWidth) > viewport.width,
            isOverflowingY: Math.max(docEl.scrollHeight, body.scrollHeight) > viewport.height,
        };
    }

    return {
        isOverflowingX: source.scrollWidth > source.clientWidth,
        isOverflowingY: source.scrollHeight > source.clientHeight,
    };
};

export const getHostRect = ({ host, isWindowLike }) => {
    const viewport = getViewportSize();

    if (typeof document === "undefined" || isWindowLike || !host) {
        return {
            top: 0,
            left: 0,
            right: viewport.width,
            bottom: viewport.height,
            width: viewport.width,
            height: viewport.height,
            clientWidth: viewport.width,
            clientHeight: viewport.height,
            scrollWidth:
                typeof document === "undefined"
                    ? viewport.width
                    : Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
            scrollHeight:
                typeof document === "undefined"
                    ? viewport.height
                    : Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
            overlayTop: 0,
            overlayLeft: 0,
        };
    }

    const rect = host.getBoundingClientRect();
    const parent = host.parentElement;
    const parentRect = parent?.getBoundingClientRect?.();

    return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        clientWidth: host.clientWidth,
        clientHeight: host.clientHeight,
        scrollWidth: host.scrollWidth,
        scrollHeight: host.scrollHeight,
        overlayTop: parentRect
            ? rect.top - parentRect.top + (parent?.scrollTop || 0) + host.clientTop
            : rect.top,
        overlayLeft: parentRect
            ? rect.left - parentRect.left + (parent?.scrollLeft || 0) + host.clientLeft
            : rect.left,
    };
};
