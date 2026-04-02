import styled, { css } from "styled-components";

export const DefaultVariant = styled.div`
    ${({ theme, $maxHeight, $disableBoxShadow, $isOverflowing, $fullWidth }) => css`
        all: unset;
        display: block;
        position: relative;
        overflow: auto;
        min-height: 0;

        ${$fullWidth &&
        css`
            width: 100%;
        `}

        ${$maxHeight &&
        css`
            max-height: ${$maxHeight}rem;
        `}

        box-shadow: ${!$isOverflowing || $disableBoxShadow
            ? "none"
            : "2rem 2rem 5rem 2rem rgba(0, 0, 0, 0.2)"};

        /* scrollbar-width: thin;
        scrollbar-color: ${theme.primary} ${theme.colorAlpha(theme.primary, 0.1)};
        scrollbar-gutter: stable;
        overscroll-behavior: contain;

        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        &::-webkit-scrollbar-thumb {
            background: ${theme.foreground};
            border-radius: 999rem;
        }

        &::-webkit-scrollbar-track {
            background: ${theme.colorAlpha(theme.foreground, 0.08)};
            border-radius: 999rem;
        } */
    `}
`;
