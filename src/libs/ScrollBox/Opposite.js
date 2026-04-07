import styled, { css } from "styled-components";

export const S = styled.div`
    ${({
        // theme,
        $maxHeight,
        $disableBoxShadow,
        $isOverflowing,
        $fullWidth,
    }) => css`
        all: unset;
        display: block;
        position: relative;
        overflow: auto;
        min-height: 0;
        /* padding-right: 20rem; */

        ${$fullWidth &&
        css`
            width: 100%;
            padding-right: 0;
        `}

        ${$maxHeight &&
        css`
            max-height: ${$maxHeight}rem;
        `}

        box-shadow: ${!$isOverflowing || $disableBoxShadow
            ? "none"
            : "2rem 2rem 5rem 2rem rgba(0, 0, 0, 0.2)"};
    `}
`;
export const X = {
    variant: S,
};
export default X;
