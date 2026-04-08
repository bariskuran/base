import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import opposite from "./Opposite";
import { DefaultVariant } from "./DefaultVariant";
import threeD from "./ThreeD";

export const ScrollBox = componentCreator("ScrollBox", Base, DefaultVariant, {
    opposite: opposite,
    threeD: threeD,
});
