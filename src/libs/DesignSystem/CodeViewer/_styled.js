import styled, { css } from "styled-components";

export const S = {
    shell: styled.div`
        ${({ $tabSize, $radius, $bg, $color, $maxHeight }) => css`
            box-sizing: border-box;
            width: 100%;
            max-width: 100%;
            ${$maxHeight ? `max-height: ${$maxHeight}rem; overflow: auto;` : ""}
            border-radius: ${$radius}rem;
            background: ${$bg || "transparent"};
            color: ${$color || "inherit"};

            & pre {
                margin: 0;
                tab-size: ${$tabSize};
                -moz-tab-size: ${$tabSize};
                font-family:
                    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
                    "Courier New", monospace;
                font-size: 13rem;
                line-height: 1.5;
            }
        `}
    `,
};

export default S;
