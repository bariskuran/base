import { componentCreator } from "../componentCreator/index.jsx";
import { Base } from "./_Base.jsx";
//
import Brackets from "./Brackets.js";
import Underline from "./Underline.js";
import AnimatedBg from "./AnimatedBg.js";
import String from "./String.js";

export const Button = componentCreator("Button", Base, {
    error: (p) => <Base bgColor="error" {...p} />,
    success: (p) => <Base bgColor="success" {...p} />,
    warning: (p) => <Base bgColor="warning" {...p} />,
    primary: (p) => <Base primary {...p} />,
    secondary: (p) => <Base secondary {...p} />,
    brackets: (p) => <Base {...p} {...Brackets} />,
    underline: (p) => <Base {...p} {...Underline} />,
    animatedBg: (p) => <Base {...p} {...AnimatedBg} />,
    string: (p) => <Base {...p} {...String} />,
});
