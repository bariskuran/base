import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorAlpha } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { color, alpha, set } = baseStore.useLocal({
        color: "#0077ff",
        alpha: 50,
    });
    const result = colorAlpha(color, alpha);

    return (
        <Ds.page
            title="colorAlpha()"
            releasedOn="1.0.0"
            description={`Applies alpha (opacity) to a color and returns a hex8 output.

                You can use colorAlpha via direct import from base, or via the theme helper in styled usage (theme.colorAlpha).`}
        >
            <Ds.block
                title="Basic usage"
                code={`import { colorAlpha } from "${SYS.basePath}";

                    colorAlpha("#0077ff", 50);
                    colorAlpha("primary", 35);
                    colorAlpha("rgba(0,119,255,0.4)", 0.8);`}
                example={
                    <Flex.column gap={10} full>
                        <Flex gap={10}>
                            <Flex.column gap={4}>
                                <Typo.span>Color input: / {alpha} </Typo.span>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.color = e.target.value;
                                        })
                                    }
                                    style={{ width: 180 }}
                                />
                            </Flex.column>
                            <Flex.column gap={4}>
                                <Typo.span>Alpha 0-1</Typo.span>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={alpha}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.alpha = Number(e.target.value);
                                        })
                                    }
                                />
                            </Flex.column>
                            <Flex.column gap={4}>
                                <Typo.span>Alpha 1-100</Typo.span>
                                <input
                                    type="range"
                                    min={2}
                                    max={100}
                                    step={1}
                                    value={alpha}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.alpha = Number(e.target.value);
                                        })
                                    }
                                />
                            </Flex.column>
                        </Flex>
                        <Flex gap={8} yAlign="center">
                            <div
                                style={{
                                    width: 46,
                                    height: 24,
                                    borderRadius: 6,
                                    border: "1px solid #ddd",
                                    background: color,
                                }}
                            />
                            <div
                                style={{
                                    width: 46,
                                    height: 24,
                                    borderRadius: 6,
                                    border: "1px solid #ddd",
                                    background: result,
                                }}
                            />
                        </Flex>
                        <Ds.output directValue={{ color, alpha, result }} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const hex8 = colorAlpha(color, alpha);"
                props={{
                    color: {
                        description: "Input color (hex/rgb/rgba/css name/theme token/path).",
                        type: "string | object",
                        required: true,
                    },
                    alpha: {
                        description: "Opacity ratio (0..1) or percent (1..100).",
                        type: "number",
                        defaultValue: "50",
                    },
                }}
                returnProps={{
                    hex8: { description: "Hex8 color string with alpha.", type: "string" },
                }}
            />
        </Ds.page>
    );
};

export default X;
