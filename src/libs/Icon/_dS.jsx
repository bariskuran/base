import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Icon } from "./";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { baseStore } from "../baseStore";
import { t } from "../getText";

const CustomTriangle = () => (
    <>
        <path d="M12 2L22 22H2Z" />
    </>
);

const X = () => {
    const { isHover, isActive, isPending, isClickEffect, setByPath } = baseStore.useLocal({
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
                    {t({ tr: "Icon, SVG ikonlarını yerleşik ikon setinden veya özel ikon tanımlarından render eder. Hover ve active durumlarını, boyut ve renk değişimini, ayrıca isteğe bağlı PopTip entegrasyonunu destekler.", en: "Icon renders SVG icons from the built-in icon set or custom icon definitions. It supports hover and active states, size and colour switching, and optional PopTip integration." })}
                    <br />
                    <br /> {t({ tr: "Tüm kullanılabilir ikonları ve yeni ikon eklemeyi görmek için ", en: "See " })}
                    <Button.string to="/design-system/iconLibrary" label="Icon Library" />{t({ tr: " sayfasına bakın.", en: " for all available icons and how to add new icons." })}
                </>
            }
        >
            <Ds.block
                title={{ tr: "Temel kullanım", en: "Basic Usage" }}
                description={{ tr: "Icon componenti, ikon adını vererek ikon kütüphanesindeki herhangi bir ikonu render edebilir.", en: "The Icon component can render any icon from the icon library by passing its name." }}
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
                title={{ tr: "Özel ikon dizisi", en: "Custom Icon Array" }}
                description={{ tr: "Özel ikon tanımını doğrudan dizi olarak verebilirsiniz. İlk öğe viewBox boyutu; ikinci öğe ise path string'i, component veya render edilebilir başka bir içeriktir.", en: "You can pass a custom icon definition directly as an array. The first item is the viewBox size and the second item is a path string, a component, or other renderable content." }}
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
                description={{ tr: "Kare yerine içerikle orantılı kutu kullanır: width/size, ikon içeriğinin uzun kenarını hedefler (kare ikonla aynı zihinsel model). Path tabanlı ikonlarda flat, SVG'yi path sınırlarına kırpar ve optik ölçeklemeyi kapatır; böylece kaynak viewBox'ta fazladan boşluk olsa bile logolar ve wordmark'lar kenardan kenara render edilir.", en: "Uses a content-proportional box instead of a square: width/size targets the long side of the icon content. For path-based icons, flat trims the SVG to path bounds and disables optical scaling, so logos and wordmarks render edge-to-edge even when the source viewBox has extra whitespace." }}
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
                title={{ tr: "Genişlik ve renk", en: "Width and Color" }}
                description={{ tr: "width ikon boyutunu kontrol eder. color ham değerleri, theme değerlerini ve theme path'lerini destekler. width için size ve w propları da kullanılabilir.", en: "width controls icon size. color supports raw values, theme values, and theme paths. size and w also work as width shorthands." }}
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
                title={{ tr: "Hover durumu", en: "Hover State" }}
                description={{ tr: "Hover sırasında ikonu, rengi ve genişliği değiştirebilirsiniz. Hover davranışı fare etkileşimiyle otomatik çalışır; hoverManually boolean prop'u ile elle de tetiklenebilir.", en: "You can change the icon, colour, and width on hover. Hover works automatically through pointer interaction or can be triggered manually with the hoverManually boolean prop." }}
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
                            onMouseEnter={() => setByPath("isHover", true)}
                            onMouseLeave={() => setByPath("isHover", false)}
                        >
                            hoverManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Active durumu", en: "Active State" }}
                description={{ tr: "Active durum ikonu, rengi ve scale değerini değiştirebilir. Active iken disableScaleEffect true değilse yerleşik pulse animasyonu da oynar. Icon kendi başına active durumu tetiklemez; componentiniz içinden activeManually boolean prop'u ile elle tetikleyebilirsiniz.", en: "The active state can switch icon, colour, and scale. Unless disableScaleEffect is true, it also plays the built-in pulse animation. Icon cannot trigger the active state itself; trigger it manually in your component with the activeManually boolean prop." }}
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
                            onMouseEnter={() => setByPath("isActive", true)}
                            onMouseLeave={() => setByPath("isActive", false)}
                        >
                            activeManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Pending durumu", en: "Pending State" }}
                description={{ tr: "Pending durum ikonu, rengi ve scale değerini değiştirebilir. Icon bunu kendi başına tetiklemez; pendingManually boolean prop'u ile elle tetikleyebilirsiniz. Pending durumunda ikon 360 derece döner; bu animasyona uygun ikonların seçilmesi önerilir.", en: "The pending state can switch icon, colour, and scale. Icon cannot trigger it itself; trigger it manually with the pendingManually boolean prop. While pending, the icon rotates 360 degrees, so choose icons suitable for this animation." }}
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
                            onMouseEnter={() => setByPath("isPending", true)}
                            onMouseLeave={() => setByPath("isPending", false)}
                        >
                            pendingManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Click durumu", en: "Click State" }}
                description={{ tr: "Click/press görselleri active katmanını yeniden kullanır: activeIcon, activeColor, activeScale ve pulse (disablePulseEffect değilse). Icon click feedback'i kendi başına oynatmaz. Parent'tan clickEffectManually boolean'ını kullanın; örneğin ertelenmiş action'lı Button veya confirm sonrası PopConfirm. clickEffectManually tanımlıysa click efektini activeManually'e ek olarak yalnızca bu boolean yönetir. Icon Button ile otomatik yönetiliyorsa prop'u vermeyin.", en: "Click/press visuals reuse the active layer: activeIcon, activeColor, activeScale, and pulse unless disablePulseEffect is set. Icon does not play click feedback itself; use clickEffectManually from a parent, such as a Button with deferred actions or PopConfirm after confirmation. When defined, this boolean controls click-effect visuals alongside activeManually. Omit it when Button drives Icon automatically." }}
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
                            onMouseEnter={() => setByPath("isClickEffect", true)}
                            onMouseLeave={() => setByPath("isClickEffect", false)}
                        >
                            clickEffectManually
                        </div>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "PopTip entegrasyonu", en: "PopTip Integration" }}
                description={
                    <>
                        {t({ tr: "Icon ile PopTip kullanmak isterseniz, tooltip içeriğini ve ayarını popTipProps prop'u ile belirleyebilirsiniz. popTipProps nesnesi PopTip ile aynı API'yi kullanır.", en: "To use PopTip with an Icon, specify tooltip content and configuration through the popTipProps prop. The popTipProps object uses the same API as PopTip." })}
                        <br />
                        <br />
                        {t({ tr: "popTipProps için ", en: "See " })}<Button.string to="/design-system/popTip" label="PopTip" />{t({ tr: " sayfasına bakın.", en: " for popTipProps." })}
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
                        description: { tr: "Kütüphanedeki ikon adı veya [viewBox, content] biçiminde özel ikon dizisi.", en: "Icon name from the library or a custom icon array in the form [viewBox, content]." },
                        type: "string | array",
                        required: true,
                        defaultValue: "warning",
                    },
                    color: {
                        description: { tr: "Varsayılan ikon rengi.", en: "Default icon colour." },
                        type: "string",
                        defaultValue: "foreground || black",
                    },
                    width: {
                        description: { tr: "Temel ikon boyutu. Kısaltmalar: size ve w.", en: "Base icon size. Shorthands: size and w." },
                        type: "number",
                        defaultValue: "10",
                    },
                    hoverIcon: {
                        description: { tr: "Hover durumunda gösterilen ikon.", en: "Icon shown on hover state." },
                        type: "string | array",
                    },
                    hoverColor: {
                        description: { tr: "Hover durumunda gösterilen renk.", en: "Colour shown on hover state." },
                        type: "string",
                    },
                    hoverWidth: {
                        description: { tr: "Hover durumunda gösterilen boyut. Kısaltmalar: hoverSize ve hoverW.", en: "Size shown on hover state. Shorthands: hoverSize and hoverW." },
                        type: "number",
                    },
                    hoverManually: {
                        description: { tr: "Hover görsellerini elle tetikler.", en: "Triggers hover visuals manually." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    activeIcon: {
                        description: { tr: "Active durumunda gösterilen ikon.", en: "Icon shown on active state." },
                        type: "string | array",
                    },
                    activeColor: {
                        description: { tr: "Active durumunda gösterilen renk.", en: "Colour shown on active state." },
                        type: "string",
                    },
                    activeWidth: {
                        description: { tr: "Active durumunda gösterilen boyut. Kısaltmalar: activeSize ve activeW.", en: "Size shown on active state. Shorthands: activeSize and activeW." },
                        type: "number",
                    },
                    activeManually: {
                        description: { tr: "Active görsellerini elle tetikler.", en: "Triggers active visuals manually." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    pendingIcon: {
                        description: { tr: "Pending durumunda gösterilen ikon (ör. navigasyon yüklenirken). Pending iken hover/active üzerinde önceliklidir.", en: "Icon shown while pending (e.g. navigation loading). Takes precedence over hover/active while pending." },
                        type: "string | array",
                    },
                    pendingColor: {
                        description: { tr: "Pending durumundaki renk.", en: "Colour while pending." },
                        type: "string",
                    },
                    pendingWidth: {
                        description: { tr: "Pending durumundaki boyut. Kısaltmalar: pendingSize ve pendingW.", en: "Size while pending. Shorthands: pendingSize and pendingW." },
                        type: "number",
                    },
                    pendingScale: {
                        description: { tr: "Pending durumundaki görsel scale ezmesi.", en: "Visual scale override while pending." },
                        type: "number",
                    },
                    pendingManually: {
                        description: { tr: "Pending görsellerini elle tetikler (ör. Router loading durumu ile birlikte).", en: "Triggers pending visuals manually (e.g. alongside Router loading state)." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    clickEffectManually: {
                        description: { tr: "Click/press durumu (activeIcon, activeColor, activeScale kullanır). Icon kendini tetiklemez; parent true/false verir. Tanımlandığında click efekti activeManually ile birlikte bu boolean'ı izler. Button içinde otomatik yönetim için vermeyin.", en: "Click/press state (uses activeIcon, activeColor, activeScale). Icon does not self-trigger; the parent sets true/false. When defined, click-effect visuals follow this boolean together with activeManually. Omit it when nested in Button for automatic handling." },
                        type: "boolean",
                    },
                    popTipProps: {
                        description: { tr: "PopTip entegrasyonunu açar. enablePopTip true olduğunda proplar PopTip'e aktarılır.", en: "Enables PopTip integration. Props are passed to PopTip when enablePopTip is true." },
                        type: "object",
                        defaultValue: "{}",
                    },
                    disableScaleEffect: {
                        description: { tr: "Hover scale efektini kapatır.", en: "Disables the hover scale effect." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    flat: {
                        description: { tr: "true olduğunda ikon kare olmaya zorlanmaz. width/size uzun kenarı hedefler. Path tabanlı ikonlar gerçek path sınırlarına kırpılır ve logolar/wordmark'lar kenardan kenara render edilebilsin diye optik scale kapatılır.", en: "When true, the icon is not forced into a square. width/size targets the long side. Path-based icons are trimmed to their real path bounds and optical scaling is disabled so logos and wordmarks render edge-to-edge." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disablePulse: {
                        description: { tr: "Active pulse efektini kapatır.", en: "Disables the active pulse effect." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
