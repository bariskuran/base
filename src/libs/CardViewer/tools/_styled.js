import styled, { css } from "styled-components";

const toCssSize = (value, fallback) => {
    if (value == null || value === "") return fallback;
    return typeof value === "number" ? `${value}rem` : value;
};

const normalizeAlignX = (alignX) => {
    if (alignX === "start" || alignX === "left") return "start";
    if (alignX === "end" || alignX === "right") return "end";
    return "center";
};

const Wrapper = styled.div`
    width: 100%;
    min-width: 0;
`;

const Grid = styled.div`
    ${({ $gap, $minColumnWidth, $alignX }) => {
        const columnWidth = toCssSize($minColumnWidth, "280rem");
        const gap = toCssSize($gap, "20rem");
        const justifyContent = normalizeAlignX($alignX);

        return css`
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, ${columnWidth}), ${columnWidth}));
            gap: ${gap};
            width: 100%;
            align-items: stretch;
            justify-content: ${justifyContent};

            & > * {
                height: 100%;
                max-width: 100%;
            }
        `;
    }}
`;

const Masonry = styled.div`
    column-width: ${({ $minColumnWidth }) => toCssSize($minColumnWidth, "280rem")};
    column-gap: ${({ $gap }) => toCssSize($gap, "20rem")};
    width: 100%;

    & > * {
        display: block;
        break-inside: avoid;
        margin-bottom: ${({ $gap }) => toCssSize($gap, "20rem")};
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

export { normalizeAlignX };
