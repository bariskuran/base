import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorConverter } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const stringifyInlineArrays = (value) =>
    JSON.stringify(value, null, 2).replace(/\[\n([\s\S]*?)\n(\s*)\]/g, (match, inner) => {
        if (inner.includes("{") || inner.includes("[")) return match;
        const parts = inner
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        return `[ ${parts.join(" ")} ]`;
    });

const X = () => {
    const { colorInput, setLocal } = baseStore.useLocal({ colorInput: "#3498db" });
    const outStr = colorConverter(colorInput);
    const outStrText =
        outStr && Object.keys(outStr).length > 0
            ? stringifyInlineArrays(outStr)
            : "Invalid color input. colorConverter returned {}.";

    return (
        <Ds.page
            title="colorConverter()"
            releasedOn="1.0.0"
            description={`Converts a color into normalized outputs (hex/rgb/hsl/hsb) and luminance.

                You can use colorConverter via direct import from base, or via the theme helper in styled usage (theme.colorConverter).`}
        >
            <Ds.block
                title="String input"
                code={`import { colorConverter } from "${SYS.basePath}";

                    colorConverter("#3498db");
                    colorConverter("rgba(0,0,0,0.5)");
                    colorConverter("red");
                    colorConverter("primary");
                    colorConverter("greys.shade20");
                    `}
                example={
                    <Flex.column gap={10}>
                        <Typo.span>Color string input:</Typo.span>
                        <Flex gap={10}>
                            <input
                                type="text"
                                value={colorInput}
                                onChange={(e) =>
                                    setLocal((state) => {
                                        state.colorInput = e.target.value;
                                    })
                                }
                                style={{ width: 220 }}
                            />
                            {outStr?.hex8 && (
                                <div
                                    style={{ backgroundColor: outStr?.hex8, width: 29, height: 29 }}
                                />
                            )}
                        </Flex>
                        <Typo.code>{outStrText}</Typo.code>
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorConverter(colorInput);"
                returns="Object with hex/rgb/hsl/hsb variants, luminance, and linearRgbaArray ({} for invalid input)."
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
