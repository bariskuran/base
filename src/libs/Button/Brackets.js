import styled, { css } from "styled-components";

const S = styled.div`
    ${({
        theme,
        $isHovered,
        // $isActivated,
        // $isPending,
        // $disabled,
        // $isJustIcon,
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
        cursor: pointer;
        overflow: hidden;
        border-radius: 5rem;
        transition: all 0.5s;

        & > [data-slot="label"] {
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 12rem;
            padding: 4rem;
            transition: all 0.5s;
        }

        & > [data-slot="prefix"],
        & > [data-slot="suffix"] {
            display: flex;
            justify-content: center;
            align-items: center;
            width: max-content;
            padding: 4rem;
            transition: all 0.5s;
        }

        ${$isHovered &&
        css`
            background: ${theme.backgrounds.shade10} !important;

            & > [data-slot="prefix"],
            & > [data-slot="suffix"] {
                transform: scale(1.1) translateX(-3rem);
            }

            & > [data-slot="suffix"] {
                transform: scale(1.1) translateX(3rem);
            }
        `}

        &:active {
            transform: scale(0.8);
        }
    `}
`;
export const X = {
    variant: S,
    prefix: { icon: "bracketLeft", width: 22, color: "primary" },
    suffix: { icon: "bracketRight", width: 22, color: "primary" },
    bgColor: "background",
};
export default X;
