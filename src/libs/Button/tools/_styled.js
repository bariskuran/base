import styled, { css } from "styled-components";

export const S = {
    LabelStack: styled.div`
        position: relative;
        display: inline-grid;
        place-items: center;
    `,
    LabelLayer: styled.div`
        grid-area: 1 / 1;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        transition: opacity 0.25s;
        opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    `,
    ScaleDiv: styled.div`
        all: unset;
        transform: scale(${({ $size }) => $size}%);

        ${({ $isMatch }) =>
            $isMatch &&
            css`
                pointer-events: none;
            `}
    `,
};
