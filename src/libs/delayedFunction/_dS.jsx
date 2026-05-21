import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";
import { useDelayedFunction } from "../useDelayedFunction";

const X = () => {
    const { count, setLocal } = baseStore.useLocal({ count: 0 });
    const { run, cancel, runNow, isPending } = useDelayedFunction(
        () => {
            setLocal((s) => {
                s.count += 1;
            });
        },
        { delay: 1500, autoCancel: true },
    );

    return (
        <Ds.page
            title="delayedFunction()"
            releasedOn="1.0.0"
            description={
                <>
                    Creates delayed executable wrappers.
                    <br />
                    <br />
                    Check out{" "}
                    <Button.string
                        to="/design-system/useDelayedFunction"
                        label="useDelayedFunction"
                    />{" "}
                    to see hook usage.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                code={`import { delayedFunction } from "${SYS.basePath}";

                    const delayed = delayedFunction(fn, { delay: 500 });
                    delayed.run();
                    delayed.cancel();
                    delayed.runNow();
                    delayed.isPending();`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="Run delayed"
                            onClick={() => {
                                run();
                            }}
                            skipClickCooldown
                            skipOnClickHold
                        />
                        <Button.plain
                            label="Run now"
                            onClick={() => {
                                runNow();
                            }}
                            skipClickCooldown
                            skipOnClickHold
                        />
                        <Button.plain
                            label="Cancel"
                            onClick={() => {
                                cancel();
                            }}
                            skipClickCooldown
                            skipOnClickHold
                        />
                        <Flex gap={20} marginTop={20}>
                            <Typo.span children={`count: ${count}`} />
                            <Typo.span children={`isPending: ${String(isPending)}`} />
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { run, cancel, runNow, isPending } = delayedFunction(fn, { autoCancel, delay });"
                props={{
                    fn: {
                        description: "Function to delay.",
                        type: "function",
                        required: true,
                    },
                    delay: {
                        description: "Delay in milliseconds.",
                        type: "number",
                        defaultValue: "500",
                    },
                    autoCancel: {
                        description: "Cancels previous pending run before scheduling new one.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                }}
                returnProps={{
                    run: {
                        description: "Runs the delayed function.",
                        type: "function",
                    },
                    runNow: {
                        description: "Runs the delayed function immediately.",
                        type: "function",
                    },
                    cancel: {
                        description: "Cancels the delayed function.",
                        type: "function",
                    },
                    isPending: {
                        description:
                            "Returns true if the delayed function is pending. Works on hook side.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
