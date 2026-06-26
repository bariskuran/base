import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Typo } from ".";
import { Flex } from "../Flex";

const longText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.";

const codeFormatSample = `const obj = {
    key1: value,
    key2: value,
    key3: {
        key4: value,
        key5: value,
    },
};`;

const apiProps = {
    children: { description: "Text content.", type: "ReactNode", defaultValue: "null" },
    content: { description: "Alternative text content.", type: "ReactNode", defaultValue: "null" },
    contentGroup: {
        description: "Renders one host element per item (e.g. multiple <p> when as is p).",
        type: "any[]",
        defaultValue: "[]",
    },
    full: {
        description: 'Shorthand for width="100%" when width is omitted.',
        type: "boolean",
        defaultValue: "false",
    },
    as: { description: "HTML tag override.", type: "string", defaultValue: '"span"' },
    responsive: {
        description: "Breakpoint-based prop overrides.",
        type: "object",
        defaultValue: "{}",
    },
    size: {
        description:
            'Font size. On preset variants with a base size (h1-h6, quote, sub), percentage values such as "110%" and numeric scale-like values such as 110 scale from that variant base.',
        type: "string | number",
        defaultValue: "theme/body default",
    },
    fontSize: { description: "Alias for size.", type: "string | number" },
    fontFamily: {
        description:
            'Named font key from PROJECT_SETTINGS.styledSettings.fonts, e.g. "montserrat". When omitted, Typo inherits fonts.primaryFont.',
        type: "string",
    },
    weight: { description: "Font weight.", type: "number | string", defaultValue: "400" },
    color: { description: "Text color.", type: "string", defaultValue: "inherit" },
    highlight: { description: "Highlight background color.", type: "string" },
    width: {
        description: 'Component width. Ignored when full is true and width is omitted.',
        type: "string | number",
        defaultValue: "auto",
    },
    maxWidth: { description: "Maximum width.", type: "string | number", defaultValue: "none" },
    disableMaxWidthLock: { description: "Disables default max-width lock.", type: "boolean" },
    ellipsis: {
        description: "Single-line overflow ellipsis, or 'base' for DOM-measured truncation.",
        type: "boolean | 'base'",
    },
    clamp: { description: "Multi-line line-clamp count.", type: "number" },
    align: { description: "Text alignment.", type: "string", defaultValue: "inherit" },
    selfAlign: {
        description:
            'Grid/flex self alignment: "left" | "center" | "right". When omitted, parent alignment applies.',
        type: "string",
    },
    wrap: { description: "Wrap behavior.", type: "boolean | string", defaultValue: "true" },
    whiteSpace: { description: "white-space CSS value.", type: "string", defaultValue: '"normal"' },
    overflow: { description: "overflow CSS value.", type: "string", defaultValue: '"visible"' },
    letterSpacing: {
        description: "letter-spacing value.",
        type: "string | number",
        defaultValue: "0",
    },
    lineHeight: { description: "line-height value.", type: "string | number", defaultValue: "1.7" },
    unselectable: { description: "Disables text selection.", type: "boolean" },
    copy: { description: "Shows copy-to-clipboard control.", type: "boolean" },
    italic: { description: "Italic text.", type: "boolean" },
    bold: { description: "Bold text.", type: "boolean" },
    underline: { description: "Underline text.", type: "boolean" },
    strikethrough: { description: "Line-through text.", type: "boolean" },
    uppercase: { description: "Uppercase transform.", type: "boolean" },
    lowercase: { description: "Lowercase transform.", type: "boolean" },
    capitalize: { description: "Capitalize transform.", type: "boolean" },
    disabled: { description: "Disabled style state.", type: "boolean" },
    margin: {
        description: "Margin shorthand or per-side props.",
        type: "string | number | object",
        defaultValue: "0",
    },
    padding: {
        description: "Padding shorthand or per-side props.",
        type: "string | number | object",
        defaultValue: "0",
    },
    fitContent: { description: "Fits width to content.", type: "boolean" },
    enableQuoteMarks: { description: "Adds decorative quote marks.", type: "boolean" },
    balance: { description: "Enables text-wrap: balance.", type: "boolean" },
    codeFormat: {
        description: "Dedents and formats string content for code display.",
        type: "boolean",
    },
    codeFormatJsxProps: {
        description: "When codeFormat is on, splits JSX opening tags across lines.",
        type: "boolean",
    },
    codeFormatCalls: {
        description:
            "When codeFormat is on, breaks function calls and object/array literals across lines.",
        type: "boolean",
    },
    exportData: { description: "Debug/export passthrough.", type: "boolean | function | object" },
};

