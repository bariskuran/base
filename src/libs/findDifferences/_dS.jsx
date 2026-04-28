import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { findDifferences } from ".";
import { Typography } from "../Typography";

const oldData = { user: { name: "Baris", age: 29 }, list: [1, 2, 3] };
const newData = { user: { name: "Baris", age: 30 }, list: [1, 3, 3] };
const diff = findDifferences(oldData, newData);

const X = () => (
    <Ds.page
        title="<findDifferences>"
        releasedOn="1.0.0"
        description="Builds diff tree and changed paths."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { findDifferences } from "${SYS.basePath}";

const { changedPaths, differences } = findDifferences(oldData, newData);`}
            example={<Typography.span children={JSON.stringify(diff)} />}
        />
        <Ds.api
            props={{
                oldData: {
                    description: "Previous value.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                newData: {
                    description: "Next value.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                settings: {
                    description: "{ isEqualSettings }",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                return: {
                    description: "{ changedPaths, differences }",
                    type: "object",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;
