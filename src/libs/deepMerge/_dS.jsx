import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { deepMerge } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const before = { a: 1, nested: { x: 10, y: 20 }, list: [1, 2, 3] };
const incoming = { nested: { y: 99 }, list: [4], b: 2 };

const X = () => {
    const { outBasic, outArray, setLocal } = baseStore.useLocal({ outBasic: null, outArray: null });

    return (
        <Ds.page title="deepMerge()" releasedOn="1.0.0" description="Deep merges plain objects.">
            <Ds.block
                title="Basic usage"
                code={`import { deepMerge } from "${SYS.basePath}";

const merged = deepMerge(
  { a: 1, nested: { x: 10, y: 20 } },
  { nested: { y: 99 }, b: 2 }
);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run deepMerge(base, patch)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.outBasic = JSON.stringify(
                                        deepMerge(
                                            { a: 1, nested: { x: 10, y: 20 } },
                                            { nested: { y: 99 }, b: 2 },
                                        ),
                                        null,
                                        2,
                                    );
                                })
                            }
                        />
                        <Space size="l" />
                        {outBasic != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{outBasic}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.block
                title="Array merge rule"
                code={`import { deepMerge } from "${SYS.basePath}";

deepMerge({ list: [1, 2, 3] }, { list: [4] });`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Typo.pre whiteSpace="pre-wrap">
                            {`before: ${JSON.stringify(before)}\nincoming: ${JSON.stringify(incoming)}`}
                        </Typo.pre>
                        <Button.string
                            label="Run deepMerge(before, incoming)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.outArray = JSON.stringify(deepMerge(before, incoming), null, 2);
                                })
                            }
                        />
                        <Space size="l" />
                        {outArray != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{outArray}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="deepMerge(oldData, newData);"
                returns="Deep-merged plain object/array result."
                props={{
                    oldData: {
                        description: "Existing/base value.",
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
};

export default X;
