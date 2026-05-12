import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Popover } from ".";
import { Flex } from "../Flex";
import { ButtonList } from "../ButtonList";

const Panel = () => (
    <Flex.column gap={2}>
        <div>Action A</div>
        <div>Action B</div>
    </Flex.column>
);
const Panel2 = () => (
    <Flex.column gap={2} padding={2}>
        <div>Action A</div>
        <div>Action B</div>
        <div>Action C</div>
        <div>Action D</div>
        <div>Action E</div>
        <div>Action F</div>
        <div>Action G</div>
        <div>Action H</div>
        <div>Action I</div>
        <div>Action J</div>
        <div>Action H</div>
        <div>Action I</div>
        <div>Action J</div>
        <div>Action H</div>
        <div>Action I</div>
        <div>Action J</div>
    </Flex.column>
);

const LargeContent = () => {
    return (
        <Flex minWidth={1000} minHeight={700}>
            Large content 1000x700
        </Flex>
    );
};

const buttons = [
    {
        bgColor: "error",
        label: "test",
        hoverLabel: "test hover",
        prefix: {
            icon: "bullet",
        },
        onClick: () => console.log("click"),
    },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
];

const commonButtonProps = {
    bgColor: "success",
    prefix: { icon: "user" },
    size: 100,
};

const X = () => (
    <Ds.page
        title="<Popover>"
        releasedOn="1.0.0"
        description="Click-triggered floating action panel."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { Popover } from "${SYS.basePath}";

                        <Popover>content</Popover>`}
            example={<Popover>content</Popover>}
        />
        <Ds.block
            title="Advanced Usage"
            code={`import { Popover } from "${SYS.basePath}";

                        <Popover>
                        <div>Panel content</div>
                        </Popover>`}
            example={
                <Flex gap={12}>
                    <Popover buttonProps={{ icon: { flat: true } }}>
                        <Panel />
                    </Popover>
                    <Popover buttonProps={{ label: "Menu", outlined: true }}>
                        <Panel2 />
                    </Popover>
                    <Popover
                        buttonProps={{ label: "Menu", outlined: false }}
                        scrollFlexProps={{ scrollBarProps: { edgeMargin: 10, variant: "primary" } }}
                    >
                        <LargeContent />
                    </Popover>
                    <Popover
                        buttonProps={{ label: "Menu", outlined: false }}
                        scrollFlexProps={{
                            flexProps: {
                                gap: 5,
                            },
                            scrollBarProps: { edgeMargin: 10, variant: "primary" },
                        }}
                    >
                        <ButtonList buttons={buttons} commonButtonProps={commonButtonProps} flat />
                    </Popover>
                </Flex>
            }
        />
        <Ds.block
            title="Button and Panel Customization"
            code={`<Popover
                  buttonProps={{ label: "Open menu", outlined: true }}
                  scrollBoxProps={{ maxHeight: 200, padding: 8 }}
                  alignX="left"
                >
                  <Panel />
                </Popover>`}
            example={
                <Popover
                    buttonProps={{ label: "Open menu", outlined: true }}
                    // scrollFlexProps={{ scrollBarProps: { edgeMargin: 0 } }}
                >
                    <Panel2 />
                </Popover>
            }
        />
        <Ds.api
            args="<Popover>{null}</Popover>"
            props={{
                children: {
                    description: "Popover panel content.",
                    type: "ReactNode",
                    required: true,
                    defaultValue: "null",
                },
                buttonProps: {
                    description: "Props forwarded to internal trigger Button.",
                    type: "object",
                    defaultValue: "{}",
                },
                scrollBoxProps: {
                    description:
                        "ScrollFlex props for the panel (width, height, maxWidth, maxHeight, flexProps, scrollBarProps, …). If width and height are omitted, the panel sizes to content up to maxWidth/maxHeight (defaults 30vw / 30vh). scrollFlexProps is merged as a legacy alias.",
                    type: "object",
                    defaultValue: "{}",
                },
                variant: {
                    description: "Popover/FloatingUi variant.",
                    type: "string | component",
                    defaultValue: '"default"',
                },
                alignX: {
                    description: "Horizontal alignment.",
                    type: "string",
                    defaultValue: '"center"',
                },
                alignY: {
                    description: "Vertical alignment (internally forced top by default).",
                    type: "string",
                    defaultValue: '"top"',
                },
                bgColor: {
                    description: "Panel background color.",
                    type: "string",
                    defaultValue: "theme.background",
                },
                color: {
                    description: "Panel text color override.",
                    type: "string",
                    defaultValue: "auto",
                },
                disableArrow: {
                    description: "Hides arrow.",
                    type: "boolean",
                    defaultValue: "false",
                },
                primary: {
                    description: "Theme primary style.",
                    type: "boolean",
                    defaultValue: "false",
                },
                secondary: {
                    description: "Theme secondary style.",
                    type: "boolean",
                    defaultValue: "false",
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
