import { deepMerge } from "../../deepMerge";
import { colorGet } from "../../colorGet";
import { normalizeCssSize } from "../../normalizeCssSize";
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
        const parts = value.trim().split(/\s+/).filter(Boolean);

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

    const normalized = [t, r, b, l].map((item) => normalizeCssSize(item));

    if (normalized.every((item) => item == null)) return undefined;

    return normalized.map((item) => item ?? 0).join(" ");
};

const mapXAlign = (value) => {
    if (value == null) return undefined;

    const v = String(value).trim();

    const map = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
        "flex-start": "flex-start",
        "flex-end": "flex-end",
        start: "start",
        end: "end",
    };

    return map[v] || v;
};

const mapYAlign = (value) => {
    if (value == null) return undefined;

    const v = String(value).trim();

    const map = {
        top: "flex-start",
        center: "center",
        bottom: "flex-end",
        "flex-start": "flex-start",
        "flex-end": "flex-end",
        start: "start",
        end: "end",
        stretch: "stretch",
    };

    return map[v] || v;
};

const generateJustifyAlign = ({ align, xAlign, yAlign, direction }) => {
    const isColumn = direction === "column" || direction === "column-reverse";

    const resolvedXAlign = xAlign ?? align;
    const resolvedYAlign = yAlign ?? align;

    const x = mapXAlign(resolvedXAlign);
    const y = mapYAlign(resolvedYAlign);

    if (isColumn) {
        return {
            justifyContent: y,
            alignItems: x,
        };
    }

    return {
        justifyContent: x,
        alignItems: y,
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
                width: normalizeCssSize(width),
            };
        }

        if (height != null) {
            return {
                flex: `0 0 ${normalizeCssSize(height)}`,
                height: undefined,
                width: normalizeCssSize(width),
            };
        }

        return {
            width: normalizeCssSize(width),
            height: normalizeCssSize(height),
        };
    }

    if (width === 0) {
        return {
            flex: "1 1 auto",
            width: undefined,
            minWidth: 0,
            height: normalizeCssSize(height),
        };
    }

    if (width != null) {
        return {
            flex: `0 0 ${normalizeCssSize(width)}`,
            width: undefined,
            height: normalizeCssSize(height),
        };
    }

    return {
        width: normalizeCssSize(width),
        height: normalizeCssSize(height),
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
        align,
        xAlign,
        yAlign,
        gap,
        alignSelf,
        //
        inCommonProps,
        inProps,
    } = mergedObj;

    const currDirection = generateDirection(direction);

    const baseSizing = parentDirection
        ? generateFlexItemSizing({
              flex,
              width,
              height,
              parentDirection,
          })
        : {
              flex,
              width: flex == null ? normalizeCssSize(width) : undefined,
              height: flex == null ? normalizeCssSize(height) : undefined,
          };

    const obj = {
        ...manageColors({ bgColor, color }),
        borderRadius: normalizeCssSize(borderRadius),
        direction: currDirection,
        flex: baseSizing.flex,
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
        ...generateJustifyAlign({ align, xAlign, yAlign, direction: currDirection }),
        gap: normalizeCssSize(gap),
        alignSelf: generateAlignSelf({ alignSelf }),
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
