import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useManageSearchParams } from ".";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const { page, set, clear, raw } = useManageSearchParams({ defaults: { page: 1 } });
    return (
        <Flex.column xAlign="start" gap={8}>
            <Typo.span>{`page: ${page}`}</Typo.span>
            <Typo.span>{`raw: ${raw || "-"}`}</Typo.span>
            <Flex gap={8}>
                <Button
                    label="Next page"
                    onClick={() => set((prev) => ({ ...prev, page: (prev?.page || 1) + 1 }))}
                />
                <Button label="Clear" onClick={() => clear()} />
            </Flex>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="<useManageSearchParams>"
        releasedOn="1.0.0"
        description="Typed URL search-params state hook."
    >
        <Ds.block
            title="Read and Update Search Params"
            code={`import { useManageSearchParams } from "${SYS.basePath}";

const { page, set, clear, raw } = useManageSearchParams({
  defaults: { page: 1 },
});`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                options: {
                    description: "Hook options.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                "options.pick": {
                    description: "Keeps only selected keys.",
                    type: "string[]",
                    required: false,
                    defaultValue: "undefined",
                },
                "options.defaults": {
                    description: "Default values for missing params.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                "options.bind": {
                    description: "Auto-sync object to URL.",
                    type: "object",
                    required: false,
                    defaultValue: "undefined",
                },
                "options.replace": {
                    description: "History replace mode.",
                    type: "boolean",
                    required: false,
                    defaultValue: "true",
                },
                "options.maxLength": {
                    description: "Max allowed query payload length.",
                    type: "number",
                    required: false,
                    defaultValue: "0",
                },
                return: {
                    description: "Decoded params + helpers: set, clear, raw.",
                    type: "object",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;
