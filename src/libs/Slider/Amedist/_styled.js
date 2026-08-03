import styled, { keyframes, css } from "styled-components";

export const AMEDIST_DEFAULT_ANIMATION_RATIO = 0.25;

const timeBarGrow = keyframes`
    from {
        transform: scaleX(0);
    }
    to {
        transform: scaleX(1);
    }
`;

const imageTransformEnter = keyframes`
    from {
        transform: translateX(var(--amedist-image-enter-x)) scale(var(--amedist-image-enter-scale));
    }
    to {
        transform: translateX(0) scale(1);
    }
`;

const imageFadeEnter = keyframes`
    from {
        opacity: var(--amedist-image-enter-opacity);
    }
    to {
        opacity: 1;
    }
`;

const floatTrackFromLeft = keyframes`
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
`;

const floatTrackFromRight = keyframes`
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
`;

const floatTrackFromTop = keyframes`
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
`;

const floatTrackFromBottom = keyframes`
    from { transform: translateY(0); }
    to { transform: translateY(-100%); }
`;

const floatImageFromLeft = keyframes`
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
`;

const floatImageFromRight = keyframes`
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
`;

const floatImageFromTop = keyframes`
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
`;

const floatImageFromBottom = keyframes`
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
`;

const floatTrackKeyframes = {
    left: floatTrackFromLeft,
    right: floatTrackFromRight,
    top: floatTrackFromTop,
    bottom: floatTrackFromBottom,
};

const floatImageKeyframes = {
    left: floatImageFromLeft,
    right: floatImageFromRight,
    top: floatImageFromTop,
    bottom: floatImageFromBottom,
};

const slideTransform = ({ $motion }) => {
    switch ($motion) {
        case "active":
            return "translateX(0) scale(1)";
        case "exit-forward":
            return "translateX(-100%) scale(1)";
        case "exit-backward":
            return "translateX(100%) scale(1)";
        case "hidden-right":
            return "translateX(100%) scale(1)";
        case "hidden-left":
            return "translateX(-100%) scale(1)";
        default:
            return "translateX(100%) scale(1)";
    }
};

const getImageEnterX = ($from) => {
    if ($from === "center") return "0";
    return $from === "left" ? "-100%" : "100%";
};

const getTransitionMs = ({ $motion, $enterMs, $exitMs }) =>
    $motion === "active" ? $enterMs : $exitMs;

const imageEnterAnimation = ({
    $from,
    $scale,
    $fade,
    $motion,
    $transitioning,
    $snap,
    $durationMs,
    $delayMs,
    $floatFrom,
}) => {
    if ($floatFrom || $snap || !$transitioning || $motion !== "active") return "";

    return css`
        --amedist-image-enter-x: ${getImageEnterX($from)};
        --amedist-image-enter-scale: ${$scale ? 0.5 : 1};
        --amedist-image-enter-opacity: ${$fade ? 0 : 1};
        animation:
            ${imageTransformEnter} ${$durationMs}ms ease ${$delayMs || 0}ms both,
            ${imageFadeEnter} ${$durationMs}ms linear ${$delayMs || 0}ms both;
    `;
};

const resolveFloatAnimation =
    (animations) =>
    ({ $floatFrom, $floatDurationMs, $motion }) => {
        const animation = animations[$floatFrom];
        if (!animation || !$floatDurationMs || $motion !== "active") return "";

        return css`
            animation: ${animation} ${$floatDurationMs}ms linear both;
        `;
    };

const floatTrackAnimation = resolveFloatAnimation(floatTrackKeyframes);
const floatImageAnimation = resolveFloatAnimation(floatImageKeyframes);

const floatImageGeometry = ({ $floatFrom }) => {
    if ($floatFrom === "left" || $floatFrom === "right") {
        return css`
            top: 0;
            ${$floatFrom}: 0;
            width: auto;
            height: 100%;
            max-width: none;
            max-height: 100%;
        `;
    }

    return css`
        left: 0;
        ${$floatFrom}: 0;
        width: 100%;
        height: auto;
        max-width: 100%;
        max-height: none;
    `;
};

const pauseWhenHidden = ({ $paused }) =>
    $paused &&
    css`
        animation-play-state: paused;
        transition-duration: 0ms !important;
    `;

