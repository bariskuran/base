import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({ $direction, $gap, $colors }) => css`
        all: unset;
        display: flex;
        flex-direction: ${$direction};
        gap: ${$gap + "rem"};
        background: ${$colors.color};
        color: ${$colors.opposite};
    `}
`;
