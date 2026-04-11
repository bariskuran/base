import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./tools/_Base.jsx";

export const Typo = componentCreator({
    name: "Typo",
    BaseComp: Base,
    variants: {
        column: { direction: "column" },
    },
});
