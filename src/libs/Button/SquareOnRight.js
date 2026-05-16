import styled, { css } from "styled-components";

const S = styled.span`
    ${({ theme, $isHovered, $isActivated, $fullWidth }) => css`
        all: unset;
        display: flex;
        transition: all 0.5s;
        position: relative;
        width: ${$fullWidth ? "100%" : "auto"} !important;
        box-sizing: border-box;

        & > [data-slot="label"] {
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 14rem;
            transition: padding 0.5s;
            padding: 4rem 12rem;
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

        &:after {
            content: "";
            width: 0;
            height: 33rem;
            background: ${theme.greys.shade50};
            transition: all 0.5s;
        }

        ${$isHovered &&
        css`
            background: ${theme.colorAlpha(theme.primary, 0.3)} !important;
        `}

        ${$isActivated &&
        css`
            background: ${theme.colorAlpha(theme.primary, 0.1)} !important;

            & > [data-slot="label"] {
                padding: 4rem 10rem;
                font-weight: 600;
            }

            &:after {
                background: ${theme.primary};
                width: 10px;
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
