import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isPlainObject } from ".";
import { Typo } from "../Typo";

const X = () => (
    <Ds.page title="<isPlainObject>" releasedOn="1.0.0" description="Checks plain-object values.">
        <Ds.block
            title="Basic Usage"
            code={`import { isPlainObject } from "${SYS.basePath}";

isPlainObject({ a: 1 }); // true
isPlainObject(new Date()); // false`}
            example={
                <>
                    <Typo.span children={`{} => ${String(isPlainObject({}))}`} />
                    <Typo.span children={`Date => ${String(isPlainObject(new Date()))}`} />
                    <Typo.span children={`[] => ${String(isPlainObject([]))}`} />
                </>
            }
        />
        <Ds.api
            props={{
                v: {
                    description: "Value to test.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "True only for plain object or null-prototype object.",
                    type: "boolean",
                    required: true,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
