import styled, { css } from "styled-components";

const S = styled.div`
    ${({ theme, $isHovered }) => css`
        all: unset;
        display: flex;
        cursor: pointer;
        transition: all 0.5s;
        position: relative;
        margin: 0 5rem;

        &::before,
        &::after {
            content: "";
            position: absolute;
            bottom: 1rem;
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

        ${$isHovered &&
        css`
            &::after {
                left: 0;
                width: 100%;
            }
        `}

        &:active {
            transform: scale(0.8);
        }
    `}
`;

const X = {
    variant: S,
    bgColor: "background",
};
export default X;
