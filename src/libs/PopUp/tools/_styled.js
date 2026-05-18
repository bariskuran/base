import styled, { css } from "styled-components";
import { POPUP_HEADER_BLOCK_REM } from "./defaultPopUpProps";

const S = {
    root: styled.div`
        ${({ $zIndex }) => css`
            position: fixed;
            inset: 0;
            z-index: ${$zIndex};
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            pointer-events: none;
            padding: 25rem;
        `}
    `,
    backdrop: styled.div`
        ${({ theme }) => css`
            position: absolute;
            inset: 0;
            background: ${theme.colorAlpha(theme.foreground, 0.6)};
            pointer-events: auto;
            backdrop-filter: blur(2rem);
        `}
    `,
    dialog: styled.div`
        ${({ theme }) => css`
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            min-width: 0;
            max-width: min(560rem, 100%);
            max-height: min(60vh, 100%);
            box-sizing: border-box;
            border-radius: 8rem;
            background: ${theme.background};
            color: ${theme.foreground};
            box-shadow: 0 6rem 20rem ${theme.colorAlpha(theme.foreground, 0.8)};
            pointer-events: auto;
            overflow: hidden;
        `}
    `,
    body: styled.div`
        ${({ $useScrollFlex }) => css`
            flex: 0 1 auto;
            min-height: 0;
            min-width: 0;
            max-height: calc(min(60vh, 100%) - ${POPUP_HEADER_BLOCK_REM}rem);
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: ${$useScrollFlex ? "hidden" : "auto"};
            ${$useScrollFlex
                ? css`
                      display: flex;
                      flex-direction: column;

                      & > * {
                          flex: 1 1 auto;
                          min-height: 0;
                          width: 100%;
                      }
                  `
                : css`
                      padding: 10rem;
                      padding-top: 0;
                  `}
        `}
    `,
};

export default S;
