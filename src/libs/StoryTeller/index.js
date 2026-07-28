import { createElement } from "react";
import Amedist from "./Amedist";

const defaultVariantKey = "amedist";
const variants = {
    amedist: Amedist,
};

export const StoryTeller = ({ variant = defaultVariantKey, ...props } = {}) =>
    createElement(variants[variant] || variants[defaultVariantKey], props);

Object.assign(StoryTeller, variants);
StoryTeller.displayName = "StoryTeller";
Object.entries(variants).forEach(([key, Component]) => {
    if (Component) Component.displayName = `StoryTeller.${key}`;
});
