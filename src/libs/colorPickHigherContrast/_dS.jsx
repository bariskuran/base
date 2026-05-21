import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorPickHigherContrast } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { optionA, optionB, background, setLocal } = baseStore.useLocal({
        optionA: "#ffffff",
        optionB: "#111111",
        background: "#3b82f6",
    });
    const output = colorPickHigherContrast(optionA, optionB, background);

    return (
        <Ds.page
            title="colorPickHigherContrast()"
            releasedOn="1.0.0"
            description={`Compares two candidates against a background and returns the better WCAG contrast winner.

You can use colorPickHigherContrast via direct import from base, or via the theme helper in styled usage (theme.colorPickHigherContrast).`}
        >
            <Ds.block
                title="Interactive comparison"
                code={`import { colorPickHigherContrast } from "${SYS.basePath}";

colorPickHigherContrast("#ffffff", "#111111", "#3b82f6");`}
                example={
                    <Flex.column gap={10} full>
                        <Flex gap={10}>
                            <Flex.column gap={4}>
                                <Typo.span>Background</Typo.span>
                                <input
                                    type="color"
                                    value={background}
                                    onChange={(e) =>
                                        setLocal((s) => {
                                            s.background = e.target.value;
                                        })
                                    }
                                />
                            </Flex.column>
                            <Flex.column gap={4}>
                                <Typo.span>Option A</Typo.span>
                                <input
                                    type="color"
                                    value={optionA}
                                    onChange={(e) =>
                                        setLocal((s) => {
                                            s.optionA = e.target.value;
                                        })
                                    }
                                />
                            </Flex.column>
                            <Flex.column gap={4}>
                                <Typo.span>Option B</Typo.span>
                                <input
                                    type="color"
                                    value={optionB}
                                    onChange={(e) =>
                                        setLocal((s) => {
                                            s.optionB = e.target.value;
                                        })
                                    }
                                />
                            </Flex.column>
                        </Flex>
                        <Flex
                            gap={10}
                            style={{
                                background,
                                padding: 10,
                                borderRadius: 8,
                                width: "fit-content",
                            }}
                        >
                            <div
                                style={{
                                    width: 56,
                                    height: 28,
                                    borderRadius: 6,
                                    background: optionA,
                                }}
                            />
                            <div
                                style={{
                                    width: 56,
                                    height: 28,
                                    borderRadius: 6,
                                    background: optionB,
                                }}
                            />
                            <div
                                style={{
                                    width: 56,
                                    height: 28,
                                    borderRadius: 6,
                                    background: output?.winner,
                                }}
                            />
                        </Flex>
                        <Ds.output directValue={output} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { winner, ratioA, ratioB } = colorPickHigherContrast(optionA, optionB, background);"
                props={{
                    optionA: {
                        description: "First candidate color.",
                        type: "string | object | null",
                        defaultValue: "theme.foreground",
                    },
                    optionB: {
                        description: "Second candidate color.",
                        type: "string | object | null",
                        defaultValue: "theme.background",
                    },
                    background: {
                        description: "Background color.",
                        type: "string | object",
                        required: true,
                    },
                }}
                returnProps={{
                    winner: { description: "Winning candidate color string.", type: "string" },
                    ratioA: { description: "Contrast ratio for optionA.", type: "number" },
                    ratioB: { description: "Contrast ratio for optionB.", type: "number" },
                }}
            />
        </Ds.page>
    );
};

export default X;
