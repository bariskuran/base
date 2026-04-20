import styled, { css } from "styled-components";

export const S = {
    container: styled.div`
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: flex-start;
        box-sizing: border-box;
        ${({ theme }) => css`
            background-color: ${theme.background};
            color: ${theme.foreground};
        `}
    `,
    navigation: styled.div`
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        flex: 0 0 300rem;
        margin-bottom: 100rem;
        align-items: flex-end;
        box-sizing: border-box;

        ${({ theme }) => css`
            background-color: ${theme.backgrounds.shade5};
            color: ${theme.foreground};
        `}
    `,
    logoArea: styled.div`
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 10rem 0 20rem 0;
    `,
    content: styled.div`
        display: flex;
        flex-direction: column;
        gap: 10rem;
        padding: 30rem;
    `,
};
