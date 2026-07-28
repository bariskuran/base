import styled from "styled-components";

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
    `,
    logoArea: styled.div`
        flex: 0 0 250rem;
        min-width: 0;
    `,
    linksArea: styled.div`
        flex: 1 1 0;
        min-width: 0;
        margin-top: 100rem;
        padding-bottom: 75rem;
    `,
    creditArea: styled.div`
        flex: 1 1 0;
        min-width: 0;
        align-self: flex-end;
    `,
};
