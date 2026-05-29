import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({ theme, $bgColor, $colors, $closingDelay, $isClosing, $boxHeight }) => css`
        position: relative;
        display: grid;
        grid-template-columns: 1fr 30rem;
        grid-template-rows: 3rem 1fr;
        width: 100%;
        background: ${$bgColor};
        box-shadow: 0rem 3px 5px ${theme.colorAlpha(theme.foreground, 0.3)};
        border-radius: 0 0 10rem 10rem;
        overflow: hidden;
        opacity: 1;
        transform: translateY(0);
        transition:
            max-height ${$closingDelay}ms ease,
            opacity ${$closingDelay}ms ease,
            transform ${$closingDelay}ms ease;

        ${$boxHeight &&
        !$isClosing &&
        css`
            max-height: ${$boxHeight};
        `}

        ${$isClosing &&
        css`
            opacity: 0;
            transform: translateY(-20rem);
            max-height: 0 !important;
        `}

        ${$bgColor &&
        css`
            color: ${$colors?.opposite};
        `}

        & > [data-slot="timeBar"] {
            position: relative;
            grid-area: 1 / 1 / 2 / 3;
            height: 3rem;
            min-height: 3rem;
            background: ${theme.colorAlpha(theme.primary, 0.5)};
            overflow: hidden;

            & > [data-slot="timeBarFill"] {
                display: block;
                height: 100%;
                width: 100%;
                transform: scaleX(0);
                transform-origin: left center;
                background: ${theme.primary};
                will-change: transform;
            }
        }

        & > [data-slot="close"] {
            grid-area: 2 / 2 / 3 / 3;
        }

        & > [data-slot="content"] {
            grid-area: 2 / 1 / 3 / 2;
            padding: 10rem;
        }
    `}
`;
