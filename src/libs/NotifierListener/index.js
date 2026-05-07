import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./tools/Base";
import { DefaultVariant } from "./DefaultVariant";
import { PlainVariant } from "./PlainVariant.js";

export const NotifierListener = componentCreator({
    name: "NotifierListener",
    BaseComp: Base,
    DefaultVariant,
    PlainVariant,
    variants: {
        // opposite: opposite,
    },
});
