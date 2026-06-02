import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { generateRandom } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const X = () => {
    return (
        <Ds.page
            title="generateRandom()"
            releasedOn="1.0.0"
            description="Random number, text and lorem generators."
        >
            <Ds.block
                title=".number"
                code={`import { generateRandom } from "${SYS.basePath}";

                        generateRandom.number(10, 99);
                        generateRandom.number(0, 100, 2);
                        generateRandom.number(0, 10, 4, true);
`}
                example={
                    <Flex gap={20} padding={5}>
                        <Typo.code>{generateRandom.number(10, 99)}</Typo.code>
                        <Typo.code>{generateRandom.number(0, 100, 2)}</Typo.code>
                        <Typo.code>{generateRandom.number(0, 10, 4, true)}</Typo.code>
                    </Flex>
                }
            />
            <Ds.block
                title=".text"
                code={`import { generateRandom } from "${SYS.basePath}";

                        generateRandom.text(8);
                        generateRandom.text(32, { useLowerCase: false });
                        generateRandom.text(12, { useNumbers: true });
                        generateRandom.text(40, { useNumbers: true, useUpperCase: true, useSymbols: true, });
`}
                example={
                    <Flex.column padding={5}>
                        <Typo.code>{generateRandom.text(8)}</Typo.code>
                        <Typo.code>{generateRandom.text(32, { useLowerCase: false })}</Typo.code>
                        <Typo.code>
                            {generateRandom.text(8, { useLowerCase: false, useUpperCase: true })}
                        </Typo.code>
                        <Typo.code>{generateRandom.text(12, { useNumbers: true })}</Typo.code>
                        <Typo.code>
                            {generateRandom.text(40, {
                                useNumbers: true,
                                useUpperCase: true,
                                useSymbols: true,
                            })}
                        </Typo.code>
                    </Flex.column>
                }
            />
            <Ds.block
                title=".loremIpsum"
                code={`import { generateRandom } from "${SYS.basePath}";

                        <Typo.code>
                            {generateRandom.loremIpsum(50)}
                        </Typo.code>
                        <Typo.code>
                            {generateRandom.loremIpsum(100, { disableDot: true })}
                        </Typo.code>
                        {generateRandom.loremIpsum(100, {
                            paragraphLength: 20,
                            enableParagraph: true,
                            paragraphComponent: Typo.code, // Typo.p is suggested.
                        })}
`}
                example={
                    <Flex.column padding={5}>
                        <Typo.bold>50</Typo.bold>
                        <Typo.code>{generateRandom.loremIpsum(50)}</Typo.code>
                        <Typo.bold>200 withoutDot</Typo.bold>
                        <Typo.code>
                            {generateRandom.loremIpsum(100, { disableDot: true })}
                        </Typo.code>
                        <Typo.bold>200 with random paragraphs as components</Typo.bold>
                        {generateRandom.loremIpsum(100, {
                            paragraphLength: 20,
                            enableParagraph: true,
                            paragraphComponent: Typo.code,
                        })}
                    </Flex.column>
                }
            />
            <Ds.api
                title="number"
                disableLastBlock
                args="const num = generateRandom.number(min, max, decimal, disableLocaleString);"
                props={{
                    min: {
                        description: "Minimum number.",
                        type: "number",
                        defaultValue: "0",
                    },
                    max: {
                        description: "Maximum number.",
                        type: "number",
                        defaultValue: "100",
                    },
                    decimal: {
                        description: "Decimal places.",
                        type: "number",
                        defaultValue: "0",
                    },
                    disableLocaleString: {
                        description: "Disables locale string formatting.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
                returnProps={{
                    num: {
                        description: "Random number, or locale-formatted string when formatting is enabled.",
                        type: "number | string",
                    },
                }}
            />
            <Ds.api
                title="text"
                disableLastBlock
                args="const text = generateRandom.text(length, { useLowerCase, useNumbers, useSymbols, useUpperCase });"
                props={{
                    length: {
                        description: "Character length.",
                        type: "number",
                        required: true,
                    },
                    useLowerCase: {
                        description: "Uses lower case letters.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    useUpperCase: {
                        description: "Uses upper case letters.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    useNumbers: {
                        description: "Uses numbers.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    useSymbols: {
                        description: "Uses symbols.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
                returnProps={{
                    text: { description: "Random text string.", type: "string" },
                }}
            />
            <Ds.api
                title="loremIpsum"
                args="const lorem = generateRandom.loremIpsum(length, { disableDot, enableParagraph, paragraphComponent, paragraphLength });"
                props={{
                    length: {
                        description: "Word count.",
                        type: "number",
                        required: true,
                    },
                    disableDot: {
                        description: "Disables dot at sentence end.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    paragraphLength: {
                        description: "Average words per paragraph when enableParagraph is true.",
                        type: "number",
                        defaultValue: "0",
                    },
                    enableParagraph: {
                        description: "Returns paragraphComponent elements when true.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    paragraphComponent: {
                        description: "Paragraph wrapper component.",
                        type: "component",
                        defaultValue: "'p'",
                    },
                }}
                returnProps={{
                    lorem: {
                        description: "Lorem text string, or React paragraph elements when enableParagraph is true.",
                        type: "string | ReactNode[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
