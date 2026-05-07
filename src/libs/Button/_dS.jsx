import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { baseStore } from "../@baseStore";
import { useTimer } from "../useTimer";
import { Dropdown } from "../Dropdown";
import { useMemo } from "react";

const url = "https://www.google.com";
const link = "/design-system";

const Template = ({ row1, row2 }) => {
    return (
        <Flex.column xAlign="start" gap={10}>
            <Flex xAlign="start" gap={10}>
                {row1}
            </Flex>
            <Flex xAlign="start" gap={10}>
                {row2}
            </Flex>
        </Flex.column>
    );
};

const X = () => {
    const [_notifier] = baseStore.useGlobal((s) => [s._notifier]);
    const { clicked, hoverManually, activeManually, pendingManually, selectedVariant, setLocal } =
        baseStore.useLocal({
            selectedVariant: "default",
            hoverManually: false,
            activeManually: false,
            pendingManually: false,
        });
    const { start } = useTimer({
        timerName: "click",
        refreshTime: 2000,
        loop: false,
        onStart: () => {
            setLocal((s) => {
                s.clicked = true;
            });
        },
        onEnd: () => {
            setLocal((s) => {
                s.clicked = false;
            });
        },
    });
    const onClick = () => {
        start();
    };

    const triggerNotifier = () => {
        _notifier.add("clicked");
    };

    const ButtonVariant = useMemo(() => {
        return Button[selectedVariant];
    }, [selectedVariant]);

    /* RETURN */
    return (
        <Ds.page
            title="<Button>"
            releasedOn="1.0.0"
            description="Button is combination of RRD's <Link>, HTML's<a> and <button> elements. It automatically detects the content and renders the appropriate element."
        >
            <Ds.block
                description="Keep in mind that not all features work for all variants."
                example={
                    <Flex xAlign="start" gap={10}>
                        <Dropdown
                            options={[
                                { label: "animatedBg", value: "animatedBg" },
                                { label: "brackets", value: "brackets" },
                                { label: "default", value: "default" },
                                { label: "plain", value: "plain" },
                                { label: "squareOnRight", value: "squareOnRight" },
                                { label: "string", value: "string" },
                                { label: "underline", value: "underline" },
                            ]}
                            value={selectedVariant}
                            onChange={(value) => {
                                setLocal((s) => {
                                    s.selectedVariant = value;
                                });
                            }}
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="Basic Usage"
                code={`import { Button } from "${SYS.basePath}";

                        <Button label="button" onClick={onClick} />
                        <Button label="a" to={url} />
                        <Button label="link" to={link} />`}
                example={
                    <Template
                        row1={
                            <>
                                <div>isClicked: {clicked ? "true" : "false"}</div>
                            </>
                        }
                        row2={
                            <>
                                <ButtonVariant label="button" onClick={onClick} />
                                <ButtonVariant label="a" to={url} />
                                <ButtonVariant label="link" to={link} />
                            </>
                        }
                    />
                }
            />
            <Ds.block
                title="Icon Usage"
                description={
                    <>
                        Button can also be used with prefixed icon, suffixed icon, icon only.
                        prefix, suffix and icon objects are totally same with the Icon component.
                        Check out <Button.string to="/design-system/icon" label="<Icon>" /> for more
                        details.
                    </>
                }
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button label="button" onClick={onClick} prefix={{ icon: "abstract2" }} />
                        <Button label="button" onClick={onClick} suffix={{ icon: "abstract2" }} />
                        <Button onClick={onClick} icon={{ icon: "abstract2" }} />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant
                            label="button"
                            onClick={onClick}
                            prefix={{ icon: "abstract2" }}
                        />
                        <ButtonVariant
                            label="button"
                            onClick={onClick}
                            suffix={{ icon: "abstract2" }}
                        />
                        <ButtonVariant onClick={onClick} icon={{ icon: "abstract2" }} />
                    </Flex>
                }
            />
            <Ds.block
                title="Color Management"
                description={` color, hoverColor, activeColor,bgColor, hoverBgColor, activeBgColor props can get any valid color value including theme colors and theme color paths.

                    The color is usually derived from the bgColor, but can be overridden using the color prop. Note: If you use bgColor="transparent", there's a known issue. Make sure to explicitly set the color prop when using a transparent background.
                                   
                    If hoverBgColor or activeBgColor are not provided, they are automatically calculated based on bgColor using tints or shades. If you prefer not to use these automatically computed colors, you can specify the desired colors by providing these props explicitly.`}
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button onClick={onClick} icon={{ icon: "abstract2" }} bgColor="ffba00" hoverBgColor="ff8400" activeBgColor="ff4d00" color="ff3c00" hoverColor="000000" activeColor="ffffff" />
                        <Button onClick={onClick} icon={{ icon: "abstract2", hoverColor: "white" }} bgColor="greys.shade20" />
                        <Button onClick={onClick} label="b" bgColor="ffba00" hoverBgColor="ff8400" activeBgColor="ff4d00" color="ff3c00" hoverColor="000000" activeColor="ffffff" />
                        <Button onClick={onClick} label="b" bgColor="transparent" hoverBgColor="transparent" activeBgColor="transparent" color="foreground" outlined />
                        <Button onClick={onClick} label="b" bgColor="error" />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant
                            onClick={onClick}
                            icon={{ icon: "abstract2" }}
                            bgColor="ffba00"
                            hoverBgColor="ff8400"
                            activeBgColor="ff4d00"
                            color="ff3c00"
                            hoverColor="000000"
                            activeColor="ffffff"
                        />
                        <ButtonVariant
                            onClick={onClick}
                            icon={{ icon: "abstract2", hoverColor: "white" }}
                            bgColor="greys.shade20"
                        />
                        <ButtonVariant
                            onClick={onClick}
                            label="b"
                            bgColor="ffba00"
                            hoverBgColor="ff8400"
                            activeBgColor="ff4d00"
                            color="ff3c00"
                            hoverColor="000000"
                            activeColor="ffffff"
                        />
                        <ButtonVariant
                            onClick={onClick}
                            label="b"
                            bgColor="transparent"
                            hoverBgColor="transparent"
                            activeBgColor="transparent"
                            color="foreground"
                            outlined
                        />
                        <ButtonVariant onClick={onClick} label="b" bgColor="error" />
                    </Flex>
                }
            />
            <Ds.block
                title="Hover & Active & Pending Management"
                description={`Our Buttons make strong use of the CSS hover and active states. In addition, with the hoverManually and activeManually props, you can control the hover and active behavior of the Button programmatically from outside the component. By using different variations, you can achieve a range of visual effects.
                    
                    Note: If you use hoverLabel or activeLabel alongside label, the UI will size itself to the longest text. This prevents layout shifting as labels change, but for best results, try to keep the length of these texts similar. The Button will be activated automatically when the route matches. To disable it, use the disableUseMatch prop.

                    In the pending state, the icon rotates 360 degrees. It is recommended to choose icons that are suitable for this type of animation.
                    `}
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button onClick={onClick} label="click" hoverLabel="hovered" activeLabel="active" pendingLabel="pending" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} />
                        <Button label="button" hoverLabel="hovered" activeLabel="active" pendingLabel="pending" onClick={onClick} bgColor="error" hoverBgColor="foreground" activeBgColor="foreground" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} prefix={{ icon: "abstract2", hoverIcon: "abstract3", activeIcon: "abstract4", pendingIcon: "loading", }} />
                        <Button label="submit" hoverLabel="are you sure?" activeLabel="submitted" pendingLabel="processing" onClick={onClick} bgColor="success" hoverBgColor="error" activeBgColor="foreground" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} prefix={{ icon: "fullArrowRight", hoverIcon: "warning", activeIcon: "check", pendingIcon: "loading3", }} />
                        <Button label="match route" to="/design-system/button" />`}
                example={
                    <Flex.column xAlign="start" gap={10}>
                        <Flex gap={10}>
                            <ButtonVariant
                                onClick={onClick}
                                label="click"
                                hoverLabel="hovered"
                                activeLabel="active"
                                pendingLabel="pending"
                                hoverManually={hoverManually}
                                activeManually={activeManually}
                                pendingManually={pendingManually}
                            />
                            <ButtonVariant
                                label="button"
                                hoverLabel="hovered"
                                activeLabel="active"
                                pendingLabel="pending"
                                onClick={onClick}
                                bgColor="error"
                                hoverBgColor="foreground"
                                activeBgColor="foreground"
                                hoverManually={hoverManually}
                                activeManually={activeManually}
                                pendingManually={pendingManually}
                                prefix={{
                                    icon: "abstract2",
                                    hoverIcon: "abstract3",
                                    activeIcon: "abstract4",
                                    pendingIcon: "loading",
                                }}
                            />
                            <ButtonVariant
                                label="submit"
                                hoverLabel="are you sure?"
                                activeLabel="submitted"
                                pendingLabel="processing"
                                onClick={onClick}
                                bgColor="success"
                                hoverBgColor="error"
                                activeBgColor="foreground"
                                hoverManually={hoverManually}
                                activeManually={activeManually}
                                pendingManually={pendingManually}
                                prefix={{
                                    icon: "fullArrowRight",
                                    hoverIcon: "warning",
                                    activeIcon: "check",
                                    pendingIcon: "loading3",
                                }}
                            />
                            <ButtonVariant label="match route" to="/design-system/button" />
                        </Flex>
                        <Flex gap={10}>
                            <div
                                onMouseEnter={() => {
                                    setLocal((s) => {
                                        s.hoverManually = true;
                                    });
                                }}
                                onMouseLeave={() => {
                                    setLocal((s) => {
                                        s.hoverManually = false;
                                    });
                                }}
                            >
                                hoverManually
                            </div>
                            <div
                                onMouseEnter={() => {
                                    setLocal((s) => {
                                        s.activeManually = true;
                                    });
                                }}
                                onMouseLeave={() => {
                                    setLocal((s) => {
                                        s.activeManually = false;
                                    });
                                }}
                            >
                                activeManually
                            </div>
                            <div
                                onMouseEnter={() => {
                                    setLocal((s) => {
                                        s.pendingManually = true;
                                    });
                                }}
                                onMouseLeave={() => {
                                    setLocal((s) => {
                                        s.pendingManually = false;
                                    });
                                }}
                            >
                                pendingManually
                            </div>
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="Disabling Cooldown and onHold"
                description={`There are 2 automatic behaviors Buttons display. You can disable them using the skipClickCooldown and skipOnClickHold props.
                    
                    cooldown prevents the Button from being clicked multiple times in quick succession (about ~1 second). onHold starts a show-on-click timer (about ~2 seconds) for the activeLabel after the Button is clicked.You can change these durations with the clickCooldownMs and onClickHoldMs props.`}
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button onClick={triggerNotifier} label="both enabled" />
                        <Button onClick={triggerNotifier} label="cooldown disabled" skipClickCooldown />
                        <Button onClick={triggerNotifier} label="onHold disabled" skipOnClickHold />
                        <Button onClick={triggerNotifier} label="both disabled" skipClickCooldown skipOnClickHold />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant onClick={triggerNotifier} label="both enabled" />
                        <ButtonVariant
                            onClick={triggerNotifier}
                            label="cooldown disabled"
                            skipClickCooldown
                        />
                        <ButtonVariant
                            onClick={triggerNotifier}
                            label="onHold disabled"
                            skipOnClickHold
                        />
                        <ButtonVariant
                            onClick={triggerNotifier}
                            label="both disabled"
                            skipClickCooldown
                            skipOnClickHold
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="Disabling Button"
                description="Disable entire button function via disabled prop."
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button onClick={triggerNotifier} label="disabled" disabled />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant onClick={triggerNotifier} label="disabled" disabled />
                    </Flex>
                }
            />
            <Ds.block
                title="Resizing Button"
                description="You can resize the Button using the size prop. The value is a percentage of the original size."
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button onClick={triggerNotifier} label="Regular" size={100} />
                        <Button onClick={triggerNotifier} label="Smaller" size={80} />
                        <Button onClick={triggerNotifier} label="Larger" size={120} />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant onClick={triggerNotifier} label="Regular" size={100} />
                        <ButtonVariant onClick={triggerNotifier} label="Smaller" size={80} />
                        <ButtonVariant onClick={triggerNotifier} label="Larger" size={120} />
                    </Flex>
                }
            />
            <Ds.block
                title="Outlined Button"
                description="When 'outlined' prop is enabled, Button uses bgColor as border color."
                code={`import { Button } from "${SYS.basePath}";
                
                        <ButtonVariant label="button" onClick={onClick} prefix={{ icon: "abstract2" }} outlined />
                        <ButtonVariant label="button" onClick={onClick} suffix={{ icon: "abstract2" }} outlined />
                        <ButtonVariant onClick={onClick} icon={{ icon: "abstract2" }} outlined />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant
                            label="button"
                            onClick={onClick}
                            prefix={{ icon: "abstract2" }}
                            outlined
                        />
                        <ButtonVariant
                            label="button"
                            onClick={onClick}
                            suffix={{ icon: "abstract2" }}
                            outlined
                        />
                        <ButtonVariant onClick={onClick} icon={{ icon: "abstract2" }} outlined />
                    </Flex>
                }
            />
            <Ds.block
                title="Integrated PopTip"
                description={
                    <>
                        Enables integrated PopTip component. You can specify the tooltip content and
                        configuration using the popTip+floatingUi props.
                        <br />
                        <br />
                        Check out{" "}
                        <Button.string to="/design-system/floatingUi" label="FloatingUi" /> for more
                        details.
                    </>
                }
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button label="button" onClick={onClick} prefix={{ icon: "abstract2" }} popTip="PopTip enabled" />
                        <Button onClick={onClick} icon={{ icon: "abstract2" }} popTip={{ content: "PopTip enabled", bgColor: "success" }} />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant
                            label="button"
                            onClick={onClick}
                            prefix={{ icon: "abstract2" }}
                            popTip="PopTip enabled"
                        />
                        <ButtonVariant
                            onClick={onClick}
                            icon={{ icon: "abstract2" }}
                            popTip={{ content: "PopTip enabled", bgColor: "success" }}
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="Full Width"
                description="When 'fullWidth' prop is enabled, Button takes the full width of its container. It can be boolean and for the text alignment, it can be 'left', 'center' or 'right'."
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button label="button" onClick={onClick} prefix={{ icon: "abstract2" }} fullWidth="right" />
                        <Button onClick={onClick} icon={{ icon: "abstract2" }} fullWidth />`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant
                            label="button"
                            onClick={onClick}
                            prefix={{ icon: "abstract2" }}
                            fullWidth="right"
                        />
                        <ButtonVariant onClick={onClick} icon={{ icon: "abstract2" }} fullWidth />
                    </Flex>
                }
            />
            <Ds.api
                args="<Button />"
                props={{
                    variant: {
                        description: "Variant name or custom styled variant.",
                        type: "string | component",
                        defaultValue: "default",
                    },
                    label: {
                        description: "Default button label.",
                        type: "string | ReactNode",
                    },
                    hoverLabel: {
                        description: "Label shown on hover.",
                        type: "string | ReactNode",
                    },
                    activeLabel: {
                        description: "Label shown in active/on-click state.",
                        type: "string | ReactNode",
                    },
                    pendingLabel: {
                        description: "Label shown in pending state.",
                        type: "string | ReactNode",
                    },
                    icon: {
                        description: "Center icon object.",
                        type: "object",
                    },
                    prefix: {
                        description: "Prefix icon object.",
                        type: "object",
                    },
                    suffix: {
                        description: "Suffix icon object.",
                        type: "object",
                    },
                    onClick: {
                        description: "Click callback.",
                        type: "function",
                    },
                    to: {
                        description: "React Router internal link target.",
                        type: "string",
                    },
                    href: {
                        description: "External link target.",
                        type: "string",
                    },
                    url: {
                        description: "Works the same as href/to URL target.",
                        type: "string",
                    },
                    _blank: {
                        description: "Opens link in a new tab.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disabled: {
                        description: "Disables the button.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    primary: {
                        description: "Uses theme primary color set.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    secondary: {
                        description: "Uses theme secondary color set.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    bgColor: {
                        description: "Default background color.",
                        type: "string",
                        defaultValue: "theme.foreground",
                    },
                    hoverBgColor: {
                        description: "Hover background color.",
                        type: "string",
                    },
                    activeBgColor: {
                        description: "Active background color.",
                        type: "string",
                    },
                    pendingBgColor: {
                        description: "Pending background color.",
                        type: "string",
                    },
                    color: {
                        description: "Default text/icon color.",
                        type: "string",
                        defaultValue: "auto-contrast",
                    },
                    hoverColor: {
                        description: "Hover text/icon color.",
                        type: "string",
                    },
                    activeColor: {
                        description: "Active text/icon color.",
                        type: "string",
                    },
                    pendingColor: {
                        description: "Pending text/icon color.",
                        type: "string",
                    },
                    alphaRate: {
                        description: "Auto hover/active tone intensity.",
                        type: "number",
                        defaultValue: "10",
                    },
                    outlined: {
                        description: "Enables outlined appearance.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    minWidth: {
                        description: "Button minimum width (rem).",
                        type: "number",
                    },
                    minLabelWidth: {
                        description: "Label minimum width (rem).",
                        type: "number",
                    },
                    minHeight: {
                        description: "Button minimum height (rem).",
                        type: "number",
                    },
                    size: {
                        description: "Overall button scale (%).",
                        type: "number",
                        defaultValue: "100",
                    },
                    fullWidth: {
                        description: "Full width + alignment (true/left/center/right).",
                        type: "boolean | string",
                        defaultValue: "false",
                    },
                    hoverManually: {
                        description: "Forces hover state externally.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    activeManually: {
                        description: "Forces active state externally.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    pendingManually: {
                        description: "Forces pending state externally.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disableUseMatch: {
                        description: "Disables auto-active state from route match.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    delay: {
                        description: "Delays click/navigation execution in seconds.",
                        type: "number",
                        defaultValue: "0",
                    },
                    onDelayStart: {
                        description: "Called when delay starts.",
                        type: "function",
                    },
                    onDelayEnd: {
                        description: "Called when delay ends.",
                        type: "function",
                    },
                    skipClickCooldown: {
                        description: "Skips click cooldown timer.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    skipOnClickHold: {
                        description: "Skips on-click hold timer.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    clickCooldownMs: {
                        description: "Click cooldown duration in milliseconds.",
                        type: "number",
                        defaultValue: "1000",
                    },
                    onClickHoldMs: {
                        description: "On-click hold duration in milliseconds.",
                        type: "number",
                        defaultValue: "2000",
                    },
                    popTip: {
                        description: "PopTip content or PopTip props object.",
                        type: "string | ReactNode | object",
                    },
                    exportData: {
                        description: "Debug/export data passthrough.",
                        type: "boolean | object",
                        defaultValue: "false",
                    },
                    children: {
                        description: "Optional children content.",
                        type: "ReactNode",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
