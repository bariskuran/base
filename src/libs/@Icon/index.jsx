import { useMemo } from "react";
import styled, { css, keyframes } from "styled-components";
import { icons } from "./icons";
import { baseStore } from "../@baseStore";
import { PopTip } from "../PopTip";
import { colorFind } from "../colorFind";

const spin360 = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const pulseTwice = keyframes`
    0% {
        transform: scale(1);
    }
    20% {
        transform: scale(1.4);
    }
    50% {
        transform: scale(1);
    }
    70% {
        transform: scale(1.4);
    }
    100% {
        transform: scale(1);
    }
`;

const Root = styled.span`
    ${({ $size, $flat, $aspectW, $aspectH }) =>
        $flat
            ? css`
                  position: relative;
                  display: inline-grid;
                  place-items: center;
                  width: ${$size}rem;
                  aspect-ratio: ${$aspectW} / ${$aspectH};
                  height: auto;
                  min-width: 0;
                  min-height: 0;
                  flex: 0 0 auto;
                  line-height: 0;
                  user-select: none;
              `
            : css`
                  position: relative;
                  display: inline-grid;
                  place-items: center;
                  width: ${$size}rem;
                  height: ${$size}rem;
                  min-width: ${$size}rem;
                  min-height: ${$size}rem;
                  flex: 0 0 ${$size}rem;
                  line-height: 0;
                  user-select: none;
              `}
`;

const LayerBox = styled.span`
    ${({ $visible, $scale = 1 }) => css`
        position: absolute;
        inset: 0;
        display: block;
        opacity: ${$visible ? 1 : 0};
        pointer-events: none;
        transition:
            opacity 0.25s linear,
            transform 0.18s ease;
        transform: scale(${$scale});
        transform-origin: center center;
    `}
`;

const SpinBox = styled.span`
    ${({ $spin }) => css`
        position: absolute;
        inset: 0;
        display: block;
        transform-origin: center center;

        ${$spin &&
        css`
            animation: ${spin360} 1s linear infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        `}
    `}
`;

const PulseBox = styled.span`
    ${({ $enablePulse, $isActive }) => css`
        position: absolute;
        inset: 0;
        display: block;
        transform-origin: center center;

        ${$enablePulse &&
        $isActive &&
        css`
            animation: ${pulseTwice} 1.2s ease forwards;
        `}
    `}
`;

const Svg = styled.svg`
    ${({ $fill, theme }) => css`
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        fill: ${$fill || theme.foreground};
        color: ${$fill || theme.foreground};
        pointer-events: none;
        transition:
            fill 0.2s ease,
            color 0.2s ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    `}
`;

const isObject = (value) => value != null && typeof value === "object" && !Array.isArray(value);

const isValidIconArray = (value) => {
    if (!Array.isArray(value)) return false;
    if (value.length < 2) return false;

    const [viewBox, content] = value;

    if (typeof viewBox !== "string") return false;

    const nums = viewBox
        .trim()
        .split(/\s+/)
        .map((v) => Number(v));

    if (nums.length !== 2) return false;
    if (nums.some((v) => Number.isNaN(v) || v <= 0)) return false;

    return typeof content === "string" || typeof content === "function" || content != null;
};

const resolveThemeColor = (theme, value) => {
    if (!value) return value;
    if (typeof value !== "string") return value;
    return colorFind(value, { theme, output: "hex8" }) ?? value;
};

const normalizeIconsLibrary = (value) => {
    if (!isObject(value)) return {};
    return value;
};

const resolveIconInput = (iconInput, allIcons) => {
    if (!iconInput) return null;

    if (typeof iconInput === "string") {
        const fromLibrary = allIcons?.[iconInput];
        return isValidIconArray(fromLibrary) ? fromLibrary : null;
    }

    return isValidIconArray(iconInput) ? iconInput : null;
};

const createIconMeta = (iconInput, allIcons) => {
    const file = resolveIconInput(iconInput, allIcons);
    if (!file) return null;

    const [viewBox, Content] = file;
    const [viewW, viewH] = viewBox.split(/\s+/).map(Number);

    if (!viewW || !viewH) return null;

    const ratio = viewW / viewH;
    const stretch = Math.max(ratio, 1 / ratio);
    const opticalScale = Math.max(0.84, Math.min(1, 1 / Math.pow(stretch, 0.18)));

    return {
        Content,
        viewW,
        viewH,
        opticalScale,
        centerX: viewW / 2,
        centerY: viewH / 2,
    };
};

