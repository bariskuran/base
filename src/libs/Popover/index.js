import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";

export const Popover = componentCreator({
    name: "Popover",
    BaseComp: Base,
    variants: {
        error: { bgColor: "error" },
        success: { bgColor: "success" },
        warning: { bgColor: "warning" },
        primary: { bgColor: "primary" },
        secondary: { bgColor: "secondary" },
    },
});
