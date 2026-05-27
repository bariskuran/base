import { useMatch, useNavigation, useNavigate, Link, useResolvedPath } from "react-router-dom";
import { useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { useTimers } from "./useTimers.js";
import { getButtonColorPalette } from "./generateColors.js";
import { useExportData } from "../../useExportedData";
import { DefaultVariant } from "../DefaultVariant.js";

/** Prop-level background intent (stable); avoids losing padding when resolved `bg` is transparent on hover. */
const isNonTransparentBgProp = (value) => {
    if (value == null) return false;
    const s = String(value).trim().toLowerCase();
    if (s === "" || s === "transparent") return false;
    return true;
};

export const useVars = ({
    Variant,
    label,
    hoverLabel,
    activeLabel,
    pendingLabel,
    onClick,
    to,
    href,
    url: urlProp,
    hoverManually,
    activeManually,
    clickEffectManually,
    prefix,
    suffix,
    icon,
    disabled,
    _blank,
    primary,
    secondary,
    minHeight,
    minWidth,
    minLabelWidth,
    outlined,
    /** When true (e.g. `string` preset), `outlined` still affects palette logic but no box border is applied — underline UX stays clean. */
    suppressOutlinedBorder,
    size,
    disableUseMatch,
    //
    delay,
    onDelayStart,
    onDelayEnd,
    //
    bgColor,
    hoverBgColor,
    activeBgColor,
    color,
    hoverColor,
    activeColor,
    pendingBgColor,
    pendingColor,
    alphaRate,
    //
    popTip,
    exportData,
    fullWidth, // left - right da olabilir.
    pendingManually,
    skipClickCooldown,
    skipOnClickHold,
    clickCooldownMs,
    onClickHoldMs,
}) => {
    const navigate = useNavigate();
    const url = href || to || urlProp;
    const isExternalUrl = /^https?:\/\//.test(url || "");

    const resolvedPath = useResolvedPath(
        !url || isExternalUrl ? "/_______never_match_______" : url,
    );

    const isMatch1 = !!useMatch({
        path: resolvedPath.pathname,
        end: true,
    });

    const isMatch = !disableUseMatch && isMatch1;
    const navigation = useNavigation();
    const isPending = navigation.state === "loading" || !!pendingManually;

    const { setLocal, showOnClickValues, isHover, clickBlocker, isActive, isPressed } =
        baseStore.useLocal({
            showOnClickValues: false,
            isHover: false,
            isActive: false,
            isPressed: false,
            clickBlocker: false,
        });

    const getTimerBaseName = ({ label, prefix, suffix, icon }) =>
        label || prefix?.icon || suffix?.icon || icon?.icon || icon || "unknown";

    const isClickEffectControlled = clickEffectManually !== undefined;

    const runAction = (
        e,
        {
            isShowOnClickValuesRunning,
            showOnClickValuesStart,
            isClickBlockerRunning,
            clickBlockerStart,
        },
    ) => {
        if (
            !isClickEffectControlled &&
            !skipOnClickHold &&
            !isShowOnClickValuesRunning
        ) {
            showOnClickValuesStart?.();
        }
        if (!skipClickCooldown && !isClickBlockerRunning) clickBlockerStart?.();
        onClick?.(e);

        if (!url) return;

        if (isExternalUrl) {
            if (_blank) {
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                window.location.assign(url);
            }
            return;
        }

        navigate(url);
    };

    const timers = useTimers({
        label,
        prefix,
        suffix,
        icon,
        delay,
        setLocal,
        onDelayStart,
        onDelayEnd,
        runAction,
        getTimerBaseName,
        clickCooldownMs,
        onClickHoldMs,
    });

    const handleClick = (e) => {
        if (disabled || blockedByClickCooldown || isMatch || timers.isDelayRunning) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (delay && delay > 0 && !timers.isDelayRunning) {
            e.preventDefault();
            e.stopPropagation();
            timers.delayStart();
            return;
        }

        runAction(e, {
            isShowOnClickValuesRunning: timers?.isShowOnClickValuesRunning,
            showOnClickValuesStart: timers?.showOnClickValuesStart,
            isClickBlockerRunning: timers?.isClickBlockerRunning,
            clickBlockerStart: timers?.clickBlockerStart,
        });
    };

    const autoClickEffect =
        !isClickEffectControlled &&
        ((skipOnClickHold && isPressed) || timers.isShowOnClickValuesRunning);

    const manualClickEffect = isClickEffectControlled && !!clickEffectManually;

    const isClickEffectActive = autoClickEffect || manualClickEffect;

    const sustainedActive =
        (activeManually || isMatch || isActive || timers.isDelayRunning) &&
        !disabled &&
        !isPending;

    const isActivated = sustainedActive || isClickEffectActive;

    useEffect(() => {
        if (!timers.isShowOnClickValuesRunning) return;
        const hasRouteOrTimerHold =
            (activeManually || isMatch || isActive || timers.isDelayRunning) && !disabled;
        if (hasRouteOrTimerHold) return;
        timers.showOnClickValuesStop();
    }, [isMatch, isActive, activeManually]);

    const isHovered = (hoverManually || isHover) && !disabled && !isPending;
    const isJustIcon = !label && icon;

    const [theme] = baseStore.useGlobal((s) => [s.theme]);

    const iconPalette = getButtonColorPalette({
        primary,
        secondary,
        bgColor,
        color,
        hoverBgColor,
        activeBgColor,
        hoverColor,
        activeColor,
        pendingBgColor,
        pendingColor,
        alphaRate,
        outlined,
        theme,
    });
    const interaction = disabled
        ? "default"
        : isPending
          ? "pending"
          : isActivated
            ? "active"
            : isHovered
              ? "hover"
              : "default";
    const { bg, color: c } = iconPalette[interaction];
    const i1 = iconPalette.inverse1;
    const i2 = iconPalette.inverse2;

    const hasPrefixIcon = !!(prefix?.icon);
    const hasSuffixIcon = !!(suffix?.icon);

    const bgAppearsFilled = (() => {
        if (bg == null) return false;
        const s = String(bg).trim().toLowerCase();
        if (s === "" || s === "transparent") return false;
        if (/^#[0-9a-f]{8}$/i.test(s) && s.slice(-2) === "00") return false;
        return true;
    })();

    const anyBgColorPropNonTransparent =
        isNonTransparentBgProp(bgColor) ||
        isNonTransparentBgProp(hoverBgColor) ||
        isNonTransparentBgProp(activeBgColor) ||
        isNonTransparentBgProp(pendingBgColor);

    /** Label-only horizontal inset: filled bg, outlined border, or any non-transparent bg-related prop. */
    const labelNeedsFullHorizontalPad =
        !!outlined || bgAppearsFilled || anyBgColorPropNonTransparent;

    let labelPadStartRem = 0;
    let labelPadEndRem = 0;

    const hasTextLabel = label != null && label !== "" && !isJustIcon;

    if (hasTextLabel) {
        if (hasPrefixIcon && hasSuffixIcon) {
            /* gap handles spacing; no extra label padding */
        } else if (hasPrefixIcon && !hasSuffixIcon) {
            labelPadEndRem = 12;
        } else if (!hasPrefixIcon && hasSuffixIcon) {
            labelPadStartRem = 12;
        } else if (!hasPrefixIcon && !hasSuffixIcon && labelNeedsFullHorizontalPad) {
            labelPadStartRem = 12;
            labelPadEndRem = 12;
        }
    }

    const as = !url ? "button" : isExternalUrl ? "a" : Link;

    const blockedByClickCooldown = !skipClickCooldown && clickBlocker;
    const fullWidthJustifyContent =
        fullWidth === "left" ? "flex-start" : fullWidth === "right" ? "flex-end" : "center";
    const cursor = disabled || isActivated ? "default" : "pointer";

    const shouldBindClickHandler =
        disabled || blockedByClickCooldown || isMatch || (delay && delay > 0) || !!onClick;

    const commonProps = {
        ...(shouldBindClickHandler ? { onClick: handleClick } : {}),
        ...(url ? (isExternalUrl ? { href: url } : { to: url }) : {}),
    };

    const linkAProps = {
        ...commonProps,
        ...(disabled ? { "aria-disabled": "true", tabIndex: -1 } : {}),
        ...(_blank ? { target: "_blank", rel: "noreferrer noopener" } : {}),
    };

    const buttonProps = {
        ...commonProps,
        type: "button",
        ...(disabled ? { disabled } : {}),
    };

    const variantProps = {
        $disabled: disabled,
        $isHovered: isHovered,
        $isActivated: isActivated,
        $isPending: isPending,
        $primary: primary,
        $secondary: secondary,
        $minWidth: minWidth,
        $minLabelWidth: minLabelWidth,
        $minHeight: minHeight,
        $outlined: outlined,
        $size: size,
        $isJustIcon: isJustIcon,
        $bgColor: bgColor,
        $color: color,
        $resolvedBg: bg,
        $resolvedColor: c,
        $prefixBgColor: prefix?.bgColor,
        $prefixColor: prefix?.color,
        $suffixBgColor: suffix?.bgColor,
        $suffixColor: suffix?.color,
        $fullWidth: fullWidth,
        $labelPadStartRem: labelPadStartRem,
        $labelPadEndRem: labelPadEndRem,

        onPointerDown: () => {
            if (isClickEffectControlled) return;
            setLocal((s) => {
                s.isPressed = true;
            });
        },

        onPointerUp: () => {
            if (isClickEffectControlled) return;
            setLocal((s) => {
                s.isPressed = false;
            });
        },

        as,
        ...(as === "a" || as === Link ? linkAProps : buttonProps),

        style: {
            background: bg,
            color: c,
            cursor,
            ...(!disabled
                ? {
                      transition:
                          "background 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                  }
                : {}),
            ...(fullWidth ? { width: "100%" } : {}),
            ...(fullWidth ? { justifyContent: fullWidthJustifyContent } : {}),
            ...(minHeight ? { minHeight: `${minHeight}rem` } : {}),
            ...(outlined && !suppressOutlinedBorder ? { border: `1px solid ${c}` } : {}),
            ...(disabled
                ? {
                      opacity: 0.5,
                      pointerEvents: "none",
                      filter: "blur(1.5rem)",
                      transition: "none",
                  }
                : {}),
        },
    };

    const useLiftHitSlop = Variant === DefaultVariant;

    const scaleWrapperProps = {
        onPointerLeave: () =>
            setLocal((s) => {
                s.isHover = false;
                if (!isClickEffectControlled) s.isPressed = false;
            }),

        onPointerCancel: () =>
            setLocal((s) => {
                s.isHover = false;
                if (!isClickEffectControlled) s.isPressed = false;
            }),

        onPointerEnter: () =>
            setLocal((s) => {
                s.isHover = true;
            }),
    };

    const showPendingLabel = isPending && !disabled && pendingLabel != null;
    const showActiveLabel =
        !showPendingLabel &&
        (showOnClickValues || sustainedActive || isClickEffectActive) &&
        activeLabel != null;
    const showHoverLabel = !showPendingLabel && !showActiveLabel && isHovered && hoverLabel != null;
    const showDefaultLabel = !showPendingLabel && !showActiveLabel && !showHoverLabel;

    return useExportData(
        {
            exportData,
            showPendingLabel,
            showActiveLabel,
            showHoverLabel,
            showDefaultLabel,
            popTip,
            isActivated,
            sustainedActive,
            isClickEffectActive,
            clickEffectManually,
            isHovered,
            isJustIcon,
            Variant,
            theme,
            bg,
            c,
            i1,
            i2,
            as,
            handleClick,
            shouldBindClickHandler,
            commonProps,
            linkAProps,
            buttonProps,
            variantProps,
            scaleWrapperProps,
            useLiftHitSlop,
            ...timers,
            navigate,
            getTimerBaseName,
            setLocal,
            url,
            isExternalUrl,
            isMatch,
            isPending,
            label,
            hoverLabel,
            activeLabel,
            pendingLabel,
            onClick,
            to,
            href,
            urlProp,
            hoverManually,
            activeManually,
            clickEffectManually,
            prefix,
            suffix,
            icon,
            disabled,
            _blank,
            primary,
            secondary,
            minHeight,
            minWidth,
            minLabelWidth,
            outlined,
            size,
            disableUseMatch,
            delay,
            onDelayStart,
            onDelayEnd,
            bgColor,
            hoverBgColor,
            activeBgColor,
            color,
            hoverColor,
            activeColor,
            pendingBgColor,
            pendingColor,
            alphaRate,
            fullWidth,
            iconPalette,
            pendingManually,
            skipClickCooldown,
            skipOnClickHold,
            clickCooldownMs,
            onClickHoldMs,
        },
        {
            showOnClickValues,
            isHover,
            clickBlocker,
            isActive,
        },
    );
};
