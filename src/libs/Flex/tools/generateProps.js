import { deepMerge } from "../../deepMerge";
import { colorGet } from "../../colorGet";
import { cssNormalizeSize } from "../../cssNormalizeSize";
import { removeUndefinedDeep } from "../../removeUndefined";

export const manageColors = ({ bgColor, color } = {}) => {
    const bg = colorGet(bgColor);
    const fg = colorGet(color);

    return {
        bgColor: bg?.color,
        color: fg?.color || bg?.opposite,
    };
};

const mergeCommonAndItem = (common = {}, item = {}) => {
    const merged = { ...common };

    Object.keys(item).forEach((key) => {
        if (item[key] === undefined) {
            delete merged[key];
        } else {
            merged[key] = item[key];
        }
    });

    return merged;
};

const normalizeCalcOperators = (value) =>
    value
        .replace(/\s+/g, " ")
        .replace(/\s*([+\-*/])\s*/g, " $1 ")
        .trim();

const findClosingParen = (value, openIndex) => {
    let depth = 0;

    for (let i = openIndex; i < value.length; i++) {
        if (value[i] === "(") depth += 1;
        if (value[i] === ")") depth -= 1;
        if (depth === 0) return i;
    }

    return -1;
};

const normalizeCalcExpression = (value) => {
    if (typeof value !== "string") return value;

    let result = "";

    for (let i = 0; i < value.length; i++) {
        if (value.slice(i, i + 5).toLowerCase() !== "calc(") {
            result += value[i];
            continue;
        }

        const closeIndex = findClosingParen(value, i + 4);

        if (closeIndex === -1) {
            result += value.slice(i);
            break;
        }

        const inner = value.slice(i + 5, closeIndex);
        const normalizedInner = normalizeCalcExpression(inner).replace(
            /calc\(([^()]*)\)/g,
            "$1",
        );

        result += `calc(${normalizeCalcOperators(normalizedInner)})`;
        i = closeIndex;
    }

    return result;
};

const splitCssValueList = (value) => {
    const parts = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < value.length; i++) {
        if (value.slice(i, i + 5).toLowerCase() === "calc(") {
            current += value.slice(i, i + 5);
            depth += 1;
            i += 4;
            continue;
        }

        const char = value[i];

        if (char === ")" && depth > 0) {
            depth -= 1;
            current += char;
            continue;
        }

        if (/\s/.test(char) && depth === 0) {
            if (current) {
                parts.push(normalizeCalcExpression(current));
                current = "";
            }
            continue;
        }

        current += char;
    }

    if (current) {
        parts.push(normalizeCalcExpression(current));
    }

    return parts;
};

const generateDirection = (direction) => {
    if (!direction) return;

    const directionCanBe = [
        "row",
        "column",
        "row-reverse",
        "column-reverse",
        "x",
        "x-reverse",
        "y",
        "y-reverse",
    ];

    if (directionCanBe.includes(direction)) {
        if (direction === "row" || direction === "x") return "row";
        if (direction === "column" || direction === "y") return "column";
        if (direction === "row-reverse" || direction === "x-reverse") return "row-reverse";
        if (direction === "column-reverse" || direction === "y-reverse") return "column-reverse";
    } else {
        return "row";
    }
};

const expandCssQuadValue = (value) => {
    if (value == null) return [undefined, undefined, undefined, undefined];

    if (typeof value === "number") {
        return [value, value, value, value];
    }

    if (typeof value === "string") {
        const parts = splitCssValueList(value);

        if (parts.length === 0) {
            return [undefined, undefined, undefined, undefined];
        }

        if (parts.length === 1) {
            const v = parts[0];
            return [v, v, v, v];
        }

        if (parts.length === 2) {
            const [tb, rl] = parts;
            return [tb, rl, tb, rl];
        }

        if (parts.length === 3) {
            const [t, rl, b] = parts;
            return [t, rl, b, rl];
        }

        const [t, r, b, l] = parts;
        return [t, r, b, l];
    }

    return [value, value, value, value];
};

const generate4DirectionProps = ([high, top, right, bottom, left]) => {
    let [t, r, b, l] = expandCssQuadValue(high);

    if (top != null) t = top;
    if (right != null) r = right;
    if (bottom != null) b = bottom;
    if (left != null) l = left;

    const normalized = [t, r, b, l].map((item) => normalizeCalcExpression(cssNormalizeSize(item)));

    if (normalized.every((item) => item == null)) return undefined;

    return normalized.map((item) => item ?? 0).join(" ");
};

