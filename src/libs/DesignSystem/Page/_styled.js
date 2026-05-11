import styled, { css } from "styled-components";

const S = {
    title: styled.div`
        ${({ theme }) => css`
            font-size: 28rem;
            font-weight: 300;
            color: ${theme.greys.shade40};
            flex: 1 1 auto;
            width: max-content;
            padding-right: 30rem;
            border-right: 1px solid ${theme.greys.shade40};
            display: flex;
            align-items: center;
            justify-content: flex-start;
            min-width: 250rem;
            box-sizing: border-box;
            text-wrap: balance;
            white-space: normal;
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
        box-sizing: border-box;
        margin: 50rem 0;
    `,
    row1: styled.div`
        display: flex;
        flex: 0 0 175rem;
        width: 175rem;
        min-width: 175rem;
        box-sizing: border-box;
    `,
    row2: styled.div`
        display: flex;
        flex: 1 1 auto;
        min-width: 0;
        background: ${({ theme }) => theme.greys.shade40};
        height: 1px;
        align-self: center;
        box-sizing: border-box;
    `,
};
export default S;
