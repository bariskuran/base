import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "./";

const Box = ({ c = "#ddd", t }) => (
    <div style={{ background: c, padding: 8, borderRadius: 6 }}>{t}</div>
);

const Item = () => <div style={{ background: "red", width: 50, height: 50 }}>item</div>;

const Content = ({ direction = "row" }) => (
    <div style={{ display: "flex", flexDirection: direction, gap: 10 }}>
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
    </div>
);

const X = () => (
    <Ds.page
        title="<Flex>"
        releasedOn="1.0.0"
        description="Flexible layout utility component. Flex supports both helper props and direct CSS-like flex props."
    >
        <Ds.block
            title="Direction + Alignment"
            code={`import { Flex } from "${SYS.basePath}";

                <Flex direction="row" xAlign="between" yAlign="center" gap={10}>
                  <div>A</div><div>B</div>
                </Flex>`}
            example={
                <div
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        position: "relative",
                    }}
                >
                    <Flex>
                        <Content />
                    </Flex>
                    {/* <Flex
                        width={100}
                        height={100}
                        style={{ width: 100, height: 100, backgroundColor: "aliceblue" }}
                    >
                        <Content direction="column" />
                    </Flex> */}
                    {/* <div style={{ width: "100%", height: 100, backgroundColor: "aliceblue" }}>
                        test
                    </div> */}
                </div>
            }
        />
        {/* <Ds.api
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
                height: {
                    description: "Height.",
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
                alignContent: {
                    description: "CSS align-content.",
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
                    description: "Overflow shorthand.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                overflowX: {
                    description: "Overflow X.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                overflowY: {
                    description: "Overflow Y.",
                    type: "string",
                    required: false,
                    defaultValue: "undefined",
                },
                inCommonProps: {
                    description: "Nested child common props.",
                    type: "object",
                    required: false,
                    defaultValue: "undefined",
                },
                inProps: {
                    description: "Nested child prop array.",
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
        /> */}
    </Ds.page>
);

export default X;
