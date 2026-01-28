import styled, { css } from "styled-components";

export const S = {
    container: styled.div`
        ${({ theme }) => css`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 10rem;
            justify-content: center;
            align-items: center;
            z-index: 2;
            background: ${theme.colorAlpha(theme.background, 80)};
            cursor: default;
            padding: 10%;
        `}
    `,
    image: styled.img`
        max-width: 80vw;
        max-height: 80vh;
        width: auto;
        height: auto;
        object-fit: contain;
        aspect-ratio: auto;
    `,
    imageArea: styled.div`
        width: 80vw;
        height: 80vh;
        background: ${({ theme }) => theme.greyB7};
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    sizeArea: styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1 1 auto;
    `,
};
