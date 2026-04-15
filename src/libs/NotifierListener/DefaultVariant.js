import styled, { css, keyframes } from "styled-components";

const timeBar = keyframes`
 from {
    width: 0;
}
   to {
    width: 100%;
}
`;

const sideIn = keyframes`
    from {
        transform: translateY(-20rem);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

export const DefaultVariant = styled.div`
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
        all: unset;

        display: grid;
        grid-template-columns: 1fr 30rem;
        grid-template-rows: 3rem, 1fr;
        width: 100%;
        background: ${$bgColor};
        ${theme.get3DShadow({ depth: 3, hoverDepth: 1 })}
        border-radius: 0 0 10rem 10rem;
        overflow: hidden;
        transition: max-height ${$closingDelay}ms;
        animation: ${sideIn} 500ms linear forwards;

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
