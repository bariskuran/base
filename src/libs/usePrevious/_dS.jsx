import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { usePrevious } from ".";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { baseStore } from "../@baseStore";

const X = () => {
    const { count, setLocal } = baseStore.useLocal({ count: 0 });
    const [previous] = usePrevious(count);

    return (
        <Ds.page title="usePrevious()" releasedOn="1.0.0" description="Keeps previous render value.">
            <Ds.block
                title="Previous Value Tracking"
                code={`import { usePrevious } from "${SYS.basePath}";

const [prev, setPrev] = usePrevious(value);`}
                example={
                    <Flex.column gap={8}>
                        <Button
                            label={`count: ${count}`}
                            onClick={() =>
                                setLocal((s) => {
                                    s.count += 1;
                                })
                            }
                        />
                        <Typo.span>{`previous: ${String(previous)}`}</Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                args="const [previousValue, setPreviousValue] = usePrevious(value);"
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
                        type: "function",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
