import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import Body from "./Body";
import { DefaultVariant } from "./DefaultVariant.js";

export const ScrollBar = componentCreator({
    name: "ScrollBar",
    BaseComp: Base,
    DefaultVariant: DefaultVariant,
    variants: {
        body: Body,
        primary: { ...Body, body: false, edgeMargin: undefined },
        fullTop: {
            ...Body,
            body: false,
            mirror: true,
            opposite: true,
            edgeMargin: 0,
            trackMargin: 0,
            thickness: 3,
            fillMode: true,
            disableOpacityEffect: true,
        },
    },
});