const X = () => (
    <Ds.page
        title="<Typo>"
        releasedOn="1.0.0"
        description="Text component with variants, typography props, truncation, copy, responsive overrides, and nested HTML guards."
    >
        <Ds.block
            title="Variants"
            description="Shortcut components for common tags and styles."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo.h1>Heading 1</Typo.h1>
                    <Typo.p>Paragraph</Typo.p>
                    <Typo.sub>Subscript</Typo.sub>
                    <Typo.bold>Bold</Typo.bold>
                    <Typo.italic>Italic</Typo.italic>
                    <Typo.code>code</Typo.code>
                    <Typo.quote>Quote</Typo.quote>`}
            example={
                <Flex.column gap={8}>
                    <Typo.h1>{"<Typo.h1>"}</Typo.h1>
                    <Typo.h2>{"<Typo.h2>"}</Typo.h2>
                    <Typo.h3>{"<Typo.h3>"}</Typo.h3>
                    <Typo.h4>{"<Typo.h4>"}</Typo.h4>
                    <Typo.h5>{"<Typo.h5>"}</Typo.h5>
                    <Typo.h6>{"<Typo.h6>"}</Typo.h6>
                    <Typo.p>{"<Typo.p>"}</Typo.p>
                    <Typo.span>{"<Typo.span>"}</Typo.span>
                    <Typo.sub>{"<Typo.sub>"}</Typo.sub>
                    <Typo.bold>{"<Typo.bold>"}</Typo.bold>
                    <Typo.italic>{"<Typo.italic>"}</Typo.italic>
                    <Typo.code>{"<Typo.code>"}</Typo.code>
                    <Typo.pre>{"<Typo.pre>"}</Typo.pre>
                    <Typo.quote>{"<Typo.quote>"}</Typo.quote>
                </Flex.column>
            }
        />

        <Ds.block
            title="size, weight & color"
            description="fontSize/size, weight, and theme color path."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo size={26} weight={700} color="primary">
                        Custom size, weight & color
                    </Typo>
                    <Typo.h1 size="110%">
                        h1 scaled from h1 base
                    </Typo.h1>`}
            example={
                <Flex.column gap={8}>
                    <Typo size={26} weight={700} color="primary">
                        Custom size, weight & color
                    </Typo>
                    <Typo.h1 size="110%">h1 scaled from h1 base</Typo.h1>
                </Flex.column>
            }
        />

        <Ds.block
            title="fontFamily"
            description="Select a named font from PROJECT_SETTINGS.styledSettings.fonts."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo content="Primary font" />
                    <Typo fontFamily="montserrat" content="Montserrat font" />`}
            example={
                <Flex.column gap={8}>
                    <Typo content="Primary font" />
                    <Typo fontFamily="montserrat" content="Montserrat font" />
                </Flex.column>
            }
        />

        <Ds.block
            title="bold & italic"
            description="weight prop or Typo.bold / Typo.italic variants."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo.span weight={700}>Bold</Typo.span>
                    <Typo.bold>Bold variant</Typo.bold>
                    <Typo.italic>Italic</Typo.italic>`}
            example={
                <Flex gap={12} wrap alignItems="center">
                    <Typo.span weight={700}>weight={700}</Typo.span>
                    <Typo.bold>Typo.bold</Typo.bold>
                    <Typo.italic>Typo.italic</Typo.italic>
                </Flex>
            }
        />

        <Ds.block
            title="underline & strikethrough"
            description="Underline and line-through styles."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo underline>Underline</Typo>
                    <Typo strikethrough>Strikethrough</Typo>`}
            example={
                <Flex gap={12} wrap alignItems="center">
                    <Typo underline>Underline</Typo>
                    <Typo strikethrough>Strikethrough</Typo>
                </Flex>
            }
        />

        <Ds.block
            title="highlight"
            description="Background highlight color."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo highlight="warning" content="Highlighted text" />`}
            example={<Typo highlight="warning" content="Highlighted text" />}
        />

        <Ds.block
            title="clamp, ellipsis & copy"
            description="clamp limits lines; ellipsis is single-line overflow without clamp; copy adds a button (inline for short text, overlay top-right for clamped or code blocks)."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo clamp={2} maxWidth={220} content={longText} />
                    <Typo.span ellipsis maxWidth={280} content={longText} />
                    <Typo.span copy content="Copy me" />
                    <Typo clamp={2} copy maxWidth={260} content={longText} />`}
            example={
                <Flex.column gap={16} padding={10} width={320}>
                    <Typo clamp={2} maxWidth={220} content={longText} />
                    <Typo.span ellipsis maxWidth={280} content={longText} />
                    <Typo.span copy content="Copy me" />
                    <Typo clamp={2} copy maxWidth={260} content={longText} />
                </Flex.column>
            }
        />

        <Ds.block
            title="Typo.code"
            description="Typo.code enables codeFormat on string content (dedent, optional JSX/call breaking)."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo.code copy content={\`const obj = { ... };\`} />`}
            example={<Typo.code copy content={codeFormatSample} />}
        />

        <Ds.block
            title="responsive"
            description="Override props per breakpoint key."
            code={`<Typo.span
                    responsive={{
                        xs: { size: 12, color: "danger" },
                        md: { size: 18, color: "primary" },
                    }}
                    content="Resize the window"
                   />`}
            example={
                <Typo.span
                    responsive={{
                        xs: { size: 12, color: "danger" },
                        md: { size: 18, color: "primary" },
                    }}
                    content="Resize the window"
                />
            }
        />

        <Ds.block
            title="content & contentGroup"
            description="Use content for a single value. contentGroup renders multiple block hosts (e.g. several <p> elements)."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo.p content="Paragraph one." />
                    <Typo.p
                        contentGroup={["Paragraph one.", "Paragraph two."]}
                    />`}
            example={
                <Flex.column gap={8}>
                    <Typo.p content="Single content." />
                    <Typo.p
                        contentGroup={[
                            "contentGroup p one.",
                            "contentGroup p two.",
                            "contentGroup p three.",
                        ]}
                    />
                </Flex.column>
            }
        />

        <Ds.block
            title="as"
            description="Override the rendered HTML tag."
            code='<Typo as="label" size={15} content="Label text" />'
            example={<Typo as="label" size={15} content="Label text" />}
        />

        <Ds.block
            title="disabled"
            description="Muted disabled appearance."
            code='<Typo.span disabled content="Disabled text" />'
            example={<Typo.span disabled content="Disabled text" />}
        />

        <Ds.block
            title="unselectable"
            description="Prevents text selection."
            code='<Typo.span unselectable content="Cannot select this" />'
            example={<Typo.span unselectable content="Cannot select this" />}
        />

        <Ds.block
            title="text transform"
            description="uppercase, lowercase, capitalize."
            code={`<Typo.span uppercase>uppercase</Typo.span>
                    <Typo.span lowercase>LOWERCASE</Typo.span>
                    <Typo.span capitalize>capitalize words</Typo.span>`}
            example={
                <Flex gap={10} wrap alignItems="center">
                    <Typo.span uppercase>uppercase</Typo.span>
                    <Typo.span lowercase>LOWERCASE</Typo.span>
                    <Typo.span capitalize>capitalize words</Typo.span>
                </Flex>
            }
        />

        <Ds.block
            title="spacing"
            description="margin, padding, and lineHeight examples."
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo.p marginBottom={16} content="marginBottom={16}" />
                    <Typo.p padding={12} content="padding={12}" />
                    <Typo.p lineHeight={2.2} content="lineHeight={2.2}" />`}
            example={
                <Flex.column gap={12}>
                    <Typo.p marginBottom={16} content="marginBottom={16}" />
                    <Typo.p padding={12} content="padding={12}" />
                    <Typo.p lineHeight={2.2} content="lineHeight={2.2}" />
                </Flex.column>
            }
        />

        <Ds.block
            title="align & selfAlign"
            description="Text alignment and flex/grid self alignment."
            code={`<Typo.p align="center" content="align=center" />
                    <Typo.span selfAlign="right" content="selfAlign=right" />`}
            example={
                <Flex.column gap={8} width={280}>
                    <Typo.p align="center" content="align=center" />
                    <Typo.span selfAlign="right" content="selfAlign=right" />
                </Flex.column>
            }
        />

        <Ds.block
            title="fitContent & balance"
            description="fit-content width and text-wrap balance."
            code="<Typo.p fitContent balance maxWidth={200} content={longText} />"
            example={<Typo.p fitContent balance maxWidth={200} content={longText} />}
        />

        <Ds.block
            title="Nested HTML guard"
            description={
                <>
                    Typo uses <code>NestedBaseUi</code> to avoid invalid HTML nesting. Phrasing-only
                    hosts (e.g. <code>p</code>, <code>span</code>, headings) cannot contain block
                    roots such as <code>pre</code> — nesting <code>p</code> inside <code>p</code> is
                    also invalid. Inside a phrasing host, <code>Typo.pre</code> /{" "}
                    <code>Typo.code</code> map to <code>code</code> instead of <code>pre</code>.
                </>
            }
            code={`// Invalid: <p><p>...</p></p>
                    // Typo avoids block-level roots inside phrasing hosts.

                    <Typo.p>
                        <Typo.code>safe inline code</Typo.code>
                    </Typo.p>`}
            example={
                <Typo.p>
                    <Typo.code content="safe inline code" />
                </Typo.p>
            }
        />

        <Ds.api args="<Typo />" props={apiProps} />
    </Ds.page>
);

export default X;
