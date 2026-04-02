import getScrollHost from "./getScrollHost";

export const disableBrowserScrollBar = ({ truckRef, isTruckMounted, setLocal, styleEl }) => {
    const el = truckRef?.current;
    if (!el || typeof document === "undefined" || isTruckMounted) return;

    const root = document.getElementById("root");
    let host = getScrollHost(el);
    if (!host) return;

    setLocal((s) => {
        s.isTruckMounted = true;
        s.scrollHost = host;
    });

    let uid = null;
    const isRootLike = host === root || host === document.body || host === document.documentElement;

    if (!isRootLike) {
        uid = `scroll-hide-${Math.random().toString(36).slice(2, 10)}`;
        host.setAttribute("data-scrollbar-hide", uid);
    }

    const prevOverflow = host.style.overflow;

    setLocal((s) => {
        s.previousOverflowValues = {
            targetEl: host,
            scrollbarAttr: uid,
            prevOverflow,
        };
    });

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
        const uid = `scroll-hide-${Math.random().toString(36).slice(2, 10)}`;
        host.setAttribute("data-scrollbar-hide", uid);

        styleEl.textContent = `
            [data-scrollbar-hide="${uid}"] {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
            }

            [data-scrollbar-hide="${uid}"]::-webkit-scrollbar {
                display: none !important;
            }
        `;
    }

    document.head.appendChild(styleEl);
};
export const enableBrowserScrollBar = ({ styleEl, previousOverflowValues }) => {
    try {
        styleEl?.remove();

        if (!previousOverflowValues) return;
        const { targetEl, scrollbarAttr, prevOverflow } = previousOverflowValues;

        if (scrollbarAttr && targetEl) {
            targetEl.removeAttribute("data-scrollbar-hide");
        }

        if (targetEl && prevOverflow !== undefined) {
            targetEl.style.overflow = prevOverflow;
        }
    } catch (e) {
        console.warn("ScrollBar cleanup error:", e);
    }
};
