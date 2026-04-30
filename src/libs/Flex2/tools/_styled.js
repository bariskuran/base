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

/**
 * generateProps çıktısındaki anahtarları transient ($) yapar; DOM'a öznitelik olarak düşmezler.
 */
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

const isShellValue = (v) => v != null && v !== "" && v !== "unset";

const shouldEmitPadding = (v) =>
    isShellValue(v) && v !== "0" && v !== 0 && `${v}`.trim() !== "0";


export const S = {
    /**
     * Tek sütunlu grid: ilk satır iç flex alanı minmax(0,1fr) ile üst genişlikte kilitlenir (block’taki şişme sorunu).
     * İç S.content hâlâ flex; grid sadece kabukta — ekstra DOM (shellClip) gerekmez.
     * height verildiğinde ilk satır minmax(0,1fr) ile dikeyde de dolabilir (50×50 senaryosu).
     */
    container: styled.div`
        box-sizing: border-box;
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        min-width: 0;
        ${(p) =>
            p.$hasExplicitShellHeight
                ? css`
                      grid-template-rows: minmax(0, 1fr);
                      grid-auto-rows: auto;
                      min-height: 0;
                  `
                : css`
                      grid-auto-rows: auto;
                  `}
        ${(p) => {
            const flexStr = p.$flex != null ? String(p.$flex).trim() : "";
            if (flexStr) {
                return css`
                    flex: ${p.$flex};
                `;
            }
            const grow = p.$flexGrow;
            const shrink = p.$flexShrink;
            const basis = p.$flexBasis;
            const hasGrow = isShellValue(grow);
            const hasShrink = isShellValue(shrink);
            const hasBasis = isShellValue(basis);
            if (!hasGrow && !hasShrink && !hasBasis) return "";
            return css`
                ${hasGrow ? css`flex-grow: ${grow};` : ""}
                ${hasShrink ? css`flex-shrink: ${shrink};` : ""}
                ${hasBasis ? css`flex-basis: ${basis};` : ""}
            `;
        }}
        ${(p) => (p.$alignSelf != null ? css`align-self: ${p.$alignSelf};` : "")}
        ${(p) => (p.$order != null ? css`order: ${p.$order};` : "")}
        ${(p) => (isShellValue(p.$width) ? css`width: ${p.$width};` : "")}
        ${(p) => (isShellValue(p.$height) ? css`height: ${p.$height};` : "")}
        ${(p) =>
            isShellValue(p.$minWidth)
                ? css`
                      min-width: ${p.$minWidth};
                  `
                : ""}
        ${(p) =>
            isShellValue(p.$minHeight)
                ? css`
                      min-height: ${p.$minHeight};
                  `
                : ""}
        ${(p) =>
            isShellValue(p.$maxWidth)
                ? css`
                      max-width: ${p.$maxWidth};
                  `
                : ""}
        ${(p) =>
            isShellValue(p.$maxHeight)
                ? css`
                      max-height: ${p.$maxHeight};
                  `
                : ""}
        ${(p) => {
            const ox = p.$overflowX;
            const oy = p.$overflowY;
            const hasAxis = ox != null || oy != null;
            if (hasAxis) {
                return css`
                    overflow-x: ${ox ?? "hidden"};
                    overflow-y: ${oy ?? "hidden"};
                `;
            }
            return css`
                overflow: hidden;
            `;
        }}
        ${(p) => {
            const pt = p.$paddingTop;
            const pr = p.$paddingRight;
            const pb = p.$paddingBottom;
            const pl = p.$paddingLeft;
            return css`
                ${shouldEmitPadding(pt) ? css`padding-top: ${pt};` : ""}
                ${shouldEmitPadding(pr) ? css`padding-right: ${pr};` : ""}
                ${shouldEmitPadding(pb) ? css`padding-bottom: ${pb};` : ""}
                ${shouldEmitPadding(pl) ? css`padding-left: ${pl};` : ""}
            `;
        }}
    `,
    content: styled.div`
        box-sizing: border-box;
        min-width: 0;
        min-height: 0;
        ${(p) => createFlexCssTree(p)}
        /* Kaynak div grid hücresini doldurur; dar çocuklar scrollbar’ı kabuk genişliğine kilitlemez. */
        width: 100%;
        justify-self: stretch;
        align-self: stretch;
        ${(p) =>
            p.$hasExplicitShellHeight
                ? css`
                      height: 100%;
                  `
                : ""}
    `,
};
