import styled, { css, keyframes } from "styled-components";

const enter = keyframes`
    from {
        transform: translateY(-20rem);
    }
    to {
        transform: none;
    }
`;

const S = {
    container: styled.div`
        position: fixed;
        top: 0;
        right: 0;
        width: 300rem;
        height: 100vh;
        z-index: 2147483000;
        padding: 10rem;
        box-sizing: border-box;
        pointer-events: none;
        overflow: visible;
        background: transparent;

        [aria-label="ScrollFlex container"],
        [aria-label="ScrollFlex shell"],
        [aria-label="ScrollFlex content"] {
            pointer-events: none;
        }
    `,

    slot: styled.div`
        width: 100%;
        pointer-events: auto;
        margin-bottom: 10rem;
        background: transparent;

        &:last-child {
            margin-bottom: 0;
        }
    `,

    collapse: styled.div`
        width: 100%;
        overflow: hidden;
    `,

    shell: styled.div`
        ${({ theme }) => css`
            width: 100%;
            pointer-events: none;
            border-radius: 0 0 10px 10px;
            filter: drop-shadow(0 2px 2px ${theme.colorAlpha(theme.foreground, 0.5)});
        `}
    `,

    slotInner: styled.div`
        width: 100%;
        ${({ $entered, $openingMs }) =>
            !$entered &&
            css`
                animation: ${enter} ${$openingMs}ms ease forwards;
            `}

        ${({ $entered }) =>
            $entered &&
            css`
                transform: none;
            `}
    `,
};

export default S;
