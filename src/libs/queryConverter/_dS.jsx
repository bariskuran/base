import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { queryConverter } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const obj = { page: 2, filter: { q: "test" }, list: ["a", "b"] };

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

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
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Typo.code>sample = {JSON.stringify(obj, null, 2)}</Typo.code>
                        <Button.string
                            label="Run export then import (round-trip)"
                            onClick={() =>
                                setLocal((s) => {
                                    const qs = queryConverter.export(obj);
                                    const parsed = queryConverter.import(qs);
                                    s.output = JSON.stringify({ qs, parsed }, null, 2);
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.code>{output}</Typo.code>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args={[
                    "queryConverter.export(obj, settings);",
                    "queryConverter.import(str, settings);",
                ]}
                returns="export: query string; import: nested object."
                props={{
                    export: {
                        description: "Nested object → query string.",
                        type: "(obj, settings?) => string",
                        required: true,
                    },
                    "settings.preserveEmpty": {
                        description: "Keeps null/undefined/empty values.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    "settings.prefix": {
                        description: "Prefix root key.",
                        type: "string",
                    },
                    "settings.ignoreEncode": {
                        description: "Skips encodeURIComponent.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    import: {
                        description: "Query string → nested object.",
                        type: "(str, settings?) => object",
                        required: true,
                    },
                    "settings.preserveBooleans": {
                        description: "Keeps boolean-like values as strings.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    "settings.preserveNumbers": {
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
