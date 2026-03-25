import { Link } from "react-router-dom";
import { useState } from "react";
import { DefaultVariant } from "./DefaultVariant.js";
import { baseStore } from "../@baseStore";
import { generateColors } from "./generateColors.js";
import { Icon } from "../@Icon";
import styled from "styled-components";
import { useTimer } from "../useTimer";

const LabelStack = styled.div`
    position: relative;
    display: inline-grid;
    place-items: center;
`;

const LabelLayer = styled.div`
    grid-area: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    transition: opacity 0.25s;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

export const Base = (props = {}) => {
    const {
        label,
        hoverLabel,
        activeLabel,
        onClick,
        to,
        href,
        url,
        hoverManually,
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
        //
        bgColor: _bgColor,
        hoverBgColor: _hoverBgColor,
        activeBgColor: _activeBgColor,
        color: _color,
        alphaRate: _alphaRate,
        //
        ...otherProps
    } = props;

    const { setLocal, showOnClickValues, isHover, clickBlocker } = baseStore.useLocal({
        showOnClickValues: false,
        isHover: false,
        clickBlocker: false,
    });
    const { start, isRunning } = useTimer({
        timerName: "showOnClickValues" + label ? label : { ...prefix, ...suffix, ...icon }.icon,
        refreshTime: 2000,
        loop: false,
        onStart: () =>
            setLocal((s) => {
                s.showOnClickValues = true;
            }),
        onEnd: () =>
            setLocal((s) => {
                s.showOnClickValues = false;
            }),
        startOnLoad: false,
    });
    const { start: start2, isRunning: isRunning2 } = useTimer({
        timerName: "clickBlocker" + label ? label : { ...prefix, ...suffix, ...icon }.icon,
        refreshTime: 1000,
        loop: false,
        onStart: () =>
            setLocal((s) => {
                s.clickBlocker = true;
            }),
        onEnd: () =>
            setLocal((s) => {
                s.clickBlocker = false;
            }),
        startOnLoad: false,
    });

    const isHovered = (hoverManually || isHover) && !disabled;
    const isJustIcon = !label && icon;

    const Variant = variant || DefaultVariant;
    const theme = baseStore.useGlobal((s) => s.theme);

    const [bgC1, bgC2, bgC3, c, i1, i2] = generateColors({ ...props, theme });

    const u = href || to || url;
    const isExternalUrl = /^https?:\/\//.test(u || "");

    const as = !u ? "button" : isExternalUrl ? "a" : Link;

    const handleClick = (e) => {
        if (disabled || clickBlocker) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        !isRunning && start();
        !isRunning2 && start2();
        onClick?.(e);
    };

    const commonProps = {
        ...otherProps,
        ...(disabled || onClick ? { onClick: handleClick } : {}),
        ...(u ? (isExternalUrl ? { href: u } : { to: u }) : {}),
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

    /* RETURN */
    return (
        <ScaleWrapper size={size}>
            <Variant
                onMouseEnter={() =>
                    setLocal((s) => {
                        s.isHover = true;
                    })
                }
                onMouseLeave={() =>
                    setLocal((s) => {
                        s.isHover = false;
                    })
                }
                {...{
                    $disabled: disabled,
                    $isHovered: isHovered,
                    $primary: primary,
                    $secondary: secondary,
                    $minWidth: minWidth,
                    $minLabelWidth: minLabelWidth,
                    $minHeight: minHeight,
                    $outlined: outlined,
                    $size: size,
                    $isJustIcon: isJustIcon,
                    //
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

                    //
                    as,
                    ...(as === "a" || as === Link ? linkAProps : buttonProps),
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
                        //
                    },
                }}
            >
                <IconArea
                    areaName="prefix"
                    {...{
                        obj: { ...prefix },
                        color: c,
                        hoverManually: isHovered,
                    }}
                />
                {/* {label != null && (
                    <div
                        data-slot="label"
                        style={{
                            ...(minWidth ? { minWidth: `${minWidth}rem` } : {}),
                        }}
                    >
                        {activeLabel && showOnClickValues
                            ? activeLabel
                            : isHovered && hoverLabel
                              ? hoverLabel
                              : label}
                    </div>
                )} */}
                {label != null && (
                    <div
                        data-slot="label"
                        style={{
                            ...(minWidth ? { minWidth: `${minWidth}rem` } : {}),
                        }}
                    >
                        <LabelStack>
                            <LabelLayer
                                $visible={
                                    !(
                                        (showOnClickValues && activeLabel != null) ||
                                        (isHovered && hoverLabel != null)
                                    )
                                }
                                data-slot="label-default"
                            >
                                {label}
                            </LabelLayer>

                            {hoverLabel != null && (
                                <LabelLayer
                                    $visible={!showOnClickValues && isHovered}
                                    data-slot="label-hover"
                                >
                                    {hoverLabel}
                                </LabelLayer>
                            )}

                            {activeLabel != null && (
                                <LabelLayer $visible={showOnClickValues} data-slot="label-active">
                                    {activeLabel}
                                </LabelLayer>
                            )}
                        </LabelStack>
                    </div>
                )}
                {isJustIcon && (
                    <IconArea
                        areaName="label"
                        {...{
                            obj: icon,
                            color: c,
                            hoverManually: isHovered,
                        }}
                    />
                )}
                <IconArea
                    areaName="suffix"
                    {...{
                        obj: suffix,
                        color: c,
                        hoverManually: isHovered,
                    }}
                />
            </Variant>
        </ScaleWrapper>
    );
};

const ScaleDiv = styled.div`
    all: unset;
    transform: scale(${({ $size }) => $size}%);
`;
const ScaleWrapper = ({ size, children }) => <ScaleDiv $size={size}>{children}</ScaleDiv>;

const IconArea = (props = {}) => {
    const { areaName, obj, hoverManually, color } = props || {};
    const { icon, color: colorFromItem, bgColor: bgColorFromItem } = obj || {};

    /* Return */
    if (!icon) return null;
    return (
        <div
            data-slot={areaName}
            style={{
                ...(bgColorFromItem ? { background: bgColorFromItem } : {}),
                ...(color ? { color: colorFromItem || color } : {}),
            }}
        >
            {icon && (
                <Icon {...{ width: 18, color: colorFromItem || color, hoverManually, ...obj }} />
            )}
        </div>
    );
};
