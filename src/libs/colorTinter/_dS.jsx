import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorTinter } from ".";
import { colorFind } from "../colorFind";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";

const X = () => {
    const { color, percent, set } = baseStore.useLocal({
        color: "#4f46e5",
        percent: 20,
    });
    const basePreview = colorFind(color, { output: "hex8" }) || color;
    const tinted = colorTinter(color, percent);

    return (
        <Ds.page
            title="colorTinter()"
            releasedOn="1.0.0"
            description={`Tints a color toward white by percent, or increases alpha when the input is transparent hex8.

You can use colorTinter via direct import from base, or via the theme helper in styled usage (theme.colorTinter).`}
        >
            <Ds.block
                title={{ tr: "Etkileşimli Açma", en: "Interactive tint" }}
                code={`import { colorTinter } from "${SYS.basePath}";

                       colorTinter("#4f46e5", 20);`}
                example={
                    <Flex.column gap={12} full>
                        <Flex gap={10}>
                            <Flex.column gap={4}>
                                <Typo.span>Color input:</Typo.span>
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
                                <Typo.span>Percent: {percent}</Typo.span>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={percent}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.percent = Number(e.target.value);
                                        })
                                    }
                                />
                            </Flex.column>
                        </Flex>
                        <Flex gap={8}>
                            <div
                                style={{
                                    width: 60,
                                    height: 24,
                                    borderRadius: 6,
                                    background: basePreview,
                                }}
                            />
                            <div
                                style={{
                                    width: 60,
                                    height: 24,
                                    borderRadius: 6,
                                    background: tinted,
                                }}
                            />
                        </Flex>
                        <Ds.output directValue={{ color, percent, result: tinted }} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const tinted = colorTinter(color, percent);"
                props={{
                    color: {
                        description: { tr: "Girdi rengi (hex/rgb/CSS adı/theme token/yol).", en: "Input color (hex/rgb/css name/theme token/path)." },
                        type: "string | object",
                    },
                    percent: {
                        description: { tr: "Açma miktarı (0..100). 100 beyaza eşittir.", en: "Tint amount (0..100). 100 is equal to white." },
                        type: "number",
                        defaultValue: "0",
                    },
                }}
                returnProps={{
                    tinted: {
                        description: { tr: "Açılmış renk string'i (kaynağa göre hex6 veya hex8).", en: "Tinted color string (hex6 or hex8 depending on source)." },
                        type: "string",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
