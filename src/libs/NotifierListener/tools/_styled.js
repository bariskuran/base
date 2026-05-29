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
};

export default S;
