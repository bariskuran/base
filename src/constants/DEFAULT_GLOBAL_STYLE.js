import { css } from "styled-components";

export const DEFAULT_GLOBAL_STYLE = css`
    html {
        ${({ preparedRemSettings }) => preparedRemSettings}
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        width: 100%;
        height: 100%;
        min-height: 100vh;
        overflow-y: unset;
        background-color: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.foreground};
    }

    body {
        ${({ primaryFont }) => primaryFont}
        padding: 0px;
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
        min-height: 100vh;
        width: 100vw;
        min-width: 320px;
        margin: auto;
    }

    #root {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        overflow: unset;
    }

    div {
        position: relative;
        font-variant-ligatures: no-common-ligatures;
        box-sizing: border-box;
    }

    button {
        ${({ primaryFont }) => primaryFont}
        margin: 0;
        padding: 10rem;
        background-color: ${({ theme }) => theme.foreground};
        color: ${({ theme }) => theme.background};
        border: none;
        cursor: pointer;
        &:focus {
            outline: rgba(0, 0, 0, 0);
        }
    }

    input,
    textarea {
        ${({ primaryFont }) => primaryFont}
    }

    p {
        margin: 10rem 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    blockquote {
        margin: 0px;
    }
`;
