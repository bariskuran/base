import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorShader } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { color, percent, setLocal } = baseStore.useLocal({
        color: "#4f46e5",
        percent: 20,
    });
    const shaded = colorShader(color, percent);

    return (
        <Ds.page
            title="colorShader()"
            releasedOn="1.0.0"
            description={`Shades a color darker by percent, or increases alpha when the input is transparent hex8.

You can use colorShader via direct import from base, or via the theme helper in styled usage (theme.colorShader).`}
        >
            <Ds.block
                title="Interactive shade"
                code={`import { colorShader } from "${SYS.basePath}";

colorShader("#4f46e5", 20);`}
                example={
                    <Flex.column gap={12}>
                        <Flex gap={10}>
                            <Flex.column gap={4}>
                                <Typo.span>Color input:</Typo.span>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) =>
                                        setLocal((s) => {
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
                                        setLocal((s) => {
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
                                    background: color,
                                }}
                            />
                            <div
                                style={{
                                    width: 60,
                                    height: 24,
                                    borderRadius: 6,
                                    background: shaded,
                                }}
                            />
                        </Flex>
                        <Typo.code>
                            {JSON.stringify({ color, percent, result: shaded }, null, 2)}
                        </Typo.code>
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorShader(color, percent);"
                returns="Shaded color string (hex6 or hex8 depending on source)."
                props={{
                    color: {
                        description: "Input color (hex/rgb/css name/theme token/path).",
                        type: "string | object",
                    },
                    percent: {
                        description: "Shade amount (0..100).",
                        type: "number",
                        defaultValue: "0",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
