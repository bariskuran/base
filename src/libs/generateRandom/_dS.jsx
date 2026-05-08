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
                args={[
                    "generateRandom.number(min, max, decimal, disableLocaleString);",
                    "generateRandom.text(length, { useLowerCase, useUpperCase, useNumbers, useSymbols});",
                    "generateRandom.loremIpsum(length, { disableDot, paragraphLength, enableParagraph, paragraphComponent });",
                ]}
                props={{
                    length: {
                        description:
                            "Length value. Used by text() and loremIpsum() (number() uses min/max).",
                        type: "number",
                        defaultValue: "16/50",
                    },
                    min: {
                        description: "Minimum number (number() only).",
                        type: "number",
                        defaultValue: 0,
                    },
                    max: {
                        description: "Maximum number (number() only).",
                        type: "number",
                        defaultValue: 100,
                    },
                    decimal: {
                        description: "Number of decimal places (number() only).",
                        type: "number",
                        defaultValue: 0,
                    },
                    disableLocaleString: {
                        description: "Disables locale string formatting (number() only).",
                        type: "boolean",
                        defaultValue: false,
                    },
                    useLowerCase: {
                        description: "Uses lower case letters (text() only).",
                        type: "boolean",
                        defaultValue: true,
                    },
                    useUpperCase: {
                        description: "Uses upper case letters (text() only).",
                        type: "boolean",
                        defaultValue: false,
                    },
                    useNumbers: {
                        description: "Uses numbers (text() only).",
                        type: "boolean",
                        defaultValue: false,
                    },
                    useSymbols: {
                        description: "Uses symbols (text() only).",
                        type: "boolean",
                        defaultValue: false,
                    },
                    disableDot: {
                        description: "Disables dot at sentence end (loremIpsum() only).",
                        type: "boolean",
                        defaultValue: false,
                    },
                    paragraphLength: {
                        description:
                            "Average words per paragraph (loremIpsum() only). Used only when enableParagraph is true; ignored for plain string output.",
                        type: "number",
                        defaultValue: 0,
                    },
                    enableParagraph: {
                        description:
                            "If true, loremIpsum() returns paragraphComponent elements split by paragraphLength. If false, returns a single plain string with no <p> wrapping.",
                        type: "boolean",
                        defaultValue: false,
                    },
                    paragraphComponent: {
                        description:
                            "Paragraph wrapper for loremIpsum() component mode. Default is 'p' (for example Typo.p).",
                        type: "component",
                        defaultValue: "'p'",
                    },
                }}
                returns="number(), text(): string — loremIpsum(): plain string if enableParagraph is false; array of paragraph elements if true."
            />
        </Ds.page>
    );
};

export default X;
