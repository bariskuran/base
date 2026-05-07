import { forwardRef } from "react";
import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant.js";
import { PlainVariant } from "./PlainVariant.js";

/** Accept both new and legacy variant spellings for ScrollFlex. */
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

const ButtonListCore = componentCreator({
    name: "ButtonList",
    BaseComp: Base,
    DefaultVariant,
    PlainVariant,
    variants: {},
});

export const ButtonList = forwardRef(function ButtonList(props, forwardedRef) {
    const { variant, ...rest } = props || {};
    const scrollFlexVariant = normalizeScrollFlexVariant(variant);

    return (
        <ButtonListCore
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

ButtonList.displayName = "ButtonList";

ButtonList.column = forwardRef(function ButtonListColumn(props, forwardedRef) {
    const { flexProps, ...rest } = props || {};
    return (
        <ButtonList
            ref={forwardedRef}
            {...rest}
            flexProps={{ direction: "column", ...(flexProps || {}) }}
        />
    );
});

ButtonList.column.displayName = "ButtonList.column";
