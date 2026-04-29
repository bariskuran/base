import { getRootScrollSize } from "./getRootScrollSize";
import { getViewport } from "./getViewport";
import { isBrowser } from "./isBrowser";

export const getScrollMetrics = ({ source, axis, body }) => {
    if (!isBrowser() || !source) {
        return {
            visible: 0,
            content: 0,
            scroll: 0,
            maxScroll: 0,
            isOverflowing: false,
        };
    }

    const isY = axis === "y";

    if (body) {
        const viewport = getViewport();
        const rootSize = getRootScrollSize();

        const visible = isY ? viewport.height : viewport.width;
        const content = isY ? rootSize.height : rootSize.width;
        const scroll = isY
            ? window.scrollY || window.pageYOffset || 0
            : window.scrollX || window.pageXOffset || 0;

        const maxScroll = Math.max(0, content - visible);

        return {
            visible,
            content,
            scroll,
            maxScroll,
            isOverflowing: content > visible + 1,
        };
    }

    const visible = isY ? source.clientHeight : source.clientWidth;
    const content = isY ? source.scrollHeight : source.scrollWidth;
    const scroll = isY ? source.scrollTop : source.scrollLeft;
    const maxScroll = Math.max(0, content - visible);

    return {
        visible,
        content,
        scroll,
        maxScroll,
        isOverflowing: content > visible + 1,
    };
};
