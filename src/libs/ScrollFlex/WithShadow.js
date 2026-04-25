import styled, { css } from "styled-components";

export const S = styled.div`
    ${({ theme, $disableShadow }) => css`
        all: unset;
        display: block;
        position: relative;
        overflow: auto;
        min-height: 0;
        padding: 10rem;

        ${!$disableShadow &&
        css`
            ${theme.get3DShadow({ depth: 5, hoverDepth: 1 })}
        `}
    `}
`;
export const X = {
    variant: S,
};
export default X;
