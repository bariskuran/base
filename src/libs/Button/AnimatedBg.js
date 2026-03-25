import styled, { css } from "styled-components";

const S = styled.div`
    ${({
        // theme,
        $isHovered,
        $disabled,
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
        transition: all 0.2s linear 0.25s;
        cursor: pointer;
        overflow: hidden;
        position: relative;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background: ${$hoverBgColor};
            transition: all 0.25s;
        }

        ${$isHovered &&
        css`
            transition: none;

            &::before {
                width: 100%;
            }
        `}

        &:active {
            transform: scale(0.8);
            &::before {
                background: ${$activeBgColor};
            }
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
export const AnimatedBg = {
    variant: S,
};
