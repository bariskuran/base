import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { baseStore } from "../baseStore";
import { useTimer } from "../useTimer";
import { Dropdown } from "../Dropdown";
import { useMemo } from "react";
import { buttonVariants } from "./";

const url = "https://www.google.com";
const link = "/design-system";

const Template = ({ row1, row2 }) => {
    return (
        <Flex.column gap={10}>
            <Flex gap={10}>{row1}</Flex>
            <Flex gap={10}>{row2}</Flex>
        </Flex.column>
    );
};

const X = () => {
    const [_notifier] = baseStore.useGlobal((s) => [s._notifier]);
    const { clicked, hoverManually, activeManually, pendingManually, selectedVariant, set } =
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
            set((s) => {
                s.clicked = true;
            });
        },
        onEnd: () => {
            set((s) => {
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
            description={{
                tr: "Button, RRD'nin <Link>, HTML'in <a> ve <button> elemanlarının birleşimidir. İçeriği otomatik algılar ve uygun elemanı render eder.",
                en: "Button is combination of RRD's <Link>, HTML's<a> and <button> elements. It automatically detects the content and renders the appropriate element.",
            }}
        >
            <Ds.block
                description={{
                    tr: "Her özelliğin tüm varyantlarda çalışmadığını unutmayın.",
                    en: "Keep in mind that not all features work for all variants.",
                }}
                example={
                    <Flex gap={10}>
                        <Dropdown
                            options={[
                                ...Object.keys(buttonVariants).map((key) => ({
                                    label: key,
                                    value: key,
                                })),
                            ]}
                            value={selectedVariant}
                            onChange={(value) => {
                                set((s) => {
                                    s.selectedVariant = value;
                                });
                            }}
                        />
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
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
                title={{ tr: "İkon Kullanımı", en: "Icon Usage" }}
                description={{
                    tr: <>
                        Button; prefix, suffix veya merkez ikonuyla kullanılabilir. prefix, suffix ve icon nesneleri
                        `icon` anahtarıyla Icon, `flag` anahtarıyla Flag render edebilir. Ayrıntılar için{" "}
                        <Button.string to="/design-system/icon" label="<Icon>" /> sayfasına bakın.
                    </>,
                    en: <>
                        Button can also be used with prefixed icon, suffixed icon, icon only.
                        prefix, suffix and icon objects can render Icon with an `icon` key or Flag
                        with a `flag` key. Check out{" "}
                        <Button.string to="/design-system/icon" label="<Icon>" /> for more details.
                    </>,
                }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button label="button" onClick={onClick} prefix={{ icon: "abstract2" }} />
                        <Button label="button" onClick={onClick} suffix={{ icon: "abstract2" }} />
                        <Button onClick={onClick} icon={{ icon: "abstract2" }} />`}
                example={
                    <Flex gap={10}>
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
                title={{ tr: "Bayrak Kullanımı", en: "Flag Usage" }}
                description={{
                    tr: <>
                        prefix, suffix veya merkez ikon nesnesinde `icon` yerine `flag` kullanın. width, flat,
                        color, bgColor, hoverColor ve activeColor gibi diğer görsel prop'lar aynı nesne düzenini izler.
                    </>,
                    en: <>
                        Use `flag` instead of `icon` inside prefix, suffix, or centered icon
                        objects. Other visual props such as width, flat, color, bgColor, hoverColor,
                        and activeColor follow the same object pattern.
                    </>,
                }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button label="Türkiye" prefix={{ flag: "tr", width: 18, flat: true }} />
                        <Button label="English" suffix={{ flag: "gb", width: 18, flat: true }} />
                        <Button icon={{ flag: "global", width: 18, flat: true }} />`}
                example={
                    <Flex gap={10}>
                        <ButtonVariant
                            label="Türkiye"
                            onClick={onClick}
                            prefix={{ flag: "tr", width: 18, flat: true }}
                        />
                        <ButtonVariant
                            label="English"
                            onClick={onClick}
                            suffix={{ flag: "gb", width: 18, flat: true }}
                        />
                        <ButtonVariant
                            onClick={onClick}
                            icon={{ flag: "global", width: 18, flat: true }}
                        />
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Renk Yönetimi", en: "Color Management" }}
                description={{
                    tr: `color, hoverColor, activeColor, bgColor, hoverBgColor ve activeBgColor prop'ları theme renkleri ve theme renk yolları dâhil tüm geçerli renk değerlerini alabilir.

                    Renk normalde bgColor'dan türetilir; ancak color prop'u ile değiştirilebilir. Not: bgColor="transparent" kullanıldığında bilinen bir sorun vardır. Şeffaf arka planla birlikte color prop'unu açıkça belirtin.

                    hoverBgColor veya activeBgColor verilmezse bgColor temel alınarak tint ya da shade ile otomatik hesaplanır. Bu hesaplanan renkleri kullanmak istemiyorsanız ilgili prop'lara istediğiniz renkleri doğrudan verin.`,
                    en: ` color, hoverColor, activeColor,bgColor, hoverBgColor, activeBgColor props can get any valid color value including theme colors and theme color paths.

                    The color is usually derived from the bgColor, but can be overridden using the color prop. Note: If you use bgColor="transparent", there's a known issue. Make sure to explicitly set the color prop when using a transparent background.

                    If hoverBgColor or activeBgColor are not provided, they are automatically calculated based on bgColor using tints or shades. If you prefer not to use these automatically computed colors, you can specify the desired colors by providing these props explicitly.`,
                }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button onClick={onClick} icon={{ icon: "abstract2" }} bgColor="ffba00" hoverBgColor="ff8400" activeBgColor="ff4d00" color="ff3c00" hoverColor="000000" activeColor="ffffff" />
                        <Button onClick={onClick} icon={{ icon: "abstract2", hoverColor: "white" }} bgColor="greys.shade20" />
                        <Button onClick={onClick} label="b" bgColor="ffba00" hoverBgColor="ff8400" activeBgColor="ff4d00" color="ff3c00" hoverColor="000000" activeColor="ffffff" />
                        <Button onClick={onClick} label="b" bgColor="transparent" hoverBgColor="transparent" activeBgColor="transparent" color="foreground" outlined />
                        <Button onClick={onClick} label="b" bgColor="error" />`}
                example={
                    <Flex gap={10}>
                        <ButtonVariant
                            onClick={onClick}
                            icon={{ icon: "abstract1" }}
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
                            prefix={{ icon: "abstract3", hoverColor: "white" }}
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
                title={{ tr: "Hover, Aktif ve Bekleyen Durum Yönetimi", en: "Hover & Active & Pending Management" }}
                description={{
                    tr: `Button'lar CSS hover ve active durumlarını yoğun biçimde kullanır. hoverManually ve activeManually prop'larıyla Button'ın hover ve aktif davranışını component dışından programatik olarak yönetebilirsiniz. Farklı kombinasyonlarla çeşitli görsel efektler elde edilebilir.

                    Not: label ile birlikte hoverLabel veya activeLabel kullanılırsa arayüz en uzun metne göre boyutlanır. Bu, etiket değişirken layout kaymasını önler; en iyi sonuç için metin uzunluklarını birbirine yakın tutun. Route eşleştiğinde Button otomatik olarak aktifleşir. Bunu kapatmak için disableUseMatch prop'unu kullanın.

                    Bekleyen durumda ikon 360 derece döner. Bu animasyon türüne uygun ikonlar seçmeniz önerilir.`,
                    en: `Our Buttons make strong use of the CSS hover and active states. In addition, with the hoverManually and activeManually props, you can control the hover and active behavior of the Button programmatically from outside the component. By using different variations, you can achieve a range of visual effects.

                    Note: If you use hoverLabel or activeLabel alongside label, the UI will size itself to the longest text. This prevents layout shifting as labels change, but for best results, try to keep the length of these texts similar. The Button will be activated automatically when the route matches. To disable it, use the disableUseMatch prop.

                    In the pending state, the icon rotates 360 degrees. It is recommended to choose icons that are suitable for this type of animation.
                    `,
                }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button onClick={onClick} label="click" hoverLabel="hovered" activeLabel="active" pendingLabel="pending" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} />
                        <Button label="button" hoverLabel="hovered" activeLabel="active" pendingLabel="pending" onClick={onClick} bgColor="error" hoverBgColor="foreground" activeBgColor="foreground" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} prefix={{ icon: "abstract2", hoverIcon: "abstract3", activeIcon: "abstract4", pendingIcon: "loading", }} />
                        <Button label="submit" hoverLabel="are you sure?" activeLabel="submitted" pendingLabel="processing" onClick={onClick} bgColor="success" hoverBgColor="error" activeBgColor="foreground" hoverManually={hoverManually} activeManually={activeManually} pendingManually={pendingManually} prefix={{ icon: "fullArrowRight", hoverIcon: "warning", activeIcon: "check", pendingIcon: "loading3", }} />
                        <Button label="match route" to="/design-system/button" />`}
                example={
                    <Flex.column gap={10}>
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
                                    set((s) => {
                                        s.hoverManually = true;
                                    });
                                }}
                                onMouseLeave={() => {
                                    set((s) => {
                                        s.hoverManually = false;
                                    });
                                }}
                            >
                                hoverManually
                            </div>
                            <div
                                onMouseEnter={() => {
                                    set((s) => {
                                        s.activeManually = true;
                                    });
                                }}
                                onMouseLeave={() => {
                                    set((s) => {
                                        s.activeManually = false;
                                    });
                                }}
                            >
                                activeManually
                            </div>
                            <div
                                onMouseEnter={() => {
                                    set((s) => {
                                        s.pendingManually = true;
                                    });
                                }}
                                onMouseLeave={() => {
                                    set((s) => {
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
                title={{ tr: "Cooldown ve onHold'u Devre Dışı Bırakma", en: "Disabling Cooldown and onHold" }}
                description={{
                    tr: `Button'ın iki otomatik davranışı vardır. Bunları skipClickCooldown ve skipOnClickHold prop'larıyla devre dışı bırakabilirsiniz.

                    cooldown, Button'ın kısa aralıklarla birden fazla tıklanmasını önler (yaklaşık 1 saniye). onHold, Button tıklandıktan sonra activeLabel için tıklama-sonrası gösterim zamanlayıcısı başlatır (yaklaşık 2 saniye). Bu süreleri clickCooldownMs ve onClickHoldMs prop'larıyla değiştirebilirsiniz.`,
                    en: `There are 2 automatic behaviors Buttons display. You can disable them using the skipClickCooldown and skipOnClickHold props.

                    cooldown prevents the Button from being clicked multiple times in quick succession (about ~1 second). onHold starts a show-on-click timer (about ~2 seconds) for the activeLabel after the Button is clicked.You can change these durations with the clickCooldownMs and onClickHoldMs props.`,
                }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button onClick={triggerNotifier} label="both enabled" />
                        <Button onClick={triggerNotifier} label="cooldown disabled" skipClickCooldown />
                        <Button onClick={triggerNotifier} label="onHold disabled" skipOnClickHold />
                        <Button onClick={triggerNotifier} label="both disabled" skipClickCooldown skipOnClickHold />`}
                example={
                    <Flex gap={10}>
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
                title={{ tr: "Button'ı Devre Dışı Bırakma", en: "Disabling Button" }}
                description={{ tr: "Tüm Button işlevini disabled prop'u ile devre dışı bırakır.", en: "Disable entire button function via disabled prop." }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button onClick={triggerNotifier} label="disabled" disabled />`}
                example={
                    <Flex gap={10}>
                        <ButtonVariant onClick={triggerNotifier} label="disabled" disabled />
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Button Boyutlandırma", en: "Resizing Button" }}
                description={{ tr: "Button boyutunu size prop'u ile değiştirebilirsiniz. Değer, özgün boyutun yüzdesidir.", en: "You can resize the Button using the size prop. The value is a percentage of the original size." }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button onClick={triggerNotifier} label="Regular" size={100} />
                        <Button onClick={triggerNotifier} label="Smaller" size={80} />
                        <Button onClick={triggerNotifier} label="Larger" size={120} />`}
                example={
                    <Flex gap={10}>
                        <ButtonVariant onClick={triggerNotifier} label="Regular" size={100} />
                        <ButtonVariant onClick={triggerNotifier} label="Smaller" size={80} />
                        <ButtonVariant onClick={triggerNotifier} label="Larger" size={120} />
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Font Ailesi", en: "Font Family" }}
                description={{ tr: "PROJECT_SETTINGS.styledSettings.fonts içinden adlandırılmış bir font seçmek için fontFamily kullanılır. Verilmezse Button global primaryFont'u devralır.", en: "Use fontFamily to select a named font from PROJECT_SETTINGS.styledSettings.fonts. If omitted, Button inherits the global primaryFont." }}
                code={`import { Button } from "${SYS.basePath}";

                        <Button label="Primary font" />
                        <Button label="Montserrat" fontFamily="montserrat" />`}
                example={
                    <Flex gap={10}>
                        <ButtonVariant label="Primary font" onClick={triggerNotifier} />
                        <ButtonVariant
                            label="Montserrat"
                            fontFamily="montserrat"
                            onClick={triggerNotifier}
                        />
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Outlined Button", en: "Outlined Button" }}
                description={{ tr: "outlined prop'u etkin olduğunda Button, bgColor değerini kenarlık rengi olarak kullanır. string gibi bazı varyantlar bu özelliği yok sayabilir.", en: "When 'outlined' prop is enabled, Button uses bgColor as border color. Some variants may ignore this feature such as 'string'." }}
                code={`import { Button } from "${SYS.basePath}";

                        <ButtonVariant label="button" onClick={onClick} prefix={{ icon: "abstract2" }} outlined />
                        <ButtonVariant label="button" onClick={onClick} suffix={{ icon: "abstract2" }} outlined />
                        <ButtonVariant onClick={onClick} icon={{ icon: "abstract2" }} outlined />`}
                example={
                    <Flex gap={10}>
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
                title={{ tr: "Entegre PopTip", en: "Integrated PopTip" }}
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
                    <Flex gap={10}>
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
                title={{ tr: "Tam Genişlik", en: "Full Width" }}
                description={{ tr: "fullWidth prop'u etkin olduğunda Button kapsayıcısının tüm genişliğini kaplar. Boolean olabilir; metin hizası için left, center veya right değeri verilebilir.", en: "When 'fullWidth' prop is enabled, Button takes the full width of its container. It can be boolean and for the text alignment, it can be 'left', 'center' or 'right'." }}
                code={`import { Button, Flex } from "${SYS.basePath}";

                        <Flex.column full gap={10}>
                            <Button label="button" onClick={onClick} prefix={{ icon: "abstract2" }} fullWidth="right" />
                            <Button onClick={onClick} icon={{ icon: "abstract2" }} fullWidth />
                        </Flex.column>`}
                example={
                    <Flex.column full gap={10}>
                        <ButtonVariant
                            label="button"
                            onClick={onClick}
                            prefix={{ icon: "abstract2" }}
                            fullWidth="right"
                        />
                        <ButtonVariant onClick={onClick} icon={{ icon: "abstract2" }} fullWidth />
                    </Flex.column>
                }
            />
            <Ds.block
                title={{ tr: "Genel Varyantlar", en: "Generic Variants" }}
                example={
                    <Ds.variant
                        variants={[
                            ["closeIcon", <Button.closeIcon key="error" />],
                            [
                                "withCopyIcon",
                                <Button.withCopyIcon label="withCopyIcon" key="withCopyIcon" />,
                            ],
                        ]}
                    />
                }
            />
            <Ds.api
                args="<Button />"
                props={{
                    variant: {
                        description: { tr: "Varyant adı veya özel stillendirilmiş varyant.", en: "Variant name or custom styled variant." },
                        type: "string | component",
                        defaultValue: "default",
                    },
                    label: {
                        description: { tr: "Varsayılan Button etiketi.", en: "Default button label." },
                        type: "string | ReactNode",
                    },
                    ariaLabel: {
                        description: { tr: "Yalnızca ikon içeren Button'lar için erişilebilir etiket.", en: "Accessible label for icon-only buttons." },
                        type: "string",
                    },
                    hoverLabel: {
                        description: { tr: "Hover durumunda gösterilen etiket.", en: "Label shown on hover." },
                        type: "string | ReactNode",
                    },
                    activeLabel: {
                        description: { tr: "Aktif/tıklama durumunda gösterilen etiket.", en: "Label shown in active/on-click state." },
                        type: "string | ReactNode",
                    },
                    pendingLabel: {
                        description: { tr: "Bekleyen durumda gösterilen etiket.", en: "Label shown in pending state." },
                        type: "string | ReactNode",
                    },
                    icon: {
                        description:
                            { tr: "Merkez ikon/bayrak nesnesi. Icon için `{ icon }`, Flag için `{ flag }` kullanın.", en: "Center icon / flag object. Use `{ icon }` for Icon or `{ flag }` for Flag." },
                        type: "object",
                    },
                    prefix: {
                        description:
                            { tr: "Prefix ikon/bayrak nesnesi. Icon için `{ icon }`, Flag için `{ flag }` kullanın.", en: "Prefix icon / flag object. Use `{ icon }` for Icon or `{ flag }` for Flag." },
                        type: "object",
                    },
                    suffix: {
                        description:
                            { tr: "Suffix ikon/bayrak nesnesi. Icon için `{ icon }`, Flag için `{ flag }` kullanın.", en: "Suffix icon / flag object. Use `{ icon }` for Icon or `{ flag }` for Flag." },
                        type: "object",
                    },
                    onClick: {
                        description: { tr: "Tıklama callback'i.", en: "Click callback." },
                        type: "fn",
                    },
                    to: {
                        description: { tr: "React Router dahili link hedefi.", en: "React Router internal link target." },
                        type: "string",
                    },
                    href: {
                        description: { tr: "Harici link hedefi.", en: "External link target." },
                        type: "string",
                    },
                    url: {
                        description: { tr: "href/to URL hedefiyle aynı şekilde çalışır.", en: "Works the same as href/to URL target." },
                        type: "string",
                    },
                    _blank: {
                        description: { tr: "Linki yeni sekmede açar.", en: "Opens link in a new tab." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disabled: {
                        description: { tr: "Button'ı devre dışı bırakır.", en: "Disables the button." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    primary: {
                        description: { tr: "Theme primary renk setini kullanır.", en: "Uses theme primary color set." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    secondary: {
                        description: { tr: "Theme secondary renk setini kullanır.", en: "Uses theme secondary color set." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    bgColor: {
                        description: { tr: "Varsayılan arka plan rengi.", en: "Default background color." },
                        type: "string",
                        defaultValue: "theme.foreground",
                    },
                    hoverBgColor: {
                        description: { tr: "Hover arka plan rengi.", en: "Hover background color." },
                        type: "string",
                    },
                    activeBgColor: {
                        description: { tr: "Aktif arka plan rengi.", en: "Active background color." },
                        type: "string",
                    },
                    pendingBgColor: {
                        description: { tr: "Bekleyen durum arka plan rengi.", en: "Pending background color." },
                        type: "string",
                    },
                    color: {
                        description: { tr: "Varsayılan metin/ikon rengi.", en: "Default text/icon color." },
                        type: "string",
                        defaultValue: "auto-contrast",
                    },
                    hoverColor: {
                        description: { tr: "Hover metin/ikon rengi.", en: "Hover text/icon color." },
                        type: "string",
                    },
                    activeColor: {
                        description: { tr: "Aktif metin/ikon rengi.", en: "Active text/icon color." },
                        type: "string",
                    },
                    pendingColor: {
                        description: { tr: "Bekleyen durum metin/ikon rengi.", en: "Pending text/icon color." },
                        type: "string",
                    },
                    alphaRate: {
                        description: { tr: "Otomatik hover/aktif ton yoğunluğu.", en: "Auto hover/active tone intensity." },
                        type: "number",
                        defaultValue: "10",
                    },
                    outlined: {
                        description: { tr: "Outlined görünümü etkinleştirir.", en: "Enables outlined appearance." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    minWidth: {
                        description: { tr: "Button minimum genişliği (rem).", en: "Button minimum width (rem)." },
                        type: "number",
                    },
                    minLabelWidth: {
                        description: { tr: "Etiket minimum genişliği (rem).", en: "Label minimum width (rem)." },
                        type: "number",
                    },
                    minHeight: {
                        description: { tr: "Button minimum yüksekliği (rem).", en: "Button minimum height (rem)." },
                        type: "number",
                    },
                    size: {
                        description: { tr: "Genel Button ölçeği (%).", en: "Overall button scale (%)." },
                        type: "number",
                        defaultValue: "100",
                    },
                    fullWidth: {
                        description: { tr: "Tam genişlik + hizalama (true/left/center/right).", en: "Full width + alignment (true/left/center/right)." },
                        type: "boolean | string",
                        defaultValue: "false",
                    },
                    fontFamily: {
                        description:
                            { tr: 'PROJECT_SETTINGS.styledSettings.fonts içinden adlandırılmış font anahtarı; ör. "montserrat". Verilmezse Button, fonts.primaryFont değerini devralır.', en: 'Named font key from PROJECT_SETTINGS.styledSettings.fonts, e.g. "montserrat". When omitted, Button inherits fonts.primaryFont.' },
                        type: "string",
                    },
                    hoverManually: {
                        description: { tr: "Hover durumunu haricî olarak zorlar.", en: "Forces hover state externally." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    activeManually: {
                        description: { tr: "Aktif durumu haricî olarak zorlar.", en: "Forces active state externally." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    clickEffectManually: {
                        description:
                            { tr: "Basılma/tıklama görsellerini (etiket aktif katmanı, ikon aktif ölçeği, pointer isPressed) kontrol eder. Tanımlandığında otomatik tıklama efektleri devre dışı kalır; true/false değerini açıkça verin. Ertelenmiş eylem tetikleyicilerinde (ör. PopConfirm contentButtonProps) false kullanın.", en: "Controls press/click visuals (label active layer, icon active scale, pointer isPressed). When defined, automatic click effects are disabled; pass true/false explicitly. Use false on deferred-action triggers (e.g. PopConfirm contentButtonProps)." },
                        type: "boolean",
                    },
                    pendingManually: {
                        description: { tr: "Bekleyen durumu haricî olarak zorlar.", en: "Forces pending state externally." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disableUseMatch: {
                        description: { tr: "Route eşleşmesinden gelen otomatik aktif durumu devre dışı bırakır.", en: "Disables auto-active state from route match." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    delay: {
                        description: { tr: "Tıklama/navigasyon çalışmasını saniye cinsinden geciktirir.", en: "Delays click/navigation execution in seconds." },
                        type: "number",
                        defaultValue: "0",
                    },
                    onDelayStart: {
                        description: { tr: "Gecikme başladığında çağrılır.", en: "Called when delay starts." },
                        type: "fn",
                    },
                    onDelayEnd: {
                        description: { tr: "Gecikme bittiğinde çağrılır.", en: "Called when delay ends." },
                        type: "fn",
                    },
                    skipClickCooldown: {
                        description: { tr: "Tıklama cooldown zamanlayıcısını atlar.", en: "Skips click cooldown timer." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    skipOnClickHold: {
                        description: { tr: "Tıklama sonrası hold zamanlayıcısını atlar.", en: "Skips on-click hold timer." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    clickCooldownMs: {
                        description: { tr: "Tıklama cooldown süresi (milisaniye).", en: "Click cooldown duration in milliseconds." },
                        type: "number",
                        defaultValue: "1000",
                    },
                    onClickHoldMs: {
                        description: { tr: "Tıklama sonrası hold süresi (milisaniye).", en: "On-click hold duration in milliseconds." },
                        type: "number",
                        defaultValue: "2000",
                    },
                    popTip: {
                        description: { tr: "PopTip içeriği veya PopTip prop nesnesi.", en: "PopTip content or PopTip props object." },
                        type: "string | ReactNode | object",
                    },
                    exportData: {
                        description: { tr: "Debug/export veri aktarımı.", en: "Debug/export data passthrough." },
                        type: "boolean | object",
                        defaultValue: "false",
                    },
                    children: {
                        description: { tr: "İsteğe bağlı children içeriği.", en: "Optional children content." },
                        type: "ReactNode",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
