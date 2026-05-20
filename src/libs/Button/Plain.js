import styled, { css } from "styled-components";

// export const DefaultVariant = styled.div`
//     ${({ theme, $hoverManually, $disabled, $bgColor, $hoverBgColor, $activeBgColor, $color  }) => css`
//         #prefix,
//         #suffix {}
//         & > #container > #href-to-button {
//             &:hover {}
//         }
//     `}
// `;

export const S = styled.span`
    ${({ $isJustIcon }) => css`
        all: unset;
        display: flex;
        transition:
            background 0.2s ease,
            background-color 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        border-radius: 0rem !important;
        border: none !important;

        & > [data-slot="label"] {
            ${!$isJustIcon &&
            css`
                min-width: 75rem;
            `}

            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6rem 10rem;
            font-size: 15rem;
            font-weight: 500;
        }
    `}
`;

const X = {
    variant: S,
};
export default X;