const mapJustify = (value) => {
    if (value == null) return undefined;
    const v = String(value).trim();
    if (["start", "left", "top"].includes(v)) return "flex-start";
    if (["end", "right", "bottom"].includes(v)) return "flex-end";
    if (v === "center") return "center";
    if (["between", "space-between"].includes(v)) return "space-between";
    if (["around", "space-around"].includes(v)) return "space-around";
    if (["evenly", "space-evenly"].includes(v)) return "space-evenly";
    return v;
};

const mapAlignItems = (value) => {
    if (value == null) return undefined;

    const v = String(value).trim();

    if (["start", "left", "top"].includes(v)) return "flex-start";
    if (["end", "right", "bottom"].includes(v)) return "flex-end";
    if (v === "center") return "center";
    if (["stretch", "baseline"].includes(v)) return v;

    return v;
};

const mapXAlign = (value) => {
    if (value == null) return undefined;

    const v = String(value).trim();

    if (["left", "start"].includes(v)) return "flex-start";
    if (["right", "end"].includes(v)) return "flex-end";
    if (v === "center") return "center";

    return v;
};

const mapYAlign = (value) => {
    if (value == null) return undefined;

    const v = String(value).trim();

    if (["top", "start"].includes(v)) return "flex-start";
    if (["bottom", "end"].includes(v)) return "flex-end";
    if (v === "center") return "center";

    return v;
};

const normalizeWrap = (wrap) => {
    if (wrap === true) return "wrap";
    if (wrap === false) return "nowrap";
    return wrap;
};

const generateJustifyAlign = ({
    align,
    xAlign,
    yAlign,
    direction,
    justifyContent,
    justify,
    alignItems,
}) => {
    const directJustify = mapJustify(justifyContent ?? justify);
    const directAlignItems = mapAlignItems(alignItems ?? align);

    if (directJustify != null || directAlignItems != null) {
        return {
            ...(directJustify != null ? { justifyContent: directJustify } : {}),
            ...(directAlignItems != null ? { alignItems: directAlignItems } : {}),
        };
    }

    const isColumn = direction === "column" || direction === "column-reverse";

    const resolvedXAlign = xAlign ?? align;
    const resolvedYAlign = yAlign ?? align;

    const x = mapXAlign(resolvedXAlign);
    const y = mapYAlign(resolvedYAlign);

    if (isColumn) {
        return {
            ...(y != null ? { justifyContent: y } : {}),
            ...(x != null ? { alignItems: x } : {}),
        };
    }

    return {
        ...(x != null ? { justifyContent: x } : {}),
        ...(y != null ? { alignItems: y } : {}),
    };
};

const generateAlignSelf = ({ alignSelf }) => {
    if (alignSelf == null) return undefined;

    const mapped = mapYAlign(alignSelf);

    if (mapped == null) return undefined;
    return mapped;
};

const generateFlexItemSizing = ({ flex, width, height, parentDirection }) => {
    const normalizedFlex = flex == null ? undefined : String(flex).trim();
    const isColumn = parentDirection === "column" || parentDirection === "column-reverse";

    if (normalizedFlex) {
        return {
            flex: normalizedFlex,
            width: undefined,
            height: undefined,
        };
    }

    if (isColumn) {
        if (height === 0) {
            return {
                flex: "1 1 auto",
                height: undefined,
                minHeight: 0,
                width: cssNormalizeSize(width),
            };
        }

        if (height != null) {
            return {
                flex: `0 0 ${cssNormalizeSize(height)}`,
                height: undefined,
                width: cssNormalizeSize(width),
            };
        }

        return {
            width: cssNormalizeSize(width),
            height: cssNormalizeSize(height),
        };
    }

    if (width === 0) {
        return {
            flex: "1 1 auto",
            width: undefined,
            minWidth: 0,
            height: cssNormalizeSize(height),
        };
    }

    if (width != null) {
        return {
            flex: `0 0 ${cssNormalizeSize(width)}`,
            width: undefined,
            height: cssNormalizeSize(height),
        };
    }

    return {
        width: cssNormalizeSize(width),
        height: cssNormalizeSize(height),
    };
};

const generateRootFlexSizing = ({
    flex,
    width,
    height,
    direction,
    hasExplicitWidth,
    hasExplicitHeight,
}) => {
    const normalizedFlex = flex == null ? undefined : String(flex).trim();
    if (normalizedFlex) {
        return {
            flex: normalizedFlex,
            width: undefined,
            height: undefined,
        };
    }

    const normalizedWidth = cssNormalizeSize(width);
    const normalizedHeight = cssNormalizeSize(height);
    const isColumn = direction === "column" || direction === "column-reverse";

    const autoFlex =
        isColumn && hasExplicitHeight && height != null
            ? `0 0 ${normalizedHeight}`
            : !isColumn && hasExplicitWidth && width != null
              ? `0 0 ${normalizedWidth}`
              : undefined;

    return {
        flex: autoFlex,
        width: normalizedWidth,
        height: normalizedHeight,
    };
};

