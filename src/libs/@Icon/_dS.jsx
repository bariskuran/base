import Ds from "../DesignSystem";
// import { SYS } from "../../constants/SYS";
// import { Icon } from "./";
import { Library } from "./Library";

const CustomTriangle = () => (
    <>
        <path d="M12 2L22 22H2Z" />
    </>
);

const X = () => (
    <Ds.page
        title="DSIcon"
        releasedOn="1.0.0"
        description="DSIcon renders svg icons from the built-in icon set or from custom icon definitions. It supports hover state, active state, size switching, color switching, and optional PopTip integration."
    >
        <Library />
        {/* 
        <Ds.block
            title="Basic usage"
            description="The Icon component can render any icon from the icon library by passing the icon name."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "16rem", alignItems: "center" }}>
    <Icon icon="copy" />
    <Icon icon="check" width={16} />
    <Icon icon="close" width={20} />
</div>`}
            example={
                <div style={{ display: "flex", gap: "16rem", alignItems: "center" }}>
                    <Icon icon="copy" />
                    <Icon icon="check" width={16} />
                    <Icon icon="close" width={20} />
                </div>
            }
        />

        <Ds.block
            title="Size and color"
            description="Width controls the icon size. Color supports both raw values and theme path values."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon icon="copy" width={12} color="tomato" />
    <Icon icon="copy" width={18} color="royalblue" />
    <Icon icon="copy" width={24} color="greys.shade40" />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon="copy" width={12} color="tomato" />
                    <Icon icon="copy" width={18} color="royalblue" />
                    <Icon icon="copy" width={24} color="greys.shade40" />
                </div>
            }
        />

        <Ds.block
            title="Hover state"
            description="You can change icon, color, width, or style on hover. Hover behavior works automatically with mouse interaction."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon
        icon="copy"
        onHoverIcon="check"
        onHoverColor="green"
    />

    <Icon
        icon="copy"
        width={14}
        onHoverIconWidth={20}
        onHoverColor="dodgerblue"
    />

    <Icon
        icon="copy"
        onHoverStyle={{ opacity: 0.5 }}
    />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon="copy" onHoverIcon="check" onHoverColor="green" />

                    <Icon icon="copy" width={14} onHoverIconWidth={20} onHoverColor="dodgerblue" />

                    <Icon icon="copy" onHoverStyle={{ opacity: 0.5 }} />
                </div>
            }
        />

        <Ds.block
            title="Active state"
            description="Active state can switch the icon, color, width, and style. When active, the component also plays the built-in pulse animation unless disableScaleEffect is enabled."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon
        icon="copy"
        isActive
        onActiveIcon="check"
        onActiveColor="green"
    />

    <Icon
        icon="copy"
        width={14}
        isActive
        onActiveIconWidth={20}
        onActiveColor="tomato"
    />

    <Icon
        icon="copy"
        isActive
        onActiveStyle={{ opacity: 0.45 }}
        disableScaleEffect
    />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon="copy" isActive onActiveIcon="check" onActiveColor="green" />

                    <Icon
                        icon="copy"
                        width={14}
                        isActive
                        onActiveIconWidth={20}
                        onActiveColor="tomato"
                    />

                    <Icon
                        icon="copy"
                        isActive
                        onActiveStyle={{ opacity: 0.45 }}
                        disableScaleEffect
                    />
                </div>
            }
        />

        <Ds.block
            title="Manual hover"
            description="hoverManually lets parent components trigger hover visuals without relying on real mouse hover."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon
        icon="copy"
        hoverManually
        onHoverIcon="check"
        onHoverColor="green"
    />

    <Icon
        icon="copy"
        hoverManually
        onHoverColor="orange"
        onHoverIconWidth={22}
    />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon="copy" hoverManually onHoverIcon="check" onHoverColor="green" />

                    <Icon icon="copy" hoverManually onHoverColor="orange" onHoverIconWidth={22} />
                </div>
            }
        />

        <Ds.block
            title="useHeight"
            description="By default, width is calculated according to the horizontal structure of the svg. useHeight forces the given width value to behave like height sizing."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon icon="copy" width={18} />
    <Icon icon="copy" width={18} useHeight />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon="copy" width={18} />
                    <Icon icon="copy" width={18} useHeight />
                </div>
            }
        />

        <Ds.block
            title="Custom icon array"
            description="You can pass a custom icon definition directly as an array. The first item is the viewBox size and the second item is either a path string, a component, or another renderable content."
            code={`import { Icon } from "${SYS.basePath}";

const customIcon = [
    "24 24",
    "M12 2L22 22H2Z",
];

const CustomTriangle = () => (
    <>
        <path d="M12 2L22 22H2Z" />
    </>
);

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon icon={customIcon} width={18} color="tomato" />
    <Icon icon={["24 24", CustomTriangle]} width={18} color="royalblue" />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon={["24 24", "M12 2L22 22H2Z"]} width={18} color="tomato" />
                    <Icon icon={["24 24", CustomTriangle]} width={18} color="royalblue" />
                </div>
            }
        />

        <Ds.block
            title="PopTip integration"
            description="enablePopTip wraps the icon with PopTip. Tooltip content and configuration are passed through popTipProps."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon
        icon="copy"
        enablePopTip
        popTipProps={{ content: "Copy" }}
    />

    <Icon
        icon="check"
        width={18}
        enablePopTip
        popTipProps={{ content: "Success" }}
    />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon="copy" enablePopTip popTipProps={{ content: "Copy" }} />

                    <Icon
                        icon="check"
                        width={18}
                        enablePopTip
                        popTipProps={{ content: "Success" }}
                    />
                </div>
            }
        />

        <Ds.block
            title="Style overrides"
            description="style, onHoverStyle, and onActiveStyle let you directly override inline svg styles for each state."
            code={`import { Icon } from "${SYS.basePath}";

<div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
    <Icon
        icon="copy"
        style={{ opacity: 0.4 }}
    />

    <Icon
        icon="copy"
        onHoverStyle={{ transform: "rotate(10deg)" }}
        onHoverColor="green"
    />

    <Icon
        icon="copy"
        isActive
        onActiveStyle={{ opacity: 0.3 }}
    />
</div>`}
            example={
                <div style={{ display: "flex", gap: "20rem", alignItems: "center" }}>
                    <Icon icon="copy" style={{ opacity: 0.4 }} />

                    <Icon
                        icon="copy"
                        onHoverStyle={{ transform: "rotate(10deg)" }}
                        onHoverColor="green"
                    />

                    <Icon icon="copy" isActive onActiveStyle={{ opacity: 0.3 }} />
                </div>
            }
        />

        <Ds.api
            props={{
                icon: {
                    description:
                        "Icon name from the library or a custom icon array in the form of [viewBox, content].",
                    type: "string | array",
                    required: true,
                    defaultValue: "null",
                },
                color: {
                    description: "Default icon color.",
                    type: "string",
                    required: false,
                    defaultValue: "null",
                },
                width: {
                    description: "Base icon size.",
                    type: "number",
                    required: false,
                    defaultValue: "10",
                },
                style: {
                    description: "Inline style object for the default state svg.",
                    type: "object",
                    required: false,
                    defaultValue: "null",
                },
                useHeight: {
                    description:
                        "Uses width value as height sizing instead of horizontal width sizing.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                onHoverIcon: {
                    description: "Icon shown on hover state.",
                    type: "string | array",
                    required: false,
                    defaultValue: "null",
                },
                onHoverColor: {
                    description: "Color shown on hover state.",
                    type: "string",
                    required: false,
                    defaultValue: "null",
                },
                onHoverIconWidth: {
                    description: "Size shown on hover state.",
                    type: "number",
                    required: false,
                    defaultValue: "null",
                },
                onHoverStyle: {
                    description: "Inline style object for hover state svg.",
                    type: "object",
                    required: false,
                    defaultValue: "null",
                },
                onActiveIcon: {
                    description: "Icon shown on active state.",
                    type: "string | array",
                    required: false,
                    defaultValue: "null",
                },
                onActiveColor: {
                    description: "Color shown on active state.",
                    type: "string",
                    required: false,
                    defaultValue: "null",
                },
                onActiveIconWidth: {
                    description: "Size shown on active state.",
                    type: "number",
                    required: false,
                    defaultValue: "null",
                },
                onActiveStyle: {
                    description: "Inline style object for active state svg.",
                    type: "object",
                    required: false,
                    defaultValue: "null",
                },
                enablePopTip: {
                    description: "Wraps the icon with PopTip.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                popTipProps: {
                    description: "Props passed to PopTip when enablePopTip is true.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                hoverManually: {
                    description: "Triggers hover visuals manually.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                isActive: {
                    description: "Triggers active visuals manually.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                disableScaleEffect: {
                    description: "Disables hover scale and active pulse effects.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
            }}
        /> */}
    </Ds.page>
);

export default X;
