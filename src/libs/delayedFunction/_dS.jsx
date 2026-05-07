import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { delayedFunction } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { count, setLocal } = baseStore.useLocal({ count: 0 });

    const delayed = delayedFunction(
        () =>
            setLocal((s) => {
                s.count += 1;
            }),
        { delay: 800, autoCancel: true },
    );

    return (
        <Ds.page
            title="delayedFunction()"
            releasedOn="1.0.0"
            description="Creates delayed executable wrappers."
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
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button label="Run delayed" onClick={() => delayed.run()} />
                        <Button label="Run now" onClick={() => delayed.runNow()} />
                        <Button label="Cancel" onClick={() => delayed.cancel()} />
                        <Typo.span children={`count: ${count}`} />
                        <Typo.span children={`pending: ${String(delayed.isPending())}`} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="delayedFunction(fn, settings);"
                returns="Object with run, cancel, runNow, and isPending."
                props={{
                    fn: {
                        description: "Function to delay.",
                        type: "function",
                        required: true,
                    },
                    settings: {
                        description: "{ delay, autoCancel }",
                        type: "object",
                        defaultValue: "{ delay: 500, autoCancel: true }",
                    },
                    "settings.delay": {
                        description: "Delay in milliseconds.",
                        type: "number",
                        defaultValue: "500",
                    },
                    "settings.autoCancel": {
                        description: "Cancels previous pending run before scheduling new one.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
