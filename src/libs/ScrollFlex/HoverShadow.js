import styled, { css } from "styled-components";

export const S = styled.div`
    ${({ theme, $disableShadow }) => css`
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
