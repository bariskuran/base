import { isBrowser } from "./isBrowser";

export const getRootScrollSize = () => {
    if (!isBrowser()) return { width: 0, height: 0 };

    const docEl = document.documentElement;
    const body = document.body;

    return {
        width: Math.max(docEl.scrollWidth, body.scrollWidth),
        height: Math.max(docEl.scrollHeight, body.scrollHeight),
    };
};
