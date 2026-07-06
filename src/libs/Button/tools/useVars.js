import { useMatch, useNavigation, useNavigate, Link, useResolvedPath } from "react-router-dom";
import { baseStore } from "../../baseStore";
import { useTimers } from "./useTimers.js";
import { getButtonColorPalette } from "./generateColors.js";
import { useExportData } from "helpers/useExportedData";
import { DefaultVariant } from "../DefaultVariant.js";
import { stripCssImports } from "../../@Base/styling/fontCss.js";
import {
    bgAppearsFilled,
    anyBgColorPropNonTransparent,
} from "./backgroundFill.js";

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

    suppressOutlinedBorder,
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

    popTip,
    exportData,
    fullWidth,
    pendingManually,
    skipClickCooldown,
    skipOnClickHold,
    clickCooldownMs,
    onClickHoldMs,
    fontFamily,
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

    const { set, showOnClickValues, isHover, clickBlocker, isActive, isPressed } =
        baseStore.useLocal({
            showOnClickValues: false,
            isHover: false,
            isActive: false,
            isPressed: false,
            clickBlocker: false,
        });

    const getTimerBaseName = ({ label, prefix, suffix, icon }) =>
        label ||
        prefix?.icon ||
        prefix?.flag ||
        suffix?.icon ||
        suffix?.flag ||
        icon?.icon ||
        icon?.flag ||
        icon ||
        "unknown";

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
        set,
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
        (isPressed || timers.isShowOnClickValuesRunning);

    const manualClickEffect = isClickEffectControlled && !!clickEffectManually;

    const isClickEffectActive = autoClickEffect || manualClickEffect;

    const sustainedActive =
        (activeManually || isMatch || isActive || timers.isDelayRunning) &&
        !disabled &&
        !isPending;

    const isActivated = sustainedActive || isClickEffectActive;

    const isHovered = (hoverManually || isHover) && !disabled && !isPending;
    const isJustIcon = !label && icon;

    const [theme, fonts] = baseStore.useGlobal((s) => [
        s.theme,
        s._projectSettings?.styledSettings?.fonts,
    ]);
    const font = fontFamily ? stripCssImports(fonts?.[fontFamily]) : null;

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

    const hasPrefixIcon = !!(prefix?.icon || prefix?.flag);
    const hasSuffixIcon = !!(suffix?.icon || suffix?.flag);

    const bgFilled = bgAppearsFilled(bg);

    const anyBgColorPropNonTransparentValue = anyBgColorPropNonTransparent({
        bgColor,
        hoverBgColor,
        activeBgColor,
        pendingBgColor,
    });

    const labelNeedsFullHorizontalPad =
        !!outlined || bgFilled || anyBgColorPropNonTransparentValue;

    let labelPadStartRem = 0;
    let labelPadEndRem = 0;

    const hasTextLabel = label != null && label !== "" && !isJustIcon;

    if (hasTextLabel) {
        if (hasPrefixIcon && !hasSuffixIcon) {
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
            set((s) => {
                s.isPressed = true;
            });
        },

        onPointerUp: () => {
            if (isClickEffectControlled) return;
            set((s) => {
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
            set((s) => {
                s.isHover = false;
                if (!isClickEffectControlled) s.isPressed = false;
            }),

        onPointerCancel: () =>
            set((s) => {
                s.isHover = false;
                if (!isClickEffectControlled) s.isPressed = false;
            }),

        onPointerEnter: () =>
            set((s) => {
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
            set,
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
            fontFamily,
            font,
        },
        {
            showOnClickValues,
            isHover,
            clickBlocker,
            isActive,
        },
    );
};
