import styled, { css } from "styled-components";

// export const DefaultVariant = styled.span`
//     ${({ theme, $hoverManually, $disabled, $bgColor, $hoverBgColor, $activeBgColor, $color  }) => css`
//         #prefix,
//         #suffix {}
//         & > #container > #href-to-button {
//             &:hover {}
//         }
//     `}
// `;

export const DefaultVariant = styled.span`
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
        position: relative;
        top: 0;
        transition:
            top 0.2s,
            box-shadow 0.2s;
        border-radius: 5rem;
        will-change: top, box-shadow;

        ${$isHovered &&
        css`
            top: -2rem;
            box-shadow: 0 4px 12rem rgba(0, 0, 0, 0.18);
        `}

        ${$isActivated &&
        css`
            top: 2rem;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12) inset;
        `}

        & > [data-slot="label"] {
            ${!$isJustIcon &&
            css`
                min-width: 75rem;
            `}

            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6rem 10rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
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
