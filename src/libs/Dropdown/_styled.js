import styled from "styled-components";

const S = {
    container: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10rem;
    `,
    select: styled.select`
        width: 100%;
        min-height: 34rem;
        border: 1px solid ${({ theme }) => theme.colorAlpha(theme.foreground, 0.25)};
        border-radius: 6rem;
        padding: 6rem 10rem;
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.foreground};
    `,
    helper: styled.span`
        font-size: 12rem;
        opacity: 0.7;
    `,
};
export default S;
