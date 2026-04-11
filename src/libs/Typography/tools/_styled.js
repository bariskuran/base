import styled, { css } from "styled-components";

const S = {
    container: styled.div`
        ${({
            // theme,
            $maxWidth,
            $width,
            $size,
            $weight,
            $color,
            $highlight,
            $align,
            $selfAlign,
            $ellipsis,
            $clamp,
            $wrap,
            $whiteSpace,
            $overflow,
            $selectable,
            $italic,
            $bold,
            $underline,
            $strikethrough,
            $superscript,
            $transform,
            $disabled,
            // as,
        }) => css`
            /* all: unset; */
            ${$maxWidth != null ? `max-width: ${$maxWidth};` : ""}
            ${$width != null ? `width: ${$width};` : ""}
            ${$size != null ? `font-size: ${$size};` : ""}
            ${$weight != null ? `font-weight: ${$weight};` : ""}
            ${$color != null ? `color: ${$color};` : ""}
            ${$highlight != null ? `background-color: ${$highlight};` : ""}
            ${$align != null ? `text-align: ${$align};` : ""}

            ${$selfAlign === "left" &&
            css`
                width: fit-content;
                margin-left: 0;
                margin-right: auto;
                justify-self: start;
                align-self: start;
            `}
            ${$selfAlign === "center" &&
            css`
                width: fit-content;
                margin-left: auto;
                margin-right: auto;
                justify-self: center;
                align-self: center;
            `}
            ${$selfAlign === "right" &&
            css`
                width: fit-content;
                margin-left: auto;
                margin-right: 0;
                justify-self: end;
                align-self: end;
            `}
            
            ${($ellipsis || $clamp) &&
            $ellipsis !== "base" &&
            css`
                overflow: hidden;
                text-overflow: ellipsis;
                ${`width: ${$width ? $width : "100%"};`}

                display: -webkit-box;
                -webkit-line-clamp: ${$clamp ?? 1};
                -webkit-box-orient: vertical;
            `}
            ${$ellipsis === "base" &&
            css`
                overflow: hidden;
                display: block;
                width: ${$width ? $width : "100%"};
            `} //
            
            /* ${$clamp != null ? `text-overflow: ellipsis;` : ""}
            ${$wrap != null ? `white-space: ${$wrap};` : ""}
            ${$whiteSpace != null ? `white-space: ${$whiteSpace};` : ""}
            ${$overflow != null ? `overflow: ${$overflow};` : ""}
            ${$selectable != null ? `user-select: ${$selectable};` : ""}
            ${$italic != null ? `font-style: italic;` : ""}
            ${$bold != null ? `font-weight: bold;` : ""}
            ${$underline != null ? `text-decoration: underline;` : ""}
            ${$strikethrough != null ? `text-decoration: line-through;` : ""}
            ${$superscript != null ? `vertical-align: super;` : ""}
            ${$transform != null ? `text-transform: ${$transform};` : ""}
            ${$disabled != null ? `opacity: 0.5;` : ""} */
        `}
    `,
};
export default S;
