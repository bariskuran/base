import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./tools/Base";
import { DefaultVariant } from "./DefaultVariant";
import { CleanVariant } from "./CleanVariant.js";

export const NotifierListener = componentCreator({
    name: "NotifierListener",
    BaseComp: Base,
    DefaultVariant,
    CleanVariant,
    variants: {
        // opposite: opposite,
    },
});
