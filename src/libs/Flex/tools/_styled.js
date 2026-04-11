import styled, { css } from "styled-components";

const createInPropsCss = (inProps = [], levelSelector = "> *") => {
    if (!Array.isArray(inProps) || inProps.length === 0) return css``;

    return css`
        ${inProps.map((item, index) => {
            if (!item) return "";

            const {
                bgColor,
                color,
                borderRadius,
                direction,
                padding,
                margin,
                width,
                height,
                flex,
                minHeight,
                minWidth,
                justifyContent,
                alignItems,
                gap,
                alignSelf,
                inProps: nestedInProps,
            } = item;

            const childSelector = `${levelSelector}:nth-child(${index + 1})`;

            return css`
                ${childSelector} {
                    ${bgColor != null ? `background-color: ${bgColor};` : ""}
                    ${color != null ? `color: ${color};` : ""}
                    ${borderRadius != null ? `border-radius: ${borderRadius};` : ""}
                    ${direction != null ? `display: flex; flex-direction: ${direction};` : ""}
                    ${padding != null ? `padding: ${padding};` : ""}
                    ${margin != null ? `margin: ${margin};` : ""}
                    ${width != null ? `width: ${width};` : ""}
                    ${height != null ? `height: ${height};` : ""}
                    ${flex != null ? `flex: ${flex};` : ""}
                    ${minWidth != null ? `min-width: ${minWidth};` : ""}
                    ${minHeight != null ? `min-height: ${minHeight};` : ""}
                    ${justifyContent != null ? `justify-content: ${justifyContent};` : ""}
                    ${alignItems != null ? `align-items: ${alignItems};` : ""}
                    ${gap != null ? `gap: ${gap};` : ""}
                    ${alignSelf != null ? `align-self: ${alignSelf};` : ""}
                }

                ${nestedInProps && nestedInProps.length > 0
                    ? createInPropsCss(nestedInProps, `${childSelector} > *`)
                    : ""}
            `;
        })}
    `;
};

export const S = {
    Container: styled.div`
        ${({
            $bgColor,
            $color,
            $borderRadius,
            $direction,
            $padding,
            $margin,
            $width,
            $height,
            $justifyContent,
            $alignItems,
            $gap,
            $alignSelf,
            $inProps,
            $flex,
            $minHeight,
            $minWidth,
        }) => css`
            display: flex;

            ${$bgColor != null ? `background-color: ${$bgColor};` : ""}
            ${$color != null ? `color: ${$color};` : ""}
            ${$borderRadius != null ? `border-radius: ${$borderRadius};` : ""}
            ${$direction != null ? `flex-direction: ${$direction};` : ""}
            ${$padding != null ? `padding: ${$padding};` : ""}
            ${$margin != null ? `margin: ${$margin};` : ""}
            ${$width != null ? `width: ${$width};` : ""}
            ${$height != null ? `height: ${$height};` : ""}
            ${$justifyContent != null ? `justify-content: ${$justifyContent};` : ""}
            ${$alignItems != null ? `align-items: ${$alignItems};` : ""}
            ${$gap != null ? `gap: ${$gap};` : ""}
            ${$alignSelf != null ? `align-self: ${$alignSelf};` : ""}
            ${$flex != null ? `flex: ${$flex};` : ""}
${$minWidth != null ? `min-width: ${$minWidth};` : ""}
${$minHeight != null ? `min-height: ${$minHeight};` : ""}

            ${createInPropsCss($inProps)}
        `}
    `,
};
