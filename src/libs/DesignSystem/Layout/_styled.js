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
        min-height: 100vh;
        max-height: 100vh;
        flex: 0 0 300rem;
        margin-bottom: 100rem;
    `,
    navigationContent: styled.div`
        width: 300rem;
        max-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-right: 10px;
        position: fixed;
        top: 0;
        left: 0;
        padding-bottom: 75rem;
    `,
    logoArea: styled.div`
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 10rem 0 20rem 0;
    `,
    content: styled.div`
        width: 100%;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: 10rem;
        padding: 30rem;
    `,
};
