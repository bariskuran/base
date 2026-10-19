import styled from "styled-components";

export const PlayerContainer = styled.div`
    position: relative;
    box-sizing: border-box;
    width: 100%;

    &[data-mode="byScroll"] {
        flex: none;
    }
`;

export const PlayerStage = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    min-height: 1px;
    justify-content: center;
    align-items: center;

    &[data-sticky="true"] {
        overflow: hidden;
    }

    .base-lottie-player__animation {
        position: relative;
        overflow: hidden;
        flex: none;
        max-width: 100%;
    }

    .base-lottie-player__layer {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .base-lottie-player__layer > svg {
        display: block;
        width: 100% !important;
        height: 100% !important;
    }
`;

export const PlayerControls = styled.div`
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 10;
    display: flex;
    gap: 0;

    button {
        display: grid;
        width: 20px;
        height: 20px;
        place-items: center;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: rgb(0 0 0 / 48%);
        color: #fff;
        font: inherit;
        cursor: pointer;
    }

    button:hover {
        background: rgb(0 0 0 / 72%);
    }

    button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    button:disabled:hover {
        background: rgb(0 0 0 / 48%);
    }

    button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

`;
