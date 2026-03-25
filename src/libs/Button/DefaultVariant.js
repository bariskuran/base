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

export const DefaultVariant = styled.div`
    ${({
        // theme,
        $isHovered,
        // $disabled,
        $isJustIcon,
        // $bgColor,
        $hoverBgColor,
        $activeBgColor,
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
        cursor: pointer;
        border-radius: 5rem;

        ${$isHovered &&
        css`
            background: ${$hoverBgColor} !important;
            transform: translateY(-3rem);
        `}

        &:active {
            background: ${$activeBgColor} !important;
            transform: translateY(3rem) scale(0.8);
        }

        & > [data-slot="label"] {
            ${!$isJustIcon &&
            css`
                min-width: 75rem;
            `}
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8rem;
            text-transform: uppercase;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 12rem;
        }

        & > [data-slot="prefix"],
        & > [data-slot="suffix"] {
            display: flex;
            justify-content: center;
            align-items: center;
            width: max-content;
            padding: 8rem;
        }
    `}
`;
