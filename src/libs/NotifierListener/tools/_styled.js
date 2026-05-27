import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${({ $isEmpty }) => css`
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 300rem;
            height: ${$isEmpty ? 0 : "100vh"};
            position: fixed;
            top: 0;
            right: 0;
            z-index: 9999999;
            padding: ${$isEmpty ? 0 : "10rem"};
            box-sizing: border-box;
            pointer-events: none;
            overflow: hidden;
            transition:
                height 0.2s ease,
                padding 0.2s ease;
        `}
    `,

    itemShell: styled.div`
        ${({ $height, $isEntered, $isClosing, $closingDelay }) => css`
            all: unset;
            display: block;
            overflow: hidden;
            width: 100%;
            box-sizing: border-box;
            pointer-events: auto;

            max-height: ${$isEntered && !$isClosing ? `${$height}px` : 0};
            opacity: ${$isEntered && !$isClosing ? 1 : 0};
            transform: translateY(${$isEntered && !$isClosing ? "0" : "-12rem"});
            margin-bottom: ${$isEntered && !$isClosing ? "10rem" : 0};

            transition:
                max-height ${$closingDelay}ms ease,
                opacity ${$closingDelay}ms ease,
                transform ${$closingDelay}ms ease,
                margin-bottom ${$closingDelay}ms ease;
        `}
    `,
    itemInner: styled.div`
        display: block;
        width: 100%;
        box-sizing: border-box;
        padding-bottom: 5rem;
        padding-right: 5rem;
    `,
};

export default S;
