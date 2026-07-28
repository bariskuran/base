import Amedist from "./Amedist";

const defaultVariantKey = "amedist";
const variants = { amedist: Amedist };

export const HeaderCover = variants[defaultVariantKey];
Object.assign(HeaderCover, variants);
HeaderCover.displayName = "HeaderCover";
Object.entries(variants).forEach(([key, Component]) => {
    if (Component) Component.displayName = `HeaderCover.${key}`;
});
