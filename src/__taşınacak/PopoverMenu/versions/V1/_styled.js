import styled, { css } from "styled-components";

const hover = css`
    /* transform: scale(1.1); */
    /* background: ${({ theme }) => theme.primary}; */

    &::before {
        height: 100%;
    }
`;

export const S = {
    container: styled.div`
        ${({ $isOpen, $isDisabled }) => css`
            width: 100%;
            height: 100%;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 250ms ease-in-out;
            cursor: pointer;
            padding: 5rem;
            user-select: none;

            ${$isDisabled &&
            css`
                opacity: 0.5;
                pointer-events: none;
                filter: blur(2px);
            `}

            &::before {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0%;
                background: ${({ theme }) => theme.primary};
                transition: all 250ms ease-in-out 250ms;
                z-index: -1;
            }

            &:hover {
                ${hover}
            }
            ${$isOpen && hover}
        `}
    `,
};
