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
                description={`Our Buttons make strong use of the CSS hover and active states. In addition, with the hoverManually and activeManually props, you can control the hover and active behavior of the Button programmatically from outside the component.
                    
                    By using different variations, you can achieve a range of visual effects.
                    
                    Note: If you use hoverLabel or activeLabel alongside label, the UI will size itself to the longest text. This prevents layout shifting as labels change, but for best results, try to keep the length of these texts similar.
                    
                    The Button will be activated automatically when the route matches. To disable it, use the disableUseMatch prop.
                    `}
                code={`import { Button } from "${SYS.basePath}";
                
                        <Button onClick={onClick} label="click" hoverLabel="hovered" activeLabel="active" pendingLabel="pending" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} />
                        <Button label="button" hoverLabel="hovered" activeLabel="active" pendingLabel="pending" onClick={onClick} bgColor="error" hoverBgColor="foreground" activeBgColor="foreground" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} prefix={{ icon: "abstract2", hoverIcon: "abstract3", activeIcon: "abstract4", pendingIcon: "loading", }} />
                        <Button label="submit" hoverLabel="are you sure?" activeLabel="submitted" pendingLabel="processing" onClick={onClick} bgColor="success" hoverBgColor="error" activeBgColor="foreground" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} prefix={{ icon: "fullArrowRight", hoverIcon: "warning", activeIcon: "check", pendingIcon: "loading3", }} />
                        <Button label="match route" to="/design-system/button" />`}
                example={
                    <Flex xAlign="start" gap={10}>
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
                }
            />
            <Ds.block
                title="Disabling Cooldown and onHold"
                description={`There are 2 automatic behaviors Buttons display. You can disable them using the skipClickCooldown and skipShowOnClickHold props.
                    
                    cooldown prevents the Button from being clicked multiple times in quick succession (about ~1 second). onHold starts a show-on-click timer (about ~2 seconds) for the activeLabel after the Button is clicked.You can change these durations with the clickCooldownMs and showOnClickHoldMs props.`}
                code={`import { Button } from "${SYS.basePath}";
                
                        <ButtonVaria`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <ButtonVariant
                            onClick={triggerNotifier}
                            label="cooldown & onHold enabled"
                        />
                        <ButtonVariant
                            onClick={triggerNotifier}
                            label="cooldown disabled"
                            skipClickCooldown
                        />
                        <ButtonVariant
                            onClick={triggerNotifier}
                            label="onHold disabled"
                            skipShowOnClickHold
                        />
                        <ButtonVariant
                            onClick={triggerNotifier}
                            label="both disabled"
                            skipClickCooldown
                            skipShowOnClickHold
                        />
                    </Flex>
                }
            />
            <Ds.api
                props={{
                    pendingManually: {
                        description:
                            "Pending görünümünü zorlar (Router navigation loading ile birleşir). İkonlar için pendingIcon vb. ile kullanın.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    skipClickCooldown: {
                        description:
                            "Tıklama sonrası otomatik tıklama engelini başlatmaz ve mevcut engeli de yok sayar (süre: clickCooldownMs).",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    skipShowOnClickHold: {
                        description:
                            "Tıklamada activeLabel için show-on-click zamanlayıcısını başlatmaz (süre: showOnClickHoldMs).",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    clickCooldownMs: {
                        description:
                            "Üst üste tıklamayı engelleyen zamanlayıcı süresi (milisaniye). Varsayılan 1000.",
                        type: "number",
                        required: false,
                        defaultValue: "1000",
                    },
                    showOnClickHoldMs: {
                        description:
                            "Tıklamadan sonra activeLabel / show-on-click durumunun sürdürülme süresi (milisaniye). Varsayılan 2000.",
                        type: "number",
                        required: false,
                        defaultValue: "2000",
                    },
                    pendingLabel: {
                        description:
                            "Pending durumunda gösterilecek metin (hover/active ile aynı mantık; pending önceliklidir).",
                        type: "string",
                        required: false,
                        defaultValue: "null",
                    },
                    pendingBgColor: {
                        description:
                            "Pending durumunda arka plan rengi (tema anahtarı veya ham renk). Boşsa hover ile aynı tonda fallback.",
                        type: "string",
                        required: false,
                        defaultValue: "null",
                    },
                    pendingColor: {
                        description:
                            "Pending durumunda metin ve outlined kenarlık rengi. Boşsa color / otomatik kontrast.",
                        type: "string",
                        required: false,
                        defaultValue: "null",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
