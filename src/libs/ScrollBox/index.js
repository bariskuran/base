import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import opposite from "./Opposite";
import { DefaultVariant } from "./DefaultVariant";
import threeD from "./ThreeD";
import { CleanVariant } from "./CleanVariant.js";

export const ScrollBox = componentCreator({
    name: "ScrollBox",
    BaseComp: Base,
    DefaultVariant,
    CleanVariant,
    variants: {
        clean: CleanVariant,
        opposite: opposite,
        threeD: threeD,
    },
});
