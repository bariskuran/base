import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant.js";

export const ButtonList = componentCreator("ButtonList", Base, DefaultVariant, {
    row: { direction: "row" },
    column: { direction: "column" },
});
