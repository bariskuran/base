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
            justify-content: flex-start;
            align-items: stretch;
            width: 320rem;
            height: ${$isEmpty ? 0 : "100vh"};
            min-height: 0;
            opacity: ${$isEmpty ? 0 : 1};
            pointer-events: ${$isEmpty ? "none" : "auto"};
            position: fixed;
            top: 0;
            right: 0;
            z-index: 9999999;
            box-sizing: border-box;
            padding-right: 6rem;
        `}
    `,
    /** ScrollFlex yukseklik zinciri: flex cocuk min-height 0 */
    scrollArea: styled.div`
        ${() => css`
            flex: 1 1 auto;
            min-height: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
        `}
    `,
};
export default S;
