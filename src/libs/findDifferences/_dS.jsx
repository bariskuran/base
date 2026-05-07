import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { findDifferences } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const oldData = { user: { name: "Baris", age: 29 }, list: [1, 2, 3] };
const newData = { user: { name: "Baris", age: 30 }, list: [1, 3, 3] };

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
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
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Typo.pre whiteSpace="pre-wrap">
                            {`oldData = ${JSON.stringify(oldData, null, 2)}\nnewData = ${JSON.stringify(newData, null, 2)}`}
                        </Typo.pre>
                        <Button.string
                            label="Run findDifferences(oldData, newData)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(findDifferences(oldData, newData), null, 2);
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{output}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="findDifferences(oldData, newData, settings);"
                returns="Object with changedPaths and differences tree."
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
                    settings: {
                        description: "{ isEqualSettings }",
                        type: "object",
                        defaultValue: "{}",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
