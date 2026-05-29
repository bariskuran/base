import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({ theme, $bgColor, $colors }) => css`
        position: relative;
        display: grid;
        grid-template-columns: 1fr 30rem;
        grid-template-rows: 3rem 1fr;
        width: 100%;
        background: ${$bgColor || theme.background};
        border-radius: 0 0 10rem 10rem;
        overflow: hidden;

        ${($bgColor || theme.background) &&
        css`
            color: ${$colors?.opposite || theme.foreground};
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
