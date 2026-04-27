import styled, { css } from "styled-components";
import { Flex } from "../Flex";

export const S = styled(Flex)`
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
