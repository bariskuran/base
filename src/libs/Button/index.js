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
import WithCopyIcon from "./WithCopyIcon.js";

export const buttonVariants = {
    brackets: Brackets,
    underline: Underline,
    animatedBg: AnimatedBg,
    string: String,
    plain: Plain,
    default: DefaultVariant,
    squareOnRight: SquareOnRight,
};

const genericVariants = {
    closeIcon: {
        ...Plain,
        bgColor: "transparent",
        color: "inherit",
        hoverBgColor: "transparent",
        activeBgColor: "transparent",
        icon: {
            icon: "close",
            width: 12,
        },
    },
    withCopyIcon: {
        ...WithCopyIcon,
        bgColor: "transparent",
        hoverBgColor: "transparent",
        activeBgColor: "transparent",
        color: "inherit",
        prefix: {
            icon: "copy",
            width: 10,
            color: "inherit",
            hoverColor: "primary",
            activeColor: "success",
            flat: true,
        },
    },
};

export const Button = componentCreator({
    name: "Button",
    BaseComp: Base,
    DefaultVariant,
    variants: { ...buttonVariants, ...genericVariants },
});
