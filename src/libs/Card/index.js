import { componentCreator } from "helpers/componentCreator";
import { Base } from "./_Base.jsx";
import Amedist from "./Amedist/index.jsx";

export const cardVariants = {
    amedist: Amedist,
};

export const Card = componentCreator({
    name: "Card",
    BaseComp: Base,
    DefaultVariant: Amedist,
    variants: cardVariants,
});
