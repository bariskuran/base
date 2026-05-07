import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { generateRandom } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="generateRandom"
            releasedOn="1.0.0"
            description="Random number, text and lorem generators."
        >
            <Ds.block
                title="Number / text / lorem"
                code={`import { generateRandom } from "${SYS.basePath}";

generateRandom.number(10, 99);

generateRandom.text(12, { useUpperCase: true, useNumbers: true });

generateRandom.loremIpsum(15);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run generateRandom.number(10, 99)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = String(generateRandom.number(10, 99));
                                })
                            }
                        />
                        <Button.string
                            label="Run generateRandom.text(12, …)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = generateRandom.text(12, {
                                        useUpperCase: true,
                                        useNumbers: true,
                                    });
                                })
                            }
                        />
                        <Button.string
                            label="Run generateRandom.loremIpsum(40)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = generateRandom.loremIpsum(40);
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.code>{output}</Typo.code>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args={[
                    "generateRandom.number(min, max, decimal, toLocaleString);",
                    "generateRandom.text(length, settings);",
                    "generateRandom.loremIpsum(count, disableDot);",
                ]}
                returns="Random number, text, or lorem string depending on method."
                props={{
                    number: {
                        description: "Random number helper.",
                        type: "function",
                        required: true,
                    },
                    text: {
                        description: "Random alphanumeric text helper.",
                        type: "function",
                        required: true,
                    },
                    loremIpsum: {
                        description: "Lorem ipsum paragraph helper.",
                        type: "function",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
