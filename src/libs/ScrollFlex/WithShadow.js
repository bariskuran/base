import styled, { css } from "styled-components";
import { Flex } from "../Flex";

export const S = styled(Flex)`
    ${({ $disableShadow }) => css`
        overflow: auto;

        ${!$disableShadow &&
        css`
            box-shadow:
                15px 15px 10px -12px rgba(0, 0, 0, 0.2),
                2px 2px 7px -3px rgba(0, 0, 0, 0.5);
        `}
    `}
`;
export const X = {
    variant: S,
};
export default X;
