import styled, { keyframes } from "styled-components";

const animation = keyframes`
    0% {
        width: 0%;
        opacity: 1;
    }
    80% {
        width: 100%;
        opacity: 0;
    }
    100% {
        width: 100%;
        opacity: 0;
    }
`;

export const Container = styled.div`
    width: 100%;
    height: 100%;
    /* background: ${(p) => p.theme.background || "#000"}; */
    position: fixed;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const TextAnimation = styled.div`
    color: ${(p) => p.theme.background || "#fff"};
    text-transform: uppercase;
    font-size: 15rem;
    font-weight: 500;
    letter-spacing: 10rem;

    &::before {
        content: "";
        height: 2rem;
        background: ${(p) => p.theme.background || "#fff"};
        animation: ${animation} 1000ms infinite;
        position: absolute;
        top: -5rem;
        left: 0;
    }
    &::after {
        content: "";
        height: 2rem;
        background: ${(p) => p.theme.background || "#fff"};
        animation: ${animation} 1000ms infinite;
        position: absolute;
        bottom: -5rem;
        right: 0;
    }
`;
