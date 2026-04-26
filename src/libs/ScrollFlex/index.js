import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant";
import shadow from "./WithShadow";
import hoverShadow from "./WithHoverShadow";
import { CleanVariant } from "./CleanVariant.js";

export const ScrollFlex = componentCreator({
    name: "ScrollFlex",
    BaseComp: Base,
    DefaultVariant,
    CleanVariant,
    variants: {
        clean: CleanVariant,
        border: { variant: DefaultVariant },
        shadow,
        hoverShadow,
    },
});
