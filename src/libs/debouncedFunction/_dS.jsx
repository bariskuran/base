import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { debouncedFunction } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";
import { notifier } from "../notifier";

const X = () => {
    const { count, throttleCount, set, ex2, ex3, ex4, ex5 } = baseStore.useLocal({
        count: 0,
        throttleCount: 0,
        ex2: 0,
        ex3: 0,
        ex4: 0,
        ex5: 0,
    });

    const runDebounced = debouncedFunction(
        () =>
            set((s) => {
                s.count += 1;
            }),
        { delay: 1000 },
    );

    const runThrottle = debouncedFunction(
        () =>
            set((s) => {
                s.throttleCount += 1;
            }),
        {
            delay: 1000,
            isThrottle: true,
        },
    );

    const runEx2 = debouncedFunction(
        () =>
            set((s) => {
                s.ex2 += 1;
            }),
        { delay: 1000, getFirst: true, functionName: "example2" },
    );

    const runEx3 = debouncedFunction(
        () =>
            set((s) => {
                s.ex3 += 1;
            }),
        { delay: 1000, getFirst: true, functionName: "example3", isThrottle: true },
    );

    const runEx4 = debouncedFunction(
        () =>
            set((s) => {
                s.ex4 += 1;
            }),
        {
            delay: 2000,
            onStart: () => notifier.add("Debounced onStart called."),
            onEnd: () => notifier.add("Debounced onEnd called."),
        },
    );

    const runEx5 = debouncedFunction(
        () =>
            set((s) => {
                s.ex5 += 1;
            }),
        {
            delay: 2000,
            isThrottle: true,
            onStart: () => notifier.add("Throttled onStart called."),
            onEnd: () => notifier.add("Throttled onEnd called."),
        },
    );

    return (
        <Ds.page
            title="debouncedFunction()"
            releasedOn="1.0.0"
            description={
                <>
                    Creates debounced or throttled function wrappers.
                    <br />
                    <br />
                    Check out{" "}
                    <Button.string
                        to="/design-system/useDebouncedFunction"
                        label="useDebouncedFunction"
                    />{" "}
                    to see hook usage.
                </>
            }
        >
            <Ds.block
                title="Basic Debounce & Throttle"
                code={`import { debouncedFunction } from "${SYS.basePath}";

                        const debounced = debouncedFunction(callback, {
                            delay: 1000
                        });
                        debounced();

                        const throttled = debouncedFunction(callback, {
                          delay: 1000,
                          isThrottle: true,
                        });
                        throttled();`}
                example={
                    <Flex gap={10}>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="Debounced"
                                onClick={runDebounced}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span children={`Count: ${count}`} />
                        </Flex.column>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="Throttled"
                                onClick={runThrottle}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span children={`Count: ${throttleCount}`} />
                        </Flex.column>
                    </Flex>
                }
            />
            <Ds.block
                title="getFirst & functionName"
                description={`getFirst: Triggers immediately on first call window. Works in debounce mode only.

                    functionName: Shared key for the internal debounce state. In some cases, you may want multiple instances of the same function to share the same debounce/throttle lock. By default, the function reference is used to generate the functionName automatically, but you can provide a unique key if needed in certain scenarios.`}
                code={`import { debouncedFunction } from "${SYS.basePath}";

                        const example2 = debouncedFunction(callback, {
                            delay: 1000,
                            getFirst: true,
                            functionName: "example2"
                        });

                        example2();`}
                example={
                    <Flex gap={10}>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="getFirst"
                                onClick={runEx2}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span children={`Count: ${ex2}`} />
                        </Flex.column>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="functionName"
                                onClick={runEx3}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span children={`Count: ${ex3}`} />
                        </Flex.column>
                    </Flex>
                }
            />
            <Ds.block
                title="onStart & onEnd"
                description={`onStart: Called when wait window starts.

                    onEnd: Called when wait window ends.`}
                code={`import { debouncedFunction } from "${SYS.basePath}";

                        const example4 = debouncedFunction(
                             () =>
                                 set((s) => {
                                     s.ex4 += 1;
                                 }),
                             {
                                 delay: 2000,
                                 onStart: () => notifier.add("Debounced onStart called."),
                                 onEnd: () => notifier.add("Debounced onEnd called."),
                             },
                         );

                         const example5 = debouncedFunction(
                             () =>
                                 set((s) => {
                                     s.ex5 += 1;
                                 }),
                             {
                                 delay: 2000,
                                 isThrottle: true,
                                 onStart: () => notifier.add("Throttled onStart called."),
                                 onEnd: () => notifier.add("Throttled onEnd called."),
                             },
                         );

                        example4();
                        example5();`}
                example={
                    <Flex gap={10}>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="Debounced onStart & onEnd"
                                onClick={runEx4}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span children={`Count: ${ex4}`} />
                        </Flex.column>
                        <Flex.column gap={10}>
                            <Button.plain
                                label="Throttled onStart & onEnd"
                                onClick={runEx5}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Typo.span children={`Count: ${ex5}`} />
                        </Flex.column>
                    </Flex>
                }
            />
            <Ds.api
                disableLastBlock
                args="const debounced = debouncedFunction(fn, { delay, functionName, getFirst, isThrottle, onEnd, onStart });"
                props={{
                    fn: {
                        description: "Function to wrap.",
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
                            "Triggers immediately on first call window (ignored in throttle mode).",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    functionName: {
                        description: "Shared key for internal debounce state.",
                        type: "string",
                        defaultValue: "auto-generated per function reference",
                    },
                    onStart: {
                        description: "Called when wait window starts.",
                        type: "fn",
                    },
                    onEnd: {
                        description: "Called when wait window ends.",
                        type: "fn",
                    },
                }}
                returnProps={{
                    debounced: {
                        description: "Debounced or throttled wrapper; call with the same args as fn.",
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
                title="debounced"
                args="debounced(...args);"
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
