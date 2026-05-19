import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useManageSearchParams } from ".";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const { page, set, clear, raw } = useManageSearchParams({ defaults: { page: 1 } });
    return (
        <Flex.column gap={8}>
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
        title="useManageSearchParams()"
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
            args="useManageSearchParams({ bind, defaults, maxLength, pick, replace })"
            returns="Decoded param fields plus set, clear, and raw query helpers."
            props={{
                bind: {
                    description: "Auto-sync object to URL.",
                    type: "object",
                },
                defaults: {
                    description: "Default values for missing params.",
                    type: "object",
                    defaultValue: "{}",
                },
                maxLength: {
                    description: "Max allowed query payload length.",
                    type: "number",
                    defaultValue: "0",
                },
                pick: {
                    description: "Keeps only selected keys.",
                    type: "string[]",
                },
                replace: {
                    description: "History replace mode.",
                    type: "boolean",
                    defaultValue: "true",
                },
            }}
        />
    </Ds.page>
);

export default X;
