import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { usePrevious } from ".";
import { useState } from "react";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const [count, setCount] = useState(0);
    const [previous] = usePrevious(count);
    return (
        <Flex.column gap={8}>
            <Button label={`count: ${count}`} onClick={() => setCount((v) => v + 1)} />
            <Typo.span>{`previous: ${String(previous)}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page title="usePrevious()" releasedOn="1.0.0" description="Keeps previous render value.">
        <Ds.block
            title="Previous Value Tracking"
            code={`import { usePrevious } from "${SYS.basePath}";

                        const [prev, setPrev] = usePrevious(value);`}
            example={<Demo />}
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

export default X;
