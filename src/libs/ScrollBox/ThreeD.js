import styled, { css } from "styled-components";

export const S = styled.div`
    ${({
        theme,
        $maxHeight,
        $disableShadow,
        // $isOverflowing,
        // $fullWidth,
    }) => css`
        all: unset;
        display: block;
        position: relative;
        overflow: auto;
        min-height: 0;
        padding: 10rem;
        position: relative;

        ${!$disableShadow &&
        css`
            ${theme.get3DShadow({ depth: 5, hoverDepth: 1 })}
        `}

        ${$maxHeight &&
        css`
            max-height: ${$maxHeight}rem;
        `}
    `}
`;
export const X = {
    variant: S,
};
export default X;
