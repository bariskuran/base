import styled, { css, keyframes } from "styled-components";

const timeBar = keyframes`
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
`;

export const DefaultVariant = styled.div`
    ${({ theme, $bgColor, $killAfter, $colors }) => css`
        position: relative;
        display: grid;
        grid-template-columns: 1fr 30rem;
        grid-template-rows: 3ox 1fr;
        width: 100%;
        background: ${$bgColor};
        box-shadow: 0rem 3px 5px ${theme.colorAlpha(theme.foreground, 0.3)};
        border-radius: 0 0 10rem 10rem;
        overflow: hidden;

        ${$bgColor &&
        css`
            color: ${$colors?.opposite};
        `}

        & > [data-slot="timeBar"] {
            position: relative;
            grid-area: 1 / 1 / 2 / 3;
            height: 3px;
            min-height: 3px;
            background: ${theme.colorAlpha(theme.primary, 0.5)};
            overflow: hidden;

            &:after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 100%;
                background: ${theme.primary};
                animation: ${timeBar} ${$killAfter}ms linear forwards;
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
