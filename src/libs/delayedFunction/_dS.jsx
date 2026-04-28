import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { delayedFunction } from ".";
import { Button } from "../Button";
import { Typography } from "../Typography";
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
            title="<delayedFunction>"
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
                    <>
                        <Button label="Run delayed" onClick={() => delayed.run()} />
                        <Button label="Run now" onClick={() => delayed.runNow()} />
                        <Button label="Cancel" onClick={() => delayed.cancel()} />
                        <Typography.span children={`count: ${count}`} />
                        <Typography.span children={`pending: ${String(delayed.isPending())}`} />
                    </>
                }
            />
            <Ds.api
                props={{
                    fn: {
                        description: "Function to delay.",
                        type: "function",
                        required: true,
                        defaultValue: "undefined",
                    },
                    settings: {
                        description: "{ delay, autoCancel }",
                        type: "object",
                        required: false,
                        defaultValue: "{ delay: 500, autoCancel: true }",
                    },
                    "settings.delay": {
                        description: "Delay in milliseconds.",
                        type: "number",
                        required: false,
                        defaultValue: "500",
                    },
                    "settings.autoCancel": {
                        description: "Cancels previous pending run before scheduling new one.",
                        type: "boolean",
                        required: false,
                        defaultValue: "true",
                    },
                    return: {
                        description: "{ run, cancel, runNow, isPending }",
                        type: "object",
                        required: true,
                        defaultValue: "computed",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
