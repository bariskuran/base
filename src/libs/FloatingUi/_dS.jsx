import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { FloatingUi } from "../FloatingUi";
import { useState } from "react";
import { Button } from "../Button";

const X = () => {
    const [open, setOpen] = useState(false);

    /* RETURN */
    return (
        <Ds.page
            title="<FloatingUi>"
            releasedOn="1.0.0"
            description={`FloatingUi renders floating content relative to a trigger element, with
                    controllable position and style. The open state is not managed internally by FloatingUi.
                    It needs to be controlled externally. Therefore, in this test page, all open props are set to true.
                    
                    Components like PopTip, Popover, PopConfirm, and Button use FloatingUi. You can also check out these components; they share the same FloatingUi props.`}
        >
            <Ds.block
                title="Basic Usage"
                code={`import { FloatingUi } from "${SYS.basePath}";

                    <FloatingUi content="Default floating content" open={true}>
                        <Flex xAlign="start" bgColor="foreground" color="background" padding={10}> Float around me </Flex>
                    </FloatingUi>`}
                example={
                    <FloatingUi content="Default floating content" open={true}>
                        <Flex xAlign="start" bgColor="foreground" color="background" padding={10}>
                            Float around me
                        </Flex>
                    </FloatingUi>
                }
            />
            <Ds.block
                title="Position and Arrow"
                code={`import { FloatingUi } from "${SYS.basePath}";

                        <FloatingUi
                            content={<div>Top / Start</div>}
                            alignX="start"
                            alignY="top"
                        >
                            <button>Top Start</button>
                        </FloatingUi>

                        <FloatingUi
                            content={<div>Bottom / End (no arrow)</div>}
                            alignX="end"
                            alignY="bottom"
                            disableArrow
                        >
                            <button>Bottom End</button>
                        </FloatingUi>`}
                example={
                    <Flex xAlign="start" gap={10}>
                        {/* <FloatingUi content={<div>Top / Start</div>} alignX="start" alignY="top">
                            <Button.underline label="Top Start" />
                        </FloatingUi>
                        <FloatingUi
                            content={<div>Bottom / End (no arrow)</div>}
                            alignX="end"
                            alignY="bottom"
                            disableArrow
                        >
                            <Button.underline label="Bottom End" />
                        </FloatingUi> */}
                        <FloatingUi
                            content="Bottom / End (no arrow)"
                            alignX="end"
                            alignY="bottom"
                            disableArrow
                            open={true}
                        >
                            <Flex
                                xAlign="start"
                                bgColor="foreground"
                                color="background"
                                padding={10}
                            >
                                Float around me without arrow
                            </Flex>
                        </FloatingUi>
                        <FloatingUi content="Top / Start" alignX="start" alignY="top" open={true}>
                            <Flex
                                xAlign="start"
                                bgColor="foreground"
                                color="background"
                                padding={10}
                            >
                                Float around me
                            </Flex>
                        </FloatingUi>
                    </Flex>
                }
            />
            <Ds.block
                title="Theme and Escape Behavior"
                code={`import { FloatingUi } from "${SYS.basePath}";

                        <FloatingUi
                            content={<div>Primary floating</div>}
                            primary
                            enableEscaping={false}
                        >
                            <button>Primary</button>
                        </FloatingUi>

                        <FloatingUi
                            content={<div>Custom background</div>}
                            bgColor="success"
                            uniqueId="floating-example-2"
                        >
                            <button>Custom BG</button>
                        </FloatingUi>`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <FloatingUi
                            content={<div>Primary floating</div>}
                            primary
                            enableEscaping={false}
                        >
                            <Button.underline label="Primary" />
                        </FloatingUi>
                        <FloatingUi
                            content={<div>Custom background</div>}
                            bgColor="success"
                            uniqueId="floating-example-2"
                        >
                            <Button.underline label="Custom BG" />
                        </FloatingUi>
                    </Flex>
                }
            />
            <Ds.api
                props={{
                    variant: {
                        description: "Variant name or custom styled variant.",
                        type: "string | component",
                        required: false,
                        defaultValue: '"default"',
                    },
                    children: {
                        description: "Trigger element rendered in place.",
                        type: "ReactNode",
                        required: true,
                        defaultValue: "null",
                    },
                    content: {
                        description: "Floating panel content.",
                        type: "ReactNode",
                        required: false,
                        defaultValue: "null",
                    },
                    open: {
                        description: "Controlled open/close state.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    alignX: {
                        description: "Horizontal alignment: start | center | end.",
                        type: "string",
                        required: false,
                        defaultValue: '"center"',
                    },
                    alignY: {
                        description: "Vertical alignment: top | bottom.",
                        type: "string",
                        required: false,
                        defaultValue: '"top"',
                    },
                    disableArrow: {
                        description: "Hides the arrow.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    primary: {
                        description: "Uses theme primary background style.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    secondary: {
                        description: "Uses theme secondary background style.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    bgColor: {
                        description: "Custom floating background color/token.",
                        type: "string",
                        required: false,
                        defaultValue: "theme.background",
                    },
                    uniqueId: {
                        description: "Unique id for coordinating popover state.",
                        type: "string | number",
                        required: false,
                        defaultValue: "undefined",
                    },
                    enableEscaping: {
                        description:
                            "When true, outside click and Escape key can close the floating panel.",
                        type: "boolean",
                        required: false,
                        defaultValue: "true",
                    },
                    onMouseEnter: {
                        description: "Mouse/pointer enter handler on trigger element.",
                        type: "function",
                        required: false,
                        defaultValue: "undefined",
                    },
                    onMouseLeave: {
                        description: "Mouse/pointer leave handler on trigger element.",
                        type: "function",
                        required: false,
                        defaultValue: "undefined",
                    },
                    onClick: {
                        description: "Click handler on trigger element.",
                        type: "function",
                        required: false,
                        defaultValue: "undefined",
                    },
                    exportData: {
                        description: "Debug/export helper passthrough.",
                        type: "boolean | object",
                        required: false,
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
