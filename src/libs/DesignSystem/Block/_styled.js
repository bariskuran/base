import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        display: flex;
        align-items: stretch;
        min-height: 100rem;
        width: 100%;

        ${({ $lastBlock }) =>
            $lastBlock &&
            css`
                margin-bottom: 100rem;
            `}
    `,
    titleArea: styled.div`
        max-width: 175rem;
        min-width: 175rem;
        box-sizing: border-box;
        padding: 10rem;
        padding-top: 30rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
    `,
    line: styled.div`
        position: relative;
        background: ${({ theme }) => theme.greys.shade40};
        min-height: 100rem;
        width: 1px;
        min-width: 1px;
        align-self: stretch;
        z-index: 2;

        ${({ $lastBlock }) =>
            $lastBlock &&
            css`
                &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    transform: translate(-50%, 50%);
                    width: 12px;
                    height: 12px;
                    border-radius: 999px;
                    background: ${({ theme }) => theme.greys.shade40};
                }
            `}
    `,

    mainColumn: styled.div`
        flex: 1 1 0%;
        min-width: 0;
        display: flex;
        flex-direction: column;
    `,
    ajaxArea: styled.div`
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        gap: 5rem;
    `,
    contentArea: styled.div`
        width: 100%;
        min-width: 0;
        background-color: ${({ theme }) => theme.backgrounds.tint30};
        border-radius: 0 20rem 20rem 0;
        padding: 20rem;
        align-self: stretch;
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
