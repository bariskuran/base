import { Base } from "./tools/_Base";
import { componentCreator } from "../componentCreator/index.jsx";

export const ActionList = componentCreator("ActionList", Base, {
    row: (p) => <Base direction="row" {...p} />,
    column: (p) => <Base direction="column" {...p} />,
});
