import styled, { css, keyframes } from "styled-components";

/** Keeps layer scale while spinning (was LayerBox → SpinBox chain). */
export const spin360Scaled = keyframes`
    from {
        transform: scale(var(--icon-layer-scale, 1)) rotate(0deg);
    }
    to {
        transform: scale(var(--icon-layer-scale, 1)) rotate(360deg);
    }
`;

/** Pulse relative to layer scale (was LayerBox → PulseBox chain). */
export const pulseTwiceScaled = keyframes`
    0% {
        transform: scale(var(--icon-layer-scale, 1));
    }
    20% {
        transform: scale(calc(var(--icon-layer-scale, 1) * 1.4));
    }
    50% {
        transform: scale(var(--icon-layer-scale, 1));
    }
    70% {
        transform: scale(calc(var(--icon-layer-scale, 1) * 1.4));
    }
    100% {
        transform: scale(var(--icon-layer-scale, 1));
    }
`;

export const Root = styled.span`
    ${({ $size, $flat, $flatRootWidth, $aspectW, $aspectH }) =>
        $flat
            ? css`
                  position: relative;
                  display: inline-grid;
                  place-items: center;
                  width: ${$flatRootWidth}rem;
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

export const Svg = styled.svg`
    ${({ $fill }) => {
        const shouldInherit = $fill == null || $fill === "" || $fill === "inherit";
        const color = shouldInherit ? "inherit" : $fill;
        const fill = shouldInherit ? "currentColor" : $fill;

        return css`
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        fill: ${fill};
        color: ${color};
        pointer-events: none;
        transition:
            fill 0.2s ease,
            color 0.2s ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    `;
    }}
`;

/** Single surface: opacity + layer scale + spin/pulse (replaces LayerBox → SpinBox → PulseBox). */
export const LayerSvg = styled(Svg)`
    ${({ $visible, $scale = 1, $spin, $enablePulse, $isActive }) => css`
        --icon-layer-scale: ${$scale};

        opacity: ${$visible ? 1 : 0};
        pointer-events: none;
        transition:
            opacity 0.25s linear,
            transform 0.18s ease;
        transform: scale(${$scale});
        transform-origin: center center;

        ${$spin &&
        css`
            animation: ${spin360Scaled} 1s linear infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
                transform: scale(${$scale});
            }
        `}

        ${!$spin &&
        $enablePulse &&
        $isActive &&
        css`
            animation: ${pulseTwiceScaled} 1.2s ease forwards;
        `}
    `}
`;