const resolveSize = (a, b, c) => a ?? b ?? c;

const resolveNumber = (value, fallback = null) => {
    if (value == null) return fallback;
    const n = Number(value);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

const resolveVisualScale = ({
    explicitScale,
    widthAlias,
    widthAliasShort,
    widthAliasSize,
    baseSize,
    fallback = 1,
}) => {
    const scaleValue = resolveNumber(explicitScale, null);
    if (scaleValue != null) return scaleValue;

    const targetWidth = resolveNumber(
        resolveSize(widthAliasSize, widthAliasShort, widthAlias),
        null,
    );

    if (targetWidth != null && baseSize > 0) {
        return targetWidth / baseSize;
    }

    return fallback;
};

const IconLayer = ({ meta, visible, fill, scale = 1, enablePulse, isActive, spinPending }) => {
    if (!meta) return null;

    const { Content, viewW, viewH, opticalScale, centerX, centerY } = meta;

    const opticalTransform =
        opticalScale === 1
            ? undefined
            : `translate(${centerX} ${centerY}) scale(${opticalScale}) translate(${-centerX} ${-centerY})`;

    return (
        <LayerBox $visible={visible} $scale={scale}>
            <SpinBox $spin={spinPending}>
                <PulseBox $enablePulse={enablePulse} $isActive={isActive}>
                    <Svg
                        $fill={fill}
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox={`0 0 ${viewW} ${viewH}`}
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <g transform={opticalTransform}>
                            {typeof Content === "string" ? (
                                <path d={Content} />
                            ) : Content ? (
                                <Content />
                            ) : null}
                        </g>
                    </Svg>
                </PulseBox>
            </SpinBox>
        </LayerBox>
    );
};

const PopTipWrapper = ({ popTipProps, children }) => {
    if (!popTipProps || !popTipProps.content) return children;
    return <PopTip {...popTipProps}>{children}</PopTip>;
};

export const Icon = ({
    icon,
    color,
    bgColor,
    width = 14,
    size,
    w,
    hoverIcon: hoverIconProp,
    hoverColor,
    hoverBgColor,
    hoverScale,
    hoverWidth,
    hoverW,
    hoverSize,
    activeIcon: activeIconProp,
    activeColor,
    activeBgColor,
    activeScale,
    activeWidth,
    activeW,
    activeSize,
    pendingIcon: pendingIconProp,
    pendingColor,
    pendingBgColor,
    pendingScale,
    pendingWidth,
    pendingW,
    pendingSize,
    popTipProps = {},
    hoverManually = false,
    activeManually = false,
    pendingManually = false,
    disableScaleEffect = false,
    disablePulseEffect = false,
    flat = false,
}) => {
    const [iconsLibraryRaw, theme] = baseStore.useGlobal((s) => [s._iconsLibrary, s.theme]);

    const { isSelfHover, setLocal } = baseStore.useLocal({
        isSelfHover: false,
    });

    const iconsLibrary = useMemo(() => normalizeIconsLibrary(iconsLibraryRaw), [iconsLibraryRaw]);
    const allIcons = useMemo(() => ({ ...icons, ...iconsLibrary }), [iconsLibrary]);

    const pendingState = !!pendingManually;
    const activeState = !!activeManually && !pendingState;
    const hoverState =
        !!(hoverManually || isSelfHover) && !activeState && !pendingState;

    const hoverGlyph = hoverIconProp || null;
    const activeGlyph = activeIconProp || null;
    const pendingGlyph = pendingIconProp || null;

    const baseMeta = useMemo(() => createIconMeta(icon, allIcons), [icon, allIcons]);
    const hoverMeta = useMemo(() => createIconMeta(hoverGlyph, allIcons), [hoverGlyph, allIcons]);
    const activeMeta = useMemo(
        () => createIconMeta(activeGlyph, allIcons),
        [activeGlyph, allIcons],
    );
    const pendingMeta = useMemo(
        () => createIconMeta(pendingGlyph, allIcons),
        [pendingGlyph, allIcons],
    );

    const finalColorRaw = pendingState
        ? pendingColor || color
        : activeState
          ? activeColor || color
          : hoverState
            ? hoverColor || color
            : color;
    const finalBgRaw = pendingState
        ? pendingBgColor || activeBgColor || hoverBgColor || bgColor
        : activeState
          ? activeBgColor || hoverBgColor || bgColor
          : hoverState
            ? hoverBgColor || bgColor
            : bgColor;

    const finalColor = resolveThemeColor(theme, finalColorRaw);
    const finalBg = resolveThemeColor(theme, finalBgRaw);
    const baseSize = resolveSize(size, w, width);

    const hoverScaleValue = resolveVisualScale({
        explicitScale: hoverScale,
        widthAlias: hoverWidth,
        widthAliasShort: hoverW,
        widthAliasSize: hoverSize,
        baseSize,
        fallback: 1,
    });

    const activeScaleValue = resolveVisualScale({
        explicitScale: activeScale,
        widthAlias: activeWidth,
        widthAliasShort: activeW,
        widthAliasSize: activeSize,
        baseSize,
        fallback: 1,
    });

    const pendingScaleValue = resolveVisualScale({
        explicitScale: pendingScale,
        widthAlias: pendingWidth,
        widthAliasShort: pendingW,
        widthAliasSize: pendingSize,
        baseSize,
        fallback: 1,
    });

    const finalScale = disableScaleEffect
        ? 1
        : pendingState
          ? pendingScaleValue
          : activeState
            ? activeScaleValue
            : hoverState
              ? hoverScaleValue
              : 1;

    const shouldRenderHoverLayer = !!(hoverIconProp && hoverMeta);
    const shouldRenderActiveLayer = !!(activeIconProp && activeMeta);
    const shouldRenderPendingLayer = !!(pendingIconProp && pendingMeta);
    const shouldUsePendingLayer = pendingState && shouldRenderPendingLayer;
    const shouldUseHoverLayer = hoverState && shouldRenderHoverLayer;
    const shouldUseActiveLayer = activeState && shouldRenderActiveLayer;
    const showBaseLayer =
        !shouldUsePendingLayer && !shouldUseHoverLayer && !shouldUseActiveLayer;
    const showHoverLayer = shouldUseHoverLayer;
    const showActiveLayer = shouldUseActiveLayer;
    const showPendingLayer = shouldUsePendingLayer;

    const pulseEnabled = !disablePulseEffect;

    if (!baseMeta) return null;

    return (
        <PopTipWrapper popTipProps={popTipProps}>
            <Root
                $size={baseSize}
                $flat={flat}
                $aspectW={flat ? baseMeta.viewW : 1}
                $aspectH={flat ? baseMeta.viewH : 1}
                onMouseEnter={() =>
                    setLocal((s) => {
                        s.isSelfHover = true;
                    })
                }
                onMouseLeave={() =>
                    setLocal((s) => {
                        s.isSelfHover = false;
                    })
                }
                style={{
                    background: finalBg || "transparent",
                    borderRadius: "999px",
                    transition: "background 0.2s ease",
                }}
            >
                <IconLayer
                    meta={baseMeta}
                    visible={showBaseLayer}
                    fill={finalColor}
                    scale={finalScale}
                    spinPending={pendingState && showBaseLayer}
                    enablePulse={
                        pulseEnabled &&
                        activeState &&
                        !shouldRenderActiveLayer &&
                        !pendingState
                    }
                    isActive={activeState}
                />

                {shouldRenderHoverLayer && (
                    <IconLayer
                        meta={hoverMeta}
                        visible={showHoverLayer}
                        fill={finalColor}
                        scale={finalScale}
                        enablePulse={false}
                        isActive={false}
                    />
                )}

                {shouldRenderActiveLayer && (
                    <IconLayer
                        meta={activeMeta}
                        visible={showActiveLayer}
                        fill={finalColor}
                        scale={finalScale}
                        enablePulse={pulseEnabled && activeState}
                        isActive={activeState}
                    />
                )}

                {shouldRenderPendingLayer && (
                    <IconLayer
                        meta={pendingMeta}
                        visible={showPendingLayer}
                        fill={finalColor}
                        scale={finalScale}
                        spinPending={showPendingLayer}
                        enablePulse={false}
                        isActive={false}
                    />
                )}
            </Root>
        </PopTipWrapper>
    );
};
