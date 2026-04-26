import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";
import { DefaultVariant } from "./DefaultVariant";
import withShadow from "./WithShadow";
import with3DShadow from "./With3DShadow";
import { CleanVariant } from "./CleanVariant.js";

export const ScrollFlex = componentCreator({
    name: "ScrollFlex",
    BaseComp: Base,
    DefaultVariant,
    CleanVariant,
    variants: {
        clean: CleanVariant,
        withLine: { variant: DefaultVariant },
        withShadow,
        with3DShadow,
    },
});
