import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { clearUndefinedDeep } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

/** JSON.stringify undefined anahtarları düşürür; DS önizlemesinde yapıyı göstermek için. */
const stringifyForPreview = (value) =>
    JSON.stringify(value, (_key, v) => (v === undefined ? "undefined" : v), 2);

const sample = {
    a: 1,
    b: undefined,
    c: { d: 2, e: undefined },
    f: [1, undefined, { g: undefined, h: 3 }],
};

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="clearUndefinedDeep()"
            releasedOn="1.0.0"
            description="Removes undefined keys recursively. Doesn't mutate the original object/array. Returns a new object/array."
        >
            <Ds.block
                title="Basic usage"
                code={`import { clearUndefinedDeep } from "${SYS.basePath}";
                    const cleaned = clearUndefinedDeep(sample);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Typo.pre whiteSpace="pre-wrap">
                            sample = {stringifyForPreview(sample)}
                        </Typo.pre>
                        <Button.plain
                            label="clearUndefinedDeep(sample)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(clearUndefinedDeep(sample), null, 2);
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{output}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="clearUndefinedDeep(object);"
                returns="New object or array with undefined keys removed."
                props={{
                    object: {
                        description: "Input value to clean.",
                        type: "object | array",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
