import styled, { css } from "styled-components";

export const S = {};

S.palette = styled.div`
    display: flex;
    flex-direction: column;
    gap: 28rem;
    width: 100%;
`;

S.group = styled.section`
    display: grid;
    grid-template-columns: minmax(120rem, 180rem) minmax(0, 1fr);
    gap: 18rem;
    align-items: start;
`;

S.groupTitle = styled.div`
    ${({ theme }) => css`
        color: ${theme.foreground};
        font-size: 18rem;
        line-height: 1.2;
        padding-top: 2rem;
    `}
`;

S.swatches = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(46rem, 1fr));
    gap: 10rem;
    min-width: 0;
`;

S.swatchButton = styled.button`
    ${({ theme, $color }) => css`
        all: unset;
        box-sizing: border-box;
        aspect-ratio: 1;
        min-width: 0;
        width: 100%;
        cursor: pointer;
        background: ${$color};
        border: 1px solid ${theme.colorAlpha(theme.foreground, 0.22)};
        box-shadow: 0 1rem 3rem ${theme.colorAlpha(theme.foreground, 0.12)};
        transition:
            transform 0.16s ease,
            box-shadow 0.16s ease,
            border-color 0.16s ease;

        &:hover {
            transform: translateY(-2rem);
            border-color: ${theme.primary};
            box-shadow: 0 5rem 16rem ${theme.colorAlpha(theme.foreground, 0.18)};
        }

        &:focus-visible {
            outline: 2rem solid ${theme.primary};
            outline-offset: 2rem;
        }
    `}
`;
