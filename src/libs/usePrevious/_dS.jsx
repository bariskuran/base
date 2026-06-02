import { useEffect } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { usePrevious } from ".";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { baseStore } from "../baseStore";

const X = () => {
    const { count, set } = baseStore.useLocal({ count: 0 });
    const { previousValue: prevCount, onChange } = usePrevious(count);

    useEffect(
        () =>
            onChange(({ previousValue, currentValue }) => {
                console.log("count changed from", previousValue, "to", currentValue);
            }),
        [onChange],
    );

    return (
        <Ds.page
            title="usePrevious()"
            releasedOn="1.0.0"
            description="Keeps previous render value."
        >
            <Ds.block
                title="Previous Value Tracking"
                code={`import { usePrevious, baseStore } from "${SYS.basePath}";

                       const { count, set } = baseStore.useLocal({ count: 0 });
                       const { previousValue, setPreviousValue, onChange } = usePrevious(count);

                       onChange(({ previousValue, currentValue }) => {
                       console.log("count changed from", previousValue, "to", currentValue);
                       });`}
                example={
                    <Flex.column gap={8}>
                        <Button.plain
                            label="add +1"
                            skipClickCooldown
                            skipOnClickHold
                            onClick={() =>
                                set((s) => {
                                    s.count += 1;
                                })
                            }
                        />
                        <Typo.span>
                            count changed from {String(prevCount)} to {count}
                        </Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const { previousValue, setPreviousValue, onChange } = usePrevious(value);"
                props={{
                    value: {
                        description: "Current value to track.",
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    previousValue: {
                        description: "Value from the previous render.",
                        type: "any",
                    },
                    setPreviousValue: {
                        description: "Manually sets the stored previous value.",
                        type: "fn",
                    },
                    onChange: {
                        description: "Registers a change listener.",
                        type: "fn",
                    },
                }}
            />
            <Ds.api
                title="onChange"
                args="onChange(({ previousValue, currentValue }) => {});"
                props={{
                    previousValue: {
                        description: "Value from the previous render.",
                        type: "any",
                    },
                    currentValue: {
                        description: "Current value after the change.",
                        type: "any",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
