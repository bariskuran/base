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
