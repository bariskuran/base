import styled, { css } from "styled-components";

const cssPropMap = {
    bgColor: "background-color",
    color: "color",
    borderRadius: "border-radius",
    direction: "flex-direction",
    padding: "padding",
    margin: "margin",
    width: "width",
    height: "height",
    flex: "flex",
    minWidth: "min-width",
    minHeight: "min-height",
    justifyContent: "justify-content",
    alignItems: "align-items",
    gap: "gap",
    alignSelf: "align-self",
    overflow: "overflow",
    wrap: "flex-wrap",
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
    container: styled.div`
        ${(p) => createFlexCssTree(p)}
    `,
};
