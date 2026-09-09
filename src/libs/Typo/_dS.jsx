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
    children: { description: { tr: "Metin içeriği.", en: "Text content." }, type: "ReactNode", defaultValue: "null" },
    content: { description: { tr: "Alternatif metin içeriği.", en: "Alternative text content." }, type: "ReactNode", defaultValue: "null" },
    contentGroup: {
        description: { tr: "Her item için bir host element render eder (ör. as p iken birden fazla <p>).", en: "Renders one host element per item (e.g. multiple <p> when as is p)." },
        type: "any[]",
        defaultValue: "[]",
    },
    full: {
        description: { tr: 'width verilmediğinde width="100%" için kısaltma.', en: 'Shorthand for width="100%" when width is omitted.' },
        type: "boolean",
        defaultValue: "false",
    },
    as: { description: { tr: "HTML tag ezmesi.", en: "HTML tag override." }, type: "string", defaultValue: '"span"' },
    responsive: {
        description: { tr: "Breakpoint tabanlı prop ezmeleri.", en: "Breakpoint-based prop overrides." },
        type: "object",
        defaultValue: "{}",
    },
    size: {
        description:
            'Font size. On preset variants with a base size (h1-h6, quote, sub), percentage values such as "110%" and numeric scale-like values such as 110 scale from that variant base.',
        type: "string | number",
        defaultValue: "theme/body default",
    },
    fontSize: { description: { tr: "size için alias.", en: "Alias for size." }, type: "string | number" },
    fontFamily: {
        description:
            'Named font key from PROJECT_SETTINGS.styledSettings.fonts, e.g. "montserrat". When omitted, Typo inherits fonts.primaryFont.',
        type: "string",
    },
    weight: { description: { tr: "Font ağırlığı.", en: "Font weight." }, type: "number | string", defaultValue: "400" },
    color: { description: { tr: "Metin rengi.", en: "Text color." }, type: "string", defaultValue: "inherit" },
    highlight: { description: { tr: "Vurgu arka plan rengi.", en: "Highlight background color." }, type: "string" },
    width: {
        description: 'Component width. Ignored when full is true and width is omitted.',
        type: "string | number",
        defaultValue: "auto",
    },
    maxWidth: { description: { tr: "Maksimum genişlik.", en: "Maximum width." }, type: "string | number", defaultValue: "none" },
    disableMaxWidthLock: { description: { tr: "Varsayılan max-width kilidini kapatır.", en: "Disables default max-width lock." }, type: "boolean" },
    ellipsis: {
        description: { tr: "Tek satırlı overflow ellipsis veya DOM ile ölçülen kırpma için base.", en: "Single-line overflow ellipsis, or base for DOM-measured truncation." },
        type: "boolean | 'base'",
    },
    clamp: { description: { tr: "Çok satırlı line-clamp sayısı.", en: "Multi-line line-clamp count." }, type: "number" },
    align: { description: { tr: "Metin hizalaması.", en: "Text alignment." }, type: "string", defaultValue: "inherit" },
    selfAlign: {
        description:
            'Grid/flex self alignment: "left" | "center" | "right". When omitted, parent alignment applies.',
        type: "string",
    },
    wrap: { description: { tr: "Satır kırma davranışı.", en: "Wrap behavior." }, type: "boolean | string", defaultValue: "true" },
    whiteSpace: { description: { tr: "white-space CSS değeri.", en: "white-space CSS value." }, type: "string", defaultValue: '"normal"' },
    overflow: { description: { tr: "overflow CSS değeri.", en: "overflow CSS value." }, type: "string", defaultValue: '"visible"' },
    letterSpacing: {
        description: { tr: "letter-spacing değeri.", en: "letter-spacing value." },
        type: "string | number",
        defaultValue: "0",
    },
    lineHeight: { description: { tr: "line-height değeri.", en: "line-height value." }, type: "string | number", defaultValue: "1.7" },
    unselectable: { description: { tr: "Metin seçimini kapatır.", en: "Disables text selection." }, type: "boolean" },
    copy: { description: { tr: "Panoya kopyalama kontrolünü gösterir.", en: "Shows copy-to-clipboard control." }, type: "boolean" },
    italic: { description: { tr: "İtalik metin.", en: "Italic text." }, type: "boolean" },
    bold: { description: { tr: "Kalın metin.", en: "Bold text." }, type: "boolean" },
    underline: { description: { tr: "Altı çizili metin.", en: "Underline text." }, type: "boolean" },
    strikethrough: { description: { tr: "Üstü çizili metin.", en: "Line-through text." }, type: "boolean" },
    uppercase: { description: { tr: "Büyük harf dönüşümü.", en: "Uppercase transform." }, type: "boolean" },
    lowercase: { description: { tr: "Küçük harf dönüşümü.", en: "Lowercase transform." }, type: "boolean" },
    capitalize: { description: { tr: "Kelime başlarını büyütme dönüşümü.", en: "Capitalize transform." }, type: "boolean" },
    disabled: { description: { tr: "Disabled stil durumu.", en: "Disabled style state." }, type: "boolean" },
    margin: {
        description: { tr: "Margin kısaltması veya kenar başına proplar.", en: "Margin shorthand or per-side props." },
        type: "string | number | object",
        defaultValue: "0",
    },
    padding: {
        description: { tr: "Padding kısaltması veya kenar başına proplar.", en: "Padding shorthand or per-side props." },
        type: "string | number | object",
        defaultValue: "0",
    },
    fitContent: { description: { tr: "Genişliği içeriğe uydurur.", en: "Fits width to content." }, type: "boolean" },
    enableQuoteMarks: { description: { tr: "Dekoratif tırnak işaretleri ekler.", en: "Adds decorative quote marks." }, type: "boolean" },
    balance: { description: { tr: "text-wrap: balance özelliğini açar.", en: "Enables text-wrap: balance." }, type: "boolean" },
    codeFormat: {
        description: { tr: "String içeriğini code gösterimi için girintiden arındırır ve formatlar.", en: "Dedents and formats string content for code display." },
        type: "boolean",
    },
    codeFormatJsxProps: {
        description: { tr: "codeFormat açıkken JSX açılış tag'lerini satırlara böler.", en: "When codeFormat is on, splits JSX opening tags across lines." },
        type: "boolean",
    },
    codeFormatCalls: {
        description:
            "When codeFormat is on, breaks function calls and object/array literals across lines.",
        type: "boolean",
    },
    exportData: { description: { tr: "Debug/export yardımcısı aktarımı.", en: "Debug/export helper passthrough." }, type: "boolean | function | object" },
};

