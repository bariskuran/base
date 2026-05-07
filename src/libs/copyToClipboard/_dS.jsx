import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { copyToClipboard } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { lastBasic, lastCb, setLocal } = baseStore.useLocal({ lastBasic: null, lastCb: null });

    return (
        <Ds.page
            title="copyToClipboard()"
            releasedOn="1.0.0"
            description="Copies text/ReactNode content to clipboard."
        >
            <Ds.block
                title="Basic usage"
                code={`import { copyToClipboard } from "${SYS.basePath}";

await copyToClipboard("Hello world");`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button
                            label="Copy text"
                            onClick={async () => {
                                const ok = await copyToClipboard("Copied from design system page.");
                                setLocal((s) => {
                                    s.lastBasic = ok ? "success" : "failed";
                                });
                            }}
                        />
                        <Space size="s" />
                        {lastBasic != null && <Typo.span balance>Last result: {lastBasic}</Typo.span>}
                    </Flex.column>
                }
            />
            <Ds.block
                title="Callbacks"
                code={`import { copyToClipboard } from "${SYS.basePath}";

await copyToClipboard("Sample", {
  onSuccess: (text) => {},
  onError: (err) => {},
  successMessage: "Copied.",
  errorMessage: "Copy failed.",
});`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button
                            label="Copy with callbacks"
                            onClick={() =>
                                copyToClipboard("Callback copy", {
                                    onSuccess: () =>
                                        setLocal((s) => {
                                            s.lastCb = "callback: success";
                                        }),
                                    onError: () =>
                                        setLocal((s) => {
                                            s.lastCb = "callback: error";
                                        }),
                                })
                            }
                        />
                        {lastCb != null && <Typo.span balance>Last result: {lastCb}</Typo.span>}
                    </Flex.column>
                }
            />
            <Ds.api
                args="copyToClipboard(value, options);"
                returns="Promise resolving to true on success, false otherwise."
                props={{
                    value: {
                        description: "Value to copy.",
                        type: "any",
                        required: true,
                    },
                    options: {
                        description: "Optional callbacks/messages.",
                        type: "object",
                        defaultValue:
                            '{ onSuccess, onError, successMessage: "Copied to clipboard.", errorMessage: "Failed to copy text." }',
                    },
                    "options.onSuccess": {
                        description: "Called on success with copied text.",
                        type: "function",
                    },
                    "options.onError": {
                        description: "Called on failure with error.",
                        type: "function",
                    },
                    "options.successMessage": {
                        description: "Notifier success message.",
                        type: "string",
                        defaultValue: '"Copied to clipboard."',
                    },
                    "options.errorMessage": {
                        description: "Notifier error message.",
                        type: "string",
                        defaultValue: '"Failed to copy text."',
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
