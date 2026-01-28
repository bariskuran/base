import styled, { css } from "styled-components";

export const V1 = styled.div`
    ${({ $color }) => css`
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 20rem;

        & > #colorBox {
            display: block;
            width: 25rem;
            height: 100%;
            background: ${$color};
        }
        & > #picker {
            opacity: 0;
            width: 1rem;
            height: 100%;
        }
        & > #inputArea {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    `}
`;
