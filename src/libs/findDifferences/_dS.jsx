import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { findDifferences } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const oldData = { country: "United Kingdom", user: { name: "Baris", age: 29 }, list: [1, 2, 3] };
const newData = { country: "GB", user: { name: "Baris", age: 30 }, list: [1, 3, 3] };
const diffResult = findDifferences(oldData, newData);

const X = () => (
    <Ds.page
        title="findDifferences()"
        releasedOn="1.0.0"
        description="Builds diff tree and changed paths."
    >
        <Ds.block
            title="Basic usage"
            code={`import { findDifferences } from "${SYS.basePath}";

const { changedPaths, differences } = findDifferences(oldData, newData);`}
            example={
                <Flex gap={16} padding={10} full>
                    <Flex.column gap={8} padding={10} bgColor="backgrounds.shade5" full>
                        <Typo.bold balance>oldData</Typo.bold>
                        <Typo.code>{JSON.stringify(oldData, null, 2)}</Typo.code>
                    </Flex.column>
                    <Flex.column padding={10} gap={8} bgColor="backgrounds.shade15" full>
                        <Typo.bold balance>newData</Typo.bold>
                        <Typo.code>{JSON.stringify(newData, null, 2)}</Typo.code>
                    </Flex.column>
                    <Flex.column padding={10} gap={8} bgColor="backgrounds.shade25" full>
                        <Typo.bold balance>diff tree (differences)</Typo.bold>
                        <Typo.code>{JSON.stringify(diffResult, null, 2)}</Typo.code>
                    </Flex.column>
                </Flex>
            }
        />
        <Ds.api
            args="const { changedPaths, differences } = findDifferences(oldData, newData, { isEqualSettings });"
            props={{
                oldData: {
                    description: "Previous value.",
                    type: "any",
                    required: true,
                },
                newData: {
                    description: "Next value.",
                    type: "any",
                    required: true,
                },
                isEqualSettings: {
                    description: "Forwarded options for internal isEqual checks.",
                    type: "object",
                    defaultValue: "{}",
                },
            }}
            returns="Object with changedPaths and differences tree."
            returnProps={{
                changedPaths: {
                    description: "Array of changed paths.",
                    type: "string[]",
                },
                differences: {
                    description: "Differences tree.",
                    type: "any",
                },
            }}
        />
    </Ds.page>
);

export default X;
