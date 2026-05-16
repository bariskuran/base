import { mergeFlexKebabPropAliases } from "../../Flex/tools/generateProps.js";
import { CONTENT_FLEX_PART_KEYS } from "./constants";
import { getCssSize, getLayoutSizeCss } from "./cssSizeUtils";

export const resolveContentFlexShorthand = (props) => {
    const merged = mergeFlexKebabPropAliases(props || {});

    const explicitFlex =
        merged.flex != null && String(merged.flex).trim() !== ""
            ? String(merged.flex).trim()
            : null;

    const growRaw = merged.flexGrow;
    const shrinkRaw = merged.flexShrink;
    const basisRaw = merged.flexBasis;

    const hasGrow = growRaw != null && growRaw !== "";
    const hasShrink = shrinkRaw != null && shrinkRaw !== "";
    const hasBasis = basisRaw != null && basisRaw !== "";
    const hasParts = hasGrow || hasShrink || hasBasis;

    if (explicitFlex) return explicitFlex;
    if (!hasParts) return null;

    const grow = hasGrow ? String(growRaw) : "0";
    const shrink = hasShrink ? String(shrinkRaw) : "0";
    const basis = hasBasis ? getLayoutSizeCss(basisRaw) ?? getCssSize(basisRaw) : "auto";

    return `${grow} ${shrink} ${basis}`;
};

export const applyContentFlexProps = (props) => {
    if (!props || typeof props !== "object") return props;

    const shorthand = resolveContentFlexShorthand(props);
    const out = { ...props };

    for (const key of CONTENT_FLEX_PART_KEYS) {
        delete out[key];
    }

    if (shorthand == null) return out;

    const style = { ...(out.style || {}), flex: shorthand };

    return { ...out, flex: shorthand, style };
};

export const mergeDefaultAlignment = (props) => {
    const hasDirectJustify = props.justify != null || props.justifyContent != null;
    const hasDirectAlign = props.alignItems != null || props.align != null;
    const hasAxisAlign = props.xAlign != null || props.yAlign != null;

    if (hasAxisAlign) {
        return {
            ...props,
            ...(props.xAlign == null && !hasDirectJustify ? { xAlign: "start" } : {}),
            ...(props.yAlign == null && !hasDirectAlign ? { yAlign: "start" } : {}),
        };
    }

    return {
        ...props,
        ...(hasDirectJustify ? {} : { justify: "start" }),
        ...(hasDirectAlign ? {} : { align: "start" }),
    };
};
