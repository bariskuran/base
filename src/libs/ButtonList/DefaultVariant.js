import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${() => css`
        box-sizing: border-box;
        position: relative;
        width: fit-content;
        max-width: 100%;
        min-width: 0;
        min-height: 0;
    `}
`;
