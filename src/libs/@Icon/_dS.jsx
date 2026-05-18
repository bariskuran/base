import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Icon } from "./";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { baseStore } from "../@baseStore";

const CustomTriangle = () => (
    <>
        <path d="M12 2L22 22H2Z" />
    </>
);

const X = () => {
    const { isHover, isActive, isPending, isClickEffect, setLocalByPath } = baseStore.useLocal({
        isHover: false,
        isActive: false,
        isPending: false,
        isClickEffect: false,
    });

    /* RETURN */
    return (
        <Ds.page
            title="<Icon>"
            releasedOn="1.0.0"
            description={
                <>
                    DSIcon renders svg icons from the built-in icon set or from custom icon
                    definitions. It supports hover state, active state, size switching, color
                    switching, and optional PopTip integration.
                    <br />
                    <br /> Check out
                    <Button.string to="/design-system/iconLibrary" label="Icon Library" /> to see
                    all available icons and how to add new icons.
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                description="The Icon component can render any icon from the icon library by passing the icon name."
                code={`import { Icon } from "${SYS.basePath}";

                    <Flex gap={16}>
                        <Icon icon="copy" />
                        <Icon icon="check" width={20} />
                        <Icon icon="close" width={24} />
                    </Flex>`}
                example={
                    <Flex gap={16}>
                        <Icon icon="copy" />
                        <Icon icon="check" width={20} />
                        <Icon icon="close" width={24} />
                    </Flex>
                }
            />
            <Ds.block
                title="Custom icon array"
                description="You can pass a custom icon definition directly as an array. The first item is the viewBox size and the second item is either a path string, a component, or another renderable content."
                code={`import { Icon } from "${SYS.basePath}";

                        const customIcon = [ "24 24", "M12 2L22 22H2Z" ];
                        const CustomTriangle = () => ( <><path d="M12 2L22 22H2Z" /></> );

                        <Flex gap={20}>
                            <Icon icon={customIcon} width={18} color="tomato" />
                            <Icon icon={["24 24", CustomTriangle]} width={18} color="royalblue" />
                    </Flex>`}
                example={
                    <Flex gap={20}>
                        <Icon icon={["24 24", "M12 2L22 22H2Z"]} width={18} color="tomato" />
                        <Icon icon={["24 24", CustomTriangle]} width={18} color="royalblue" />
                    </Flex>
                }
            />
            <Ds.block
                title="flat"
                description="ViewBox-proportional box instead of a square: `width`/`size` targets the **long** side of the viewBox (same mental model as a square icon). Root width is `width × viewW / max(viewW, viewH)` so tall narrow glyphs (e.g. vertical dots) no longer blow up vertically for the same numeric width."
                code={`import { Icon } from "${SYS.basePath}";
                
                        <Icon icon="baseLogo" width={80} />
                        <Icon icon="baseLogo" width={80} flat />`}
                example={
                    <Flex gap={24} yAlign="start">
                        <Flex bgColor="greys.shade40">
                            <Icon icon="baseLogo" width={80} />
                        </Flex>
                        <Flex bgColor="greys.shade40">
                            <Icon icon="baseLogo" width={80} flat />
                        </Flex>
                    </Flex>
                }
            />
            <Ds.block
                title="Width and color"
                description={`Width controls the icon size. Color supports both raw values and theme path values. 'size' && 'w' prop also work for width as well.
                
                "color" prop supports both raw values, theme values and theme path values.
                `}
                code={`import { Icon } from "${SYS.basePath}";

                    <Flex gap={20}>
                        <Icon icon="copy" width={12} color="$ff0000" />
                        <Icon icon="copy" size={18} color="royalblue" />
                        <Icon icon="copy" size={18} color="primary" />
                        <Icon icon="copy" w={24} color="greys.shade40" />
                    </Flex>`}
                example={
                    <Flex gap={20}>
                        <Icon icon="copy" width={12} color="#ff0000" />
                        <Icon icon="copy" size={18} color="royalblue" />
                        <Icon icon="copy" size={18} color="primary" />
                        <Icon icon="copy" w={24} color="greys.shade40" />
                    </Flex>
                }
            />
            <Ds.block
                title="Hover state"
                description="You can change icon, color and width on hover. Hover behavior works automatically with mouse interaction or you can trigger it manually with hoverManually (boolean) prop."
                code={`import { Icon } from "${SYS.basePath}";

                    <Flex gap={20}>
                        <Icon icon="copy" hoverIcon="check" hoverColor="green" />
                        <Icon icon="download" width={14} hoverScale={1.4} hoverColor="dodgerblue" />
                        <Icon icon="search" width={14} hoverScale={4} disableScaleEffect hoverColor="dodgerblue" hoverManually={isHover} />
                    </Flex>`}
                example={
                    <Flex gap={20}>
                        <Icon
                            icon="copy"
                            hoverIcon="check"
                            hoverColor="green"
                            hoverManually={isHover}
                        />
                        <Icon
                            icon="download"
                            width={14}
                            hoverScale={1.4}
                            hoverColor="dodgerblue"
                            hoverManually={isHover}
                        />
                        <Icon
                            icon="search"
                            width={14}
                            hoverScale={4}
                            hoverColor="dodgerblue"
                            hoverManually={isHover}
                            disableScaleEffect
                        />
                        <div
                            onMouseEnter={() => setLocalByPath("isHover", true)}
                            onMouseLeave={() => setLocalByPath("isHover", false)}
                        >
                            hoverManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title="Active state"
                description={`Active state can switch the icon, color and scale. When active, the component also plays the built-in pulse animation unless disableScaleEffect is true.
                    
                    Technically, <Icon> component can not trigger active state itself. But, you can trigger it manually with activeManually (boolean) prop inside your component.`}
                code={`import { Icon } from "${SYS.basePath}";

                    <Flex gap={20}>
                        <Icon icon="copy" activeIcon="check" activeColor="green" activeManually={isActive} />
                        <Icon icon="copy" width={14} activeScale={1.4} activeColor="tomato" activeManually={isActive} />
                        <Icon icon="copy" width={14} activeScale={1.8} activeColor="primary" activeManually={isActive} disablePulseEffect />
                    </Flex>`}
                example={
                    <Flex gap={20}>
                        <Icon
                            icon="copy"
                            activeIcon="check"
                            activeColor="green"
                            activeManually={isActive}
                        />
                        <Icon
                            icon="download"
                            width={14}
                            activeColor="blue"
                            activeScale={1.8}
                            activeManually={isActive}
                        />
                        <Icon
                            icon="search"
                            width={14}
                            activeColor="primary"
                            activeScale={3}
                            activeManually={isActive}
                            disablePulseEffect
                        />
                        <div
                            onMouseEnter={() => setLocalByPath("isActive", true)}
                            onMouseLeave={() => setLocalByPath("isActive", false)}
                        >
                            activeManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title="Pending state"
                description={`Pending state can switch the icon, color and scale. 
                    
                    Technically, <Icon> component can not trigger pending state itself. But, you can trigger it manually with pendingManually (boolean) prop inside your component.
                    
                    In the pending state, the icon rotates 360 degrees. It is recommended to choose icons that are suitable for this type of animation. `}
                code={`import { Icon } from "${SYS.basePath}";

                    <Icon icon="copy" pendingIcon="loading" pendingColor="green" pendingManually={isPending} />
                    <Icon icon="download" width={14} pendingIcon="loading2" pendingColor="blue" pendingScale={1.8} pendingManually={isPending} />`}
                example={
                    <Flex gap={20}>
                        <Icon
                            icon="copy"
                            pendingIcon="loading"
                            pendingColor="green"
                            pendingManually={isPending}
                        />
                        <Icon
                            icon="download"
                            width={14}
                            pendingIcon="loading2"
                            pendingColor="blue"
                            pendingScale={1.8}
                            pendingManually={isPending}
                        />
                        <div
                            onMouseEnter={() => setLocalByPath("isPending", true)}
                            onMouseLeave={() => setLocalByPath("isPending", false)}
                        >
                            pendingManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title="Click state"
                description={`Click/press visuals reuse the active layer: activeIcon, activeColor, activeScale, and pulse (unless disablePulseEffect).

                    Icon does not play click feedback on its own. Use clickEffectManually (boolean) from a parent — for example Button with deferred actions, or PopConfirm after confirm.

                    When clickEffectManually is defined, only that boolean controls click-effect visuals (in addition to activeManually for sustained active). Omit the prop when Icon is driven automatically via Button.`}
                code={`import { Icon } from "${SYS.basePath}";

                    <Flex gap={20}>
                        <Icon
                            icon="copy"
                            activeIcon="check"
                            activeColor="green"
                            clickEffectManually={isClickEffect}
                        />
                        <Icon
                            icon="download"
                            width={14}
                            activeIcon="loading"
                            activeColor="blue"
                            activeScale={1.4}
                            clickEffectManually={isClickEffect}
                        />
                    </Flex>`}
                example={
                    <Flex gap={20}>
                        <Icon
                            icon="copy"
                            activeIcon="check"
                            activeColor="green"
                            clickEffectManually={isClickEffect}
                        />
                        <Icon
                            icon="download"
                            width={14}
                            activeIcon="loading"
                            activeColor="blue"
                            activeScale={1.4}
                            clickEffectManually={isClickEffect}
                        />
                        <div
                            onMouseEnter={() => setLocalByPath("isClickEffect", true)}
                            onMouseLeave={() => setLocalByPath("isClickEffect", false)}
                        >
                            clickEffectManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title="PopTip integration"
                description={
                    <>
                        If you want to use PopTip with an Icon, you can specify the tooltip content
                        and configuration using the popTipProps prop. The popTipProps object uses
                        the same API as PopTip.
                        <br />
                        <br />
                        Check out
                        <Button.string to="/design-system/popTip" label="PopTip" /> for popTipProps.
                    </>
                }
                code={`import { Icon } from "${SYS.basePath}";

                        <Flex gap={20}>
                            <Icon icon="copy" popTipProps={{ content: "Copy" }} />
                            <Icon icon="check" width={18} popTipProps={{ content: "Success" }} />
                        </Flex>`}
                example={
                    <Flex gap={20}>
                        <Icon icon="copy" popTipProps={{ content: "Copy" }} />
                        <Icon icon="check" width={18} popTipProps={{ content: "Success" }} />
                    </Flex>
                }
            />
            <Ds.api
                args='<Icon icon="" />'
                props={{
                    icon: {
                        description:
                            "Icon name from the library or a custom icon array in the form of [viewBox, content].",
                        type: "string | array",
                        required: true,
                        defaultValue: "warning",
                    },
                    color: {
                        description: "Default icon color.",
                        type: "string",
                        defaultValue: "foreground || black",
                    },
                    width: {
                        description: "Base icon size. Shorthands: 'size' && 'w'",
                        type: "number",
                        defaultValue: "10",
                    },
                    hoverIcon: {
                        description: "Icon shown on hover state.",
                        type: "string | array",
                    },
                    hoverColor: {
                        description: "Color shown on hover state.",
                        type: "string",
                    },
                    hoverWidth: {
                        description:
                            "Size shown on hover state. Shorthands: 'hoverSize' && 'hoverW'",
                        type: "number",
                    },
                    hoverManually: {
                        description: "Triggers hover visuals manually.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    activeIcon: {
                        description: "Icon shown on active state.",
                        type: "string | array",
                    },
                    activeColor: {
                        description: "Color shown on active state.",
                        type: "string",
                    },
                    activeWidth: {
                        description:
                            "Size shown on active state. Shorthands: 'activeSize' && 'activeW'",
                        type: "number",
                    },
                    activeManually: {
                        description: "Triggers active visuals manually.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    pendingIcon: {
                        description:
                            "Icon shown while pending (e.g. navigation loading). Takes precedence over hover/active when pending.",
                        type: "string | array",
                    },
                    pendingColor: {
                        description: "Color while pending.",
                        type: "string",
                    },
                    pendingWidth: {
                        description: "Size while pending. Shorthands: 'pendingSize' && 'pendingW'",
                        type: "number",
                    },
                    pendingScale: {
                        description: "Visual scale override while pending.",
                        type: "number",
                    },
                    pendingManually: {
                        description:
                            "Triggers pending visuals manually (e.g. alongside Router loading state).",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    clickEffectManually: {
                        description:
                            "Click/press state (uses activeIcon, activeColor, activeScale). Icon does not self-trigger; parent sets true/false. When defined, click-effect visuals follow this boolean together with activeManually. Omit when nested in Button for automatic handling.",
                        type: "boolean",
                    },
                    popTipProps: {
                        description:
                            "Enables popTip integration. Props passed to PopTip when enablePopTip is true.",
                        type: "object",
                        defaultValue: "{}",
                    },
                    disableScaleEffect: {
                        description: "Disables hover scale effect.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    flat: {
                        description:
                            "If true, the icon is sized according to its viewBox aspect ratio, not forced into a square. Width/size sets the width in rem; height is calculated from the viewBox proportions.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disablePulse: {
                        description: "Disables active pulse effect.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
