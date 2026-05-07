import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant";
import { PlainVariant } from "./PlainVariant.js";

export const FloatingUi = componentCreator({
    name: "FloatingUi",
    BaseComp: Base,
    DefaultVariant,
    PlainVariant,
    variants: {
        // opposite: opposite,
        // threeD: threeD,
    },
});
