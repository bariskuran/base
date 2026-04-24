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
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        height: 100%;
        flex: 0 0 300rem;
        margin-bottom: 100rem;
        align-items: flex-end;
        border-right: 1px solid ${({ theme }) => theme.greys.shade40};
    `,
    logoArea: styled.div`
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 10rem 0 20rem 0;
    `,
    content: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10rem;
        padding: 30rem;
    `,
};
