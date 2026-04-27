import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./_Base.jsx";
//
import { DefaultVariant } from "./DefaultVariant.js";
import Brackets from "./Brackets.js";
import Underline from "./Underline.js";
import AnimatedBg from "./AnimatedBg.js";
import String from "./String.js";
import Plain from "./Plain.js";
import SquareOnRight from "./SquareOnRight.js";

export const Button = componentCreator({
    name: "Button",
    BaseComp: Base,
    DefaultVariant,
    variants: {
        error: { bgColor: "error" },
        success: { bgColor: "success" },
        warning: { bgColor: "warning" },
        primary: { primary: true },
        secondary: { secondary: true },
        brackets: Brackets,
        underline: Underline,
        animatedBg: AnimatedBg,
        string: String,
        plain: Plain,
        default: DefaultVariant,
        squareOnRight: SquareOnRight,
        closeIcon: {
            ...Plain,
            bgColor: "transparent",
            color: "foreground",
            hoverBgColor: "transparent",
            activeBgColor: "transparent",
            icon: {
                icon: "close",
                width: 12,
            },
        },
    },
});
