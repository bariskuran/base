import { Base } from "./tools/_Base";
import { componentCreator } from "helpers/componentCreator";
import { DefaultVariant } from "./DefaultVariant";
import shadow from "./Shadow";
import hoverShadow from "./HoverShadow";
import { Plain } from "./Plain.js";

export const ScrollFlex = componentCreator({
    name: "ScrollFlex",
    BaseComp: Base,
    DefaultVariant,
    PlainVariant: Plain,
    variants: {

        plain: { variant: Plain },
        border: { variant: DefaultVariant },
        shadow,
        hoverShadow,
    },
});
