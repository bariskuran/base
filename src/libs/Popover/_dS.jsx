import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { PopOver } from ".";
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
        title="<PopOver>"
        releasedOn="1.0.0"
        description={
            <>
                PopOver is composed of advanced components such as FloatingUi, ScrollFlex, Button,
                and ButtonList. As a result, it does not have many features of its own, but can
                utilize all the features provided by the aforementioned components. <br />
                <br />A nice feature of the PopOver component: by default the system allows only one
                exclusive PopOver at a time (see FloatingUi <code>disableMultipleBlock</code>). Use{" "}
                <code>disableMultipleBlock</code> on PopOver when multiple panels should stay open.
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
            code={`import { PopOver } from "${SYS.basePath}";

                        <PopOver>content</PopOver>`}
            example={<PopOver>content</PopOver>}
        />
        <Ds.block
            title="Advanced Usage"
            code={`import { PopOver } from "${SYS.basePath}";

                    <PopOver buttonProps={{ icon: { flat: true } }}>
                        <Panel />
                    </PopOver>
                    <PopOver buttonProps={{ label: "Menu", outlined: true }}>
                        <Panel2 />
                    </PopOver>
                    <PopOver
                        buttonProps={{ label: "Menu", outlined: false }}
                        scrollFlexProps={{
                            enableDragging: true,
                            scrollBarProps: { variant: "primary", disableOpacityEffect: true },
                        }}
                    >
                        <LargeContent />
                    </PopOver>
                        `}
            example={
                <Flex gap={12}>
                    <PopOver buttonProps={{ icon: { flat: true } }}>
                        <Panel />
                    </PopOver>
                    <PopOver buttonProps={{ label: "Menu", outlined: true }}>
                        <Panel2 />
                    </PopOver>
                    <PopOver
                        buttonProps={{ label: "Menu", outlined: false }}
                        scrollFlexProps={{
                            enableDragging: true,
                            scrollBarProps: { variant: "primary", disableOpacityEffect: true },
                        }}
                    >
                        <LargeContent />
                    </PopOver>
                </Flex>
            }
        />
        <Ds.block
            title="ButtonList with PopOver"
            description='The "flat" prop of ButtonList removes outer wrappers, giving layout control to the PopOver. You can manage the UI inside the PopOver using scrollFlexProps.'
            code={`import { PopOver, ButtonList } from "${SYS.basePath}";

                <PopOver
                    buttonProps={{ label: "flat ButtonList usage" }}
                    scrollFlexProps={{
                        flexProps: { gap: 5 },
                        scrollBarProps: {
                            disableOpacityEffect: true,
                            variant: "primary",
                        },
                    }}
                >
                    <ButtonList buttons={buttons} commonButtonProps={commonButtonProps} flat />
                </PopOver>`}
            example={
                <PopOver
                    buttonProps={{ label: "flat ButtonList usage" }}
                    scrollFlexProps={{
                        flexProps: { gap: 5 },
                        scrollBarProps: {
                            disableOpacityEffect: true,
                            variant: "primary",
                        },
                    }}
                >
                    <ButtonList buttons={buttons} commonButtonProps={commonButtonProps} flat />
                </PopOver>
            }
        />
        <Ds.block
            title="Styling"
            description="bgColor and color props are used to set the background and text color of the PopOver. It can be a theme color, a theme path, or a css color."
            code={`import { PopOver, ButtonList } from "${SYS.basePath}";

                <PopOver bgColor="lightgrey" color="primary">
                    <Panel />
                </PopOver>`}
            example={
                <PopOver bgColor="lightgrey" color="primary">
                    <Panel />
                </PopOver>
            }
        />
        <Ds.block
            title="disableArrow"
            code={`import { PopOver, ButtonList } from "${SYS.basePath}";

                <PopOver disableArrow buttonProps={{ label: "Without Arrow", outlined: true }}>
                    <Panel />
                </PopOver>`}
            example={
                <PopOver disableArrow buttonProps={{ label: "Without Arrow", outlined: true }}>
                    <Panel />
                </PopOver>
            }
        />
        <Ds.api
            args="<PopOver>{React.Node}</PopOver>"
            props={{
                children: {
                    description: "Panel content rendered inside the internal ScrollFlex.",
                    type: "React Node",
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
