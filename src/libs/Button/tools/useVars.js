import { useMatch, useNavigation, useNavigate, Link } from "react-router-dom";
import { baseStore } from "../../@baseStore";
import { useTimers } from "./useTimers.js";
import { DefaultVariant } from "../DefaultVariant.js";
import { generateColors } from "./generateColors.js";

export const useVars = ({
    label,
    hoverLabel,
    activeLabel,
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
    variant,
    primary,
    secondary,
    minHeight,
    minWidth,
    minLabelWidth,
    outlined,
    size,
    disableUseMatch,
    //
    delay, // seconds
    onDelayStart,
    onDelayEnd,
    //
    bgColor,
    hoverBgColor,
    activeBgColor,
    color,
    alphaRate,
    //
    ...otherProps
}) => {
    /**
     *
     *
     * VARS
     *
     *
     */
    const navigate = useNavigate();
    const url = href || to || urlProp;
    const isExternalUrl = /^https?:\/\//.test(url || "");
    const isMatch1 = !!useMatch({
        path: url !== undefined ? url : "/_______never_match_______",
        end: true,
    });
    const isMatch = !disableUseMatch && isMatch1;
    const navigation = useNavigation();
    const isPending = navigation.state === "loading";

    /**
     *
     *
     * LOCAL STORE VARS
     *
     *
     */
    const { setLocal, showOnClickValues, isHover, clickBlocker, isActive } = baseStore.useLocal({
        showOnClickValues: false,
        isHover: false,
        isActive: false,
        clickBlocker: false,
    });

    /**
     *
     *
     * FUNCTIONS
     *
     *
     */
    const getTimerBaseName = ({ label, prefix, suffix, icon }) =>
        label || prefix?.icon || suffix?.icon || icon?.icon || icon || "unknown";

    /**
     *
     *
     * USETIMERS
     *
     *
     */

    const runAction = (
        e,
        {
            isShowOnClickValuesRunning,
            showOnClickValuesStart,
            isClickBlockerRunning,
            clickBlockerStart,
        },
    ) => {
        !isShowOnClickValuesRunning && showOnClickValuesStart?.();
        !isClickBlockerRunning && clickBlockerStart?.();
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
    });

    /**
     *
     *
     * HANDLE CLICK
     *
     *
     */
    const handleClick = (e) => {
        if (disabled || clickBlocker || isMatch || timers.isDelayRunning) {
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
    /**
     *
     *
     * VARS
     *
     *
     */
    const isActivated =
        (activeManually ||
            timers.isShowOnClickValuesRunning ||
            isMatch ||
            isActive ||
            timers.isDelayRunning) &&
        !disabled;

    const isHovered = (hoverManually || isHover) && !disabled && !isActivated;
    const isJustIcon = !label && icon;

    const [theme, defaultVariants] = baseStore.useGlobal((s) => [s.theme, s.defaultVariants]);
    const Variant = variant || defaultVariants?.button || DefaultVariant;

    const [bgC1, bgC2, bgC3, c, i1, i2] = generateColors({
        primary,
        secondary,
        bgColor,
        color,
        hoverBgColor,
        activeBgColor,
        alphaRate,
        outlined,
        theme,
    });
    const as = !url ? "button" : isExternalUrl ? "a" : Link;

    const shouldBindClickHandler =
        disabled || clickBlocker || isMatch || (delay && delay > 0) || !!onClick;

    const commonProps = {
        ...otherProps,
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
        $isJustIcon: isJustIcon, //
        $bgColor: bgC1,
        $hoverBgColor: bgC2,
        $activeBgColor: bgC3,
        $color: c,
        $inverseColor1: i1,
        $inverseColor2: i2,
        //
        $prefixBgColor: prefix?.bgColor,
        $prefixColor: prefix?.color,
        $suffixBgColor: suffix?.bgColor,
        $suffixColor: suffix?.color,
        //
        onPointerDown: () =>
            setLocal((s) => {
                s.isActivated = true;
            }),
        onPointerUp: () =>
            setLocal((s) => {
                s.isActivated = false;
            }),

        onPointerLeave: () =>
            setLocal((s) => {
                s.isHover = false;
                s.isActivated = false;
            }),

        onPointerCancel: () =>
            setLocal((s) => {
                s.isActivated = false;
                s.isHover = false;
            }),

        onPointerEnter: () =>
            setLocal((s) => {
                s.isHover = true;
            }),
        //
        as,
        ...(as === "a" || as === Link ? linkAProps : buttonProps),
        //
        style: {
            background: bgC1,
            color: c,
            ...(minHeight ? { minHeight: `${minHeight}rem` } : {}),
            ...(outlined ? { border: `1px solid ${c}` } : {}),
            ...(disabled
                ? {
                      opacity: 0.5,
                      pointerEvents: "none",
                      filter: "blur(2rem)",
                      transition: "none",
                  }
                : {}),
        },
    };

    const showActiveLabel = (showOnClickValues || isActivated) && activeLabel != null;
    const showHoverLabel = !showActiveLabel && isHovered && hoverLabel != null;
    const showDefaultLabel = !showActiveLabel && !showHoverLabel;

    /**
     *
     *
     * RETURN
     *
     *
     */
    return {
        showActiveLabel,
        showHoverLabel,
        showDefaultLabel,
        // vars
        isActivated,
        isHovered,
        isJustIcon,
        Variant,
        theme,
        bgC1,
        bgC2,
        bgC3,
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

        // timers
        ...timers,

        // rrd
        navigate,

        // functions
        getTimerBaseName,

        // local store
        setLocal,
        showOnClickValues,
        isHover,
        clickBlocker,
        isActive,

        // vars
        url,
        isExternalUrl,
        isMatch,
        isPending,

        // props
        label,
        hoverLabel,
        activeLabel,
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
        variant,
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
        alphaRate,
        otherProps,
    };
};
