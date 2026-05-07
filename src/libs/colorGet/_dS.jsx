import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorGet } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const Swatch = ({ label, color, opposite }) => (
    <Flex.column xAlign="start" gap={4}>
        <div style={{ width: 80, height: 26, borderRadius: 6, background: color, color: opposite }}>
            {label}
        </div>
        <Typo.span children={`${color} / opposite: ${opposite}`} />
    </Flex.column>
);

const X = () => {
    const { outTheme, outHex, setLocal } = baseStore.useLocal({ outTheme: null, outHex: null });
    const c1 = colorGet("primary");
    const c2 = colorGet("foregrounds.tint50");
    const hex = colorGet("#3388ff");

    return (
        <Ds.page
            title="colorGet()"
            releasedOn="1.0.0"
            description="Theme/css color resolver + helpers."
        >
            <Ds.block
                title="Theme tokens"
                code={`import { colorGet } from "${SYS.basePath}";

const c = colorGet("primary");

const c2 = colorGet("foregrounds.tint50");`}
                example={
                    <Flex.column xAlign="start" gap={16} padding={10}>
                        <Flex xAlign="start" gap={16}>
                            <Swatch label="primary" color={c1?.color} opposite={c1?.opposite} />
                            <Swatch label="path" color={c2?.color} opposite={c2?.opposite} />
                        </Flex>
                        <Button.string
                            label='Dump colorGet("primary") as JSON'
                            onClick={() =>
                                setLocal((s) => {
                                    s.outTheme = JSON.stringify(colorGet("primary"), null, 2);
                                })
                            }
                        />
                        <Space size="l" />
                        {outTheme != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{outTheme}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.block
                title="Shade / tint API"
                code={`import { colorGet } from "${SYS.basePath}";

const c = colorGet("#3388ff");

c.colorApi.shade20;

c.colorApi.tint30;`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Typo.span balance>
                            {hex
                                ? `shade20: ${hex.colorApi?.shade20} | tint30: ${hex.colorApi?.tint30}`
                                : ""}
                        </Typo.span>
                        <Button.string
                            label='Dump colorGet("#3388ff").colorApi'
                            onClick={() =>
                                setLocal((s) => {
                                    const c = colorGet("#3388ff");
                                    s.outHex = JSON.stringify(c?.colorApi ?? {}, null, 2);
                                })
                            }
                        />
                        <Space size="l" />
                        {outHex != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{outHex}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorGet(color);"
                returns="Object with color, opposite, colorApi, oppositeApi (or undefined)."
                props={{
                    color: {
                        description: "Input color token/path/css color.",
                        type: "string",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
