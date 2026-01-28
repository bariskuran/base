import styled from "styled-components";

export const V1 = {
    drawerContainer: styled.div``,
    drawerChildren: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10rem;
    `,
    drawerFooter: styled.div`
        margin: 20rem 0;
    `,
    titleArea: styled.div`
        display: flex;
        gap: 10rem;
        cursor: pointer;

        & > svg {
            fill: ${({ theme }) => theme.foreground};
        }
    `,
    textArea: styled.div`
        font-size: 20rem;
        display: flex;
        opacity: 0.7;
        flex-direction: column;

        & > div:nth-child(2) {
            font-size: 12rem;
            line-height: 0;
            font-weight: 600;
            opacity: 0.5;
        }
    `,
};
