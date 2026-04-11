import styled, { css } from "styled-components";

export const CleanVariant = styled.div`
    ${({
        $direction,
        $gap,
        // $colors
    }) => css`
        all: unset;
        display: flex;
        flex-direction: ${$direction};
        gap: ${$gap + "rem"};
    `}
`;
