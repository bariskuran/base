import { isBrowser } from "./isBrowser";

export const getViewport = () => {
    if (!isBrowser()) return { width: 0, height: 0 };

    const docEl = document.documentElement;

    return {
        width: docEl.clientWidth || window.innerWidth || 0,
        height: docEl.clientHeight || window.innerHeight || 0,
    };
};
