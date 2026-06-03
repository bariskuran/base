import { Base } from "./tools/_Base";
import { componentCreator } from "helpers/componentCreator";
import { DefaultVariant } from "./DefaultVariant";
import { PlainVariant } from "./PlainVariant.js";

export const FloatingUi = componentCreator({
    name: "FloatingUi",
    BaseComp: Base,
    DefaultVariant,
    PlainVariant,
    variants: {},
});
