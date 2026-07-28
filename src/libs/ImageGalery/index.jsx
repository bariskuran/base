import { Base } from "./_Base";
import Amedist from "./Amedist";

const variants = {
    amedist: Amedist,
};

const defaultVariantKey = "amedist";

export const ImageGalery = ({ variant = defaultVariantKey, ...props } = {}) => {
    const Variant = variants[variant] || variants[defaultVariantKey];
    return <Base {...props} Variant={Variant} />;
};

Object.entries(variants).forEach(([key, Variant]) => {
    const Preset = (props) => <Base {...props} Variant={Variant} />;
    Preset.displayName = `ImageGalery.${key}`;
    ImageGalery[key] = Preset;
});

ImageGalery.displayName = "ImageGalery";

export const ImageGallery = ImageGalery;
