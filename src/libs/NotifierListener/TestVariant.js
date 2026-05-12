import styled, { css, keyframes } from "styled-components";

const timeBar = keyframes`
 from {
    width: 0;
}
   to {
    width: 100%;
}
`;

export const TestVariant = styled.div`
    ${({
        theme,
        $bgColor,
        $killAfter,
        $colors,
        $closingDelay,
        $isClosing,
        // $status,
        // $boxHeight,
    }) => css`
        display: grid;
        grid-template-columns: 1fr 30rem;
        grid-template-rows: 3rem, 1fr;
        width: 100%;
        background: ${theme.backgrounds.shade10};
        overflow: hidden;

        ${$isClosing &&
        css`
            opacity: 0;
        `}

        ${$bgColor &&
        css`
            color: ${$colors?.opposite};
        `}

        & > [data-slot="timeBar"] {
            grid-area: 1 / 1 / 2 / 3;
            height: 3rem;
            background: ${theme.colorAlpha(theme.primary, 50)};
            transition: width 0.25s ease;

            &:after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 100%;
                background: ${theme.primary};
                animation: ${timeBar} ${$killAfter}ms linear;
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
