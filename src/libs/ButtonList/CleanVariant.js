import styled, { css } from "styled-components";

/** Üst sarmalayıcı; düzen Flex + ScrollBar içinde. */
export const CleanVariant = styled.div`
    ${() => css`
        all: unset;
        display: block;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        min-width: 0;
        min-height: 0;
    `}
`;
