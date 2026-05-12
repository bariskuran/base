import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Popover } from ".";
import { Flex } from "../Flex";
import { ButtonList } from "../ButtonList";
import { Button } from "../Button";

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
        description={
            <>
                Popover is composed of advanced components such as FloatingUi, ScrollFlex, Button,
                and ButtonList. As a result, it does not have many features of its own, but can
                utilize all the features provided by the aforementioned components. <br />
                <br />
                A nice feature of the Popover component: the system prevents two popovers from being
                open at the same time. This is a built-in feature and cannot be disabled.
                <br />
                <br />
                Check out <Button.string to="/design-system/floatingUi" label="FloatingUi" /> for
                more details.
                <br />
                Check out <Button.string to="/design-system/scrollFlex" label="ScrollFlex" /> for
                more details.
                <br />
                Check out <Button.string to="/design-system/button" label="Button" /> for more
                details.
                <br />
                Check out <Button.string to="/design-system/buttonList" label="ButtonList" /> for
                more details.
            </>
        }
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
                        `}
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
                </Flex>
            }
        />
        <Ds.block
            title="ButtonList with Popover"
            description='The "flat" prop of ButtonList removes outer wrappers, giving layout control to the Popover. You can manage the UI inside the Popover using scrollFlexProps.'
            code={`import { Popover, ButtonList } from "${SYS.basePath}";

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
                    </Popover>`}
            example={
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
            }
        />
        <Ds.block
            title="Styling"
            description="bgColor and color props are used to set the background and text color of the Popover. It can be a theme color, a theme path, or a css color."
            code={`import { Popover, ButtonList } from "${SYS.basePath}";

                    <Popover bgColor="lightgrey" color="primary">
                        <Panel />
                    </Popover>`}
            example={
                <Popover bgColor="lightgrey" color="primary">
                    <Panel />
                </Popover>
            }
        />
        <Ds.block
            title="disableArrow"
            code={`import { Popover, ButtonList } from "${SYS.basePath}";

                    <Popover disableArrow buttonProps={{ label: "Without Arrow" }}>
                        <Panel />
                    </Popover>`}
            example={
                <Popover disableArrow buttonProps={{ label: "Without Arrow", outlined: true }}>
                    <Panel />
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
                floatingUiProps: {
                    description: "FloatingUi props.",
                    type: "object",
                },
                bgColor: {
                    description:
                        "Panel background. Resolved like Button colors: theme keys or paths (`primary`, `greys.shade50`), hex/rgb/rgba, and named CSS colors; passed to FloatingUi after `colorFind`.",
                    type: "string",
                    defaultValue: "theme.background",
                },
                color: {
                    description:
                        "Panel text color override; same resolution rules as `bgColor`. When omitted, FloatingUi uses contrast opposite of the resolved background.",
                    type: "string",
                    defaultValue: "auto",
                },
                disableArrow: {
                    description: "Hides arrow.",
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
