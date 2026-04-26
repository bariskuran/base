import styled, { css } from "styled-components";

const S = styled.div`
    ${({
        theme,
        $isHovered,
        $isActivated,
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
        $fullWidth,
    }) => css`
        all: unset;
        display: flex;
        cursor: pointer;
        transition: all 0.5s;
        position: relative;
        width: ${$fullWidth ? "100%" : "auto"};
        line-height: 1;

        &::before,
        &::after {
            content: "";
            position: absolute;
            bottom: -2rem;
            left: 0;
            width: 100%;
            height: 2rem;
            background: ${theme.greys.shade30};
            transition: all 0.5s;
        }

        &::after {
            left: 50%;
            width: 0%;
            background: ${theme.primary};
        }

        & > [data-slot="label"] {
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 12rem;
            padding: 5rem 10rem;
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

        ${($isHovered || $isActivated) &&
        css`
            &::after {
                left: 0;
                width: 100%;
            }
        `}
    `}
`;
export const X = {
    variant: S,
    bgColor: "background",
};
export default X;
