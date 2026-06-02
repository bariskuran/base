import { FLEX_PROPS_OMIT_FOR_DOM } from "./generateProps.js";

const STYLED_COMPONENTS_NON_DOM_PROPS = new Set([
    "theme",
    "as",
    "forwardedAs",
    "componentStyle",
    "foldedComponentIds",
    "styledComponentId",
    "warnTooManyClasses",

    "render",
]);

export const getFlexDomRestProps = (props) => {
    if (props == null) return {};

    const out = {};

    for (const key of Object.keys(props)) {
        if (FLEX_PROPS_OMIT_FOR_DOM.has(key)) continue;
        if (STYLED_COMPONENTS_NON_DOM_PROPS.has(key)) continue;
        if (key.startsWith("$")) continue;
        if (key.startsWith("__sc")) continue;
        out[key] = props[key];
    }

    return out;
};
