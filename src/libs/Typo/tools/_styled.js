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
    $isManuallyHover,
    $lineHeight,
    $letterSpacing,
    $margin,
    $padding,
    $enableQuoteMarks,
    $fitContent,
    $balance,
    $inlineCopy,
    $overlayCopyLayout,
    $stackedOverlayCopy,
    $font,
}) => {
    return css`
        box-sizing: border-box;
        position: relative;
        ${$font}

        ${$overlayCopyLayout &&
        !$stackedOverlayCopy &&
        css`
            margin: 0;
            width: 100%;
            min-width: 0;
            padding-right: 34rem;
            box-sizing: border-box;
        `}

        ${$overlayCopyLayout &&
        $stackedOverlayCopy &&
        css`
            margin: 0;
            width: max-content;
            max-width: 100%;
            min-width: 0;
            box-sizing: border-box;
        `}

        ${as === "pre" &&
        css`
            margin: 0;
            ${$stackedOverlayCopy ? "" : "display: block;"}
        `}
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
    ${$unselectable ? "user-select: none !important;" : ""}
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

    ${$inlineCopy &&
        css`
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: stretch;
            column-gap: 6rem;
            width: 100%;
            max-width: 100%;
        `}

    ${$fitContent &&
        css`
            width: fit-content;
        `}

    ${$balance &&
        css`
            text-wrap: balance;
        `}

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

    ${$clamp != null &&
        $ellipsis !== "base" &&
        css`
            overflow: hidden;
            text-overflow: ellipsis;
            width: ${$width ?? "100%"};
            min-width: 0;
            display: -webkit-box;
            -webkit-line-clamp: ${$clamp};
            -webkit-box-orient: vertical;
        `}

    ${$ellipsis &&
        $clamp == null &&
        $ellipsis !== "base" &&
        css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
            width: ${$width ?? "100%"};
            min-width: 0;
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

const OVERLAY_COPY_HOSTS = new Set(["pre", "code"]);

const wrapperWidth = ({
    $width,
    $maxWidth,
    $fitContent,
    $disableMaxWidthLock,
    $overlayCopy,
    $stackedOverlayCopy,
    $as,
}) => {
    if (!$overlayCopy) return "auto";
    if ($stackedOverlayCopy) return "fit-content";
    if ($width != null) return $width;
    if ($fitContent) return "fit-content";
    if ($maxWidth != null) return $maxWidth;
    if (OVERLAY_COPY_HOSTS.has($as)) {
        if ($disableMaxWidthLock) return "100%";
        return "fit-content";
    }
    if (!$disableMaxWidthLock) return "min(100%, 600px)";
    return "fit-content";
};

const S = {
    wrapper: styled.div`
        ${({ $overlayCopy, $stackedOverlayCopy, $maxWidth, $width, $fitContent, $disableMaxWidthLock, $as }) => css`
            display: ${$overlayCopy ? ($stackedOverlayCopy ? "inline-grid" : "inline-flex") : "inline-block"};
            position: relative;

            ${$stackedOverlayCopy &&
            css`
                grid-template-columns: max-content auto;
                align-items: start;
                column-gap: 8rem;
                width: fit-content;
                max-width: 100%;
            `}

            ${$overlayCopy &&
            css`
                width: ${wrapperWidth({
                    $width,
                    $maxWidth,
                    $fitContent,
                    $disableMaxWidthLock,
                    $overlayCopy,
                    $stackedOverlayCopy,
                    $as,
                })};
                max-width: ${$stackedOverlayCopy
                    ? "100%"
                    : $maxWidth != null
                      ? $maxWidth
                      : $disableMaxWidthLock
                        ? "none"
                        : "min(100%, 600px)"};
            `}
        `}
    `,
    overlayCopy: styled.div`
        ${({ $stackedOverlayCopy }) =>
            $stackedOverlayCopy
                ? css`
                      grid-column: 2;
                      grid-row: 1;
                      align-self: start;
                      justify-self: end;
                      position: relative;
                      display: flex;
                      align-items: flex-start;
                      justify-content: flex-end;
                      flex-shrink: 0;
                      margin: 0;
                      padding: 0;
                      line-height: 0;
                      pointer-events: none;
                      user-select: none;
                      z-index: 1;

                      & > * {
                          margin: 0;
                          pointer-events: auto;
                      }
                  `
                : css`
                      position: absolute;
                      top: 0;
                      right: 0;
                      display: flex;
                      align-items: flex-start;
                      justify-content: flex-end;
                      margin: 0;
                      padding: 0;
                      line-height: 0;
                      pointer-events: auto;
                      user-select: none;
                      z-index: 2;

                      & > * {
                          margin: 0;
                          vertical-align: top;
                      }
                  `}
    `,

    inlineContent: styled.span`
        display: flex;
        align-items: center;
        align-self: stretch;
        min-width: 0;
        min-height: 100%;
    `,

    inlineCopy: styled.span`
        display: flex;
        align-items: center;
        align-self: stretch;
        flex-shrink: 0;
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
