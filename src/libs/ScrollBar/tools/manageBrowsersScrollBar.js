export const disableBrowserScrollBar = ({ host, styleEl }) => {
    if (!host || typeof document === "undefined") return null;

    const root = document.getElementById("root");
    let uid = null;

    const isRootLike =
        host === root ||
        host === document.body ||
        host === document.documentElement ||
        host === window;

    const previousValues = {
        targetEl: host,
        scrollbarAttr: null,
    };

    if (!isRootLike) {
        uid = `scroll-hide-${Math.random().toString(36).slice(2, 10)}`;
        host.setAttribute("data-scrollbar-hide", uid);
        previousValues.scrollbarAttr = uid;
    }

    styleEl.setAttribute("data-scrollbar-hide-style", "true");

    if (isRootLike) {
        styleEl.textContent = `
            html, body {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
            }

            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
                display: none !important;
            }
        `;
    } else {
        styleEl.textContent = `
            [data-scrollbar-hide="${uid}"] {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                overscroll-behavior: contain !important;
            }

            [data-scrollbar-hide="${uid}"]::-webkit-scrollbar {
                display: none !important;
            }
        `;
    }

    document.head.appendChild(styleEl);

    return previousValues;
};

export const enableBrowserScrollBar = ({ styleEl, previousValues }) => {
    try {
        styleEl?.remove();

        if (!previousValues) return;

        const { targetEl, scrollbarAttr } = previousValues;

        if (scrollbarAttr && targetEl) {
            targetEl.removeAttribute("data-scrollbar-hide");
        }
    } catch (e) {
        console.warn("ScrollBar cleanup error:", e);
    }
};
