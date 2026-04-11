import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant";
import { CleanVariant } from "./CleanVariant.js";

export const FloatingUi = componentCreator({
    name: "FloatingUi",
    BaseComp: Base,
    DefaultVariant,
    CleanVariant,
    variants: {
        // opposite: opposite,
        // threeD: threeD,
    },
});
