import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";

export const PopTip = componentCreator("PopTip", Base, {
    error: (p) => <Base bgColor="error" {...p} />,
    success: (p) => <Base bgColor="success" {...p} />,
    warning: (p) => <Base bgColor="warning" {...p} />,
    primary: (p) => <Base primary {...p} />,
    secondary: (p) => <Base secondary {...p} />,
});
