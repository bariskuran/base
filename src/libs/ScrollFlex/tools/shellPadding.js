import {
    mergeFlexKebabPropAliases,
    FLEX_PROPS_KEBAB_TO_CAMEL,
} from "../../Flex/tools/generateProps.js";
import { PADDING_CAMEL_KEYS, PADDING_CAMEL_SET } from "./constants";
import { normalizeCalcValue, parseCssLengthToPx } from "./cssSizeUtils";

export const getShellPaddingCssValue = (value) => {
    if (value == null) return null;
    if (value === 0 || value === "0") return "0";
    if (typeof value === "number") return `${value}rem`;

    const raw = String(value).trim();
    if (!raw) return null;

    const singleToken = raw.replace(/\s+/g, "");
    if (/^-?\d+(\.\d+)?$/.test(singleToken)) return `${singleToken}rem`;

    return normalizeCalcValue(raw.replace(/\s+/g, " "));
};

const expandPaddingShorthandPx = (parts) => {
    if (!parts.length) return [0, 0, 0, 0];
    if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
    if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
    if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];

    return [parts[0], parts[1], parts[2], parts[3]];
};

export const getShellPaddingInsetsPx = (shellPaddingStyle) => {
    if (!shellPaddingStyle || typeof shellPaddingStyle !== "object") {
        return { x: 0, y: 0 };
    }

    const p = shellPaddingStyle;

    let top = 0;
    let right = 0;
    let bottom = 0;
    let left = 0;

    if (p.padding != null) {
        const parts = String(p.padding).trim().split(/\s+/).map(parseCssLengthToPx);
        [top, right, bottom, left] = expandPaddingShorthandPx(parts);
    }

    if (p.paddingTop != null) top = parseCssLengthToPx(p.paddingTop);
    if (p.paddingRight != null) right = parseCssLengthToPx(p.paddingRight);
    if (p.paddingBottom != null) bottom = parseCssLengthToPx(p.paddingBottom);
    if (p.paddingLeft != null) left = parseCssLengthToPx(p.paddingLeft);

    if (p.paddingBlock != null) {
        const parts = String(p.paddingBlock).trim().split(/\s+/).map(parseCssLengthToPx);
        top = parts[0] ?? 0;
        bottom = parts[1] ?? parts[0] ?? 0;
    }

    if (p.paddingInline != null) {
        const parts = String(p.paddingInline).trim().split(/\s+/).map(parseCssLengthToPx);
        left = parts[0] ?? 0;
        right = parts[1] ?? parts[0] ?? 0;
    }

    if (p.paddingBlockStart != null) top = parseCssLengthToPx(p.paddingBlockStart);
    if (p.paddingBlockEnd != null) bottom = parseCssLengthToPx(p.paddingBlockEnd);
    if (p.paddingInlineStart != null) left = parseCssLengthToPx(p.paddingInlineStart);
    if (p.paddingInlineEnd != null) right = parseCssLengthToPx(p.paddingInlineEnd);

    return {
        x: Math.round(left + right),
        y: Math.round(top + bottom),
    };
};

const styleKeyToPaddingCamel = (key) => {
    if (typeof key !== "string") return null;
    if (PADDING_CAMEL_SET.has(key)) return key;
    if (!key.startsWith("padding")) return null;
    if (!key.includes("-")) return null;

    const camel = key.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());

    return PADDING_CAMEL_SET.has(camel) ? camel : null;
};

const buildShellPaddingStyleFromMerged = (merged) => {
    const shell = {};

    for (const key of PADDING_CAMEL_KEYS) {
        if (merged[key] == null) continue;

        const css = getShellPaddingCssValue(merged[key]);
        if (css != null) shell[key] = css;
    }

    return shell;
};

export const splitShellPaddingFromRestProps = (restProps) => {
    if (!restProps || typeof restProps !== "object") {
        return {
            shellPaddingStyle: {},
            restPropsWithoutShellPadding: {},
        };
    }

    const mergedTop = mergeFlexKebabPropAliases(restProps);
    let shellPaddingStyle = buildShellPaddingStyleFromMerged(mergedTop);

    const next = { ...restProps };

    for (const key of PADDING_CAMEL_KEYS) {
        delete next[key];
    }

    for (const [kebab, camel] of Object.entries(FLEX_PROPS_KEBAB_TO_CAMEL)) {
        if (PADDING_CAMEL_SET.has(camel)) delete next[kebab];
    }

    if (next.style && typeof next.style === "object") {
        const nextStyle = { ...next.style };

        for (const key of Object.keys(nextStyle)) {
            const camel = styleKeyToPaddingCamel(key);

            if (camel == null) continue;

            const value = nextStyle[key];

            if (value != null && shellPaddingStyle[camel] == null) {
                const css = getShellPaddingCssValue(value);
                if (css != null) shellPaddingStyle = { ...shellPaddingStyle, [camel]: css };
            }

            delete nextStyle[key];
        }

        if (Object.keys(nextStyle).length) next.style = nextStyle;
        else delete next.style;
    }

    return {
        shellPaddingStyle: Object.keys(shellPaddingStyle).length ? shellPaddingStyle : {},
        restPropsWithoutShellPadding: next,
    };
};
