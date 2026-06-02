import styled, { css } from "styled-components";

const cssPropMap = {
    bgColor: "background-color",
    color: "color",
    borderRadius: "border-radius",
    border: "border",
    borderTop: "border-top",
    borderRight: "border-right",
    borderBottom: "border-bottom",
    borderLeft: "border-left",
    borderInline: "border-inline",
    borderBlock: "border-block",
    borderInlineStart: "border-inline-start",
    borderInlineEnd: "border-inline-end",
    borderBlockStart: "border-block-start",
    borderBlockEnd: "border-block-end",
    direction: "flex-direction",
    padding: "padding",
    margin: "margin",
    width: "width",
    height: "height",
    flex: "flex",
    flexFlow: "flex-flow",
    flexGrow: "flex-grow",
    flexShrink: "flex-shrink",
    flexBasis: "flex-basis",
    order: "order",
    minWidth: "min-width",
    minHeight: "min-height",
    maxWidth: "max-width",
    maxHeight: "max-height",
    justifyContent: "justify-content",
    alignItems: "align-items",
    alignContent: "align-content",
    placeContent: "place-content",
    placeItems: "place-items",
    placeSelf: "place-self",
    gap: "gap",
    rowGap: "row-gap",
    columnGap: "column-gap",
    alignSelf: "align-self",
    overflow: "overflow",
    overflowX: "overflow-x",
    overflowY: "overflow-y",
    wrap: "flex-wrap",
    userSelect: "user-select",
    textAlign: "text-align",
    transform: "transform",
    transformOrigin: "transform-origin",
    transition: "transition",
};

const normalizeStyledProps = (props = {}) => {
    const result = {};
    Object.entries(props).forEach(([key, value]) => {
        if (value == null) return;

        if (key.startsWith("$")) {
            result[key.slice(1)] = value;
            return;
        }
        result[key] = value;
    });
    return result;
};

const createPropsCss = (props = {}) => {
    const p = normalizeStyledProps(props);
    return css`
        display: flex;
        ${Object.entries(cssPropMap).map(([propName, cssName]) => {
            const value = p[propName];
            if (value == null) return "";
            return `${cssName}: ${value};`;
        })}
    `;
};

export const toTransientFlexContentProps = (props = {}) => {
    const out = {};
    for (const [key, value] of Object.entries(props)) {
        if (value === undefined) continue;
        out[`$${key}`] = value;
    }
    return out;
};

const createFlexCssTree = (props = {}, levelSelector = "&") => {
    const p = normalizeStyledProps(props);
    const { inProps, ...rest } = p;

    return css`
        ${levelSelector} {
            ${createPropsCss(rest)}
        }

        ${Array.isArray(inProps)
            ? inProps.map((childProps, index) => {
                  if (!childProps) return "";

                  return createFlexCssTree(
                      childProps,
                      `${levelSelector} > *:nth-child(${index + 1})`,
                  );
              })
            : ""}
    `;
};

export const S = {
    root: styled.div`
        box-sizing: border-box;
        position: relative;
        min-width: 0;
        ${(p) =>
            p.$hasExplicitHeight
                ? css`
                      min-height: 0;
                  `
                : ""}
        ${(p) => createFlexCssTree(p)}
    `,
};
