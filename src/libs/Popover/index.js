import { Base } from "./tools/_Base";
import { componentCreator } from "helpers/componentCreator";

export const PopOver = componentCreator({
    name: "PopOver",
    BaseComp: Base,
    variants: {
        error: { bgColor: "error" },
        success: { bgColor: "success" },
        warning: { bgColor: "warning" },
        primary: { bgColor: "primary" },
        secondary: { bgColor: "secondary" },
    },
});
