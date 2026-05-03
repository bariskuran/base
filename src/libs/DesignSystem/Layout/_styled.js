import styled, { css } from "styled-components";

export const S = {
    container: styled.div`
        width: 100%;
        display: flex;
        align-items: flex-start;

        ${({ theme }) => css`
            background-color: ${theme.background};
            color: ${theme.foreground};
        `}
    `,
    navigation: styled.div`
        box-sizing: border-box;
        position: sticky;
        top: 0;
        align-self: flex-start;
        flex: 0 0 300rem;
        min-height: 100vh;
        max-height: 100vh;
        min-height: 100dvh;
        max-height: 100dvh;
    `,
};
