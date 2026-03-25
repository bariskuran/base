import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./_Base.jsx";
import { Brackets } from "./Brackets.js";
import { Underline } from "./Underline.js";
import { AnimatedBg } from "./AnimatedBg.js";

export const Button = componentCreator("Button", Base, {
    brackets: (p) => <Base {...p} {...Brackets} />,
    underline: (p) => <Base {...p} {...Underline} />,
    animatedBg: (p) => <Base {...p} {...AnimatedBg} />,
    amedist1: (p) => <Base color="error" {...p} />,
});
