import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

export const S = {
    row: styled.div`
        ${({ theme, $isDescription }) => css`
            width: 100%;
            max-width: 400rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 10rem;
            background: transparent;
            white-space: nowrap;
            padding-right: 10rem;
            user-select: none;
            font-size: 12rem;

            & > #iconArea {
                flex: 0 0 20rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            ${$isDescription &&
            css`
                display: block;
                white-space: normal;
                border-bottom: 1rem solid ${theme.grey};
                border-top: 1rem solid ${theme.grey};
                color: ${theme.foreground} !important;
                padding: 10rem 0;
                font-size: 13rem !important;
                max-width: 400rem;
                opacity: 1 !important;
                pointer-events: none !important;

                & > p {
                    margin-top: 10rem;
                }
            `}
        `}
    `,
    link: styled(Link)`
        &,
        &:hover,
        &:active,
        &:focus,
        &:visited {
            ${({
                theme,
                // $disabled, $isLoading, $tooltip, isMobile
            }) => css`
                font-size: 12rem;
                width: 100%;
                padding: 0;
                margin: 0;
                background: transparent;
                color: ${theme.foreground};
                position: relative;
                cursor: pointer;
                outline: none;
                box-shadow: none;
                user-select: none;
                box-sizing: border-box;
                border: none;
                text-decoration: none;
                display: flex;
                align-items: center;
            `}
        }
    `,
};
