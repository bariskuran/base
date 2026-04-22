import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${({ theme }) => css`
            width: 100%;
            display: grid;
            grid-template-columns: 10px 1fr 1fr 4fr 1fr;

            & > div {
                padding: 5rem;
            }

            & > *:nth-child(10n + 1),
            & > *:nth-child(10n + 2),
            & > *:nth-child(10n + 3),
            & > *:nth-child(10n + 4),
            & > *:nth-child(10n + 5) {
                background: ${theme.colorAlpha(theme.foreground, 0.04)};
            }
        `}
    `,
};
export default S;
