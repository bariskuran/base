import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { stringCaseConverter } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="stringCaseConverter()"
            releasedOn="1.0.0"
            description="Converts strings across case formats."
        >
            <Ds.block
                title="Case conversion"
                code={`import { stringCaseConverter } from "${SYS.basePath}";

stringCaseConverter("helloWorld", "kebab");

stringCaseConverter("hello world", "constant", "lower");`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.string
                            label='Run stringCaseConverter("helloWorld", "kebab")'
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = stringCaseConverter("helloWorld", "kebab");
                                })
                            }
                        />
                        <Button.string
                            label='Run stringCaseConverter("hello world", "constant", "lower")'
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = stringCaseConverter(
                                        "hello world",
                                        "constant",
                                        "lower",
                                    );
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
                args="stringCaseConverter(string, output, input);"
                returns="Converted string."
                props={{
                    string: {
                        description: "Input text.",
                        type: "string",
                        required: true,
                        defaultValue: '""',
                    },
                    output: {
                        description:
                            "Target format (camel, pascal, kebab, snake, constant, dot, path, lower, sentence, title, spaced).",
                        type: "string",
                        defaultValue: '"camel"',
                    },
                    input: {
                        description: "Input format, or auto detection.",
                        type: "string",
                        defaultValue: '"auto"',
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
