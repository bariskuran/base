import styled, { css, keyframes } from "styled-components";

const open = keyframes`
    from {
        transform: translateY(-20rem);
        clip-path: inset(0 0 100% 0);
    }
    to {
        transform: translateY(0);
        clip-path: inset(0 0 0 0);
    }
`;

const close = keyframes`
    from {
        transform: translateY(0);
        clip-path: inset(0 0 0 0);
    }
    to {
        transform: translateY(-20rem);
        clip-path: inset(0 0 100% 0);
    }
`;

export const S = {
    container: styled.div`
        --layout-header-extended-height: ${({ $extendedHeight }) => $extendedHeight}rem;
        --layout-header-condensed-height: ${({ $condensedHeight }) => $condensedHeight}rem;
        width: 100%;
        min-height: 100%;
    `,
    pageContent: styled.div`
        position: relative;
        width: 100%;
        min-height: 100vh;
    `,
    main: styled.main`
        width: 100%;
        min-height: 100vh;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
    `,
    menuArea: styled.div`
        position: absolute;
        inset: 0 0 auto 0;
        z-index: 3;
        width: 100%;
        min-height: 100vh;
        padding: 100rem;
        padding-top: calc(var(--layout-header-extended-height) + 75rem);
        box-sizing: border-box;
        background-color: ${({ theme }) => theme.backgrounds?.shade15 || theme.background};
        animation: ${open} 0.5s ease both;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);

        ${({ theme }) =>
            theme.responsive(
                "phone",
                css`
                    /* Phone: the menu is a full screen surface that scrolls its own
                       content, so no dead band is ever left at the bottom. */
                    position: fixed;
                    inset: 0;
                    min-height: 0;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    -webkit-overflow-scrolling: touch;
                    padding: 25rem;
                    padding-top: calc(var(--layout-header-extended-height) + 25rem);
                `,
            )};

        ${({ $closing }) =>
            $closing &&
            css`
                animation-name: ${close};
            `}
    `,
    footerBoundary: styled.div`
        position: relative;
        z-index: 5;
        isolation: isolate;
        width: 100%;
    `,
};
