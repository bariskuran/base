import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant";
import shadow from "./WithShadow";
import hoverShadow from "./WithHoverShadow";
import { PlainVariant } from "./PlainVariant.js";

export const ScrollFlex = componentCreator({
    name: "ScrollFlex",
    BaseComp: Base,
    DefaultVariant,
    PlainVariant,
    variants: {
        /** Nesne şart: styled bileşenler `function` olduğu için creator bunları fabrika sanmasın. */
        plain: { variant: PlainVariant },
        border: { variant: DefaultVariant },
        shadow,
        hoverShadow,
    },
});
