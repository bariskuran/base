import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
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
        /** Nesne şart: styled bileşenler `function` olduğu için creator bunları fabrika sanmasın. */
        plain: { variant: Plain },
        border: { variant: DefaultVariant },
        shadow,
        hoverShadow,
    },
});