const generateInProps = ({
    inCommonProps,
    inProps,
    childrenCount = 0,
    currentBreakpoint,
    sysDefaults = {},
    parentDirection,
}) => {
    const total = Math.max(childrenCount, Array.isArray(inProps) ? inProps.length : 0);

    if (!inCommonProps && !Array.isArray(inProps)) return undefined;

    return Array.from({ length: total }).map((_, index) => {
        const commonRaw = inCommonProps || {};
        const itemRaw = Array.isArray(inProps) ? inProps[index] || {} : {};

        return generateProps({
            props: mergeCommonAndItem(commonRaw, itemRaw),
            currentBreakpoint,
            sysDefaults,
            parentDirection,
        });
    });
};

export const generateProps = ({
    props = {},
    currentBreakpoint,
    sysDefaults = {},
    childrenCount = 0,
    parentDirection,
}) => {
    const merged1 = deepMerge(sysDefaults, props);
    const bpOverride = props?.responsive?.[currentBreakpoint] || {};
    const mergedObj = deepMerge(merged1, bpOverride);
    const hasExplicitWidth = props?.width != null || bpOverride?.width != null;
    const hasExplicitHeight = props?.height != null || bpOverride?.height != null;

    const {
        bgColor,
        color,
        borderRadius,
        direction,
        flex,
        //
        padding,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        //
        margin,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        //
        width,
        height,
        flexGrow,
        flexShrink,
        flexBasis,
        order,
        align,
        xAlign,
        yAlign,
        gap,
        rowGap,
        columnGap,
        alignSelf,
        alignContent,
        justifyContent,
        justify,
        alignItems,
        //
        inCommonProps,
        inProps,
        wrap,
        overflowX,
        overflowY,
    } = mergedObj;

    const currDirection = generateDirection(direction);

    const baseSizing = parentDirection
        ? generateFlexItemSizing({
              flex,
              width,
              height,
              parentDirection,
          })
        : generateRootFlexSizing({
              flex,
              width,
              height,
              direction: currDirection,
              hasExplicitWidth,
              hasExplicitHeight,
          });

    const obj = {
        ...manageColors({ bgColor, color }),
        borderRadius: cssNormalizeSize(borderRadius),
        direction: currDirection,
        flex: baseSizing.flex,
        flexGrow: flexGrow == null ? undefined : String(flexGrow),
        flexShrink: flexShrink == null ? undefined : String(flexShrink),
        flexBasis: cssNormalizeSize(flexBasis),
        order: order == null ? undefined : String(order),
        padding: generate4DirectionProps([
            padding,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
        ]),
        margin: generate4DirectionProps([margin, marginTop, marginRight, marginBottom, marginLeft]),
        width: baseSizing.width,
        height: baseSizing.height,
        minWidth: baseSizing.minWidth,
        minHeight: baseSizing.minHeight,
        ...generateJustifyAlign({
            align,
            xAlign,
            yAlign,
            direction: currDirection,
            justifyContent,
            justify,
            alignItems,
        }),
        gap: cssNormalizeSize(gap),
        rowGap: cssNormalizeSize(rowGap),
        columnGap: cssNormalizeSize(columnGap),
        alignSelf: generateAlignSelf({ alignSelf }),
        alignContent: mapAlignItems(alignContent),
        overflowX,
        overflowY,
        wrap: normalizeWrap(wrap),
        inProps: generateInProps({
            inCommonProps,
            inProps,
            currentBreakpoint,
            sysDefaults: {},
            childrenCount,
            parentDirection: currDirection,
        }),
    };

    return removeUndefinedDeep(obj);
};

export const FLEX_PROPS_OMIT_FOR_DOM = new Set([
    "bgColor",
    "color",
    "borderRadius",
    "direction",
    "flex",
    "padding",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "margin",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marginBottom",
    "width",
    "height",
    "flexGrow",
    "flexShrink",
    "flexBasis",
    "order",
    "align",
    "xAlign",
    "yAlign",
    "gap",
    "rowGap",
    "columnGap",
    "alignSelf",
    "alignContent",
    "justifyContent",
    "justify",
    "alignItems",
    "inCommonProps",
    "inProps",
    "overflowX",
    "overflowY",
    "wrap",
    "responsive",
    "exportData",
]);
