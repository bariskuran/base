import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { typeOf } from ".";
import { Typography } from "../Typography";

const multi = typeOf(1, "x", null, [], new Date(0));

const X = () => (
    <Ds.page title="<typeOf>" releasedOn="1.0.0" description="Extended type detector helper.">
        <Ds.block
            title="Single and Multi Input"
            code={`import { typeOf } from "${SYS.basePath}";

typeOf(null); // "null"
typeOf(1, "x", []); // ["number","string","array"]`}
            example={
                <>
                    <Typography.span children={`typeOf(null): ${typeOf(null)}`} />
                    <Typography.span children={`typeOf(...): ${JSON.stringify(multi)}`} />
                </>
            }
        />
        <Ds.api
            props={{
                "...args": { description: "One or more values to inspect.", type: "any[]", required: false, defaultValue: "[]" },
                return: {
                    description: "undefined with no args, string with one arg, array with multiple args.",
                    type: "undefined | string | string[]",
                    required: true,
                    defaultValue: "undefined",
                },
            }}
        />
    </Ds.page>
);

export default X;
