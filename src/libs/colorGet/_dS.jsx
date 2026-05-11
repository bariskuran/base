import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorGet } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { input, setLocal } = baseStore.useLocal({ input: "primary" });
    const out = colorGet(input);

    return (
        <Ds.page
            title="colorGet()"
            releasedOn="1.0.0"
            description={`Resolves a color (theme token/path or raw css color) and returns helper APIs.

                        You can use colorGet via direct import from base, or via the theme helper in styled usage (theme.colorGet).`}
        >
            <Ds.block
                title="Interactive"
                code={`import { colorGet } from "${SYS.basePath}";

                colorGet("primary");
                colorGet("foregrounds.tint50");
                colorGet("rgba(0,0,0,0.5)");
                colorGet("red");
                colorGet("primary");
                `}
                example={
                    <Flex.column gap={12} full>
                        <Flex gap={10} full>
                            <Flex.column gap={4}>
                                <Typo.span>Input:</Typo.span>
                                <Flex gap={10}>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) =>
                                            setLocal((s) => {
                                                s.input = e.target.value;
                                            })
                                        }
                                        style={{ width: 220 }}
                                    />
                                    {out?.colorApi?.hex8 && (
                                        <div
                                            style={{
                                                backgroundColor: out?.colorApi?.hex8,
                                                width: 29,
                                                height: 29,
                                            }}
                                        />
                                    )}
                                </Flex>
                            </Flex.column>
                        </Flex>
                        <Ds.output
                            directValue={`
                                color: ${out?.color},
                                colorApi: {
                                      colorConverterResults,
                                      shade1..100, // 100 = #000
                                      tint1..100, // 100 = #fff
                                }
                                opposite: ${out?.opposite},
                                oppositeApi: {
                                    // same content as colorApi, but for the opposite color
                                }
                            `}
                        />
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
