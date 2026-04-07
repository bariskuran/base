import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";

export const PopTip = componentCreator("PopTip", Base, undefined, {
    error: { bgColor: "error" },
    success: { bgColor: "success" },
    warning: { bgColor: "warning" },
    primary: { primary: true },
    secondary: { secondary: true },
});
