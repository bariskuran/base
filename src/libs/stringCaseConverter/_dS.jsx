import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { stringCaseConverter } from ".";
import { baseStore } from "../baseStore";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Dropdown } from "../Dropdown";

const CASE_SAMPLES = {
    camel: "helloWorld",
    pascal: "HelloWorld",
    kebab: "hello-world",
    snake: "hello_world",
    constant: "HELLO_WORLD",
    dot: "hello.world",
    path: "hello/world",
    lower: "hello world",
    sentence: "Hello world",
    title: "Hello World",
    spaced: "Hello World",
};

const sampleOptions = Object.entries(CASE_SAMPLES).map(([value, sample]) => ({
    label: `${value} — ${sample}`,
    value,
}));

const outputTypeOptions = Object.keys(CASE_SAMPLES).map((value) => ({
    label: value,
    value,
}));

const CaseConverterDemo = () => {
    const { sampleKey, outputType, set } = baseStore.useLocal({
        sampleKey: "camel",
        outputType: "kebab",
    });

    const input = CASE_SAMPLES[sampleKey] ?? "";
    const output = stringCaseConverter(input, outputType);

    return (
        <Flex.column gap={12} padding={10} full>
            <Flex gap={16} wrap alignItems="center">
                <Flex gap={8} alignItems="center">
                    <Typo.span>örnek</Typo.span>
                    <Dropdown
                        options={sampleOptions}
                        value={sampleKey}
                        sortBy="none"
                        onChange={(value) => {
                            set((s) => {
                                s.sampleKey = value;
                            });
                        }}
                    />
                </Flex>
                <Flex gap={8} alignItems="center">
                    <Typo.span>outputType</Typo.span>
                    <Dropdown
                        options={outputTypeOptions}
                        value={outputType}
                        sortBy="none"
                        onChange={(value) => {
                            set((s) => {
                                s.outputType = value;
                            });
                        }}
                    />
                </Flex>
            </Flex>
            <Flex.column gap={6}>
                <Typo.span weight={600}>Input</Typo.span>
                <Typo.code>{input}</Typo.code>
                <Typo.span weight={600}>Output</Typo.span>
                <Typo.code>{output}</Typo.code>
            </Flex.column>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="stringCaseConverter()"
        releasedOn="1.0.0"
        description="Converts strings across case formats. Input case is auto-detected."
    >
        <Ds.block
            title="Basic Usage"
            description="Used to convert technical string formats. Input type is auto-detected."
            code={`import { stringCaseConverter } from "${SYS.basePath}";

                    stringCaseConverter("helloWorld", "kebab");`}
            example={<CaseConverterDemo />}
        />
        <Ds.api
            args='const converted = stringCaseConverter(string, outputType);'
            props={{
                string: {
                    description: "Input text.",
                    type: "string",
                    required: true,
                },
                outputType: {
                    description:
                        "Target format (camel, pascal, kebab, snake, constant, dot, path, lower, sentence, title, spaced).",
                    type: "string",
                    defaultValue: '"camel"',
                },
            }}
            returnProps={{
                converted: {
                    description: "Input string in the requested case format.",
                    type: "string",
                },
            }}
        />
    </Ds.page>
);

export default X;
