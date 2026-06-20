import Amedist from "./Amedist";

const defaultVariantKey = "amedist";
const variants = {
    amedist: Amedist,
};

export const Slider = variants[defaultVariantKey];
Object.assign(Slider, variants);
Slider.displayName = "Slider";
Object.entries(variants).forEach(([key, Component]) => {
    if (Component) Component.displayName = `Slider.${key}`;
});
