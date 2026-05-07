import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorTinter } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const b = "#4f46e5";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });
    const t20 = colorTinter(b, 20);
    const t50 = colorTinter(b, 50);

    return (
        <Ds.page title="colorTinter()" releasedOn="1.0.0" description="Tints color toward white.">
            <Ds.block
                title="Basic usage"
                code={`import { colorTinter } from "${SYS.basePath}";

colorTinter("#4f46e5", 20);

colorTinter("#4f46e5", 50);`}
                example={
                    <Flex.column xAlign="start" gap={12} padding={10}>
                        <Flex xAlign="start" gap={12}>
                            <div style={{ width: 70, height: 24, background: b }} />
                            <div style={{ width: 70, height: 24, background: t20 }} />
                            <div style={{ width: 70, height: 24, background: t50 }} />
                        </Flex>
                        <Typo.span balance>{`base: ${b} / tint20: ${t20} / tint50: ${t50}`}</Typo.span>
                        <Button.string
                            label="Dump hex values as JSON"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(
                                        { base: b, tint20: t20, tint50: t50 },
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
                args="colorTinter(hex, percent);"
                returns="Tinted hex color string."
                props={{
                    hex: {
                        description: "Input color.",
                        type: "string",
                        defaultValue: '"#f00"',
                    },
                    percent: {
                        description: "Tint amount (0..100).",
                        type: "number",
                        defaultValue: "0",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