const S = {
    container: styled.div`
        position: relative;
        width: 100%;
        height: 100vh;
        min-height: 560rem;
        overflow: hidden;
        display: flex;
        flex-direction: column-reverse;
        background: ${({ theme }) => theme.background};
    `,
    sliderArea: styled.div`
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: ${({ theme }) => theme.background};
    `,
    slidesLayer: styled.div`
        position: absolute;
        inset: 0;
        z-index: 0;
    `,
    frontSlidesLayer: styled.div`
        position: absolute;
        inset: 0;
        z-index: 3;
        pointer-events: none;
    `,
    slideStack: styled.div`
        position: absolute;
        inset: 0;
        z-index: ${({ $motion }) =>
            $motion === "active" ? 2 : $motion.startsWith("exit") ? 1 : 0};
        pointer-events: none;
    `,
    slideBgLayer: styled.div`
        position: absolute;
        inset: 0;
        transform: ${slideTransform};
        opacity: ${({ $motion }) => ($motion === "active" || $motion.startsWith("exit") ? 1 : 0)};
        transition: ${({ $snap, $motion, $exitMs }) => {
            if ($snap || $motion === "active") return "none";
            return `transform ${$exitMs}ms ease`;
        }};
        z-index: ${({ $layerIndex }) => $layerIndex};
        will-change: transform, opacity;
        ${imageEnterAnimation};
        ${pauseWhenHidden};
    `,
    slideBgImage: styled.div.attrs(({ $image, $candleOpacity, $candleTransitionMs }) => ({
        style: {
            backgroundImage: `url(${$image})`,
            opacity: $candleOpacity,
            transitionDuration: `${$candleTransitionMs}ms`,
        },
    }))`
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transition-property: opacity;
        transition-timing-function: linear;
        will-change: opacity;
    `,
    slideBgFloatTrack: styled.div`
        position: absolute;
        inset: 0;
        opacity: ${({ $motion }) => ($motion === "active" ? 1 : 0)};
        pointer-events: none;
        will-change: transform;
        ${floatTrackAnimation};
        ${pauseWhenHidden};
    `,
    slideBgFloatImage: styled.img`
        position: absolute;
        display: block;
        object-fit: contain;
        user-select: none;
        pointer-events: none;
        opacity: ${({ $candleOpacity }) => $candleOpacity};
        transition: opacity ${({ $candleTransitionMs }) => $candleTransitionMs}ms linear;
        will-change: transform, opacity;
        ${floatImageGeometry};
        ${floatImageAnimation};
        ${pauseWhenHidden};
    `,
    contentArea: styled.div`
        width: 100%;
        z-index: 2;
        position: relative;
        margin-bottom: ${({ $bottomMargin }) => $bottomMargin}rem;
        display: flex;
        align-items: flex-start;
    `,
    area1: styled.div`
        flex: 0 0 150rem;
        height: 90rem;
        margin-top: 30rem;
        background: ${({ theme }) => theme.colorAlpha(theme.background, 10)};
        backdrop-filter: blur(3rem);
        -webkit-backdrop-filter: blur(3rem);
    `,
    area3: styled.div`
        flex: 1 1 auto;
        height: 40rem;
        background: ${({ theme }) => theme.colorAlpha(theme.background, 10)};
        backdrop-filter: blur(3rem);
        -webkit-backdrop-filter: blur(3rem);
        margin-top: 60rem;
    `,
    sliderInfo: styled.div`
        flex: 0 0 50%;
        min-height: 100rem;
        background: ${({ theme }) => theme.colorAlpha(theme.background, 20)};
        backdrop-filter: blur(25rem);
        -webkit-backdrop-filter: blur(25rem);
        margin-bottom: 30rem;
    `,
    topBarArea: styled.div`
        width: 100%;
        height: 2px;
        overflow: hidden;
    `,
    topBarFill: styled.div`
        height: 2px;
        width: 100%;
        transform-origin: left center;
        transform: scaleX(0);
        background: ${({ theme }) => theme.primary};
        animation: ${timeBarGrow} ${({ $durationSec }) => $durationSec}s linear forwards;
        ${pauseWhenHidden};
    `,
    sliderContent: styled.div`
        width: 100%;
        display: flex;
        gap: 20rem;
        align-items: stretch;
    `,
    infoArea: styled.div`
        flex: 1 1 auto;
        min-width: 0;
        padding: 24rem 36rem 30rem 36rem;
        overflow-x: hidden;
    `,
    contentWrap: styled.div`
        position: relative;
        display: grid;
        width: 100%;
        min-height: 74rem;
        padding-bottom: 36rem;
        overflow: visible;
    `,
    slideContent: styled.div`
        grid-area: 1 / 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16rem;
        transform: ${slideTransform};
        opacity: ${({ $motion }) => ($motion === "active" ? 1 : 0)};
        transition: ${({ $snap, $motion, $enterMs, $exitMs }) =>
            $snap
                ? "none"
                : `transform ${getTransitionMs({ $motion, $enterMs, $exitMs })}ms ease, opacity ${getTransitionMs({ $motion, $enterMs, $exitMs })}ms ease`};
        pointer-events: ${({ $motion }) => ($motion === "active" ? "auto" : "none")};
        z-index: ${({ $motion }) =>
            $motion === "active" ? 2 : $motion.startsWith("exit") ? 1 : 0};
        will-change: transform, opacity;
        ${pauseWhenHidden};
        ${({ $motion }) =>
            $motion === "active" || $motion.startsWith("exit")
                ? css``
                : css`
                      max-height: 0;
                      overflow: hidden;
                  `};
    `,
    commonContent: styled.div`
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        transform: ${slideTransform};
        opacity: ${({ $motion }) => ($motion === "active" ? 1 : 0)};
        transition: ${({ $snap, $motion, $enterMs, $exitMs }) =>
            $snap
                ? "none"
                : `transform ${getTransitionMs({ $motion, $enterMs, $exitMs })}ms ease, opacity ${getTransitionMs({ $motion, $enterMs, $exitMs })}ms ease`};
        pointer-events: ${({ $motion }) => ($motion === "active" ? "auto" : "none")};
        z-index: 4;
        will-change: transform, opacity;
        ${pauseWhenHidden};
    `,
    bullets: styled.div`
        flex: 0 0 30rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6rem;
        padding: 12rem 10rem 12rem 0;
    `,
    bulletButton: styled.button`
        appearance: none;
        border: none;
        padding: 0;
        margin: 0;
        flex: 0 0 auto;
        background: transparent;
        cursor: pointer;
        line-height: 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;

        &:focus-visible {
            outline: 2px solid ${({ theme }) => theme.primary};
            outline-offset: 4rem;
            border-radius: 999px;
        }
    `,
    bulletSvg: styled.svg`
        display: block;
        overflow: visible;
        flex-shrink: 0;
    `,
    bulletRect: styled.rect`
        transition:
            height 0.35s ease,
            fill 0.35s ease;
        fill: ${({ theme, $active }) => ($active ? theme.primary : "#fff")};
    `,
};

export default S;
