import styled, { css } from "styled-components";

const controlPositions = {
    previous: css`
        top: 0;
        left: 0;
    `,
    next: css`
        right: 0;
        bottom: 0;
    `,
    close: css`
        top: 0;
        right: 0;
    `,
};

const S = {
    root: styled.section`
        position: relative;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    `,
    measureHost: styled.div`
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
    `,
    measureRow: styled.div`
        ${({ $gap, $height }) => css`
            display: flex;
            flex-wrap: nowrap;
            align-items: stretch;
            width: max-content;
            gap: ${typeof $gap === "number" ? `${$gap}rem` : $gap || "10rem"};
            height: ${$height}rem;
        `}
    `,
    alignedRow: styled.div`
        ${({ $gap, $height, $alignX }) => css`
            display: flex;
            flex-wrap: nowrap;
            align-items: stretch;
            justify-content: ${$alignX || "center"};
            width: 100%;
            min-height: ${$height}rem;
            gap: ${typeof $gap === "number" ? `${$gap}rem` : $gap || "10rem"};
            box-sizing: border-box;
        `}
    `,
    edgeSpacer: styled.span`
        ${({ $width }) => css`
            display: block;
            flex: 0 0 ${$width};
            width: ${$width};
            height: 1rem;
            pointer-events: none;
        `}
    `,
    thumbnail: styled.button`
        ${({ theme, $height }) => css`
            all: unset;
            position: relative;
            flex: 0 0 auto;
            width: auto;
            height: ${$height}rem;
            overflow: hidden;
            box-sizing: border-box;
            cursor: pointer;
            background: ${theme.colorAlpha(theme.foreground, 0.08)};

            &:focus-visible {
                outline: 2rem solid ${theme.primary};
                outline-offset: -2rem;
            }

            & > span {
                display: block;
                height: 100%;
                width: auto !important;
                max-width: none !important;
                transform: scale(1);
                transform-origin: center center;
                transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
            }

            & img {
                display: block;
                width: auto !important;
                height: 100% !important;
                max-height: 100%;
                max-width: none !important;
                object-fit: cover !important;
            }

            /* Touch can sticky-hover after tap — only zoom with real pointer hover. */
            @media (hover: hover) {
                &:hover > span {
                    will-change: transform;
                    transform: scale(1.3);
                }
            }
        `}
    `,
    stage: styled.div`
        ${({ theme }) => css`
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 0;
            overflow: hidden;
            background: ${theme.background};

            & > span:first-child,
            & > span:first-child img {
                width: 100%;
                height: 100%;
            }
        `}
    `,
    control: styled.div`
        ${({ $position }) => css`
            position: absolute;
            z-index: 2;
            width: 36rem;
            height: 36rem;
            box-sizing: border-box;
            ${controlPositions[$position]}

            & > span,
            & button {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }

            & button {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `}
    `,
    counter: styled.div`
        ${({ theme }) => css`
            position: absolute;
            z-index: 2;
            left: 12rem;
            bottom: 10rem;
            padding: 4rem 7rem;
            color: ${theme.foreground};
            background: ${theme.colorAlpha(theme.background, 0.75)};
            font-size: 11rem;
            line-height: 1;
            pointer-events: none;
        `}
    `,
    caption: styled.div`
        ${({ theme }) => css`
            position: absolute;
            z-index: 3;
            left: 50%;
            bottom: 16rem;
            transform: translateX(-50%);
            max-width: min(80%, 640rem);
            padding: 8rem 14rem;
            box-sizing: border-box;
            background: ${theme.foreground};
            color: ${theme.background};
            font-size: 13rem;
            line-height: 1.35;
            text-align: center;
            pointer-events: none;
        `}
    `,
};

export default S;
