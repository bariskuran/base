import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { shallowEqual } from ".";
import { Typography } from "../Typography";

const X = () => (
    <Ds.page title="<shallowEqual>" releasedOn="1.0.0" description="Shallow compare for arrays/plain objects.">
        <Ds.block
            title="Object and Array Checks"
            code={`import { shallowEqual } from "${SYS.basePath}";

shallowEqual({ a: 1 }, { a: 1 }); // true
shallowEqual([1, 2], [1, 2]); // true
shallowEqual({ a: { b: 1 } }, { a: { b: 1 } }); // false`}
            example={
                <>
                    <Typography.span children={`obj: ${String(shallowEqual({ a: 1 }, { a: 1 }))}`} />
                    <Typography.span children={`arr: ${String(shallowEqual([1, 2], [1, 2]))}`} />
                    <Typography.span children={`nested: ${String(shallowEqual({ a: { b: 1 } }, { a: { b: 1 } }))}`} />
                </>
            }
        />
        <Ds.api
            props={{
                a: { description: "First value.", type: "any", required: true, defaultValue: "undefined" },
                b: { description: "Second value.", type: "any", required: true, defaultValue: "undefined" },
                return: { description: "Shallow equality result.", type: "boolean", required: true, defaultValue: "false" },
            }}
        />
    </Ds.page>
);

export default X;
