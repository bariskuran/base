import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorContrastRatio } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="colorContrastRatio()"
            releasedOn="1.0.0"
            description="Returns WCAG contrast ratio between two colors."
        >
            <Ds.block
                title="Basic usage"
                code={`import { colorContrastRatio } from "${SYS.basePath}";

colorContrastRatio("#ffffff", "#111111");

colorContrastRatio("#ffbf00", "#ffffff");`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run #fff vs #111"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = String(colorContrastRatio("#ffffff", "#111111"));
                                })
                            }
                        />
                        <Button.string
                            label="Run #ffbf00 vs #fff"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = String(colorContrastRatio("#ffbf00", "#ffffff"));
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
                args="colorContrastRatio(colorA, colorB);"
                returns="WCAG contrast ratio number (0 if input missing)."
                props={{
                    colorA: {
                        description: "First color.",
                        type: "string | object",
                        required: true,
                    },
                    colorB: {
                        description: "Second color.",
                        type: "string | object",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
