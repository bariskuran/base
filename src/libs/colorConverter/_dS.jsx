import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorConverter } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";

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
    const { colorInput, set } = baseStore.useLocal({ colorInput: "#3498db" });
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
                title={{ tr: "String Girdisi", en: "String input" }}
                code={`import { colorConverter } from "${SYS.basePath}";

                       colorConverter("#3498db");
                       colorConverter("rgba(0,0,0,0.5)");
                       colorConverter("red");
                       colorConverter("primary");
                       colorConverter("greys.shade20");
`}
                example={
                    <Flex.column gap={10} full>
                        <Typo.span>Color string input:</Typo.span>
                        <Flex gap={10}>
                            <input
                                type="text"
                                value={colorInput}
                                onChange={(e) =>
                                    set((state) => {
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
                        <Ds.output directValue={outStrText} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const formats = colorConverter(colorInput);"
                props={{
                    colorInput: {
                        description: { tr: "Renk girdi string'i veya desteklenen nesne verisi.", en: "Color input string or supported object payload." },
                        type: "string | object",
                        required: true,
                    },
                }}
                returnProps={{
                    hex6: { description: { tr: "Hex6 renk.", en: "Hex6 color." }, type: "string" },
                    hex8: { description: { tr: "Alpha içeren Hex8 renk.", en: "Hex8 color with alpha." }, type: "string" },
                    rgbArray: { description: { tr: "RGB dizisi [r, g, b].", en: "RGB array [r, g, b]." }, type: "number[]" },
                    rgbString: { description: { tr: "RGB CSS string'i.", en: "RGB css string." }, type: "string" },
                    rgbaArray: { description: { tr: "RGBA dizisi [r, g, b, a].", en: "RGBA array [r, g, b, a]." }, type: "number[]" },
                    rgbaString: { description: { tr: "RGBA CSS string'i.", en: "RGBA css string." }, type: "string" },
                    hslArray: { description: { tr: "HSL dizisi [h, s, l].", en: "HSL array [h, s, l]." }, type: "number[]" },
                    hslString: { description: { tr: "HSL CSS string'i.", en: "HSL css string." }, type: "string" },
                    hslaArray: { description: { tr: "HSLA dizisi [h, s, l, a].", en: "HSLA array [h, s, l, a]." }, type: "number[]" },
                    hslaString: { description: { tr: "HSLA CSS string'i.", en: "HSLA css string." }, type: "string" },
                    hsbArray: { description: { tr: "HSB dizisi [h, s, b].", en: "HSB array [h, s, b]." }, type: "number[]" },
                    hsbString: { description: { tr: "HSB CSS string'i.", en: "HSB css string." }, type: "string" },
                    hsbaArray: { description: { tr: "HSBA dizisi [h, s, b, a].", en: "HSBA array [h, s, b, a]." }, type: "number[]" },
                    hsbaString: { description: { tr: "HSBA CSS string'i.", en: "HSBA css string." }, type: "string" },
                    luminance: { description: { tr: "Bağıl parlaklık (0–1).", en: "Relative luminance (0–1)." }, type: "number" },
                    isLight: { description: { tr: "luminance >= 0.5 olduğunda true.", en: "True when luminance >= 0.5." }, type: "boolean" },
                    isDark: { description: { tr: "luminance < 0.5 olduğunda true.", en: "True when luminance < 0.5." }, type: "boolean" },
                    linearRgbaArray: {
                        description: { tr: "WCAG hesapları için lineer RGBA dizisi.", en: "Linear RGBA array for WCAG math." },
                        type: "number[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
