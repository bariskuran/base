import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from "../baseStore";
import { Flex } from "../Flex";
import { ScrollFlex } from "../ScrollFlex";
import { Dropdown } from "../Dropdown";
import { PopTip } from "../PopTip";
import { PopOver } from "../PopOver";
import { notifier } from "../notifier";

const alignXOptions = [
    { label: "left", value: "left" },
    { label: "center", value: "center" },
    { label: "right", value: "right" },
];

const alignYOptions = [
    { label: "top", value: "top" },
    { label: "bottom", value: "bottom" },
];

const Template = ({ children }) => (
    <Flex padding={10} bgColor="foregrounds.tint80" color="foreground">
        {children}
    </Flex>
);

const X = () => {
    const { selectedAlignX, selectedAlignY, set } = baseStore.useLocal({
        selectedAlignX: "center",
        selectedAlignY: "top",
    });

    /* Return */
    return (
        <Ds.page
            title="<FloatingUi>"
            releasedOn="1.0.0"
            description={`FloatingUi renders floating content relative to a trigger element, with
                    controllable position and style. The open state of FloatingUi is controlled externally; in other words, it is a base component. For PopOver, PopTip, PopConfirm, main features are provided by the FloatingUi component.`}
        >
            <Ds.block
                title="Basic Usage"
                code={`import { FloatingUi } from "${SYS.basePath}";

                        <FloatingUi
                            content="Default floating content"
                            open={isOpen}
                            closeHandler={closeHandler}
                        >
                                content
                        </FloatingUi>`}
                example={<PopOver content="Default floating content">content</PopOver>}
            />
            <Ds.block
                title="Auto Positioning"
                description="Open the PopOver and drag the ScrollFlex area to see auto positioning in action. The PopOver will also auto-close when it goes outside the viewport."
                example={
                    <ScrollFlex width={300} height={300} padding={0} enableDragging>
                        <Flex.column
                            width={600}
                            height={800}
                            bgColor="lightgrey"
                            padding={20}
                            xAlign="center"
                            yAlign="center"
                            gap={10}
                        >
                            <PopOver disableAutoClose>content</PopOver>
                        </Flex.column>
                    </ScrollFlex>
                }
            />
            <Ds.block
                title="Manual Positioning"
                description="The position option defaults to 'auto', which determines the placement based on the element's position on the screen and the floating content. However, you can override its position if you wish."
                example={
                    <Flex gap={10}>
                        <Flex gap={20} alignItems="center">
                            alignX
                            <Dropdown
                                options={alignXOptions}
                                value={selectedAlignX}
                                onChange={(value) => {
                                    set((s) => {
                                        s.selectedAlignX = value;
                                    });
                                }}
                            />
                            alignY
                            <Dropdown
                                options={alignYOptions}
                                value={selectedAlignY}
                                onChange={(value) => {
                                    set((s) => {
                                        s.selectedAlignY = value;
                                    });
                                }}
                            />
                        </Flex>
                        <PopOver alignX={selectedAlignX} alignY={selectedAlignY} disableAutoClose>
                            Manual Positioning
                        </PopOver>
                    </Flex>
                }
            />
            <Ds.block
                title="Styling"
                description="bgColor prop is used to set the background color of the PopTip. It can be a theme color, a theme path, or a css color. color calculates automatically but you can override it via 'color' prop."
                example={
                    <Flex gap={10}>
                        <PopTip content="theme" bgColor="success">
                            <Template>theme</Template>
                        </PopTip>
                        <PopTip content="theme path" bgColor="foregrounds.tint50">
                            <Template>theme.path</Template>
                        </PopTip>
                        <PopTip content="css colors" bgColor="skyblue">
                            <Template>css colors</Template>
                        </PopTip>
                        <PopTip content="override color" bgColor="skyblue" color="#fff">
                            <Template>override color</Template>
                        </PopTip>
                        <PopTip content="disable arrow" disableArrow>
                            <Template>disable arrow</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title="Enable Escaping"
                description="'esc' button closes the PopTip even if mouse is still on the PopTip."
                example={
                    <Flex gap={10}>
                        <PopTip content="enable escaping" enableEscaping>
                            <Template>enable escaping</Template>
                        </PopTip>
                        <PopOver enableEscaping>enableEscaping</PopOver>
                        <PopOver>default behaviour = autoClose and escaping is disabled</PopOver>
                    </Flex>
                }
            />
            <Ds.block
                title="Multiple FloatingUi instances"
                description="By default, only one FloatingUi instance can be open at a time. You can change this behavior by setting the disableMultipleBlock prop to true."
                example={
                    <Flex gap={10}>
                        <PopOver content="content1">disableMultipleBlock false1</PopOver>
                        <PopOver content="content2">disableMultipleBlock false2</PopOver>
                        <PopOver content="content3" disableMultipleBlock>
                            disableMultipleBlock true1
                        </PopOver>
                        <PopOver content="content4" disableMultipleBlock>
                            disableMultipleBlock true2
                        </PopOver>
                    </Flex>
                }
            />
            <Ds.block
                title="Handlers"
                description="Mouse handlers for FloatingUi element."
                example={
                    <Flex gap={10}>
                        <PopOver content="onClick" onClick={() => notifier.add("onClick")}>
                            onClick
                        </PopOver>
                        <PopOver
                            content="onMouseEnter"
                            onMouseEnter={() => notifier.add("onMouseEnter")}
                        >
                            onMouseEnter
                        </PopOver>
                        <PopOver
                            content="onMouseLeave"
                            onMouseLeave={() => notifier.add("onMouseLeave")}
                        >
                            onMouseLeave
                        </PopOver>
                    </Flex>
                }
            />
            <Ds.api
                args="<FloatingUi open={false}>{null}</FloatingUi>"
                props={{
                    variant: {
                        description: "Variant name or custom styled variant.",
                        type: "string | component",
                        defaultValue: '"default"',
                    },
                    children: {
                        description: "Trigger element rendered in place.",
                        type: "ReactNode",
                        required: true,
                    },
                    content: {
                        description: "Floating panel content.",
                        type: "ReactNode",
                        required: true,
                    },
                    open: {
                        description: "Controlled open/close state.",
                        type: "boolean",
                        defaultValue: "false",
                        required: true,
                    },
                    closeHandler: {
                        description:
                            "Called to close the floating layer. Plain calls use the animated closing path; `{ instant: true }` skips transition (exclusive takeover, observer exit, dismissWithoutAnimationRef). Parent must set `open` to false.",
                        type: "fn",
                        required: true,
                    },
                    padding: {
                        description:
                            "Padding shorthand; numbers become rem, strings pass through (same rules as Flex). Combines with paddingTop/Right/Bottom/Left.",
                        type: "number | string",
                        defaultValue: "10",
                    },
                    paddingTop: {
                        description: "Overrides top edge of padding shorthand.",
                        type: "number | string",
                    },
                    paddingRight: {
                        description: "Overrides right edge of padding shorthand.",
                        type: "number | string",
                    },
                    paddingBottom: {
                        description: "Overrides bottom edge of padding shorthand.",
                        type: "number | string",
                    },
                    paddingLeft: {
                        description: "Overrides left edge of padding shorthand.",
                        type: "number | string",
                    },
                    alignX: {
                        description:
                            "Horizontal placement hint: left | center | right (start/end are normalized to left/right in layout).",
                        type: "string",
                        defaultValue: '"center"',
                    },
                    alignY: {
                        description: "Vertical placement: top | bottom.",
                        type: "string",
                        defaultValue: '"top"',
                    },
                    disableArrow: {
                        description: "Hides the arrow.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    bgColor: {
                        description: "Custom floating background color/token.",
                        type: "string",
                        defaultValue: "theme.background",
                    },
                    color: {
                        description: "Overrides auto-calculated text color.",
                        type: "string",
                        defaultValue: "auto",
                    },
                    disableMultipleBlock: {
                        description:
                            "When false (default), a global popOver id lets only one exclusive instance stay visually open; opening another steals the slot. When true, multiple instances may stay open; combined with popOverTriggerMarker, outside pointerdown skips closing when the target is another marked trigger.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    enableEscaping: {
                        description:
                            "When true, registers a document Escape listener only (no outside pointer listener from this flag). Default false.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    onMouseEnter: {
                        description: "Mouse/pointer enter on the floating panel (variant root).",
                        type: "fn",
                    },
                    onMouseLeave: {
                        description: "Mouse/pointer leave on the floating panel (variant root).",
                        type: "fn",
                    },
                    onClick: {
                        description: "Click handler on the floating panel (variant root).",
                        type: "fn",
                    },
                    exportData: {
                        description: "Debug/export helper passthrough.",
                        type: "boolean | object",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
