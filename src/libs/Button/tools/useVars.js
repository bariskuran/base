import { useMatch, useNavigation, useNavigate, Link, useResolvedPath } from "react-router-dom";
import { useEffect } from "react";
import { baseStore } from "../../@baseStore";
import { useTimers } from "./useTimers.js";
import { getButtonColorPalette } from "./generateColors.js";
import { useExportData } from "../../useExportedData";

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

    const runAction = (
        e,
        {
            isShowOnClickValuesRunning,
            showOnClickValuesStart,
            isClickBlockerRunning,
            clickBlockerStart,
        },
    ) => {
        if (!skipOnClickHold && !isShowOnClickValuesRunning) showOnClickValuesStart?.();
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

    const isActivated =
        (activeManually ||
            (skipOnClickHold && isPressed) ||
            timers.isShowOnClickValuesRunning ||
            isMatch ||
            isActive ||
            timers.isDelayRunning) &&
        !disabled &&
        !isPending;

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

    const as = !url ? "button" : isExternalUrl ? "a" : Link;

    const blockedByClickCooldown = !skipClickCooldown && clickBlocker;
    const fullWidthJustifyContent =
        fullWidth === "left" ? "flex-start" : fullWidth === "right" ? "flex-end" : "center";

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

        onPointerDown: () =>
            setLocal((s) => {
                s.isPressed = true;
            }),

        onPointerUp: () =>
            setLocal((s) => {
                s.isPressed = false;
            }),

        onPointerLeave: () =>
            setLocal((s) => {
                s.isHover = false;
                s.isPressed = false;
            }),

        onPointerCancel: () =>
            setLocal((s) => {
                s.isHover = false;
                s.isPressed = false;
            }),

        onPointerEnter: () =>
            setLocal((s) => {
                s.isHover = true;
            }),

        as,
        ...(as === "a" || as === Link ? linkAProps : buttonProps),

        style: {
            background: bg,
            color: c,
            ...(fullWidth ? { width: "100%" } : {}),
            ...(fullWidth ? { justifyContent: fullWidthJustifyContent } : {}),
            ...(minHeight ? { minHeight: `${minHeight}rem` } : {}),
            ...(outlined ? { border: `1px solid ${c}` } : {}),
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

    const showPendingLabel = isPending && !disabled && pendingLabel != null;
    const showActiveLabel =
        !showPendingLabel && (showOnClickValues || isActivated) && activeLabel != null;
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
