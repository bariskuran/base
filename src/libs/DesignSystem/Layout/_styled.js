import styled, { css } from "styled-components";

export const S = {
    container: styled.div`
        width: 100%;
        min-width: 0;
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
    logoArea: styled.div`
        position: sticky;
        top: 25rem;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 25rem;
    `,
    logoArea2: styled.div`
        transform: rotate(-90deg);
        transform-origin: center bottom;
    `,
};
