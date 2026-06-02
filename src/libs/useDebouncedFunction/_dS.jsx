import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useDebouncedFunction } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";

const X = () => {
    const { count, throttleCount, set } = baseStore.useLocal({
        count: 0,
        throttleCount: 0,
    });

    const runDebounced = useDebouncedFunction(
        () =>
            set((s) => {
                s.count += 1;
            }),
        { delay: 1000 },
    );

    const runThrottle = useDebouncedFunction(
        () =>
            set((s) => {
                s.throttleCount += 1;
            }),
        { delay: 1000, isThrottle: true },
    );

    return (
        <Ds.page
            title="useDebouncedFunction()"
            releasedOn="1.0.0"
            description={
                <>
                    React hook wrapper around debouncedFunction. Keeps the same debounced instance
                    across renders; you do not need useCallback on fn.
                    <br />
                    <br />
                    See{" "}
                    <Button.string
                        to="/design-system/debouncedFunction"
                        label="debouncedFunction"
                    />{" "}
                    for all options and advanced examples.
                </>
            }
        >
            <Ds.block
                title="Basic Debounce & Throttle"
                code={`import { useDebouncedFunction } from "${SYS.basePath}";

                        const runDebounced = useDebouncedFunction(
                            () => setCount((c) => c + 1),
                            { delay: 1000 }
                        );

                        const runThrottle = useDebouncedFunction(
                            () => setCount((c) => c + 1),
                            { delay: 1000, isThrottle: true }
                        );

                        runDebounced();
                        runThrottle();`}
                example={
                    <Flex gap={10}>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="Debounced"
                                onClick={runDebounced}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span>{`Count: ${count}`}</Typo.span>
                            <Typo.span color="greys.shade60" size="s">
                                Increments 1000ms after you stop clicking.
                            </Typo.span>
                        </Flex.column>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="Throttled"
                                onClick={runThrottle}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span>{`Count: ${throttleCount}`}</Typo.span>
                            <Typo.span color="greys.shade60" size="s">
                                Increments at most once per 1000ms while clicking.
                            </Typo.span>
                        </Flex.column>
                    </Flex>
                }
            />
            <Ds.api
                disableLastBlock
                args="const debouncedFn = useDebouncedFunction(fn, { delay, isThrottle, getFirst, functionName, onStart, onEnd });"
                props={{
                    fn: {
                        description:
                            "Function to wrap. Latest fn is always used; inline arrows are fine. Prefer a stable settings object or module-level constants for delay/options.",
                        type: "fn",
                        required: true,
                    },
                    delay: {
                        description: "Wait duration in milliseconds.",
                        type: "number",
                        defaultValue: "500",
                    },
                    isThrottle: {
                        description: "Switches to throttle behavior.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    getFirst: {
                        description:
                            "Runs fn on the first call in a window (debounce only; ignored when isThrottle).",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    functionName: {
                        description: "Shared key for internal debounce state.",
                        type: "string",
                        defaultValue: "auto-generated per function reference",
                    },
                    onStart: {
                        description: "Called when a wait window starts.",
                        type: "fn",
                    },
                    onEnd: {
                        description: "Called when a wait window ends.",
                        type: "fn",
                    },
                }}
                returnProps={{
                    debouncedFn: {
                        description:
                            "Debounced or throttled wrapper. Call with the same arguments as fn.",
                        type: "fn",
                    },
                }}
            />
            <Ds.api
                disableLastBlock
                title="onStart"
                args="onStart(...args);"
                props={{
                    args: {
                        description: "Same arguments passed to the debounced/throttled call.",
                        type: "any[]",
                    },
                }}
            />
            <Ds.api
                title="debouncedFn"
                args="debouncedFn(...args);"
                props={{
                    args: {
                        description: "Forwarded to fn unchanged.",
                        type: "any[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
