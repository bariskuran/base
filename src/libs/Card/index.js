import Amedist from "./Amedist";

const defaultVariantKey = "amedist";
const variants = {
    amedist: Amedist,
};

export const Card = variants[defaultVariantKey];
Object.assign(Card, variants);
Card.displayName = "Card";
Object.entries(variants).forEach(([key, Component]) => {
    if (Component) Component.displayName = `Card.${key}`;
});
