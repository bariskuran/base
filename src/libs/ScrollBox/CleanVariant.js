import styled, { css } from "styled-components";

export const CleanVariant = styled.div`
    ${() =>
        // {
        // theme,
        // $maxHeight,
        // $maxWidth,
        // $disableBoxShadow,
        // $isOverflowing,
        // $isOverflowingY,
        // $isOverflowingX,
        // $fullWidth,
        // }
        css`
            all: unset;
            display: block;
            position: relative;
            overflow: auto;
            min-height: 0;
            padding: 5rem;
        `}
`;
