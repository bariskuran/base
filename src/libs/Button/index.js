import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./_Base.jsx";
//
import { DefaultVariant } from "./DefaultVariant.js";
import Brackets from "./Brackets.js";
import Underline from "./Underline.js";
import AnimatedBg from "./AnimatedBg.js";
import String from "./String.js";

export const Button = componentCreator("Button", Base, DefaultVariant, {
    error: { bgColor: "error" },
    success: { bgColor: "success" },
    warning: { bgColor: "warning" },
    primary: { primary: true },
    secondary: { secondary: true },
    brackets: Brackets,
    underline: Underline,
    animatedBg: AnimatedBg,
    string: String,
});
