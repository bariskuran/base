import Amedist from "./Amedist";

const defaultVariantKey = "amedist";
const variants = {
    amedist: Amedist,
};

export const ScrollAnimatedItem = variants[defaultVariantKey];
Object.assign(ScrollAnimatedItem, variants);
ScrollAnimatedItem.displayName = "ScrollAnimatedItem";
Object.entries(variants).forEach(([key, Component]) => {
    if (Component) Component.displayName = `ScrollAnimatedItem.${key}`;
});
