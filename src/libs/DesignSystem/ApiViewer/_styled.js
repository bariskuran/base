import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${() => css`
            width: 100%;
            display: flex;
            flex-direction: column;
        `}
    `,

    row: styled.div`
        ${({ theme, $striped }) => css`
            display: grid;
            grid-template-columns: 10px 3fr 1fr 5fr 2fr;
            width: 100%;
            min-width: 0;
            align-items: center;

            ${$striped &&
            css`
                background: ${theme.colorAlpha(theme.foreground, 0.04)};
            `}

            & > * {
                width: 100%;
                min-width: 0;
                padding: 5rem;
            }

            & > *:nth-child(2) {
                user-select: none;
                cursor: pointer;
            }
        `}
    `,
};
export default S;
