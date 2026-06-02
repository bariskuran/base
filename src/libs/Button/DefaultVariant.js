import styled, { css } from "styled-components";
export const DEFAULT_VARIANT_LIFT_REM = 2;

export const DefaultVariant = styled.span`
    ${({ $isHovered, $isJustIcon, $isActivated }) => css`
        all: unset;
        display: flex;
        transform: translateY(0);
        transition:
            transform 0.2s,
            box-shadow 0.2s,
            background 0.2s ease,
            background-color 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        border-radius: 5rem;
        will-change: transform, box-shadow;

        ${$isHovered &&
        !$isActivated &&
        css`
            transform: translateY(-${DEFAULT_VARIANT_LIFT_REM}rem);
            box-shadow: 0 4px 12rem rgba(0, 0, 0, 0.18);
        `}

        ${$isActivated &&
        css`
            transform: translateY(${DEFAULT_VARIANT_LIFT_REM}rem);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12) inset;
        `}

        & > [data-slot="label"] {
            ${!$isJustIcon &&
            css`
                min-width: 75rem;
            `}

            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6rem 10rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            font-size: 12rem;
            min-height: 20rem;
            min-width: 20rem;
        }


    `}
`;
