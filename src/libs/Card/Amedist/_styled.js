import styled, { css } from "styled-components";

const Wrapper = styled.article`
    ${({ theme, $isClickable, $isHovered }) => css`
        width: 100%;
        min-width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid ${theme.greys?.shade25};
        box-sizing: border-box;
        background: ${theme.backgrounds.shade10};
        color: ${theme.foreground};
        cursor: ${$isClickable ? "pointer" : "default"};
        outline: 0;
        overflow: hidden;
        transition: all 1s ease;
        position: relative;

        ${$isHovered &&
        css`
            background: ${theme.backgrounds.tint90};
            [data-slot="thumb-image"] {
                transform: scale(1.1);
            }
        `}
    `}
`;

const Thumb = styled.div`
    border-bottom: 0;
    aspect-ratio: 1.55;
    overflow: hidden;

    [data-slot="thumb-image"] {
        width: 100%;
        height: 100%;
        transition: transform 1s ease;
        transform-origin: center;
    }
`;

const Body = styled.div`
    padding: 10rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10rem;
`;

const Title = styled.h3`
    padding: 5rem 15rem;
    margin: 0;
    font-size: 20rem;
    line-height: 1.3;
    font-weight: 400;
    letter-spacing: 0;
`;

const Subtitle = styled.div`
    margin: 0;
    padding: 0 15rem;
    font-size: 13rem;
    line-height: 1.25;
    font-weight: 600;
`;

const Description = styled.p`
    margin: 0;
    padding: 0 15rem;
    line-height: 1.5;
    width: fit-content;
    text-wrap: balance;
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-self: flex-end;
    width: fit-content;
    min-height: 32rem;
    align-items: flex-end;
    margin-top: auto;
    transform-origin: right bottom;
    transition: transform 220ms ease;
`;

const line = styled.div`
    border: 1px solid ${({ theme }) => theme.primary};
    pointer-events: none;
    width: calc(100% - 20rem);
    height: calc(100% - 20rem);
    position: absolute;
    top: 10rem;
    left: 10rem;
    z-index: 2;
`;

export const S = {
    Wrapper,
    Thumb,
    Body,
    Title,
    Subtitle,
    Description,
    Footer,
    line,
};

export default S;
