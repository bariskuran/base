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
        $isActivated,
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
        border-radius: 5rem;

        ${$isHovered &&
        css`
            transform: translateY(-3rem);
        `}

        ${$isActivated &&
        css`
            transform: translateY(3rem) scale(0.9);
        `}

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
            min-height: 20rem;
            min-width: 20rem;
        }

        /* & > [data-slot="prefix"],
        & > [data-slot="suffix"],
        & > [data-slot="centeredIcon"] {} */
    `}
`;
