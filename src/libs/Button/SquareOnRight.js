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
        transition: all 0.5s;
        position: relative;
        width: ${$fullWidth ? "100%" : "auto"} !important;
        box-sizing: border-box;

        & > [data-slot="label"] {
            display: flex;
            align-items: center;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 14rem;
            transition: all 0.5s;
            padding: 4rem 8rem;
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
            background: ${theme.colorAlpha(theme.primary, 0.2)} !important;
        `}

        &:after {
            content: "";
            width: 0;
            height: 30rem;
            background: ${theme.primary};
            transition: all 0.5s;
        }

        ${$isActivated &&
        css`
            background: ${theme.colorAlpha(theme.primary, 0.1)} !important;

            & > [data-slot="label"] {
                padding: 4rem 12rem;
            }

            &:after {
                width: 10rem;
            }
        `}
    `}
`;
export const X = {
    variant: S,
    bgColor: "background",
    fullWidth: true,
};
export default X;
