import { useMemo } from "react";
import styled, { css, keyframes } from "styled-components";
import { icons } from "./icons";
import { baseStore } from "../@baseStore";
import { PopTip } from "../PopTip";
import { byPath } from "../byPath";

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
    ${({ $size }) => css`
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
    return byPath.get(theme, value) ?? theme?.[value] ?? value;
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

const resolveScale = (value, fallback = 1) => {
    if (value == null) return fallback;
    const n = Number(value);
    if (Number.isNaN(n) || n <= 0) return fallback;
    return n;
};

const IconLayer = ({ meta, visible, fill, scale = 1, enablePulse, isActive }) => {
    if (!meta) return null;

    const { Content, viewW, viewH, opticalScale, centerX, centerY } = meta;

    const opticalTransform =
        opticalScale === 1
            ? undefined
            : `translate(${centerX} ${centerY}) scale(${opticalScale}) translate(${-centerX} ${-centerY})`;

    return (
        <LayerBox $visible={visible} $scale={scale}>
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
    width = 14,
    size,
    w,
    onHoverIcon: onHoverIconProp,
    onHoverColor,
    onHoverScale,
    onActiveIcon: onActiveIconProp,
    onActiveColor,
    onActiveScale,
    popTipProps = {},
    hoverManually = false,
    activeManually = false,
    isActive = false,
    disableScaleEffect = false,
    disablePulse = false,
}) => {
    const [iconsLibraryRaw, theme] = baseStore.useGlobal((s) => [s._iconsLibrary, s.theme]);

    const { isSelfHover, setLocal } = baseStore.useLocal({
        isSelfHover: false,
    });

    const iconsLibrary = useMemo(() => normalizeIconsLibrary(iconsLibraryRaw), [iconsLibraryRaw]);
    const allIcons = useMemo(() => ({ ...icons, ...iconsLibrary }), [iconsLibrary]);

    const activeState = !!(activeManually || isActive);
    const hoverState = !!(hoverManually || isSelfHover) && !activeState;

    const onHoverIcon = onHoverIconProp || null;
    const onActiveIcon = onActiveIconProp || null;

    const baseMeta = useMemo(() => createIconMeta(icon, allIcons), [icon, allIcons]);
    const hoverMeta = useMemo(() => createIconMeta(onHoverIcon, allIcons), [onHoverIcon, allIcons]);
    const activeMeta = useMemo(
        () => createIconMeta(onActiveIcon, allIcons),
        [onActiveIcon, allIcons],
    );

    const finalColorRaw = activeState
        ? onActiveColor || color
        : hoverState
          ? onHoverColor || color
          : color;

    const finalColor = resolveThemeColor(theme, finalColorRaw);
    const finalSize = resolveSize(size, w, width);

    const hoverScaleValue = resolveScale(onHoverScale, 1);
    const activeScaleValue = resolveScale(onActiveScale, 1);

    const finalScale = activeState ? activeScaleValue : hoverState ? hoverScaleValue : 1;

    const shouldRenderHoverLayer = !!(onHoverIconProp && hoverMeta);
    const shouldRenderActiveLayer = !!(onActiveIconProp && activeMeta);
    const shouldUseHoverLayer = hoverState && shouldRenderHoverLayer;
    const shouldUseActiveLayer = activeState && shouldRenderActiveLayer;
    const showBaseLayer = !shouldUseHoverLayer && !shouldUseActiveLayer;
    const showHoverLayer = shouldUseHoverLayer;
    const showActiveLayer = shouldUseActiveLayer;

    const pulseEnabled = !disablePulse && !disableScaleEffect;

    if (!baseMeta) return null;

    return (
        <PopTipWrapper popTipProps={popTipProps}>
            <Root
                $size={finalSize}
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
            >
                <IconLayer
                    meta={baseMeta}
                    visible={showBaseLayer}
                    fill={finalColor}
                    scale={finalScale}
                    enablePulse={pulseEnabled && activeState && !shouldRenderActiveLayer}
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
            </Root>
        </PopTipWrapper>
    );
};
