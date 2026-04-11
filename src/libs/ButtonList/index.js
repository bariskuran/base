import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant.js";
import { CleanVariant } from "./CleanVariant.js";

export const ButtonList = componentCreator({
    name: "ButtonList",
    BaseComp: Base,
    DefaultVariant,
    CleanVariant,
    variants: {
        row: { direction: "row" },
        column: { direction: "column" },
    },
});
