import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";

export const ScrollBox = componentCreator("ScrollBox", Base, {
    // error: (p) => <Base bgColor="error" {...p} />,
});
