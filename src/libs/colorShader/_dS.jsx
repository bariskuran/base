import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorShader } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const b = "#4f46e5";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });
    const s20 = colorShader(b, 20);
    const s50 = colorShader(b, 50);

    return (
        <Ds.page
            title="colorShader()"
            releasedOn="1.0.0"
            description="Darkens color or increases alpha."
        >
            <Ds.block
                title="Basic usage"
                code={`import { colorShader } from "${SYS.basePath}";

colorShader("#4f46e5", 20);

colorShader("#4f46e5", 50);`}
                example={
                    <Flex.column xAlign="start" gap={12} padding={10}>
                        <Flex xAlign="start" gap={12}>
                            <div style={{ width: 70, height: 24, background: b }} />
                            <div style={{ width: 70, height: 24, background: s20 }} />
                            <div style={{ width: 70, height: 24, background: s50 }} />
                        </Flex>
                        <Typo.span balance>{`base: ${b} / shade20: ${s20} / shade50: ${s50}`}</Typo.span>
                        <Button.string
                            label="Dump hex values as JSON"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(
                                        { base: b, shade20: s20, shade50: s50 },
                                        null,
                                        2,
                                    );
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
                args="colorShader(hex, percent);"
                returns="Darkened hex color string."
                props={{
                    hex: {
                        description: "Input color.",
                        type: "string",
                        defaultValue: '"#f00"',
                    },
                    percent: {
                        description: "Darken amount (0..100).",
                        type: "number",
                        defaultValue: "0",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
