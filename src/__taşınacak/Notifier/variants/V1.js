import styled from "styled-components";

export const V1 = {
    container: styled.div`
        width: max-content;
        min-width: 300rem;
        padding: 15rem;
        background: ${({ $status, theme }) =>
            $status === "success"
                ? theme.success
                : $status === "error"
                  ? theme.error
                  : theme.warning};
        color: ${({ $fg }) => $fg};
        display: flex;
        gap: 5rem;
        box-shadow: 2rem 2rem 1rem 1rem ${({ theme }) => theme.colorAlpha("#000000", 30)};
    `,
    iconArea: styled.div`
        flex: 0 0 30rem;
        display: flex;
        gap: 5rem;
        align-items: flex-start;
        margin-top: 8rem;
    `,
    content: styled.div`
        flex: 1 1 auto;
        margin-top: 2rem;
    `,
    closeArea: styled.div`
        flex: 0 0 20rem;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        height: 30rem;
        cursor: pointer;
    `,
    title: styled.div`
        flex: 1 1 auto;
        font-weight: 600;
        font-size: 18rem;
    `,
    buttonArea: styled.div`
        width: 100%;
        display: flex;
        gap: 10rem;
        margin-left: -10rem;
        margin-top: 20rem;
        padding-right: 20rem;
    `,
    miniButton: styled.div`
        width: max-content;
        min-height: 30rem;
        padding: 5rem 15rem;
        background: transparent;
        border: 1rem solid ${({ theme }) => theme.background};
        cursor: pointer;
        transition: all 0.5s ease-in-out;
        flex-shrink: 0;
        white-space: nowrap;

        &:hover {
            background: ${({ theme }) => theme.colorAlpha(theme.background, 20)};
        }
    `,
};
