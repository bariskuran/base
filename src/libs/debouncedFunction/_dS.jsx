import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { debouncedFunction } from ".";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { count, setLocal } = baseStore.useLocal({ count: 0 });

    const runDebounced = debouncedFunction(
        () =>
            setLocal((s) => {
                s.count += 1;
            }),
        { delay: 600, functionName: "ds-debounce-example" },
    );

    return (
        <Ds.page
            title="<debouncedFunction>"
            releasedOn="1.0.0"
            description="Creates debounced or throttled function wrappers."
        >
            <Ds.block
                title="Basic Debounce"
                code={`import { debouncedFunction } from "${SYS.basePath}";

const fn = debouncedFunction(callback, { delay: 500 });
fn();`}
                example={
                    <>
                        <Button label="Spam click" onClick={runDebounced} />
                        <Typo.span children={`Triggered count: ${count}`} />
                    </>
                }
            />
            <Ds.block
                title="Throttle Mode"
                code={`const fn = debouncedFunction(callback, {
  delay: 500,
  isThrottle: true,
  getFirst: true,
});`}
                example={<Typo.span children="Use isThrottle for interval-based triggering." />}
            />
            <Ds.api
                props={{
                    fn: {
                        description: "Function to wrap.",
                        type: "function",
                        required: true,
                        defaultValue: "undefined",
                    },
                    settings: {
                        description:
                            "{ delay, isThrottle, getFirst, functionName, onStart, onEnd }",
                        type: "object",
                        required: false,
                        defaultValue:
                            "{ delay: 500, isThrottle: false, getFirst: false, functionName: random }",
                    },
                    "settings.delay": {
                        description: "Wait duration in milliseconds.",
                        type: "number",
                        required: false,
                        defaultValue: "500",
                    },
                    "settings.isThrottle": {
                        description: "Switches to throttle behavior.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    "settings.getFirst": {
                        description: "Triggers immediately on first call window.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    "settings.functionName": {
                        description: "Shared key for internal debounce state.",
                        type: "string",
                        required: false,
                        defaultValue: "random",
                    },
                    "settings.onStart": {
                        description: "Called when wait window starts.",
                        type: "function",
                        required: false,
                        defaultValue: "undefined",
                    },
                    "settings.onEnd": {
                        description: "Called when wait window ends.",
                        type: "function",
                        required: false,
                        defaultValue: "undefined",
                    },
                    return: {
                        description: "Wrapped callable function.",
                        type: "function",
                        required: true,
                        defaultValue: "computed",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
