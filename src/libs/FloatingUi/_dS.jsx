import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
const X = () => {
    /* RETURN */
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

                    <FloatingUi content="Default floating content" open={true}>
                        Content
                    </FloatingUi>`}
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
                    color: {
                        description: "Overrides auto-calculated text color.",
                        type: "string",
                        required: false,
                        defaultValue: "auto",
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
