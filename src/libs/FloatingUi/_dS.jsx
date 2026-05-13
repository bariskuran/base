import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from "../@baseStore";
import { FloatingUi } from "./";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { ScrollFlex } from "../ScrollFlex";

const X = () => {
    const { isOpen, isOpen2, setLocal } = baseStore.useLocal({ isOpen: true });

    const open = (path) => {
        setLocal((s) => {
            s[path] = true;
        });
    };
    const close = (path) => {
        setLocal((s) => {
            s[path] = false;
        });
    };

    const openHandler = () => {
        setLocal((s) => {
            s.isOpen = true;
        });
    };
    const closeHandler = () => {
        setLocal((s) => {
            s.isOpen = false;
        });
    };

    /* Return */
    return (
        <Ds.page
            title="<FloatingUi>"
            releasedOn="1.0.0"
            description={`FloatingUi renders floating content relative to a trigger element, with
                    controllable position and style. The open state of FloatingUi is controlled externally; in other words, it is a helper component. For detailed usage examples, you can check components like PopOver, PopTip, PopConfirm, and Button. `}
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
                example={
                    <Flex.column gap={20}>
                        <FloatingUi
                            content="Default floating content"
                            open={isOpen}
                            closeHandler={closeHandler}
                        >
                            content
                        </FloatingUi>
                        <Flex gap={10}>
                            <Button.plain
                                label="Open"
                                onClick={openHandler}
                                disabled={isOpen}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Button.plain
                                label="Close"
                                onClick={closeHandler}
                                disabled={!isOpen}
                                skipClickCooldown
                                skipOnClickHold
                            />
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="Auto Positioning"
                code={`import { FloatingUi } from "${SYS.basePath}";

                    `}
                example={
                    <ScrollFlex width={400} height={400} padding={0} enableDragging>
                        <Flex.column
                            width={600}
                            height={600}
                            bgColor="lightgrey"
                            padding={20}
                            xAlign="center"
                            yAlign="center"
                            gap={10}
                        >
                            <FloatingUi
                                content="Default floating content"
                                open={isOpen2}
                                closeHandler={() => close("isOpen2")}
                            >
                                <Flex width={100} height={100} bgColor="darkgrey" color="white">
                                    content
                                </Flex>
                            </FloatingUi>
                            <Button.plain
                                label="Open"
                                onClick={() => open("isOpen2")}
                                disabled={isOpen2}
                                skipClickCooldown
                                skipOnClickHold
                            />
                            <Button.plain
                                label="Close"
                                onClick={() => close("isOpen2")}
                                disabled={!isOpen2}
                                skipClickCooldown
                                skipOnClickHold
                            />
                        </Flex.column>
                    </ScrollFlex>
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
                    },
                    open: {
                        description: "Controlled open/close state.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    resolveFloatingMount: {
                        description:
                            "Optional (triggerElement) => HTMLElement. Overrides automatic choice of the nearest scrollable ancestor as the portal mount root.",
                        type: "function",
                    },
                    padding: {
                        description:
                            "Padding shorthand; numbers become rem, strings pass through (same rules as Flex). Combines with paddingTop/Right/Bottom/Left.",
                        type: "number | string",
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
                        description: "Horizontal alignment: start | center | end.",
                        type: "string",
                        defaultValue: '"center"',
                    },
                    alignY: {
                        description: "Vertical alignment: top | bottom.",
                        type: "string",
                        defaultValue: '"top"',
                    },
                    disableArrow: {
                        description: "Hides the arrow.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    primary: {
                        description: "Uses theme primary background style.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    secondary: {
                        description: "Uses theme secondary background style.",
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
                    uniqueId: {
                        description: "Unique id for coordinating popover state.",
                        type: "string | number",
                    },
                    dismissWithoutAnimationRef: {
                        description:
                            "Optional ref with `.current === true` when `open` becomes false: skip the closing opacity/transform transition and set status to closed immediately (e.g. anchor moved). Cleared inside FloatingUi after read.",
                        type: "ref",
                    },
                    enableEscaping: {
                        description:
                            "When true, outside click and Escape key can close the floating panel.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    onMouseEnter: {
                        description: "Mouse/pointer enter handler on trigger element.",
                        type: "function",
                    },
                    onMouseLeave: {
                        description: "Mouse/pointer leave handler on trigger element.",
                        type: "function",
                    },
                    onClick: {
                        description: "Click handler on trigger element.",
                        type: "function",
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
