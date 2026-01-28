import styled from "styled-components";

export const S = {
    container: styled.div`
        /* width: 100%; */
    `,
    confirmation: styled.div`
        width: 100%;
        display: flex;
        gap: 10rem;
        justify-content: flex-end;
        z-index: 2;
    `,
    but: styled.div`
        text-decoration: underline;
    `,
    overlay: styled.div`
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.background};
        opacity: 0.8;
    `,
};
