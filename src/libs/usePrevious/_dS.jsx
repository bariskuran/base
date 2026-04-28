import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { usePrevious } from ".";
import { useState } from "react";
import { Button } from "../Button";
import { Typography } from "../Typography";
import { Flex } from "../Flex";

const Demo = () => {
    const [count, setCount] = useState(0);
    const [previous] = usePrevious(count);
    return (
        <Flex.column xAlign="start" gap={8}>
            <Button label={`count: ${count}`} onClick={() => setCount((v) => v + 1)} />
            <Typography.span>{`previous: ${String(previous)}`}</Typography.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page title="<usePrevious>" releasedOn="1.0.0" description="Keeps previous render value.">
        <Ds.block
            title="Previous Value Tracking"
            code={`import { usePrevious } from "${SYS.basePath}";

const [prev, setPrev] = usePrevious(value);`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                value: { description: "Current value to track.", type: "any", required: true, defaultValue: "undefined" },
                return: {
                    description: "[previousValue, setPreviousValue]",
                    type: "[any, (value:any) => void]",
                    required: true,
                    defaultValue: "[null, fn]",
                },
            }}
        />
    </Ds.page>
);

export default X;
