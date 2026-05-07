import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorPickHigherContrast } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="colorPickHigherContrast()"
            releasedOn="1.0.0"
            description="Picks the better contrast candidate color."
        >
            <Ds.block
                title="Basic usage"
                code={`import { colorPickHigherContrast } from "${SYS.basePath}";

colorPickHigherContrast("#ffffff", "#111111", "#3b82f6");`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run sample pick"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(
                                        colorPickHigherContrast("#ffffff", "#111111", "#3b82f6"),
                                        null,
                                        2,
                                    );
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{output}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorPickHigherContrast(optionA, optionB, background);"
                returns="Object with winner color and ratioA, ratioB."
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
            />
        </Ds.page>
    );
};

export default X;
