import styled, { css } from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    min-width: 0;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(
            min(
                100%,
                ${({ $minColumnWidth }) =>
                    typeof $minColumnWidth === "number"
                        ? `${$minColumnWidth}rem`
                        : $minColumnWidth || "280rem"}
            ),
            1fr
        )
    );
    gap: ${({ $gap }) => (typeof $gap === "number" ? `${$gap}rem` : $gap || "20rem")};
    width: 100%;
    align-items: stretch;

    & > * {
        height: 100%;
    }
`;

const Masonry = styled.div`
    column-width: ${({ $minColumnWidth }) =>
        typeof $minColumnWidth === "number" ? `${$minColumnWidth}rem` : $minColumnWidth || "280rem"};
    column-gap: ${({ $gap }) => (typeof $gap === "number" ? `${$gap}rem` : $gap || "20rem")};
    width: 100%;

    & > * {
        display: block;
        break-inside: avoid;
        margin-bottom: ${({ $gap }) => (typeof $gap === "number" ? `${$gap}rem` : $gap || "20rem")};
    }
`;

const Empty = styled.div`
    ${({ theme }) => css`
        width: 100%;
        color: ${theme.text?.muted || theme.greys?.shade600 || theme.foreground};
        padding: 24rem 0;
        font-size: 15rem;
        line-height: 1.4;
    `}
`;

const Actions = styled.div`
    display: flex;
    gap: 10rem;
    align-items: center;
    justify-content: center;
    padding-top: 20rem;
`;

export const S = {
    Wrapper,
    Grid,
    Masonry,
    Empty,
    Actions,
};
