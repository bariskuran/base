import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${({
            $isEmpty,
            // $closingDelay
        }) => css`
            all: unset;

            display: flex;
            flex-direction: column;
            gap: 10rem;
            justify-content: flex-start;
            width: 300rem;
            height: ${$isEmpty ? 0 : "100vh"};
            opacity: ${$isEmpty ? 0 : 1};
            pointer-events: ${$isEmpty ? "none" : "auto"};
            position: fixed;
            padding: 10rem;
            top: 0;
            right: 0;
            z-index: 9999999;
            box-sizing: border-box;
        `}
    `,
};
export default S;
