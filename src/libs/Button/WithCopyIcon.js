import styled, { css } from "styled-components";

const S = styled.div`
    ${({ $isHovered, $isActivated, theme, $hoverColor }) => {
        return css`
            all: unset;
            display: flex;
            transition: all 0.2s linear;
            overflow: hidden;
            /* border-bottom: 1px solid ${theme.greys.shade30}; */

            ${($isHovered || $isActivated) &&
            css`
                /* border-bottom: 1px solid ${$hoverColor}; */
            `}

            & > [data-slot="label"] {
                display: flex;
                align-items: center;
                padding-left: 5rem;
            }
        `;
    }}
`;
export const X = {
    variant: S,
};
export default X;
