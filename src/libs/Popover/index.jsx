import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";

/**
 * Popover floating ui kullanan bir yapı. Ancak content ve childrenları PopTip'e göre farklı işliyor. children ve content yer değiştiriyor kullanırken. content olarak bir Button komponenti var default olarak.
 *
 *
 *
 */

export const Popover = componentCreator("Popover", Base, {
    error: (p) => <Base bgColor="error" {...p} />,
    success: (p) => <Base bgColor="success" {...p} />,
    warning: (p) => <Base bgColor="warning" {...p} />,
    primary: (p) => <Base primary {...p} />,
    secondary: (p) => <Base secondary {...p} />,
});
