import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${({ theme }) => css`
            display: flex;
            align-items: stretch;
            min-height: 100rem;
        `}
    `,
    titleArea: styled.div`
        max-width: 150rem;
        padding: 10rem;
        padding-top: 30rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
    `,
    line: styled.div`
        background: ${({ theme }) => theme.greys.shade40};
        min-height: 100rem;
        width: 1px;
        min-width: 1px;
        align-self: stretch;
    `,

    ajaxArea: styled.div`
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
    `,
    contentArea: styled.div`
        /* border-bottom: 1px solid ${({ theme }) => theme.greys.shade40}; */
        background-color: ${({ theme }) => theme.backgrounds.tint30};
        border-radius: 0 20rem 20rem 0;
        padding: 20rem;
        align-self: center;
        display: flex;
        flex-direction: column;
        gap: 15rem;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 20rem;

        & > div {
            width: 100%;
            align-items: center;
            justify-content: flex-start;
        }
    `,
};
export default S;
