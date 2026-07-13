import styled, { css } from "styled-components";

const S = styled.span`
    ${({ theme, $isHovered, $isActivated }) => css`
        all: unset;
        display: flex;
        position: relative;
        transition: all 0.5s;
        overflow: visible;
        text-transform: uppercase;
        font-weight: 600;
        font-size: 90%;
        align-items: center;
        gap: 10rem;
        line-height: 1.2;

        &::before {
            content: "";
            position: absolute;
            bottom: -3rem;
            right: 0;
            width: 0%;
            height: 2px;
            background: ${theme.primary};
            transition: all 0.25s;
        }

        ${$isHovered &&
        css`
            &::before {
                width: 100%;
            }
        `}
        ${$isActivated &&
        css`
            &::before {
                width: 100%;
            }
        `}
    `}
`;
export const X = {
    variant: S,

    bgColor: "transparent",
    hoverBgColor: "transparent",
    activeBgColor: "transparent",
    color: "foreground",
};
export default X;
