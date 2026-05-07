import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { debouncedFunction } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { count, throttleCount, setLocal } = baseStore.useLocal({ count: 0, throttleCount: 0 });

    const runDebounced = debouncedFunction(
        () =>
            setLocal((s) => {
                s.count += 1;
            }),
        { delay: 600, functionName: "ds-debounce-example" },
    );

    const runThrottle = debouncedFunction(
        () =>
            setLocal((s) => {
                s.throttleCount += 1;
            }),
        {
            delay: 500,
            isThrottle: true,
            getFirst: true,
            functionName: "ds-throttle-example",
        },
    );

    return (
        <Ds.page
            title="debouncedFunction()"
            releasedOn="1.0.0"
            description="Creates debounced or throttled function wrappers."
        >
            <Ds.block
                title="Basic Debounce"
                code={`import { debouncedFunction } from "${SYS.basePath}";

const fn = debouncedFunction(callback, { delay: 500 });
fn();`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button label="Spam click (debounced)" onClick={runDebounced} />
                        <Typo.span children={`Debounced count: ${count}`} />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Throttle Mode"
                code={`import { debouncedFunction } from "${SYS.basePath}";

const fn = debouncedFunction(callback, {
  delay: 500,
  isThrottle: true,
  getFirst: true,
});

fn();`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button label="Spam click (throttled)" onClick={runThrottle} />
                        <Typo.span children={`Throttled count: ${throttleCount}`} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="debouncedFunction(fn, settings);"
                returns="Debounced or throttled wrapper function."
                props={{
                    fn: {
                        description: "Function to wrap.",
                        type: "function",
                        required: true,
                    },
                    settings: {
                        description:
                            "{ delay, isThrottle, getFirst, functionName, onStart, onEnd }",
                        type: "object",
                        defaultValue:
                            "{ delay: 500, isThrottle: false, getFirst: false, functionName: random }",
                    },
                    "settings.delay": {
                        description: "Wait duration in milliseconds.",
                        type: "number",
                        defaultValue: "500",
                    },
                    "settings.isThrottle": {
                        description: "Switches to throttle behavior.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    "settings.getFirst": {
                        description: "Triggers immediately on first call window.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    "settings.functionName": {
                        description: "Shared key for internal debounce state.",
                        type: "string",
                        defaultValue: "random",
                    },
                    "settings.onStart": {
                        description: "Called when wait window starts.",
                        type: "function",
                    },
                    "settings.onEnd": {
                        description: "Called when wait window ends.",
                        type: "function",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
