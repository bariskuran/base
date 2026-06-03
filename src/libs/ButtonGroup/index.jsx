import { forwardRef } from "react";
import { Base } from "./tools/_Base";
import { componentCreator } from "helpers/componentCreator";
import { DefaultVariant } from "./DefaultVariant.js";
import { PlainVariant } from "./PlainVariant.js";

const SCROLL_FLEX_VARIANT_ALIAS_MAP = {
    plain: "plain",
    border: "border",
    shadow: "shadow",
    hovershadow: "hoverShadow",
    withshadow: "shadow",
    withhovershadow: "hoverShadow",
};

const normalizeScrollFlexVariant = (variant) => {
    if (typeof variant !== "string") return undefined;
    const key = variant.trim().toLowerCase();
    return SCROLL_FLEX_VARIANT_ALIAS_MAP[key];
};

const ButtonGroupCore = componentCreator({
    name: "ButtonGroup",
    BaseComp: Base,
    DefaultVariant,
    PlainVariant,
    variants: {},
});

export const ButtonGroup = forwardRef(function ButtonGroup(props, forwardedRef) {
    const { variant, ...rest } = props || {};
    const scrollFlexVariant = normalizeScrollFlexVariant(variant);

    return (
        <ButtonGroupCore
            ref={forwardedRef}
            {...rest}
            {...(scrollFlexVariant != null
                ? { scrollFlexVariant }
                : variant !== undefined
                  ? { variant }
                  : {})}
        />
    );
});

ButtonGroup.displayName = "ButtonGroup";

ButtonGroup.column = forwardRef(function ButtonGroupColumn(props, forwardedRef) {
    const { flexProps, ...rest } = props || {};
    return (
        <ButtonGroup
            ref={forwardedRef}
            {...rest}
            flexProps={{ direction: "column", ...(flexProps || {}) }}
        />
    );
});

ButtonGroup.column.displayName = "ButtonGroup.column";
