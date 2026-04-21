import styled, { css } from "styled-components";

const sharedStyles = ({
    theme,
    as,
    $maxWidth,
    $disableMaxWidthLock,
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
    $unselectable,
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
    $margin,
    $padding,
    $enableQuoteMarks,
}) => {
    return css`
        box-sizing: border-box;
        position: relative;
        ${$maxWidth != null
            ? `max-width: ${$maxWidth};`
            : !as?.includes("h") && !$disableMaxWidthLock
              ? "max-width: 600px;"
              : as?.includes("h") && !$disableMaxWidthLock
                ? "max-width: 800px;"
                : ""}

        ${theme.responsive.phone(css`
            max-width: 260px;
        `)}

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
    ${$unselectable ? "user-select: none !important;" : "user-select: text !important;"}
    ${$bold ? `font-weight: bold;` : ""}
    ${$disabled ? `opacity: 0.5;` : ""}
    ${$underline ? `text-decoration: underline;` : ""}
    ${$strikethrough ? `text-decoration: line-through;` : ""}
    ${$lineHeight ? `line-height: ${$lineHeight};` : ""}
    ${$letterSpacing ? `letter-spacing: ${$letterSpacing};` : ""}
    ${$margin != null ? `margin: ${$margin};` : ""}
    ${$padding != null ? `padding: ${$padding};` : ""}
    ${($uppercase || $lowercase || $capitalize) &&
        css`
            text-transform: ${$uppercase ? "uppercase" : $lowercase ? "lowercase" : "capitalize"};
        `}

    ${$hasOverlayCopy ? `padding-right: 20rem;` : ""}

    ${$selfAlign === "left" &&
        css`
            width: fit-content;
            margin-left: 0;
            margin-right: auto;
            justify-self: start;
            align-self: start;
            text-align: left;
        `}

    ${$selfAlign === "center" &&
        css`
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            justify-self: center;
            align-self: center;
            text-align: center;
        `}

    ${$selfAlign === "right" &&
        css`
            width: fit-content;
            margin-left: auto;
            margin-right: 0;
            justify-self: end;
            align-self: end;
            text-align: right;
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

         ${$enableQuoteMarks &&
        css`
            &::before,
            &::after {
                font-family: "Times New Roman", serif;
                font-size: 500%;
                line-height: 0;
                font-weight: 100;
                opacity: 0.3;
                line-height: 0;
            }

            &::before {
                content: '"';
                margin-right: 0.05em;
                vertical-align: -30rem;
            }

            &::after {
                content: '"';
                margin-left: 0.05em;
                display: inline-block;
                transform: rotate(180deg);
                transform-origin: center;
                vertical-align: -10rem;
            }
        `}
    `;
};

const S = {
    wrapper: styled.div`
        ${({ $overlayCopy }) => css`
            display: ${$overlayCopy ? "grid" : "inline-block"};
            ${$overlayCopy ? "grid-template-columns: minmax(0, 1fr) 20rem;" : ""}
            ${$overlayCopy ? "align-items: start;" : ""}
            position: relative;
            width: ${$overlayCopy ? "100%" : "auto"};
            max-width: 100%;
        `}
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
        min-width: 0;
    `,
};

export default S;