const X = () => (
    <Ds.page
        title="<Typo>"
        releasedOn="1.0.0"
        description={{ tr: "Varyantları, tipografi propları, kırpma, kopyalama, responsive ezmeleri ve iç içe HTML korumaları olan metin componenti.", en: "Text component with variants, typography props, truncation, copy, responsive overrides, and nested HTML guards." }}
    >
        <Ds.block
            title={{ tr: "Varyantlar", en: "Variants" }}
            description={{ tr: "Yaygın tag'ler ve stiller için kısayol componentleri.", en: "Shortcut components for common tags and styles." }}
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
            title={{ tr: "size, weight ve color", en: "size, weight & color" }}
            description={{ tr: "fontSize/size, weight ve theme color path kullanımı.", en: "fontSize/size, weight, and theme color path." }}
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
            description={{ tr: "PROJECT_SETTINGS.styledSettings.fonts içinden adlandırılmış font seçer.", en: "Selects a named font from PROJECT_SETTINGS.styledSettings.fonts." }}
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
            title={{ tr: "bold ve italic", en: "bold & italic" }}
            description={{ tr: "weight prop'u veya Typo.bold / Typo.italic varyantları.", en: "weight prop or Typo.bold / Typo.italic variants." }}
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
            title={{ tr: "underline ve strikethrough", en: "underline & strikethrough" }}
            description={{ tr: "Altı çizili ve üstü çizili stiller.", en: "Underline and line-through styles." }}
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
            description={{ tr: "Arka plan vurgu rengi.", en: "Background highlight colour." }}
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo highlight="warning" content="Highlighted text" />`}
            example={<Typo highlight="warning" content="Highlighted text" />}
        />

        <Ds.block
            title={{ tr: "clamp, ellipsis ve copy", en: "clamp, ellipsis & copy" }}
            description={{ tr: "clamp satırları sınırlar; ellipsis clamp olmadan tek satırlı overflow sağlar; copy buton ekler (kısa metinde inline, clamp veya code bloklarında sağ üst overlay).", en: "clamp limits lines; ellipsis is single-line overflow without clamp; copy adds a button (inline for short text, overlay top-right for clamped or code blocks)." }}
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
            description={{ tr: "Typo.code, string içerikte codeFormat'ı açar (dedent, isteğe bağlı JSX/call bölme).", en: "Typo.code enables codeFormat on string content (dedent, optional JSX/call breaking)." }}
            code={`import { Typo } from "${SYS.basePath}";

                    <Typo.code copy content={\`const obj = { ... };\`} />`}
            example={<Typo.code copy content={codeFormatSample} />}
        />

        <Ds.block
            title="responsive"
            description={{ tr: "Breakpoint anahtarı başına prop ezmesi.", en: "Override props per breakpoint key." }}
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
            title={{ tr: "content ve contentGroup", en: "content & contentGroup" }}
            description={{ tr: "Tek değer için content kullanın. contentGroup birden fazla block host render eder (ör. birden çok <p> elementi).", en: "Use content for a single value. contentGroup renders multiple block hosts (e.g. several <p> elements)." }}
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
            description={{ tr: "Render edilen HTML tag'ini ezer.", en: "Overrides the rendered HTML tag." }}
            code='<Typo as="label" size={15} content="Label text" />'
            example={<Typo as="label" size={15} content="Label text" />}
        />

        <Ds.block
            title="disabled"
            description={{ tr: "Soluk disabled görünümü.", en: "Muted disabled appearance." }}
            code='<Typo.span disabled content="Disabled text" />'
            example={<Typo.span disabled content="Disabled text" />}
        />

        <Ds.block
            title="unselectable"
            description={{ tr: "Metin seçimini engeller.", en: "Prevents text selection." }}
            code='<Typo.span unselectable content="Cannot select this" />'
            example={<Typo.span unselectable content="Cannot select this" />}
        />

        <Ds.block
            title={{ tr: "metin dönüşümü", en: "Text Transform" }}
            description={{ tr: "uppercase, lowercase, capitalize.", en: "uppercase, lowercase, capitalize." }}
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
            title={{ tr: "boşluk", en: "Spacing" }}
            description={{ tr: "margin, padding ve lineHeight örnekleri.", en: "margin, padding, and lineHeight examples." }}
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
            title={{ tr: "align ve selfAlign", en: "align & selfAlign" }}
            description={{ tr: "Metin hizalaması ve flex/grid self hizalaması.", en: "Text alignment and flex/grid self alignment." }}
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
            title={{ tr: "fitContent ve balance", en: "fitContent & balance" }}
            description={{ tr: "fit-content genişliği ve text-wrap balance.", en: "fit-content width and text-wrap balance." }}
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
