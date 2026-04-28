import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { clearUndefinedDeep } from ".";
import { Typography } from "../Typography";

const sample = {
    a: 1,
    b: undefined,
    c: { d: 2, e: undefined },
    f: [1, undefined, { g: undefined, h: 3 }],
};

const X = () => (
    <Ds.page
        title="<clearUndefinedDeep>"
        releasedOn="1.0.0"
        description="Removes undefined keys recursively."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { clearUndefinedDeep } from "${SYS.basePath}";

const cleaned = clearUndefinedDeep(sample);`}
            example={
                <Typography.span children={JSON.stringify(clearUndefinedDeep(sample), null, 2)} />
            }
        />
        <Ds.api
            props={{
                obj: {
                    description: "Input value to clean.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "New value with undefined entries removed from objects.",
                    type: "any",
                    required: true,
                    defaultValue: "cleaned clone",
                },
            }}
        />
    </Ds.page>
);

export default X;
