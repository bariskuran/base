import { createElement } from "react";
import Amedist from "./Amedist";
import AmedistHorizontalLeft from "./amedistHorizontalLeft";
import AmedistHorizontalRight from "./amedistHorizontalRight";
import AmedistVertical from "./amedistVertical";

const defaultVariantKey = "amedist";
const variants = {
    amedist: Amedist,
    amedistHorizontalLeft: AmedistHorizontalLeft,
    amedistHorizontalRight: AmedistHorizontalRight,
    amedistVertical: AmedistVertical,
};

export const BlockBuilder = ({ variant = defaultVariantKey, ...props } = {}) =>
    createElement(variants[variant] || variants[defaultVariantKey], props);

Object.assign(BlockBuilder, variants);
BlockBuilder.displayName = "BlockBuilder";
Object.entries(variants).forEach(([key, Component]) => {
    if (Component) Component.displayName = `BlockBuilder.${key}`;
});
