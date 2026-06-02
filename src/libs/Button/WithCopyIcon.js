import styled, { css } from "styled-components";

const S = styled.span`
    ${() => {
        return css`
            all: unset;
            display: flex;
            transition: all 0.2s linear;
            overflow: hidden;

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
