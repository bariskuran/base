import styled, { css } from "styled-components";

export const S = {
    container: styled.footer`
        width: 100%;
        min-height: ${({ $minHeight }) => $minHeight};
        box-sizing: border-box;
        padding: 50rem;

        display: flex;
        gap: 20rem;

        border-top: 1px solid ${({ theme }) => theme.colorAlpha(theme.foreground, 0.5)};

        background: ${({ theme }) => theme.background};
        ${({ theme }) =>
            theme.responsive(
                "phone",
                css`
                    flex-direction: column;
                    min-height: 100vh;
                    padding: 40rem 25px;
                    gap: 35rem;
                `,
            )};
    `,
    logoArea: styled.div`
        flex: 0 0 250rem;
        min-width: 0;
        ${({ theme }) =>
            theme.responsive(
                "phone",
                css`
                    flex: 0 0 auto;
                    width: 100%;
                    margin-top: 0;
                    padding-bottom: 0;
                    align-self: stretch;
                `,
            )};
    `,
    linksArea: styled.div`
        flex: 1 1 0;
        min-width: 0;
        margin-top: 100rem;
        padding-bottom: 75rem;
        ${({ theme }) =>
            theme.responsive(
                "phone",
                css`
                    flex: 0 0 auto;
                    width: 100%;
                    margin-top: 0;
                    padding-bottom: 0;
                    align-self: stretch;
                `,
            )};
    `,
    creditArea: styled.div`
        flex: 1 1 0;
        min-width: 0;
        align-self: flex-end;
        ${({ theme }) =>
            theme.responsive(
                "phone",
                css`
                    flex: 0 0 auto;
                    width: 100%;
                    margin-top: auto;
                    padding-bottom: 0;
                    align-self: stretch;
                `,
            )};
    `,
};
