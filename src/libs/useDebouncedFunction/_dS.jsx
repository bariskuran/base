import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useDebouncedFunction } from ".";
import { useState } from "react";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const [calls, setCalls] = useState(0);
    const run = useDebouncedFunction(() => setCalls((v) => v + 1), { delay: 600 });

    return (
        <Flex.column xAlign="start" gap={8}>
            <Button label="Trigger rapidly" onClick={() => [run(), run(), run()]} />
            <Typo.span>{`effective calls: ${calls}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useDebouncedFunction()"
        releasedOn="1.0.0"
        description="Memoized debounce/throttle function hook."
    >
        <Ds.block
            title="Debounced Callback"
            code={`import { useDebouncedFunction } from "${SYS.basePath}";

const fn = useDebouncedFunction(handler, { delay: 500 });`}
            example={<Demo />}
        />
        <Ds.api
            args="useDebouncedFunction(fn, settings);"
            returns="Stable debounced or throttled function."
            props={{
                fn: {
                    description: "Function to debounce/throttle.",
                    type: "function",
                    required: true,
                },
                settings: {
                    description: "Debounce settings object.",
                    type: "object",
                    defaultValue: "{}",
                },
                "settings.delay": {
                    description: "Delay in milliseconds.",
                    type: "number",
                    defaultValue: "500",
                },
                "settings.isThrottle": {
                    description: "Throttle mode.",
                    type: "boolean",
                    defaultValue: "false",
                },
                "settings.getFirst": {
                    description: "Executes first call immediately.",
                    type: "boolean",
                    defaultValue: "false",
                },
                "settings.functionName": {
                    description: "Optional function label.",
                    type: "string",
                },
            }}
        />
    </Ds.page>
);

export default X;
