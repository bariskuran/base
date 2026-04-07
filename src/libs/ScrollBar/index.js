import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import Body from "./Body";
import { DefaultVariant } from "./DefaultVariant.js";

export const ScrollBar = componentCreator("ScrollBar", Base, DefaultVariant, {
    body: Body,
});
