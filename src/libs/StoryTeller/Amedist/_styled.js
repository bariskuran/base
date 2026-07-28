import styled, { keyframes } from "styled-components";

const enterForward = keyframes`
    from { opacity: 0; transform: translateX(24rem); }
    to { opacity: 1; transform: translateX(0); }
`;

const enterBackward = keyframes`
    from { opacity: 0; transform: translateX(-24rem); }
    to { opacity: 1; transform: translateX(0); }
`;

const control = styled.div`
    position: absolute;
    z-index: 2;
    pointer-events: auto;
`;

export const S = {
    container: styled.section`
        position: fixed;
        inset: 0;
        z-index: 2;
        isolation: isolate;
        overflow: hidden;
        background: ${({ theme }) => theme.background};
    `,
    slideLayer: styled.div`
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        animation: ${({ $direction }) => ($direction === "backward" ? enterBackward : enterForward)}
            180ms ease both;
    `,
    preloadLayer: styled.div`
        position: absolute;
        inset: 0;
        z-index: 0;
        visibility: hidden;
        pointer-events: none;
        overflow: hidden;
    `,
    controls: styled.div`
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
    `,
    previous: styled(control)`
        top: 0;
        left: 0;

        & > span {
            transform-origin: top left;
        }
    `,
    close: styled(control)`
        top: 0;
        right: 0;
        display: flex;
        gap: 5rem;
    `,
    next: styled(control)`
        right: 0;
        bottom: 0;

        & > span {
            transform-origin: bottom right;
        }
    `,
};
