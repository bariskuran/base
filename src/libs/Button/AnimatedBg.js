import styled, { css } from "styled-components";

const S = styled.span`
    ${({
        // theme,
        $isHovered,
        // $disabled,
        $isActivated,
        // $isPending,
        $isJustIcon,
        $resolvedBg,
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
        overflow: hidden;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background: ${$resolvedBg};
            transition: all 0.25s;
        }

        ${($isHovered || $isActivated) &&
        css`
            transition: none;

            &::before {
                width: 100%;
            }
        `}

        & > [data-slot="label"] {
            ${!$isJustIcon &&
            css`
                min-width: 75rem;
            `}
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 12rem;
            padding: 6rem 10rem;
        }
    `}
`;
export const X = {
    variant: S,
    alphaRate: 15,
};
export default X;
