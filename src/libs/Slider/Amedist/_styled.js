import styled, { keyframes, css } from "styled-components";
import { Typo } from "../../Typo";

export const AMEDIST_TEXT_MS = 600;
export const AMEDIST_IMAGE_BASE_MS = 250;
export const AMEDIST_IMAGE_STAGGER_MS = 200;

const timeBarGrow = keyframes`
    from {
        transform: scaleX(0);
    }
    to {
        transform: scaleX(1);
    }
`;

const slideTransform = ({ $motion }) => {
    switch ($motion) {
        case "active":
            return "translateX(0)";
        case "exit-forward":
            return "translateX(-100%)";
        case "exit-backward":
            return "translateX(100%)";
        case "hidden-right":
            return "translateX(100%)";
        case "hidden-left":
            return "translateX(-100%)";
        default:
            return "translateX(100%)";
    }
};

const pauseWhenHidden = ({ $paused }) =>
    $paused &&
    css`
        animation-play-state: paused;
        transition-duration: 0ms !important;
    `;

const S = {
    root: styled.div`
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: ${({ theme }) => theme.background};
    `,

    timeBarTrack: styled.div`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 4;
        width: 100%;
        height: 3px;
        background: ${({ theme }) => theme.greys.shade20};
    `,

    timeBarFill: styled.div`
        height: 100%;
        width: 100%;
        transform-origin: left center;
        transform: scaleX(0);
        background: ${({ theme }) => theme.primary};
        animation: ${timeBarGrow} ${({ $durationSec }) => $durationSec}s linear forwards;
        ${pauseWhenHidden};
    `,

    imageArea: styled.div`
        position: relative;
        width: 100%;
        flex: 0 0 auto;
        overflow: hidden;
        aspect-ratio: 16 / 9;

        ${({ theme }) =>
            theme.responsive.vertical(css`
                aspect-ratio: 4 / 5;
            `)}
    `,

    slidesLayer: styled.div`
        position: absolute;
        inset: 0;
        z-index: 0;
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
        background-image: url(${({ $image }) => $image});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transform: ${slideTransform};
        opacity: ${({ $motion }) => ($motion === "active" ? 1 : 0)};
        transition: ${({ $snap, $motion, $durationMs }) => {
            if ($snap) return "none";
            const ms = $motion === "active" ? $durationMs : AMEDIST_TEXT_MS;
            return `transform ${ms}ms ease, opacity ${ms}ms ease`;
        }};
        z-index: ${({ $layerIndex }) => $layerIndex};
        will-change: transform, opacity;
        ${pauseWhenHidden};
    `,

    contentWrap: styled.div`
        display: grid;
        width: 100%;
        max-width: 720rem;
        overflow: hidden;
    `,

    slideContent: styled.div`
        grid-area: 1 / 1;
        width: 100%;
        display: flex;
        transform: ${slideTransform};
        opacity: ${({ $motion }) => ($motion === "active" ? 1 : 0)};
        transition: ${({ $snap }) =>
            $snap
                ? "none"
                : `transform ${AMEDIST_TEXT_MS}ms ease, opacity ${AMEDIST_TEXT_MS}ms ease`};
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

    slideTitle: styled(Typo.h1)`
        font-family: "Cormorant Garamond", serif;
        text-align: center;
    `,

    bulletButton: styled.button`
        appearance: none;
        border: none;
        padding: 4rem 0;
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
            width 0.35s ease,
            fill 0.35s ease;
        fill: ${({ theme, $active }) => ($active ? theme.primary : theme.greys.shade20)};
    `,
};

export default S;
