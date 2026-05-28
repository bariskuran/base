import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorFind } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { input, output, set } = baseStore.useLocal({
        input: "primary",
        output: "hex6",
    });

    const result = colorFind(input, { output });

    return (
        <Ds.page
            title="colorFind()"
            releasedOn="1.0.0"
            description={`Resolves input color strings into hex output using theme tokens, theme paths, and raw color formats.

You can use colorFind via direct import from base, or via the theme helper in styled usage (theme.colorFind).`}
        >
            <Ds.block
                title="Interactive"
                code={`import { colorFind } from "${SYS.basePath}";

colorFind("primary");
colorFind("greys.shade50");
colorFind("rgba(0,0,0,0.5)", { output: "hex8" });
colorFind("red");
colorFind("#07f", { output: "hex8" });`}
                example={
                    <Flex.column gap={12} full>
                        <Flex gap={10}>
                            <Flex.column gap={4}>
                                <Typo.span>Input:</Typo.span>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.input = e.target.value;
                                        })
                                    }
                                    style={{ width: 220 }}
                                />
                            </Flex.column>

                            <Flex.column gap={4}>
                                <Typo.span>Output mode:</Typo.span>
                                <select
                                    value={output}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.output = e.target.value;
                                        })
                                    }
                                >
                                    <option value="hex6">hex6</option>
                                    <option value="hex8">hex8</option>
                                </select>
                            </Flex.column>

                            {result && (
                                <Flex.column gap={4}>
                                    <Typo.span>Preview:</Typo.span>
                                    <div
                                        style={{
                                            backgroundColor: result,
                                            width: 30,
                                            height: 30,
                                            borderRadius: 6,
                                            border: "1px solid #ddd",
                                        }}
                                    />
                                </Flex.column>
                            )}
                        </Flex>
                        <Ds.output directValue={{ input, output, result }} />
                    </Flex.column>
                }
            />

            <Ds.api
                args='const hex = colorFind(input, { output, theme });'
                props={{
                    input: {
                        description:
                            "Color input as token/path/raw css color (e.g. primary, greys.shade50, red, rgba(...), #07f).",
                        type: "string",
                        required: true,
                    },
                    output: {
                        description: "Output format for resolved color.",
                        type: '"hex6" | "hex8"',
                        defaultValue: '"hex6"',
                    },
                    theme: {
                        description: "Optional theme override object for lookup.",
                        type: "object",
                    },
                }}
                returnProps={{
                    hex: {
                        description: "Resolved hex color string, or undefined when not found.",
                        type: "string | undefined",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
