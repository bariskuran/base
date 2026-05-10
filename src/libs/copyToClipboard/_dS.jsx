import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { copyToClipboard } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { lastBasic, setLocal } = baseStore.useLocal({ lastBasic: null });

    return (
        <Ds.page
            title="copyToClipboard()"
            releasedOn="1.0.0"
            description={
                <>
                    Copies text/ReactNode content to clipboard.
                    <br />
                    <br /> Check out <Button.string
                        to="/design-system/notifier"
                        label="Notifier"
                    />{" "}
                    to see notifier props.
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                code={`import { copyToClipboard } from "${SYS.basePath}";

                    copyToClipboard("Hello world");`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="Copy text"
                            onClick={() => {
                                const ok = copyToClipboard("Hello world");
                                setLocal((s) => {
                                    s.lastBasic = ok ? "success" : "failed";
                                });
                            }}
                        />
                        <Space size="s" />
                        {lastBasic != null && (
                            <Typo.span balance>Last result: {lastBasic}</Typo.span>
                        )}
                    </Flex.column>
                }
            />
            <Ds.block
                title="Options"
                description="Options to customize the copyToClipboard behavior. You can disable the notifier, and provide custom success and error callbacks."
                code={`import { copyToClipboard } from "${SYS.basePath}";

                    copyToClipboard("Hello world", 
                        { 
                            disableNotifier: true, 
                            onSuccess: ()=> console.log("success"),
                            onError: (err)=> console.error("error", err)
                        });`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="Copy text"
                            onClick={() => {
                                copyToClipboard("Hello world", {
                                    disableNotifier: true,
                                    onSuccess: () => console.log("success"),
                                    onError: (err) => console.error("error", err),
                                });
                            }}
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Supported Formats"
                description="copyToClipboard can copy the following formats: string, number, boolean, object, array, function, date, regex, symbol, error, null, undefined."
                code={`import { copyToClipboard } from "${SYS.basePath}";

                    copyToClipboard({ a: 1, b: 2, c: 3, d: { e: 4 } });
                    copyToClipboard([1, 2, 3, 4]);
                    copyToClipboard(new Date());
                    copyToClipboard(new Error("test"));
                    copyToClipboard(null);
                    copyToClipboard(undefined);
                    copyToClipboard(Symbol("test"));
                    copyToClipboard(function() {});
                `}
                example={
                    <Flex gap={10} padding={10}>
                        <Button.plain
                            label="Obj"
                            onClick={() => {
                                copyToClipboard({ a: 1, b: 2, c: 3, d: { e: 4 } });
                            }}
                        />
                        <Button.plain
                            label="Arr"
                            onClick={() => {
                                copyToClipboard([1, 2, 3, 4]);
                            }}
                        />
                        <Button.plain
                            label="Date"
                            onClick={() => {
                                copyToClipboard(new Date());
                            }}
                        />
                        <Button.plain
                            label="Err"
                            onClick={() => {
                                copyToClipboard(new Error("test"));
                            }}
                        />
                        <Button.plain
                            label="Null"
                            onClick={() => {
                                copyToClipboard(null);
                            }}
                        />
                        <Button.plain
                            label="Undefined"
                            onClick={() => {
                                copyToClipboard(undefined);
                            }}
                        />
                        <Button.plain
                            label="Sym"
                            onClick={() => {
                                copyToClipboard(Symbol("test"));
                            }}
                        />
                        <Button.plain
                            label="Fn"
                            onClick={() => {
                                copyToClipboard(function () {});
                            }}
                        />
                    </Flex>
                }
            />
            <Ds.api
                args="copyToClipboard(value, { onSuccess, onError, successMessage, errorMessage, disableNotifier });"
                returns="Promise resolving to true on success, false otherwise."
                props={{
                    value: {
                        description: "Value to copy.",
                        type: "any",
                        required: true,
                    },
                    onSuccess: {
                        description: "Called on success with copied text.",
                        type: "function",
                    },
                    onError: {
                        description: "Called on failure with error.",
                        type: "function",
                    },
                    successMessage: {
                        description: "Notifier success message.",
                        type: "string",
                        defaultValue: '"Copied to clipboard."',
                    },
                    errorMessage: {
                        description: "Notifier error message.",
                        type: "string",
                        defaultValue: '"Failed to copy text."',
                    },
                    disableNotifier: {
                        description: "Disable notifier.",
                        type: "boolean",
                        defaultValue: false,
                    },
                    notifierProps: {
                        description:
                            "Props to pass to the notifier. Check the notifier documentation for available props.",
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
