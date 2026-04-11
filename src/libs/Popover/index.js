import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";

/**
 * Popover floating ui kullanan bir yapı. Ancak content ve childrenları PopTip'e göre farklı işliyor. children ve content yer değiştiriyor kullanırken. content olarak bir Button komponenti var default olarak.
 *
 *
 *
 */

export const Popover = componentCreator({
    name: "Popover",
    BaseComp: Base,
    variants: {
        error: { bgColor: "error" },
        success: { bgColor: "success" },
        warning: { bgColor: "warning" },
        primary: { primary: true },
        secondary: { secondary: true },
    },
});
