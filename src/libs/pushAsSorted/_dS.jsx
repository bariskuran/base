import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { pushAsSorted } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

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
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label='pushAsSorted([5, 1, 3], 4)'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => pushAsSorted([5, 1, 3], 4),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
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
