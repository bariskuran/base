import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { PopTip } from "./";
import { Button } from "../Button";
import { t } from "../getText";

const Template = ({ children }) => (
    <Flex padding={10} bgColor="foregrounds.tint80" color="foreground">
        {children}
    </Flex>
);
const X = () => {
    /* Return */
    return (
        <Ds.page
            title="<PopTip>"
            releasedOn="1.0.0"
            description={
                <>
                    {t({ tr: "PopTip, tetikleyici elemana göre konumlanan kayan içeriği; konum ve stil denetimiyle render eder. Açık durumu dışarıdan da yönetilebildiği için yardımcı bir componenttir. Ayrıntılı kullanım için PopOver, PopConfirm ve Button gibi componentlere bakabilirsiniz.", en: "PopTip renders floating content relative to a trigger element, with controllable position and style. Its open state can be managed externally, making it a helper component. For detailed usage, review components such as PopOver, PopConfirm, and Button." })}
                    <br />
                    <br />
                    {t({ tr: "Ayrıntılar için ", en: "See " })}<Button.string
                        to="/design-system/floatingUi"
                        label="FloatingUi"
                    />{" "}
                    {t({ tr: " sayfasına bakın.", en: " for more details." })}
                </>
            }
        >
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="floating content">Content</PopTip>`}
                example={
                    <Flex padding={10}>
                        <PopTip content="floating content">Content</PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Konumlandırma", en: "Positioning" }}
                description={{ tr: "position seçeneği varsayılan olarak auto'dur; yerleşimi elemanın ekrandaki konumuna ve kayan içeriğe göre belirler. Gerektiğinde kendiniz ezebilirsiniz.", en: "The position option defaults to auto, which determines placement from the element's position on screen and the floating content. You can override it when needed." }}
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="Top / Left" alignX="left" alignY="top">
                            <Template>T/L</Template>
                        </PopTip>
                        <PopTip content="Top / Center" alignX="center" alignY="top">
                            <Template>T/C</Template>
                        </PopTip>
                        <PopTip content="Top / Right" alignX="right" alignY="top">
                            <Template>T/R</Template>
                        </PopTip>
                        <PopTip content="Bottom / Left" alignX="left" alignY="bottom">
                            <Template>B/L</Template>
                        </PopTip>
                        <PopTip content="Bottom / Center" alignX="center" alignY="bottom">
                            <Template>B/C</Template>
                        </PopTip>
                        <PopTip content="Bottom / Right" alignX="right" alignY="bottom">
                            <Template>B/R</Template>
                        </PopTip>`}
                example={
                    <Flex gap={10}>
                        <PopTip content="Top / Left" alignX="left" alignY="top">
                            <Template>T/L</Template>
                        </PopTip>
                        <PopTip content="Top / Center" alignX="center" alignY="top">
                            <Template>T/C</Template>
                        </PopTip>
                        <PopTip content="Top / Right" alignX="right" alignY="top">
                            <Template>T/R</Template>
                        </PopTip>
                        <PopTip content="Bottom / Left" alignX="left" alignY="bottom">
                            <Template>B/L</Template>
                        </PopTip>
                        <PopTip content="Bottom / Center" alignX="center" alignY="bottom">
                            <Template>B/C</Template>
                        </PopTip>
                        <PopTip content="Bottom / Right" alignX="right" alignY="bottom">
                            <Template>B/R</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Stil", en: "Styling" }}
                description={{ tr: "bgColor prop'u PopTip arka plan rengini belirler. Theme rengi, theme path'i veya CSS rengi olabilir. color otomatik hesaplanır; color prop'u ile ezebilirsiniz.", en: "The bgColor prop sets the PopTip background. It can be a theme color, theme path, or CSS color. color is calculated automatically but can be overridden through color." }}
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="theme" bgColor="success">
                            <Template>theme</Template>
                        </PopTip>
                        <PopTip content="theme path" bgColor="foregrounds.tint50">
                            <Template>theme.path</Template>
                        </PopTip>
                        <PopTip content="css colors" bgColor="skyblue">
                            <Template>css colors</Template>
                        </PopTip>
                        <PopTip content="override color" bgColor="skyblue" color="#fff">
                            <Template>override color</Template>
                        </PopTip>
                        <PopTip content="disable arrow" disableArrow>
                            <Template>disable arrow</Template>
                        </PopTip>`}
                example={
                    <Flex gap={10}>
                        <PopTip content="theme" bgColor="success">
                            <Template>theme</Template>
                        </PopTip>
                        <PopTip content="theme path" bgColor="foregrounds.tint50">
                            <Template>theme.path</Template>
                        </PopTip>
                        <PopTip content="css colors" bgColor="skyblue">
                            <Template>css colors</Template>
                        </PopTip>
                        <PopTip content="override color" bgColor="skyblue" color="#fff">
                            <Template>override color</Template>
                        </PopTip>
                        <PopTip content="disable arrow" disableArrow>
                            <Template>disable arrow</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Escape ile Kapatma", en: "Enable Escaping" }}
                description={{ tr: "Esc tuşu, imleç hâlâ PopTip üzerindeyken bile PopTip'i kapatır.", en: "The Esc key closes the PopTip even when the pointer is still over it." }}
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="enable escaping" enableEscaping>
                            <Template>enable escaping</Template>
                        </PopTip>`}
                example={
                    <Flex gap={10}>
                        <PopTip content="enable escaping" enableEscaping>
                            <Template>enable escaping</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Maksimum Genişlik", en: "Max Width" }}
                description={{ tr: "Tip varsayılan olarak içeriğiyle birlikte büyür (viewport ile sınırlıdır). Uzun içeriği sınırlamak için maxWidth verin; sayılar rem'e dönüşür.", en: "By default the tip grows with its content (capped by the viewport). Pass maxWidth to constrain long content; numbers become rem." }}
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip
                            maxWidth={200}
                            content="Long copy wraps once the tip hits maxWidth instead of stretching with the content."
                        >
                            <Template>maxWidth 200</Template>
                        </PopTip>`}
                example={
                    <Flex gap={10}>
                        <PopTip
                            maxWidth={200}
                            content="Long copy wraps once the tip hits maxWidth instead of stretching with the content."
                        >
                            <Template>maxWidth 200</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.api
                args='<PopTip content="">{React.Node}</PopTip>'
                props={{
                    children: {
                        description: { tr: "Tetikleyici element.", en: "Trigger element." },
                        type: "ReactNode",
                        required: true,
                    },
                    content: {
                        description: { tr: "Kayan panel gövdesi.", en: "Floating panel body." },
                        type: "ReactNode",
                        required: true,
                    },
                    variant: {
                        description: { tr: "FloatingUi görsel varyantı.", en: "FloatingUi visual variant." },
                        type: "string | component",
                        defaultValue: '"default"',
                    },
                    alignX: {
                        description: { tr: "FloatingUi'a aktarılan yatay yerleşim.", en: "Horizontal placement passed to FloatingUi." },
                        type: "string",
                        defaultValue: '"center"',
                    },
                    alignY: {
                        description: { tr: "FloatingUi'a aktarılan dikey yerleşim (top | bottom).", en: "Vertical placement passed to FloatingUi (top | bottom)." },
                        type: "string",
                        defaultValue: '"top"',
                    },
                    disableArrow: {
                        description: { tr: "Kayan oku gizler.", en: "Hides the floating arrow." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    bgColor: {
                        description: { tr: "Kayan arka plan rengi veya theme token'ı.", en: "Floating background colour or theme token." },
                        type: "string",
                    },
                    color: {
                        description: { tr: "Kayan metin rengi ezmesi.", en: "Floating text colour override." },
                        type: "string",
                    },
                    padding: {
                        description: { tr: "FloatingUi padding kısaltması.", en: "FloatingUi padding shorthand." },
                        type: "number | string",
                    },
                    maxWidth: {
                        description: { tr: "Kayan panel max-width değeri. Sayı → rem; string → CSS (px/%/vw…). Varsayılan calc(100vw - 40rem) kalır.", en: "Floating panel max-width. Number → rem; string → CSS (px/%/vw…). The default remains calc(100vw - 40rem)." },
                        type: "number | string",
                    },
                    paddingTop: {
                        description: { tr: "Padding kısaltmasının üst kenarını ezer.", en: "Overrides the top edge of the padding shorthand." },
                        type: "number | string",
                    },
                    paddingRight: {
                        description: { tr: "Padding kısaltmasının sağ kenarını ezer.", en: "Overrides the right edge of the padding shorthand." },
                        type: "number | string",
                    },
                    paddingBottom: {
                        description: { tr: "Padding kısaltmasının alt kenarını ezer.", en: "Overrides the bottom edge of the padding shorthand." },
                        type: "number | string",
                    },
                    paddingLeft: {
                        description: { tr: "Padding kısaltmasının sol kenarını ezer.", en: "Overrides the left edge of the padding shorthand." },
                        type: "number | string",
                    },
                    enableEscaping: {
                        description: { tr: "true olduğunda Escape, imleç hâlâ üzerinde olsa bile tip'i kapatır (FloatingUi).", en: "When true, Escape closes the tip while the pointer may still be over it (FloatingUi)." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    open: {
                        description: { tr: "İsteğe bağlı kontrollü açık durumu (aksi halde hover ile yönetilen dahili durum).", en: "Optional controlled open state (otherwise hover-driven internal state)." },
                        type: "boolean",
                    },
                    closeHandler: {
                        description: { tr: "Kontrollü open kullanılırken isteğe bağlı close callback'i.", en: "Optional close callback when using controlled open." },
                        type: "fn",
                    },
                    onMouseEnter: {
                        description: { tr: "Tetikleyici mouse/pointer enter olayı; verilmezse PopTip varsayılan açılma davranışını kullanır.", en: "Trigger mouse/pointer enter; PopTip uses default open behaviour when omitted." },
                        type: "fn",
                    },
                    onMouseLeave: {
                        description: { tr: "Tetikleyici mouse/pointer leave olayı; verilmezse PopTip varsayılan kapanma davranışını kullanır.", en: "Trigger mouse/pointer leave; PopTip uses default close behaviour when omitted." },
                        type: "fn",
                    },
                    exportData: {
                        description: { tr: "Debug/export yardımcısı aktarımı.", en: "Debug/export helper passthrough." },
                        type: "boolean | function | object",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
