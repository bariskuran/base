import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { queryConverter } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const obj = { page: 2, filter: { q: "test" }, list: ["a", "b"] };

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="queryConverter"
            releasedOn="1.0.0"
            description="Nested object/query converter."
        >
            <Ds.block
                title="Export / import"
                code={`import { queryConverter } from "${SYS.basePath}";

                        const qs = queryConverter.export({ page: 2, filter: { q: "test" } });

                        const obj = queryConverter.import(qs);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.code>sample = {JSON.stringify(obj, null, 2)}</Typo.code>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="(export → import)"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => {
                                        const qs = queryConverter.export(obj);
                                        const parsed = queryConverter.import(qs);
                                        return { qs, parsed };
                                    },
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args={[
                    "queryConverter.export(obj, { preserveEmpty, prefix, ignoreEncode });",
                    "queryConverter.import(str, { preserveBooleans, preserveNumbers });",
                ]}
                returns="export: query string; import: nested object."
                props={{
                    export: {
                        description: "Nested object → query string.",
                        type: "(obj, options?) => string",
                        required: true,
                    },
                    preserveEmpty: {
                        description: "Keeps null/undefined/empty values.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    prefix: {
                        description: "Prefix root key.",
                        type: "string",
                    },
                    ignoreEncode: {
                        description: "Skips encodeURIComponent.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    import: {
                        description: "Query string → nested object.",
                        type: "(str, options?) => object",
                        required: true,
                    },
                    preserveBooleans: {
                        description: "Keeps boolean-like values as strings.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    preserveNumbers: {
                        description: "Keeps number-like values as strings.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
