import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isContainer } from ".";
import { Typography } from "../Typography";

const X = () => (
    <Ds.page title="<isContainer>" releasedOn="1.0.0" description="Checks array or plain object.">
        <Ds.block
            title="Basic Usage"
            code={`import { isContainer } from "${SYS.basePath}";

isContainer([]); // true
isContainer({}); // true
isContainer(new Date()); // false`}
            example={
                <>
                    <Typography.span children={`[] => ${String(isContainer([]))}`} />
                    <Typography.span children={`{} => ${String(isContainer({}))}`} />
                    <Typography.span children={`Date => ${String(isContainer(new Date()))}`} />
                </>
            }
        />
        <Ds.api
            props={{
                value: {
                    description: "Value to test.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "True for array or plain object.",
                    type: "boolean",
                    required: true,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
