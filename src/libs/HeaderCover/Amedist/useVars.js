import { useEffect, useMemo, useRef, useState, isValidElement } from "react";
import { t } from "../../getText";

const EARLY_SCROLL_THRESHOLD_RATIO = 1 / 12;

const localize = (value) => {
    if (value == null || value === "") return value;
    if (typeof value === "string") return value;
    // Already-resolved JSX (Fragment / element) — don't run through getText object paths.
    if (isValidElement(value)) return value;
    return t(value);
};

const splitTitle = (title) => {
    const words = String(title || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length < 2) return [words[0] || "", ""];

    const splitAt = Math.ceil(words.length / 2);
    return [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")];
};

export const useVars = ({
    title,
    parentTitle,
    parentIcon,
    location,
    coverImage,
    quote,
    sliderColor = "foreground",
}) => {
    const rootRef = useRef(null);
    const [pastThreshold, setPastThreshold] = useState(false);

    const localizedTitle = localize(title);
    const titleLines = useMemo(() => splitTitle(localizedTitle), [localizedTitle]);

    useEffect(() => {
        let frame;

        const update = () => {
            frame = undefined;
            const rootTop = rootRef.current
                ? window.scrollY + rootRef.current.getBoundingClientRect().top
                : 0;
            setPastThreshold(
                window.scrollY - rootTop >= window.innerHeight * EARLY_SCROLL_THRESHOLD_RATIO,
            );
        };

        const scheduleUpdate = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);

        return () => {
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    return {
        rootRef,
        pastThreshold,
        titleLines,
        parentTitle: localize(parentTitle),
        parentIcon,
        location: t(location),
        coverImage,
        quote: quote == null ? null : localize(quote),
        sliderColor: sliderColor || "foreground",
    };
};
