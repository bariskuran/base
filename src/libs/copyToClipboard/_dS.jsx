import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { copyToClipboard } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";

const X = () => (
    <Ds.page
        title="<copyToClipboard>"
        releasedOn="1.0.0"
        description="Copies text/ReactNode content to clipboard."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { copyToClipboard } from "${SYS.basePath}";

await copyToClipboard("Hello world");`}
            example={
                <Button
                    label="Copy text"
                    onClick={() => {
                        copyToClipboard("Copied from design system page.");
                    }}
                />
            }
        />
        <Ds.block
            title="Callbacks"
            code={`await copyToClipboard("Sample", {
  onSuccess: (text) => console.log("copied:", text),
  onError: (err) => console.error(err),
  successMessage: "Copied.",
  errorMessage: "Copy failed."
});`}
            example={
                <Flex xAlign="start">
                    <Button
                        label="Copy with callbacks"
                        onClick={() =>
                            copyToClipboard("Callback copy", {
                                onSuccess: () => console.log("success"),
                                onError: () => console.log("error"),
                            })
                        }
                    />
                </Flex>
            }
        />
        <Ds.api
            props={{
                value: {
                    description: "Value to copy.",
                    type: "any",
                    required: true,
                    defaultValue: "undefined",
                },
                options: {
                    description: "Optional callbacks/messages.",
                    type: "object",
                    required: false,
                    defaultValue:
                        '{ onSuccess, onError, successMessage: "Copied to clipboard.", errorMessage: "Failed to copy text." }',
                },
                "options.onSuccess": {
                    description: "Called on success with copied text.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
                "options.onError": {
                    description: "Called on failure with error.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
                "options.successMessage": {
                    description: "Notifier success message.",
                    type: "string",
                    required: false,
                    defaultValue: '"Copied to clipboard."',
                },
                "options.errorMessage": {
                    description: "Notifier error message.",
                    type: "string",
                    required: false,
                    defaultValue: '"Failed to copy text."',
                },
                return: {
                    description: "Promise<boolean> for success state.",
                    type: "Promise<boolean>",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;
