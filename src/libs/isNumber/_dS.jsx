import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isNumber } from ".";
import { Typo } from "../Typo";

const X = () => (
    <Ds.page title="<isNumber>" releasedOn="1.0.0" description="Checks finite numeric values.">
        <Ds.block
            title="Basic Usage"
            code={`import { isNumber } from "${SYS.basePath}";

isNumber(12); // true
isNumber("12.4"); // true
isNumber("abc"); // false`}
            example={
                <>
                    <Typo.span children={`12 => ${String(isNumber(12))}`} />
                    <Typo.span children={`"12.4" => ${String(isNumber("12.4"))}`} />
                    <Typo.span children={`"abc" => ${String(isNumber("abc"))}`} />
                </>
            }
        />
        <Ds.api
            props={{
                data: {
                    description: "Value to check.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "True for finite numeric-like values.",
                    type: "boolean",
                    required: true,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
