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
                <br />A nice feature of the Popover component: by default the system allows only one
                exclusive popover at a time (see FloatingUi <code>disableMultipleBlock</code>). Use{" "}
                <code>disableMultipleBlock</code> on Popover when multiple panels should stay open.
                <br />
                <br />
                <Button.string to="/design-system/floatingUi" label="FloatingUi" />
                <br />
                <Button.string to="/design-system/scrollFlex" label="ScrollFlex" />
                <br />
                <Button.string to="/design-system/button" label="Button" />
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
                        scrollFlexProps={{
                            enableDragging: true,
                            scrollBarProps: { variant: "primary", disableOpacityEffect: true },
                        }}
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
                    buttonProps={{ label: "flat ButtonList usage", outlined: false }}
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
                    description: "Panel content rendered inside the internal ScrollFlex.",
                    type: "ReactNode",
                    required: true,
                },
                buttonProps: {
                    description: "Checkout Button api.",
                    type: "object",
                },
                scrollFlexProps: {
                    description: "Checkout ScrollFlex api.",
                    type: "object",
                },
                _rest: {
                    description:
                        "All rest props are passed to the FloatingUi component. Check out FloatingUi api.",
                    type: "object",
                },
            }}
        />
    </Ds.page>
);

export default X;
