import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { pushAsSorted } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="pushAsSorted()"
            releasedOn="1.0.0"
            description="Pushes and sorts with neighbor info."
        >
            <Ds.block
                title="Basic usage"
                code={`import { pushAsSorted } from "${SYS.basePath}";

const [sorted, index, lower, upper] = pushAsSorted([5, 1, 3], 4);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run pushAsSorted([5, 1, 3], 4)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(pushAsSorted([5, 1, 3], 4));
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.code>{output}</Typo.code>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="pushAsSorted(arr, el);"
                returns="Tuple: sorted array, insert index, lower neighbor, upper neighbor."
                props={{
                    arr: {
                        description: "Input array.",
                        type: "any[]",
                        defaultValue: "[]",
                    },
                    el: {
                        description: "Element to push.",
                        type: "any",
                        defaultValue: "0",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
