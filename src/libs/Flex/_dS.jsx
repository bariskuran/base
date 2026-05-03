import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "./";
import { generateRandom } from "../generateRandom";

const longText = generateRandom.loremIpsum(100);
const shortText = generateRandom.loremIpsum(50);

const Item = () => (
    <Flex bgColor="greys.shade20" width={50} height={50}>
        item
    </Flex>
);

const Items = () => [...Array(40)].map((_, i) => <Item key={i} />);

const Box = ({ c = "#ddd", t }) => (
    <div style={{ background: c, padding: 8, borderRadius: 6 }}>{t}</div>
);

const Content = ({ direction = "row" }) => (
    <Flex direction={direction} gap={10} bgColor="skyblue" width="100%">
        <Items />
    </Flex>
);

const X = () => (
    <Ds.page
        title="<Flex>"
        releasedOn="1.0.0"
        description="Flexible layout utility component. Flex supports both helper props and direct CSS-like flex props."
    >
        <Ds.block
            title="Direction + Alignment"
            description="Flex supports both helper props and direct CSS-like flex props. Also you can use the shorthands such as 'justify', 'align' and 'xAlign', 'yAlign' to quickly align the content. xAlign and yAlign are aliases for align and justify respectively."
            code={`import { Flex } from "${SYS.basePath}";

            <Flex gap={10} padding={8}>
                <div>A</div><div>B</div><div>C</div>
            </Flex>
            <Flex direction="column" gap={10} padding={8}>
                <div>A</div><div>B</div><div>C</div>
            </Flex>
            <Flex.column gap={5} bgColor="#fff" padding={5} alignSelf="end">
                <div>A</div><div>B</div><div>C</div>
            </Flex.column>`}
            example={
                <Flex direction="row" gap={10} aria-label="Block1" align="start">
                    <Flex gap={10} bgColor="#fff" padding={8}>
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
                    <Flex direction="column" gap={10} bgColor="#fff" padding={8}>
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
                    <Flex.column
                        gap={10}
                        bgColor="#fff"
                        padding={8}
                        alignSelf="end"
                        aria-label="Block2"
                    >
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex.column>
                </Flex>
            }
        />
        <Ds.block
            title="Props Management"
            description="Flex supports both helper props and direct CSS-like flex props. For ex. 'justify-content' and 'justifyContent' both are supported."
            code={`import { Flex } from "${SYS.basePath}";
                
                <Flex direction="row" gap={8}>
                    <Flex height={120} bgColor="#dbeafe" alignItems="end"> A </Flex>
                    <Flex height={120} bgColor="#dbeafe" yAlign="end"> B </Flex>
                    <Flex height={120} bgColor="#dbeafe" align-items="end"> B </Flex>
                </Flex>`}
            example={
                <Flex direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex height={120} bgColor="#dbeafe" alignItems="end">
                        A
                    </Flex>
                    <Flex height={120} bgColor="#dbeafe" yAlign="end">
                        B
                    </Flex>
                    <Flex height={120} bgColor="#dbeafe" align-items="end">
                        B
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="Sizing + Flex Item Props"
            description="The sizing props are exactly the same as CSS flex."
            code={`import { Flex } from "${SYS.basePath}";
            
                <Flex width="100%" direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex width={50} bgColor="#dbeafe" padding={6}>
                        Fixed
                    </Flex>
                    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>
                        Grow
                    </Flex>
                </Flex>`}
            example={
                <Flex width="100%" direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex width={50} bgColor="#dbeafe" padding={6}>
                        Fixed
                    </Flex>
                    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>
                        Grow
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="full"
            description='width="100%" yazmak yerine boolean full kullanılabilir; width verilmişse full yok sayılır. responsive breakpoint içinde de kullanılabilir.'
            code={`import { Flex } from "${SYS.basePath}";

<Flex full direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
    <Flex width={50} bgColor="#dbeafe" padding={6}>Fixed</Flex>
    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>Grow</Flex>
</Flex>`}
            example={
                <Flex full direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex width={50} bgColor="#dbeafe" padding={6}>
                        Fixed
                    </Flex>
                    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>
                        Grow
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="childrenCommon + childrenProps + nested children"
            description="childrenCommon provides a base set of props to all children; childrenProps allows you to add or override props for each child in order. This enables a cleaner UI."
            code={`import { Flex } from "${SYS.basePath}";

                <Flex gap={8} childrenCommon={{ bgColor: "#fff", padding: 8 }} childrenProps={[{}, { bgColor: "#ff0000" }, { padding: 0, alignSelf: "end" }]} >
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                </Flex>
                <Flex gap={5} padding={2} childrenProps={[ { width: 20, bgColor: "#ffd6d6", direction: "column", gap: 10, childrenProps: [ { bgColor: "#ff0000", padding: 10 }, { bgColor: "#00ff00", padding: 10 }, ], }, { width: 0, bgColor: "#d6ffd6", }, ]} >
                    <div>
                        <div>nested 1</div>
                        <div>nested 2</div>
                    </div>
                    <div>content area</div>
                </Flex>`}
            example={
                <Flex gap={8}>
                    <Flex
                        gap={8}
                        childrenCommon={{ bgColor: "#fff", padding: 8 }}
                        childrenProps={[
                            {},
                            { bgColor: "#ff0000" },
                            { padding: 0, alignSelf: "end" },
                        ]}
                    >
                        <div>A</div>
                        <div>B</div>
                        <div>C</div>
                    </Flex>
                    <Flex
                        gap={5}
                        padding={2}
                        childrenProps={[
                            {
                                width: 20,
                                bgColor: "#ffd6d6",
                                direction: "column",
                                gap: 10,
                                childrenProps: [
                                    { bgColor: "#ff0000", padding: 10 },
                                    { bgColor: "#00ff00", padding: 10 },
                                ],
                            },
                            {
                                width: 0,
                                bgColor: "#d6ffd6",
                            },
                        ]}
                    >
                        <div>
                            <div>nested 1</div>
                            <div>nested 2</div>
                        </div>
                        <div>content area</div>
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="padding & margin shorthands"
            code={`import { Flex } from "${SYS.basePath}";

                `}
            example={
                <Flex
                    gap={8}
                    childrenCommon={{ bgColor: "aliceblue", gap: 5, padding: 5 }}
                    align="start"
                >
                    <Flex padding="10 20 30 40">
                        <Item>padding 1 2 3 4</Item>
                        <Item>test</Item>
                    </Flex>
                    <Flex padding="1 1 1 1" paddingLeft={50}>
                        <Item>paddingLeft override</Item>
                        <Item>test</Item>
                    </Flex>
                    <Flex margin="20 30">
                        <Item>margin 2 3</Item>
                        <Item>test</Item>
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="ScrollBar Integration"
            description="ScrollBar is enabled by default; customize with scrollBarProps. If disableScrollBar is set, the custom ScrollBar is not mounted and shell padding for the track is skipped. When ScrollBar is on, the shell uses overflow hidden and the inner flex area uses overflow auto so scrolling still works; when ScrollBar is off, no default overflow is applied on the shell—set overflow / overflowX / overflowY yourself (e.g. for scale effects)."
            code={`import { Flex } from "${SYS.basePath}";

                    <Flex width={100} height={100} disableScrollBar>
                        {shortText}
                    </Flex>
                    <Flex width={100} height={100}>
                        {longText}
                    </Flex>
                    <Flex width={100} height={100} disableScrollBar>
                        <Content direction="column" />
                    </Flex>
                    <Flex width={100} height={100} bgColor="aliceblue" direction="column" gap={10} >
                        <Items />
                    </Flex>
                    <Flex width={100} height={100} bgColor="aliceblue" direction="column" gap={10} scrollBarProps={{ mirror: true }} >
                        <Items />
                    </Flex>
                    <Flex width={100} height={100} bgColor="aliceblue" direction="column" gap={10} scrollBarProps={{ opposite: true }} >
                        <Items />
                    </Flex>
                    <Flex width={100} height={100} bgColor="aliceblue" direction="column" gap={10} scrollBarProps={{ opposite: true, mirror: true }} >
                        <Items />
                    </Flex>`}
            example={
                <Flex direction="column" gap={10}>
                    <Flex>
                        <Content />
                    </Flex>
                    <Flex>{shortText}</Flex>
                    <Flex gap={10}>
                        <Flex width={100} height={100} disableScrollBar>
                            {shortText}
                        </Flex>
                        <Flex width={100} height={100}>
                            {longText}
                        </Flex>
                        <Flex width={100} height={100} disableScrollBar>
                            <Content direction="column" />
                        </Flex>
                        <Flex
                            width={100}
                            height={100}
                            bgColor="aliceblue"
                            direction="column"
                            gap={10}
                        >
                            <Items />
                        </Flex>
                        <Flex
                            width={100}
                            height={100}
                            bgColor="aliceblue"
                            direction="column"
                            gap={10}
                            scrollBarProps={{ mirror: true }}
                        >
                            <Items />
                        </Flex>
                        <Flex
                            width={100}
                            height={100}
                            bgColor="aliceblue"
                            direction="column"
                            gap={10}
                            scrollBarProps={{ opposite: true }}
                        >
                            <Items />
                        </Flex>
                        <Flex
                            width={100}
                            height={100}
                            bgColor="aliceblue"
                            direction="column"
                            gap={10}
                            scrollBarProps={{ opposite: true, mirror: true }}
                        >
                            <Items />
                        </Flex>
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="responsive feature"
            description="responsive prop allows you to customize the Flex container for different screen sizes. You can use the responsive prop to customize the Flex container for different screen sizes."
            code={`import { Flex } from "${SYS.basePath}";

                <Flex gap={2} padding={2} bgColor="#ff0000" responsive={{ tablet: { direction: "column", bgColor: "#00ff00" }, }} >
                    <Item>Responsive 1</Item>
                    <Item>Responsive 2</Item>
                </Flex>
                <Flex gap={5} padding={5} childrenProps={[{ width: 10, bgColor: "#ffd6d6" }, { bgColor: "#d6ffd6" }]} responsive={{ phone: { direction: "column", childrenProps: [ { width: "100%", bgColor: "#red" }, { width: "100%", bgColor: "#green" }, ], }, }} >
                    <div>Responsive child 1</div>
                    <div>Responsive child 2</div>
                </Flex>`}
            example={
                <Flex gap={10}>
                    <Flex
                        gap={2}
                        padding={2}
                        bgColor="#ff0000"
                        responsive={{
                            tablet: { direction: "column", bgColor: "#00ff00" },
                        }}
                    >
                        <Item>Responsive 1</Item>
                        <Item>Responsive 2</Item>
                    </Flex>
                    <Flex
                        gap={5}
                        padding={5}
                        childrenProps={[{ width: 10, bgColor: "#ffd6d6" }, { bgColor: "#d6ffd6" }]}
                        responsive={{
                            phone: {
                                direction: "column",
                                childrenProps: [
                                    { width: "100%", bgColor: "#red" },
                                    { width: "100%", bgColor: "#green" },
                                ],
                            },
                        }}
                    >
                        <div>Responsive child 1</div>
                        <div>Responsive child 2</div>
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="Typo integration"
            description='Wraps content with Typo: typo="h6" → Typo.h6. In the typography object, type + Typo props are provided together.'
            example={
                <Flex.column gap={8}>
                    <Flex typo="h6" padding={12}>
                        h6
                    </Flex>
                    <Flex typography={{ type: "p", bold: true }} padding={12}>
                        typography nesnesi: kalın paragraf
                    </Flex>
                </Flex.column>
            }
        />
        <Ds.api
            props={{
                variant: {
                    description: "Variant preset or custom variant.",
                    type: "string | component",
                    required: false,
                    defaultValue: '"default"',
                },
                children: {
                    description: "Children/content.",
                    type: "ReactNode",
                    required: false,
                    defaultValue: "null",
                },
                bgColor: {
                    description: "Background color.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                color: {
                    description: "Text color.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                borderRadius: {
                    description: "Border radius.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                direction: {
                    description: "row | column | row-reverse | column-reverse | x | y.",
                    type: "string",
                    required: false,
                    defaultValue: '"row"',
                },
                flexFlow: {
                    description: "CSS flex-flow shorthand.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                flex: {
                    description: "CSS flex shorthand.",
                    type: "string | number",
                    required: false,
                    defaultValue: "undefined",
                },
                flexGrow: {
                    description: "CSS flex-grow.",
                    type: "string | number",
                    required: false,
                    defaultValue: "undefined",
                },
                flexShrink: {
                    description: "CSS flex-shrink.",
                    type: "string | number",
                    required: false,
                    defaultValue: "undefined",
                },
                flexBasis: {
                    description: "CSS flex-basis.",
                    type: "string | number",
                    required: false,
                    defaultValue: "undefined",
                },
                order: {
                    description: "CSS order.",
                    type: "string | number",
                    required: false,
                    defaultValue: "undefined",
                },
                width: {
                    description: "Width.",
                    type: "number | string",
                    required: false,
                    defaultValue: '"100%" (root)',
                },
                full: {
                    description:
                        'width açıkça verilmediyse width="100%" ile aynı; tekrar tekrar width="100%" yazmamak için kısayol.',
                    type: "boolean",
                    required: false,
                    defaultValue: "undefined",
                },
                height: {
                    description: "Height.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                maxWidth: {
                    description: "Maximum width.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                maxHeight: {
                    description: "Maximum height.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                minWidth: {
                    description: "Minimum width.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                minHeight: {
                    description: "Minimum height.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                padding: {
                    description: "Padding shorthand.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                paddingTop: {
                    description: "Padding top.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                paddingRight: {
                    description: "Padding right.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                paddingBottom: {
                    description: "Padding bottom.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                paddingLeft: {
                    description: "Padding left.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                margin: {
                    description: "Margin shorthand.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                marginTop: {
                    description: "Margin top.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                marginRight: {
                    description: "Margin right.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                marginBottom: {
                    description: "Margin bottom.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                marginLeft: {
                    description: "Margin left.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                align: {
                    description: "Shorthand align for both axes.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                xAlign: {
                    description: "Main axis align helper.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                yAlign: {
                    description: "Cross axis align helper.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                justify: {
                    description: "justify-content alias.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                justifyContent: {
                    description: "CSS justify-content.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                alignItems: {
                    description: "CSS align-items.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                alignSelf: {
                    description: "CSS align-self.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                justifySelf: {
                    description: "CSS justify-self.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                alignContent: {
                    description: "CSS align-content.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                placeContent: {
                    description: "CSS place-content shorthand.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                placeItems: {
                    description: "CSS place-items shorthand.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                placeSelf: {
                    description: "CSS place-self shorthand.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                gap: {
                    description: "Gap.",
                    type: "number | string",
                    required: false,
                    defaultValue: "0",
                },
                rowGap: {
                    description: "Row gap.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                columnGap: {
                    description: "Column gap.",
                    type: "number | string",
                    required: false,
                    defaultValue: "undefined",
                },
                wrap: {
                    description: "Wrap mode.",
                    type: "boolean | string",
                    required: false,
                    defaultValue: "undefined",
                },
                overflow: {
                    description:
                        "Kabuk overflow kısayolu. ScrollBar açıkken (varsayılan) kabuk için hidden + eksenler yalnızca sen verdiğinde uygulanır; ScrollBar kapalıyken varsayılan overflow yok, bu prop tamamen senin.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                overflowX: {
                    description:
                        "ScrollBar açıkken eksen verilmezse hidden; ScrollBar kapalıyken yalnızca verdiğin değer.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                overflowY: {
                    description:
                        "ScrollBar açıkken eksen verilmezse hidden; ScrollBar kapalıyken yalnızca verdiğin değer.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                disableScrollBar: {
                    description:
                        "Gömülü ScrollBar’ı kapatır; kabukta varsayılan overflow:hidden uygulanmaz (scale vb. için). Track için ek padding de yapılmaz.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                scrollBarProps: {
                    description:
                        "ScrollBar bileşenine iletilen prop çantası (exportData ile ölçü alınır).",
                    type: "object",
                    required: false,
                    defaultValue: "undefined",
                },
                content: {
                    description:
                        "children yerine kullanılabilen içerik (ikisi birlikte verilirse children önceliklidir).",
                    type: "ReactNode",
                    required: false,
                    defaultValue: "undefined",
                },
                typo: {
                    description:
                        'Typo variant anahtarı (ör. "h6" → Typo.h6). typography ile çakışırsa typography alınır.',
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                typography: {
                    description:
                        "{ type, ...Typo props } — type ile variant, kalanı Typo’ya spread.",
                    type: "string | object",
                    required: false,
                    defaultValue: "undefined",
                },
                childrenCommon: {
                    description:
                        "Tüm çocuklara önce uygulanan ortak prop çantası; childrenProps girdileri bunun üzerine birleştirilir.",
                    type: "object",
                    required: false,
                    defaultValue: "undefined",
                },
                childrenProps: {
                    description: "Çocuk başına prop dizisi (nth-child ile eşlenir).",
                    type: "array",
                    required: false,
                    defaultValue: "undefined",
                },
                responsive: {
                    description: "Breakpoint based overrides.",
                    type: "object",
                    required: false,
                    defaultValue: "undefined",
                },
                exportData: {
                    description: "Debug/export passthrough.",
                    type: "boolean | function | object",
                    required: false,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
