import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { deepMerge } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
const oldData = {
    user: {
        profile: { firstName: "Baris", lastName: "Kuran" },
        preferences: { theme: "dark", language: "en" },
    },
    stats: { login: { total: 12, lastDays: [1, 2, 3] } },
};

const newData = {
    user: {
        preferences: { language: "tr", timezone: "Europe/Istanbul" },
    },
    stats: { login: { total: 13, lastDays: [4] } },
};

const merged = deepMerge(oldData, newData);

const X = () => (
    <Ds.page
        title="deepMerge()"
        releasedOn="1.0.0"
        description="Deep merges plain objects. When paths overlap, newData values override oldData."
    >
        <Ds.block
            title="3-level merge example"
            code={`import { deepMerge } from "${SYS.basePath}";

                    const merged = deepMerge(oldData, newData);`}
            example={
                <Flex gap={30}>
                    <Flex.column gap={10} padding={10} align="stretch">
                        <Typo.bold balance>oldData</Typo.bold>
                        <Typo.code>{JSON.stringify(oldData, null, 2)}</Typo.code>
                    </Flex.column>
                    <Flex alignItems="center">
                        <Typo size={40} selfAlign="center">
                            +
                        </Typo>
                    </Flex>
                    <Flex.column gap={10} bgColor="backgrounds.shade2" padding={10}>
                        <Typo.bold balance>newData (overrides)</Typo.bold>
                        <Typo.code>{JSON.stringify(newData, null, 2)}</Typo.code>
                    </Flex.column>
                    <Flex alignItems="center">
                        <Typo size={40} selfAlign="center">
                            =
                        </Typo>
                    </Flex>
                    <Flex.column gap={10} bgColor="backgrounds.shade4" padding={10}>
                        <Typo.bold balance>merged result</Typo.bold>
                        <Typo.code>{JSON.stringify(merged, null, 2)}</Typo.code>
                    </Flex.column>
                </Flex>
            }
        />
        <Ds.api
            args="deepMerge(oldData, newData);"
            returns="Deep-merged plain object/array result."
            props={{
                oldData: {
                    description: "Base value.",
                    type: "any",
                    required: true,
                },
                newData: {
                    description: "Incoming value to merge.",
                    type: "any",
                    required: true,
                },
            }}
        />
    </Ds.page>
);

export default X;
