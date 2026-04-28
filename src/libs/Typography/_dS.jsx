import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Typo as Typography } from ".";
import { Card } from "../Card";
import { Flex } from "../Flex";

const X = () => (
    <Ds.page title="<Typography>" releasedOn="1.0.0" description="Text component with rich style variants.">
        <Ds.block
            title="Basic Variants"
            code={`import { Typography } from "${SYS.basePath}";

<Typography.h3>Heading</Typography.h3>
<Typography.p>Body text</Typography.p>
<Typography.quote>Quoted text</Typography.quote>`}
            example={
                <Flex.column xAlign="start" gap={8}>
                    <Typography.h3>Heading</Typography.h3>
                    <Typography.p>Body text example</Typography.p>
                    <Typography.quote>Quoted text example</Typography.quote>
                </Flex.column>
            }
        />
        <Ds.block
            title="Clamp and Copyable"
            code={`<Typography
  clamp={2}
  copyable
  maxWidth={260}
  content="Long text..."
/>`}
            example={
                <Card padding={10} width={280}>
                    <Typography
                        clamp={2}
                        copyable
                        maxWidth={260}
                        content="This is a long text for clamp and copyable preview in the design-system page."
                    />
                </Card>
            }
        />
        <Ds.api
            props={{
                children: { description: "Text content.", type: "ReactNode", required: false, defaultValue: "null" },
                content: { description: "Alternative text content.", type: "ReactNode", required: false, defaultValue: "null" },
                contentArray: { description: "Optional content list source.", type: "any[]", required: false, defaultValue: "[]" },
                as: { description: "HTML tag override.", type: "string", required: false, defaultValue: '"span"' },
                responsive: { description: "Breakpoint based prop map.", type: "object", required: false, defaultValue: "{}" },
                size: { description: "Font size.", type: "string | number", required: false, defaultValue: "theme/body default" },
                fontSize: { description: "Alias for size.", type: "string | number", required: false, defaultValue: "undefined" },
                weight: { description: "Font weight.", type: "number | string", required: false, defaultValue: "400" },
                color: { description: "Text color.", type: "string", required: false, defaultValue: "theme.foreground" },
                highlight: { description: "Highlight background/text helper.", type: "string", required: false, defaultValue: "undefined" },
                width: { description: "Component width.", type: "string | number", required: false, defaultValue: "auto" },
                maxWidth: { description: "Maximum width.", type: "string | number", required: false, defaultValue: "none" },
                disableMaxWidthLock: { description: "Disables max-width lock behaviors.", type: "boolean", required: false, defaultValue: "false" },
                ellipsis: { description: "Ellipsis mode.", type: "boolean | 'base'", required: false, defaultValue: "false" },
                clamp: { description: "Line clamp count.", type: "number", required: false, defaultValue: "undefined" },
                align: { description: "Text alignment.", type: "string", required: false, defaultValue: "inherit" },
                selfAlign: { description: "Self align helper.", type: "string", required: false, defaultValue: '"left"' },
                wrap: { description: "Wrap behavior.", type: "boolean | string", required: false, defaultValue: "true" },
                whiteSpace: { description: "white-space css value.", type: "string", required: false, defaultValue: '"normal"' },
                overflow: { description: "overflow css value.", type: "string", required: false, defaultValue: '"visible"' },
                letterSpacing: { description: "letter-spacing value.", type: "string | number", required: false, defaultValue: "0" },
                lineHeight: { description: "line-height value.", type: "string | number", required: false, defaultValue: "1.7" },
                unselectable: { description: "Disables text selection.", type: "boolean", required: false, defaultValue: "false" },
                copyable: { description: "Shows copy action.", type: "boolean", required: false, defaultValue: "false" },
                italic: { description: "Italic text.", type: "boolean", required: false, defaultValue: "false" },
                bold: { description: "Bold text.", type: "boolean", required: false, defaultValue: "false" },
                underline: { description: "Underline text.", type: "boolean", required: false, defaultValue: "false" },
                strikethrough: { description: "Line-through text.", type: "boolean", required: false, defaultValue: "false" },
                uppercase: { description: "Uppercase transform.", type: "boolean", required: false, defaultValue: "false" },
                lowercase: { description: "Lowercase transform.", type: "boolean", required: false, defaultValue: "false" },
                capitalize: { description: "Capitalize transform.", type: "boolean", required: false, defaultValue: "false" },
                disabled: { description: "Disabled style state.", type: "boolean", required: false, defaultValue: "false" },
                margin: { description: "Margin shorthand/object.", type: "string | number | object", required: false, defaultValue: "0" },
                padding: { description: "Padding shorthand/object.", type: "string | number | object", required: false, defaultValue: "0" },
                fitContent: { description: "Fits width to content.", type: "boolean", required: false, defaultValue: "false" },
                enableQuoteMarks: { description: "Adds quote marks style.", type: "boolean", required: false, defaultValue: "false" },
                balance: { description: "Enables text-wrap balance.", type: "boolean", required: false, defaultValue: "false" },
                exportData: { description: "Debug/export passthrough.", type: "boolean | function | object", required: false, defaultValue: "false" },
            }}
        />
    </Ds.page>
);

export default X;
