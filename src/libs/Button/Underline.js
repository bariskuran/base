import styled, { css } from "styled-components";

const S = styled.span`
    ${({ theme, $isHovered, $isActivated, $isJustIcon, $fullWidth }) => css`
        all: unset;
        display: flex;
        transition: all 0.5s;
        width: ${$fullWidth ? "100%" : "auto"};

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
            ${!$isJustIcon &&
            css`
                min-width: 75rem;
            `}

            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            padding: 6rem 20rem;
            letter-spacing: 0.5rem;
            font-weight: 600;
            font-size: 12rem;
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
    hoverBgColor: "backgrounds.shade5",
    color: "foreground",
    activeBgColor: "transparent",
};
export default X;
