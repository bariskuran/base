import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const S = {
    container: styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        height: 100vh;
        padding: 100rem;
        overflow: hidden;

        ${({ theme }) =>
            theme.responsive(
                "phone,tablet",
                css`
                    padding: 20rem;
                `,
            )};
    `,
    code: styled.span`
        position: absolute;
        top: 0;
        left: 0;
        line-height: 0.8;
        font-size: 400rem;
        font-weight: 600;
        opacity: 0.05;
        letter-spacing: -20rem;
        ${({ theme }) =>
            theme.responsive(
                "phone,tablet",
                css`
                    font-size: 200rem;
                `,
            )};
    `,
    title: styled.h1`
        font-size: 20rem;
        font-weight: 600;
        text-transform: uppercase;
        line-height: 1;
    `,
    description: styled.p`
        font-size: 15rem;
        line-height: 1;
    `,
    error: styled.pre`
        margin-top: 16rem;
        opacity: 0.7;
        white-space: pre-wrap;
    `,
    footer: styled.div`
        position: absolute;
        bottom: 0;
        left: 0;
        opacity: 0.5;
        width: 100%;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 5rem 20rem;
    `,
    link: styled(Link)`
        margin-top: 50rem;
        color: inherit;
        font-size: 16rem;
        line-height: 1;
        transition: opacity 0.3s ease;

        &:hover {
            opacity: 1;
        }
        &:active {
            text-decoration: none;
        }

        ${({ theme }) =>
            theme.responsive(
                "phone,tablet",
                css`
                    font-size: 20rem;
                `,
            )};
    `,
    linkArea: styled.div`
        display: flex;
        gap: 10rem;
        justify-content: flex-start;
        align-items: center;
    `,
};
