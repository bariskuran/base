import { isBrowser } from "./isBrowser";

export const hideNativeScrollbar = ({ source, body }) => {
    if (!isBrowser() || !source) return () => {};

    const styleEl = document.createElement("style");

    if (body) {
        styleEl.textContent = `
            html,
            body {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
                display: none;
            }
        `;

        document.head.appendChild(styleEl);

        return () => {
            styleEl.remove();
        };
    }

    const uid = `base-scrollbar-${Math.random().toString(36).slice(2, 10)}`;

    source.setAttribute("data-base-scrollbar-hide", uid);

    styleEl.textContent = `
        [data-base-scrollbar-hide="${uid}"] {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        [data-base-scrollbar-hide="${uid}"]::-webkit-scrollbar {
            display: none;
        }
    `;

    document.head.appendChild(styleEl);

    return () => {
        styleEl.remove();
        source.removeAttribute("data-base-scrollbar-hide");
    };
};
