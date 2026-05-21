import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useDelayedFunction } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { count, setLocal } = baseStore.useLocal({ count: 0 });
    const { run, cancel, runNow, isPending } = useDelayedFunction(
        () =>
            setLocal((s) => {
                s.count += 1;
            }),
        { delay: 1500, autoCancel: true },
    );

    return (
        <Ds.page
            title="useDelayedFunction()"
            releasedOn="1.0.0"
            description={
                <>
                    React hook wrapper around delayedFunction with isPending state. Latest fn is
                    always used; inline arrows are fine.
                    <br />
                    <br />
                    See{" "}
                    <Button.string
                        to="/design-system/delayedFunction"
                        label="delayedFunction"
                    />{" "}
                    for core behavior.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                description="Run starts a 1500ms delay; Run now skips the wait; Cancel clears the pending run."
                code={`import { useDelayedFunction } from "${SYS.basePath}";

                    const { run, cancel, runNow, isPending } = useDelayedFunction(() => {
                        setLocal((s) => { s.count += 1; });
                    }, { delay: 1500, autoCancel: true });

                    run();
                    cancel();
                    runNow();`}
                example={
                    <Flex.column gap={10}>
                        <Flex gap={8} wrap>
                            <Button.plain
                                label="Run (delayed)"
                                onClick={() => run()}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Button.plain
                                label="Cancel (cancel pending run)"
                                onClick={() => cancel()}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Button.plain
                                label="Run now (immediate)"
                                onClick={() => runNow()}
                                skipClickCooldown
                                skipOnClickHold
                            />
                        </Flex>
                        <Typo.span>{`count: ${count}`}</Typo.span>
                        <Typo.span>{`isPending: ${String(isPending)}`}</Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { run, cancel, runNow, isPending } = useDelayedFunction(fn, { delay, autoCancel });"
                props={{
                    fn: {
                        description:
                            "Function to run after delay. Latest fn is always used; inline arrows are fine.",
                        type: "function",
                        required: true,
                    },
                    delay: {
                        description: "Delay in milliseconds before fn runs.",
                        type: "number",
                        defaultValue: "500",
                    },
                    autoCancel: {
                        description: "When true, a new run() cancels the previous pending timer.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                }}
                returnProps={{
                    run: {
                        description: "Schedules fn after delay; sets isPending true.",
                        type: "function",
                    },
                    cancel: {
                        description: "Cancels the pending run; sets isPending false.",
                        type: "function",
                    },
                    runNow: {
                        description: "Runs fn immediately and clears pending state.",
                        type: "function",
                    },
                    isPending: {
                        description: "True while a delayed run is scheduled.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
