import Amedist from "./Amedist";

const defaultVariantKey = "amedist";
const variants = {
    amedist: Amedist,
};

export const BlockBuilder = variants[defaultVariantKey];
Object.assign(BlockBuilder, variants);
BlockBuilder.displayName = "BlockBuilder";
Object.entries(variants).forEach(([key, Component]) => {
    if (Component) Component.displayName = `BlockBuilder.${key}`;
});
