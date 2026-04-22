import styled, { css } from "styled-components";

export const S = {
    container: styled.pre`
        ${({
            // theme,
            $tabSize,
            $padding,
            $radius,
            $bg,
            $color,
            $maxHeight,
            $wrap,
        }) => css`
            display: block;
            box-sizing: border-box;
            width: 100%;
            overflow: auto;
            max-width: 100%;
            ${$maxHeight ? `max-height: ${$maxHeight}rem;` : ""}
            padding: ${$padding}rem;
            border-radius: ${$radius}rem;
            background: ${$bg || "transparent"};
            color: ${$color || "inherit"};
            font-family:
                ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
                "Courier New", monospace;
            font-size: 13rem;
            line-height: 1.5;
            tab-size: ${$tabSize};
            -moz-tab-size: ${$tabSize};
            white-space: ${$wrap ? "pre-wrap" : "pre"};
            word-break: normal;
            overflow-wrap: normal;
            display: flex;

            & > code {
                flex: 1 1 auto;
                font: inherit;
                color: inherit;
                white-space: inherit;
            }
        `}
    `,
    buttonArea: styled.div`
        flex: 0 0 25rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 10rem;
    `,
};
export default S;
