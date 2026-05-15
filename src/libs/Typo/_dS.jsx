import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Typo } from ".";
import { Card } from "../Card";
import { Flex } from "../Flex";

const X = () => (
    <Ds.page title="<Typo>" releasedOn="1.0.0" description="Text component with rich style variants.">
        <Ds.block
            title="Basic Variants"
            code={`import { Typo } from "${SYS.basePath}";

                        <Typo.h3>Heading</Typo.h3>
                        <Typo.p>Body text</Typo.p>
                        <Typo.quote>Quoted text</Typo.quote>
                        <Typo.code>{\`
                            <Button
                                label="Hello"
                                variant="plain"
                            />
                        \`}</Typo.code>`}
            example={
                <Flex.column gap={8}>
                    <Typo.h3>Heading</Typo.h3>
                    <Typo.p>Body text example</Typo.p>
                    <Typo.quote>Quoted text example</Typo.quote>
                        <Typo.code>{`<Button label="Hello" variant="plain" />`}</Typo.code>
                </Flex.column>
            }
        />
        <Ds.block
            title="Clamp and Copyable"
            code={`<Typo
  clamp={2}
  copyable
  maxWidth={260}
  content="Long text..."
/>`}
            example={
                <Card padding={10} width={280}>
                    <Typo
                        clamp={2}
                        copyable
                        maxWidth={260}
                        content="This is a long text for clamp and copyable preview in the design-system page."
                    />
                </Card>
            }
        />
        <Ds.api
            args="<Typo />"
            props={{
                children: { description: "Text content.", type: "ReactNode", defaultValue: "null" },
                content: { description: "Alternative text content.", type: "ReactNode", defaultValue: "null" },
                contentArray: { description: "Optional content list source.", type: "any[]", defaultValue: "[]" },
                as: { description: "HTML tag override.", type: "string", defaultValue: '"span"' },
                responsive: { description: "Breakpoint based prop map.", type: "object", defaultValue: "{}" },
                size: { description: "Font size.", type: "string | number", defaultValue: "theme/body default" },
                fontSize: { description: "Alias for size.", type: "string | number", defaultValue: "undefined" },
                weight: { description: "Font weight.", type: "number | string", defaultValue: "400" },
                color: { description: "Text color.", type: "string", defaultValue: "inherit" },
                highlight: { description: "Highlight background/text helper.", type: "string", defaultValue: "undefined" },
                width: { description: "Component width.", type: "string | number", defaultValue: "auto" },
                maxWidth: { description: "Maximum width.", type: "string | number", defaultValue: "none" },
                disableMaxWidthLock: { description: "Disables max-width lock behaviors.", type: "boolean", defaultValue: "false" },
                ellipsis: { description: "Ellipsis mode.", type: "boolean | 'base'", defaultValue: "false" },
                clamp: { description: "Line clamp count.", type: "number", defaultValue: "undefined" },
                align: { description: "Text alignment.", type: "string", defaultValue: "inherit" },
                selfAlign: {
                    description:
                        'Optional grid/flex self alignment: "left" | "center" | "right". When omitted, parent align-items / justify-items apply.',
                    type: "string",
                },
                wrap: { description: "Wrap behavior.", type: "boolean | string", defaultValue: "true" },
                whiteSpace: { description: "white-space css value.", type: "string", defaultValue: '"normal"' },
                overflow: { description: "overflow css value.", type: "string", defaultValue: '"visible"' },
                letterSpacing: { description: "letter-spacing value.", type: "string | number", defaultValue: "0" },
                lineHeight: { description: "line-height value.", type: "string | number", defaultValue: "1.7" },
                unselectable: { description: "Disables text selection.", type: "boolean", defaultValue: "false" },
                copyable: { description: "Shows copy action.", type: "boolean", defaultValue: "false" },
                italic: { description: "Italic text.", type: "boolean", defaultValue: "false" },
                bold: { description: "Bold text.", type: "boolean", defaultValue: "false" },
                underline: { description: "Underline text.", type: "boolean", defaultValue: "false" },
                strikethrough: { description: "Line-through text.", type: "boolean", defaultValue: "false" },
                uppercase: { description: "Uppercase transform.", type: "boolean", defaultValue: "false" },
                lowercase: { description: "Lowercase transform.", type: "boolean", defaultValue: "false" },
                capitalize: { description: "Capitalize transform.", type: "boolean", defaultValue: "false" },
                disabled: { description: "Disabled style state.", type: "boolean", defaultValue: "false" },
                margin: { description: "Margin shorthand/object.", type: "string | number | object", defaultValue: "0" },
                padding: { description: "Padding shorthand/object.", type: "string | number | object", defaultValue: "0" },
                fitContent: { description: "Fits width to content.", type: "boolean", defaultValue: "false" },
                enableQuoteMarks: { description: "Adds quote marks style.", type: "boolean", defaultValue: "false" },
                balance: { description: "Enables text-wrap balance.", type: "boolean", defaultValue: "false" },
                codeFormat: {
                    description:
                        "String içerikte dedent + (isteğe bağlı) JSX prop satırları + üst seviye çağrı/ literal kırılımı.",
                    type: "boolean",
                    defaultValue: "false",
                },
                codeFormatJsxProps: {
                    description: "codeFormat açıkken <Tag prop…> açılışlarını çok satıra böler.",
                    type: "boolean",
                    defaultValue: "false",
                },
                codeFormatCalls: {
                    description:
                        'codeFormat açıkken `foo({ a: 1 }, …)` gibi tek çağrıları ve `{ }` / `[ ]` içeriğini okunur biçimde satırlara böler.',
                    type: "boolean",
                    defaultValue: "false",
                },
                exportData: { description: "Debug/export passthrough.", type: "boolean | function | object", defaultValue: "false" },
            }}
        />
    </Ds.page>
);

export default X;
