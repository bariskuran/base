import styled, { css } from "styled-components";

const S = {
    title: styled.div`
        ${({ theme }) => css`
            font-size: 28rem;
            font-weight: 300;
            color: ${theme.greys.shade40};
            flex: 0 0 max-content;
            width: max-content;
            padding-right: 30rem;
            min-height: 100rem;
            border-right: 1px solid ${theme.greys.shade40};
            display: flex;
            align-items: center;
            justify-content: flex-start;
            min-width: 200rem;
        `}
    `,
    headerContent: styled.div`
        flex: 1 1 auto;
        padding-left: 30rem;
        display: flex;
        flex-direction: column;
        min-height: 100rem;
        align-items: flex-start;
        justify-content: center;
    `,
    row1: styled.div`
        display: flex;
        flex: 0 0 150rem;
    `,
    row2: styled.div`
        display: flex;
        background: ${({ theme }) => theme.greys.shade40};
        height: 1px;
    `,
};
export default S;
