import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import opposite from "./Opposite";
import { DefaultVariant } from "./DefaultVariant";

export const ScrollBox = componentCreator("ScrollBox", Base, DefaultVariant, {
    opposite: opposite,
});
