import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "./";

const Item = () => (
    <Flex bgColor="greys.shade20" width={50} height={50}>
        item
    </Flex>
);

const Box = ({ c = "#ddd", t }) => (
    <div style={{ background: c, padding: 8, borderRadius: 6 }}>{t}</div>
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
            <Flex.column gap={10} padding={8}>
                <div>A</div><div>B</div><div>C</div>
            </Flex.column>
            <Flex gap={5} bgColor="#fff" padding={5} alignSelf="end">
                <div>A</div><div>B</div><div>C</div>
            </Flex>
            <Flex direction="column-reverse gap={10} padding={8} >
                <div>A</div><div>B</div><div>C</div>
            </Flex>`}
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
                    <Flex gap={10} bgColor="#fff" padding={8} alignSelf="end">
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
                    <Flex direction="column-reverse" gap={10} bgColor="#fff" padding={8}>
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
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
                        C
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="Sizing + Flex Item Props"
            description="The sizing props are exactly the same as CSS flex."
            code={`import { Flex } from "${SYS.basePath}";
            
                <Flex width={200} direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex width={50} bgColor="#dbeafe" padding={6}>
                        Fixed
                    </Flex>
                    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>
                        Grow
                    </Flex>
                </Flex>`}
            example={
                <Flex width={200} direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
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
            description='Instead of writing width="100%", you can use the boolean full prop. If width is provided, full will be ignored. It can also be used within responsive breakpoints.'
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
            code={`import { Flex } from "${SYS.basePath}";

                <Flex typo="h6" padding={12}>
                    h6
                </Flex>
                <Flex typography={{ type: "p", bold: true }} padding={12}>
                    typography item, bold is true
                </Flex>
            `}
            example={
                <Flex.column gap={8}>
                    <Flex typo="h6" padding={12}>
                        h6
                    </Flex>
                    <Flex typography={{ type: "p", bold: true }} padding={12}>
                        typography item, bold is true
                    </Flex>
                </Flex.column>
            }
        />
        <Ds.api
            args="<Flex />"
            props={{
                variant: {
                    description: "Variant preset or custom variant.",
                    type: "string | component",
                    defaultValue: '"default"',
                },
                children: {
                    description: "Children/content.",
                    type: "ReactNode",
                },
                bgColor: {
                    description: "Background color.",
                    type: "string",
                },
                color: {
                    description: "Text color.",
                    type: "string",
                },
                borderRadius: {
                    description: "Border radius.",
                    type: "number | string",
                },
                direction: {
                    description: "row | column | row-reverse | column-reverse | x | y.",
                    type: "string",
                    defaultValue: '"row"',
                },
                flexFlow: {
                    description: "CSS flex-flow shorthand.",
                    type: "string",
                },
                flex: {
                    description: "CSS flex shorthand.",
                    type: "string | number",
                },
                flexGrow: {
                    description: "CSS flex-grow.",
                    type: "string | number",
                },
                flexShrink: {
                    description: "CSS flex-shrink.",
                    type: "string | number",
                },
                flexBasis: {
                    description: "CSS flex-basis.",
                    type: "string | number",
                },
                order: {
                    description: "CSS order.",
                    type: "string | number",
                },
                width: {
                    description: "Width.",
                    type: "number | string",
                    defaultValue: '"100%" (root)',
                },
                full: {
                    description:
                        'width açıkça verilmediyse width="100%" ile aynı; tekrar tekrar width="100%" yazmamak için kısayol.',
                    type: "boolean",
                },
                height: {
                    description: "Height.",
                    type: "number | string",
                },
                maxWidth: {
                    description: "Maximum width.",
                    type: "number | string",
                },
                maxHeight: {
                    description: "Maximum height.",
                    type: "number | string",
                },
                minWidth: {
                    description: "Minimum width.",
                    type: "number | string",
                },
                minHeight: {
                    description: "Minimum height.",
                    type: "number | string",
                },
                padding: {
                    description: "Padding shorthand.",
                    type: "number | string",
                },
                paddingTop: {
                    description: "Padding top.",
                    type: "number | string",
                },
                paddingRight: {
                    description: "Padding right.",
                    type: "number | string",
                },
                paddingBottom: {
                    description: "Padding bottom.",
                    type: "number | string",
                },
                paddingLeft: {
                    description: "Padding left.",
                    type: "number | string",
                },
                margin: {
                    description: "Margin shorthand.",
                    type: "number | string",
                },
                marginTop: {
                    description: "Margin top.",
                    type: "number | string",
                },
                marginRight: {
                    description: "Margin right.",
                    type: "number | string",
                },
                marginBottom: {
                    description: "Margin bottom.",
                    type: "number | string",
                },
                marginLeft: {
                    description: "Margin left.",
                    type: "number | string",
                },
                align: {
                    description: "Shorthand align for both axes.",
                    type: "string",
                },
                xAlign: {
                    description: "Main axis align helper.",
                    type: "string",
                },
                yAlign: {
                    description: "Cross axis align helper.",
                    type: "string",
                },
                justify: {
                    description: "justify-content alias.",
                    type: "string",
                },
                justifyContent: {
                    description: "CSS justify-content.",
                    type: "string",
                },
                alignItems: {
                    description: "CSS align-items.",
                    type: "string",
                },
                alignSelf: {
                    description: "CSS align-self.",
                    type: "string",
                },
                justifySelf: {
                    description: "CSS justify-self.",
                    type: "string",
                },
                alignContent: {
                    description: "CSS align-content.",
                    type: "string",
                },
                placeContent: {
                    description: "CSS place-content shorthand.",
                    type: "string",
                },
                placeItems: {
                    description: "CSS place-items shorthand.",
                    type: "string",
                },
                placeSelf: {
                    description: "CSS place-self shorthand.",
                    type: "string",
                },
                gap: {
                    description: "Gap.",
                    type: "number | string",
                    defaultValue: "0",
                },
                rowGap: {
                    description: "Row gap.",
                    type: "number | string",
                },
                columnGap: {
                    description: "Column gap.",
                    type: "number | string",
                },
                wrap: {
                    description: "Wrap mode.",
                    type: "boolean | string",
                },
                overflow: {
                    description: "Overflow shorthand (CSS).",
                    type: "string",
                },
                overflowX: {
                    description: "overflow-x.",
                    type: "string",
                },
                overflowY: {
                    description: "overflow-y.",
                    type: "string",
                },
                content: {
                    description:
                        "children yerine kullanılabilen içerik (ikisi birlikte verilirse children önceliklidir).",
                    type: "ReactNode",
                },
                typo: {
                    description:
                        'Typo variant anahtarı (ör. "h6" → Typo.h6). typography ile çakışırsa typography alınır.',
                    type: "string",
                },
                typography: {
                    description:
                        "{ type, ...Typo props } — type ile variant, kalanı Typo’ya spread.",
                    type: "string | object",
                },
                childrenCommon: {
                    description:
                        "Tüm çocuklara önce uygulanan ortak prop çantası; childrenProps girdileri bunun üzerine birleştirilir.",
                    type: "object",
                },
                childrenProps: {
                    description: "Çocuk başına prop dizisi (nth-child ile eşlenir).",
                    type: "array",
                },
                responsive: {
                    description: "Breakpoint based overrides.",
                    type: "object",
                },
                exportData: {
                    description: "Debug/export passthrough.",
                    type: "boolean | function | object",
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
