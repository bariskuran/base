import { useMemo, useState, isValidElement } from "react";
import { Link } from "react-router-dom";
import { baseStore } from "../../baseStore";
import { getText as t } from "../../getText";

const isExternalUrl = (url) => /^https?:\/\//i.test(url || "");

const toTitleCase = (value, language) => {
    if (typeof value !== "string" || !value) return value;
    const locale = language === "tr" ? "tr-TR" : "en";
    return value
        .toLocaleLowerCase(locale)
        .split(/\s+/)
        .map((word) => (word ? word.charAt(0).toLocaleUpperCase(locale) + word.slice(1) : word))
        .join(" ");
};

const resolveSupTitle = (supTitle, language) => {
    if (supTitle == null || supTitle === false) return "";
    if (isValidElement(supTitle)) return supTitle;
    const resolved = t(supTitle);
    if (isValidElement(resolved)) return resolved;
    return toTitleCase(resolved, language);
};

export const useVars = ({
    title,
    subtitle,
    supTitle,
    description,
    ctaLabel,
    to,
    href,
    state,
    onClick,
    target,
    disabled,
}) => {
    const language = baseStore.useGlobal((s) => s.language);
    const [isHovered, setIsHovered] = useState(false);
    const url = href || to;
    const isClickable = !disabled && (!!url || !!onClick);
    const isSemanticLink = !disabled && !!url;
    const linkComponent = href || isExternalUrl(url) ? "a" : Link;

    const texts = useMemo(
        () => ({
            title: t(title),
            subtitle: t(subtitle),
            supTitle: resolveSupTitle(supTitle, language),
            description: t(description),
            ctaLabel: t(ctaLabel || { tr: "İncele", en: "View" }),
        }),
        [title, subtitle, supTitle, description, ctaLabel, language],
    );

    const handleClick = (event) => {
        if (!isClickable) return;
        onClick?.(event);
    };

    const handleKeyDown = (event) => {
        if (!isClickable || isSemanticLink) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleClick(event);
    };

    const linkProps = isSemanticLink
        ? {
              as: linkComponent,
              ...(linkComponent === Link
                  ? { to: url, ...(state !== undefined ? { state } : {}) }
                  : { href: url }),
              ...(target ? { target } : {}),
              ...(target === "_blank" ? { rel: "noopener noreferrer" } : {}),
          }
        : {};

    return {
        texts,
        isHovered,
        isClickable,
        isSemanticLink,
        linkProps,
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
