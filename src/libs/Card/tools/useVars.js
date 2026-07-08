import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getText as t } from "../../getText";

const isExternalUrl = (url) => /^https?:\/\//i.test(url || "");

export const useVars = ({
    title,
    subtitle,
    description,
    ctaLabel,
    to,
    href,
    onClick,
    target,
    disabled,
}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const url = href || to;
    const isClickable = !disabled && (!!url || !!onClick);

    const texts = useMemo(
        () => ({
            title: t(title),
            subtitle: t(subtitle),
            description: t(description),
            ctaLabel: t(ctaLabel || { tr: "İncele", en: "View" }),
        }),
        [title, subtitle, description, ctaLabel],
    );

    const handleClick = (event) => {
        if (!isClickable) return;
        onClick?.(event);
        if (event.defaultPrevented || !url) return;

        if (href || isExternalUrl(url)) {
            if (target === "_blank") {
                window.open(url, "_blank", "noopener,noreferrer");
                return;
            }
            window.location.assign(url);
            return;
        }

        navigate(url);
    };

    const handleKeyDown = (event) => {
        if (!isClickable) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleClick(event);
    };

    return {
        texts,
        isHovered,
        isClickable,
        handleClick,
        handleKeyDown,
        hoverProps: {
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
            onFocus: () => setIsHovered(true),
            onBlur: () => setIsHovered(false),
        },
    };
};
