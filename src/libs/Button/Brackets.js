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
        overflow: hidden;
        border-radius: 5rem;
        transition: all 0.5s;
        overflow: visible;

        &::before,
        &::after {
            content: "[";
            position: relative;
            display: block;
            font-size: 225%;
            color: ${theme.primary};
            transition: all 0.5s;
            line-height: 1;
        }

        &::after {
            content: "]";
        }

        & > [data-slot="label"] {
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 12rem;
            padding: 6rem 20rem;
            transition: all 0.5s;
        }

        ${($isHovered || $isActivated) &&
        css`
            &::before {
                transform: scale(1.2) translate(-2rem, -1px);
                transform-origin: right center;
            }
            &::after {
                transform: scale(1.2) translate(2rem, -1px);
                transform-origin: left center;
            }
        `}
    `}
`;
export const X = {
    variant: S,
    // prefix: { icon: "bracketLeft", width: 22, color: "primary" },
    // suffix: { icon: "bracketRight", width: 22, color: "primary" },
    bgColor: "transparent",
    hoverBgColor: "transparent",
    activeBgColor: "transparent",
    color: "foreground",
};
export default X;
