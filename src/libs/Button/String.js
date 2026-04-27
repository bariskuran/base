import styled, { css } from "styled-components";

const S = styled.div`
    ${({ theme, $isHovered, $isActivated }) => css`
        all: unset;
        width: max-content;
        display: inline-flex;
        cursor: pointer;
        transition: all 0.5s;
        position: relative;
        margin: 0 3rem;

        &::before,
        &::after {
            content: "";
            position: absolute;
            bottom: 0rem;
            left: 0;
            width: 100%;
            height: 3rem;
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
            transition: all 0.5s;
        }

        & > [data-slot="prefix"],
        & > [data-slot="suffix"] {
            display: flex;
            justify-content: center;
            align-items: center;
            width: max-content;
            transition: all 0.5s;
        }

        ${($isHovered || $isActivated) &&
        css`
            &::after {
                left: 0;
                width: 100%;
            }
        `}

        ${$isActivated &&
        css`
            pointer-events: none;

            &::after {
                background: ${theme.foreground};
                left: 0;
                width: 100%;
                height: 2rem;
            }
        `}
    `}
`;

const X = {
    variant: S,
    bgColor: "transparent",
    color: "foreground",
    hoverBgColor: "transparent",
    activeBgColor: "transparent",
};
export default X;
