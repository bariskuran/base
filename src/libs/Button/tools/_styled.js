import styled, { css } from "styled-components";
import { DEFAULT_VARIANT_LIFT_REM } from "../DefaultVariant.js";

export const S = {
    LabelStack: styled.span`
        position: relative;
        display: inline-grid;
        place-items: center;
        width: unset;
        vertical-align: middle;
    `,
    LabelLayer: styled.span`
        grid-area: 1 / 1;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        transition: opacity 0.25s;
        opacity: ${({ $visible }) => ($visible ? 1 : 0)};
        width: unset;
    `,
    icon: styled.span`
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
    ScaleDiv: styled.span`
        position: relative;
        display: inline-flex;
        vertical-align: middle;
        width: fit-content;
        max-width: 100%;
        cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
        ${({ $font }) => $font}

        ${({ $useLiftHitSlop, $isHovered, $isActivated }) =>
            $useLiftHitSlop &&
            $isHovered &&
            !$isActivated &&
            css`
                padding-top: ${DEFAULT_VARIANT_LIFT_REM}rem;
                margin-top: -${DEFAULT_VARIANT_LIFT_REM}rem;
            `}

        ${({ $useLiftHitSlop, $isActivated }) =>
            $useLiftHitSlop &&
            $isActivated &&
            css`
                padding-bottom: ${DEFAULT_VARIANT_LIFT_REM}rem;
                margin-bottom: -${DEFAULT_VARIANT_LIFT_REM}rem;
            `}

        ${({ $size }) =>
            $size &&
            css`
                transform: scale(${$size}%);
            `}

        ${({ $fullWidth }) =>
            $fullWidth &&
            css`
                display: flex !important;
                box-sizing: border-box;
                width: 100% !important;
                max-width: 100%;
                min-width: 0;
                align-self: stretch;
            `}

        ${({ $isMatch }) =>
            $isMatch &&
            css`
                pointer-events: none;
            `}
    `,
};
