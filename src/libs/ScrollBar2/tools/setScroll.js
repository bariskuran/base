import { isBrowser } from "./isBrowser";

export const setScroll = ({ source, axis, body, value, behavior = "auto" }) => {
    if (!isBrowser() || !source) return;

    const nextValue = Math.max(0, value);

    if (body) {
        window.scrollTo({
            ...(axis === "y" ? { top: nextValue } : { left: nextValue }),
            behavior,
        });

        return;
    }

    if (typeof source.scrollTo === "function") {
        source.scrollTo({
            ...(axis === "y" ? { top: nextValue } : { left: nextValue }),
            behavior,
        });

        return;
    }

    source[axis === "y" ? "scrollTop" : "scrollLeft"] = nextValue;
};
