import styled, { css } from "styled-components";

export const S = {
    LabelStack: styled.div`
        position: relative;
        display: grid;
        place-items: center;
        width: unset;
        vertical-align: middle;
    `,
    LabelLayer: styled.div`
        grid-area: 1 / 1;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        transition: opacity 0.25s;
        opacity: ${({ $visible }) => ($visible ? 1 : 0)};
        width: unset;

        /* ${({ $isJustIcon }) =>
            $isJustIcon &&
            css`
                min-width: 75rem;
            `} */
    `,
    icon: styled.div`
        ${({ $areaName }) => css`
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.5s;

            ${$areaName === "prefix" &&
            css`
                padding: 8rem;
                padding-right: 0;
            `}

            ${$areaName === "suffix" &&
            css`
                padding: 8rem;
                padding-left: 0;
            `}

            ${$areaName === "centeredIcon" &&
            css`
                padding: 8rem;
            `}
        `}
    `,
    ScaleDiv: styled.div`
        position: relative;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;

        ${({ $size }) =>
            $size &&
            css`
                transform: scale(${$size}%);
            `}

        ${({ $fullWidth }) =>
            $fullWidth &&
            css`
                width: 100% !important;
            `}

        ${({ $isMatch }) =>
            $isMatch &&
            css`
                pointer-events: none;
            `}
    `,
};
