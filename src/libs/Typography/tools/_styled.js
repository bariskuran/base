import styled, { css } from "styled-components";

const sharedStyles = ({
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
    $uppercase,
    $lowercase,
    $capitalize,
    $disabled,
    $hasOverlayCopy,
    $isManuallyHover,
    $lineHeight,
    $letterSpacing,
}) => css`
    box-sizing: border-box;
    position: relative;
    ${$maxWidth != null ? `max-width: ${$maxWidth};` : ""}
    ${$width != null ? `width: ${$width};` : ""}
    ${$size != null ? `font-size: ${$size};` : ""}
    ${$weight != null ? `font-weight: ${$weight};` : ""}
    ${$color != null ? `color: ${$color};` : ""}
    ${$highlight != null ? `background-color: ${$highlight};` : ""}
    ${$align != null ? `text-align: ${$align};` : ""}
    ${$wrap != null ? `white-space: ${$wrap};` : ""}
    ${$whiteSpace != null ? `white-space: ${$whiteSpace};` : ""}
    ${$overflow != null ? `overflow: ${$overflow};` : ""}
    ${$italic ? `font-style: italic;` : ""}
    ${$selectable != null ? `user-select: ${$selectable ? "text" : "none"};` : ""}
    ${$bold ? `font-weight: bold;` : ""}
    ${$disabled ? `opacity: 0.5;` : ""}
    ${$underline ? `text-decoration: underline;` : ""}
    ${$strikethrough ? `text-decoration: line-through;` : ""}
    ${$lineHeight ? `line-height: ${$lineHeight};` : ""}
    ${$letterSpacing ? `letter-spacing: ${$letterSpacing};` : ""}
    ${($uppercase || $lowercase || $capitalize) &&
    css`
        text-transform: ${$uppercase ? "uppercase" : $lowercase ? "lowercase" : "capitalize"};
    `}

    ${$hasOverlayCopy ? `padding-right: 35rem;` : ""}

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
        width: ${$width ? $width : "100%"};

        display: -webkit-box;
        -webkit-line-clamp: ${$clamp ?? 1};
        -webkit-box-orient: vertical;
    `}

    ${$ellipsis === "base" &&
    css`
        overflow: hidden;
        display: block;
        width: ${$width ? $width : "100%"};
    `}

    ${$isManuallyHover &&
    css`
        &::after {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.04);
            pointer-events: none;
        }
    `}
`;

const S = {
    wrapper: styled.div`
        ${({ $overlayCopy }) => css`
            display: ${$overlayCopy ? "grid" : "inline-block"};
            ${$overlayCopy ? "grid-template-columns: minmax(0, 1fr) 35rem;" : ""}
            ${$overlayCopy ? "align-items: start;" : ""}
            position: relative;
            width: ${$overlayCopy ? "100%" : "auto"};
            max-width: 100%;
        `}
    `,

    containerArea: styled.div`
        min-width: 0;
        width: 100%;
    `,

    overlayCopy: styled.div`
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        pointer-events: auto;
        user-select: none;
    `,

    inlineCopy: styled.span`
        display: inline-flex;
        vertical-align: middle;
        margin-left: 6rem;
        position: relative;
        z-index: 2;
        user-select: none;
    `,

    container: styled.div`
        ${sharedStyles}
    `,

    measureSource: styled.div`
        ${sharedStyles}

        position: fixed !important;
        left: -999999px !important;
        top: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        z-index: -1 !important;

        width: auto !important;
        max-width: none !important;
        overflow: visible !important;
        display: block !important;

        -webkit-line-clamp: unset !important;
        -webkit-box-orient: unset !important;
        text-overflow: clip !important;
    `,
};

export default S;
