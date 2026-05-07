import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorConverter } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { outStr, outObj, setLocal } = baseStore.useLocal({ outStr: null, outObj: null });

    return (
        <Ds.page
            title="colorConverter()"
            releasedOn="1.0.0"
            description="Converts a color into multiple color spaces and formats."
        >
            <Ds.block
                title="String input"
                code={`import { colorConverter } from "${SYS.basePath}";

colorConverter("#3498db");`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label='Run colorConverter("#3498db")'
                            onClick={() =>
                                setLocal((s) => {
                                    s.outStr = JSON.stringify(colorConverter("#3498db"), null, 2);
                                })
                            }
                        />
                        <Space size="l" />
                        {outStr != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{outStr}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.block
                title="Object input"
                code={`import { colorConverter } from "${SYS.basePath}";

colorConverter({ hslArray: [200, 70, 45] });`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run colorConverter({ hslArray: [...] })"
                            onClick={() =>
                                setLocal((s) => {
                                    s.outObj = JSON.stringify(
                                        colorConverter({ hslArray: [200, 70, 45] }),
                                        null,
                                        2,
                                    );
                                })
                            }
                        />
                        <Space size="l" />
                        {outObj != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{outObj}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorConverter(colorInput);"
                returns="Object with hex/rgb/hsl/hsb variants, luminance, and linearRgbaArray."
                props={{
                    colorInput: {
                        description: "Color input string or supported object payload.",
                        type: "string | object",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
