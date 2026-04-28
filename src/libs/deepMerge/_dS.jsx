import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { deepMerge } from ".";
import { Typography } from "../Typography";

const before = { a: 1, nested: { x: 10, y: 20 }, list: [1, 2] };
const incoming = { nested: { y: 99 }, list: [4], b: 2 };
const merged = deepMerge(before, incoming);

const X = () => (
    <Ds.page title="<deepMerge>" releasedOn="1.0.0" description="Deep merges plain objects.">
        <Ds.block
            title="Basic Usage"
            code={`import { deepMerge } from "${SYS.basePath}";

const merged = deepMerge(
  { a: 1, nested: { x: 10, y: 20 } },
  { nested: { y: 99 }, b: 2 }
);`}
            example={<Typography.span children={JSON.stringify(merged)} />}
        />
        <Ds.block
            title="Merge Rules"
            code={`deepMerge({ list: [1, 2, 3] }, { list: [4] }); // arrays are replaced`}
            example={
                <Typography.span
                    children={`before: ${JSON.stringify(before)} | incoming: ${JSON.stringify(incoming)}`}
                />
            }
        />
        <Ds.api
            props={{
                oldData: {
                    description: "Existing/base value.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                newData: {
                    description: "Incoming value to merge.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "Merged result.",
                    type: "any",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;
