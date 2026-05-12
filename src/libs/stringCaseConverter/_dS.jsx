import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { stringCaseConverter } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

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
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label='("helloWorld", "kebab")'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => stringCaseConverter("helloWorld", "kebab"),
                                })}
                            />
                            <Button.plain
                                label='("hello world", "constant", "lower")'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => stringCaseConverter("hello world", "constant", "lower"),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
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
