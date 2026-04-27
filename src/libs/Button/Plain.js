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

export const S = styled.div`
    ${({
        // theme,
        // $isHovered,
        // $disabled,
        $isJustIcon,
        // $isActivated,
        // $isPending,
        // $bgColor,
        // $hoverBgColor,
        // $activeBgColor,
        // $color,
        // $prefixBgColor,
        // $prefixColor,
        // $suffixBgColor,
        // $suffixColor,
        // $minHeight,
        // $minWidth,
        // $minLabelWidth,
        // $inverseColor1,
        // $inverseColor2,
        // $size,
    }) => css`
        all: unset;
        display: flex;
        transition: all 0.2s;
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
            padding: 6rem 20rem;
            text-transform: uppercase;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 12rem;
        }
    `}
`;

const X = {
    variant: S,
};
export default X;
