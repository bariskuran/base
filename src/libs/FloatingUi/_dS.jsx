import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from "../baseStore";
import { Flex } from "../Flex";
import { ScrollFlex } from "../ScrollFlex";
import { Dropdown } from "../Dropdown";
import { PopTip } from "../PopTip";
import { PopOver } from "../PopOver";
import { notifier } from "../notifier";

const alignXOptions = [
    { label: "left", value: "left" },
    { label: "center", value: "center" },
    { label: "right", value: "right" },
];

const alignYOptions = [
    { label: "top", value: "top" },
    { label: "bottom", value: "bottom" },
];

const Template = ({ children }) => (
    <Flex padding={10} bgColor="foregrounds.tint80" color="foreground">
        {children}
    </Flex>
);

const X = () => {
    const { selectedAlignX, selectedAlignY, set } = baseStore.useLocal({
        selectedAlignX: "center",
        selectedAlignY: "top",
    });

    /* Return */
    return (
        <Ds.page
            title="<FloatingUi>"
            releasedOn="1.0.0"
            description={{
                tr: "FloatingUi, bir tetikleyici elemana göre konumlanan kayan içeriği; konum ve stil denetimiyle render eder. Açık/kapalı durumu dışarıdan yönetilir; başka bir deyişle bir base componentidir. PopOver, PopTip ve PopConfirm'in ana özelliklerini FloatingUi sağlar.",
                en: "FloatingUi renders floating content relative to a trigger element, with controllable position and style. Its open state is controlled externally; in other words, it is a base component. FloatingUi provides the main features used by PopOver, PopTip, and PopConfirm.",
            }}
        >
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
                code={`import { FloatingUi } from "${SYS.basePath}";

                        <FloatingUi
                            content="Default floating content"
                            open={isOpen}
                            closeHandler={closeHandler}
                        >
                                content
                        </FloatingUi>`}
                example={<PopOver content="Default floating content">content</PopOver>}
            />
            <Ds.block
                title={{ tr: "Otomatik Konumlandırma", en: "Auto Positioning" }}
                description={{ tr: "Otomatik konumlandırmayı görmek için PopOver'ı açın ve ScrollFlex alanını sürükleyin. PopOver viewport dışına çıktığında otomatik olarak kapanır.", en: "Open the PopOver and drag the ScrollFlex area to see auto positioning in action. The PopOver also auto-closes when it goes outside the viewport." }}
                example={
                    <ScrollFlex width={300} height={300} padding={0} enableDragging>
                        <Flex.column
                            width={600}
                            height={800}
                            bgColor="lightgrey"
                            padding={20}
                            xAlign="center"
                            yAlign="center"
                            gap={10}
                        >
                            <PopOver disableAutoClose>content</PopOver>
                        </Flex.column>
                    </ScrollFlex>
                }
            />
            <Ds.block
                title={{ tr: "Manuel Konumlandırma", en: "Manual Positioning" }}
                description={{ tr: "position seçeneği varsayılan olarak auto değerindedir; yerleşimi elemanın ekrandaki konumuna ve kayan içeriğe göre belirler. İsterseniz konumu kendiniz ezebilirsiniz.", en: "The position option defaults to auto, which determines placement from the element's position on screen and the floating content. You can override it when needed." }}
                example={
                    <Flex gap={10}>
                        <Flex gap={20} alignItems="center">
                            alignX
                            <Dropdown
                                options={alignXOptions}
                                value={selectedAlignX}
                                onChange={(value) => {
                                    set((s) => {
                                        s.selectedAlignX = value;
                                    });
                                }}
                            />
                            alignY
                            <Dropdown
                                options={alignYOptions}
                                value={selectedAlignY}
                                onChange={(value) => {
                                    set((s) => {
                                        s.selectedAlignY = value;
                                    });
                                }}
                            />
                        </Flex>
                        <PopOver alignX={selectedAlignX} alignY={selectedAlignY} disableAutoClose>
                            Manual Positioning
                        </PopOver>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Stil", en: "Styling" }}
                description={{ tr: "bgColor prop'u PopTip arka plan rengini belirler. Theme rengi, theme path'i veya CSS rengi olabilir. color otomatik hesaplanır; color prop'u ile ezebilirsiniz.", en: "The bgColor prop sets the PopTip background. It can be a theme color, theme path, or CSS color. color is calculated automatically, but can be overridden through the color prop." }}
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
                example={
                    <Flex gap={10}>
                        <PopTip content="enable escaping" enableEscaping>
                            <Template>enable escaping</Template>
                        </PopTip>
                        <PopOver enableEscaping>enableEscaping</PopOver>
                        <PopOver>default behaviour = autoClose and escaping is disabled</PopOver>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Birden Fazla FloatingUi Örneği", en: "Multiple FloatingUi Instances" }}
                description={{ tr: "Varsayılan olarak aynı anda yalnızca bir FloatingUi örneği açık olabilir. disableMultipleBlock prop'unu true yaparak bu davranışı değiştirebilirsiniz.", en: "By default, only one FloatingUi instance can be open at a time. Set disableMultipleBlock to true to change this behaviour." }}
                example={
                    <Flex gap={10}>
                        <PopOver content="content1">disableMultipleBlock false1</PopOver>
                        <PopOver content="content2">disableMultipleBlock false2</PopOver>
                        <PopOver content="content3" disableMultipleBlock>
                            disableMultipleBlock true1
                        </PopOver>
                        <PopOver content="content4" disableMultipleBlock>
                            disableMultipleBlock true2
                        </PopOver>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Handler'lar", en: "Handlers" }}
                description={{ tr: "FloatingUi elementi için fare handler'ları.", en: "Mouse handlers for the FloatingUi element." }}
                example={
                    <Flex gap={10}>
                        <PopOver content="onClick" onClick={() => notifier.add("onClick")}>
                            onClick
                        </PopOver>
                        <PopOver
                            content="onMouseEnter"
                            onMouseEnter={() => notifier.add("onMouseEnter")}
                        >
                            onMouseEnter
                        </PopOver>
                        <PopOver
                            content="onMouseLeave"
                            onMouseLeave={() => notifier.add("onMouseLeave")}
                        >
                            onMouseLeave
                        </PopOver>
                    </Flex>
                }
            />
            <Ds.api
                args="<FloatingUi open={false}>{null}</FloatingUi>"
                props={{
                    variant: {
                        description: { tr: "Varyant adı veya özel stillendirilmiş varyant.", en: "Variant name or custom styled variant." },
                        type: "string | component",
                        defaultValue: '"default"',
                    },
                    children: {
                        description: { tr: "Yerinde render edilen tetikleyici element.", en: "Trigger element rendered in place." },
                        type: "ReactNode",
                        required: true,
                    },
                    content: {
                        description: { tr: "Kayan panel içeriği.", en: "Floating panel content." },
                        type: "ReactNode",
                        required: true,
                    },
                    open: {
                        description: { tr: "Kontrollü açık/kapalı durumu.", en: "Controlled open/close state." },
                        type: "boolean",
                        defaultValue: "false",
                        required: true,
                    },
                    closeHandler: {
                        description: {
                            tr: "Kayan katmanı kapatmak için çağrılır. Normal çağrılar animasyonlu kapanış yolunu kullanır; `{ instant: true }` geçişi atlar (özel alan devralma, observer çıkışı, dismissWithoutAnimationRef). Parent open değerini false yapmalıdır.",
                            en: "Called to close the floating layer. Plain calls use the animated closing path; `{ instant: true }` skips the transition (exclusive takeover, observer exit, dismissWithoutAnimationRef). The parent must set open to false.",
                        },
                        type: "fn",
                        required: true,
                    },
                    padding: {
                        description: {
                            tr: "Padding kısaltması; sayılar rem'e dönüşür, string değerler aynen geçer (Flex ile aynı kurallar). paddingTop/Right/Bottom/Left ile birleşir.",
                            en: "Padding shorthand; numbers become rem and strings pass through (the same rules as Flex). Combines with paddingTop/Right/Bottom/Left.",
                        },
                        type: "number | string",
                        defaultValue: "10",
                    },
                    maxWidth: {
                        description: {
                            tr: "Kayan panelin max-width değeri. Sayı → rem; string → CSS (px/%/vw…). Varsayılan calc(100vw - 40rem) olarak kalır.",
                            en: "Floating panel max-width. Number → rem; string → CSS (px/%/vw…). The default remains calc(100vw - 40rem).",
                        },
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
                    alignX: {
                        description: { tr: "Yatay yerleşim ipucu: left | center | right (start/end değerleri layout içinde left/right olarak normalize edilir).", en: "Horizontal placement hint: left | center | right (start/end are normalized to left/right in layout)." },
                        type: "string",
                        defaultValue: '"center"',
                    },
                    alignY: {
                        description: { tr: "Dikey yerleşim: top | bottom.", en: "Vertical placement: top | bottom." },
                        type: "string",
                        defaultValue: '"top"',
                    },
                    disableArrow: {
                        description: { tr: "Oku gizler.", en: "Hides the arrow." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    bgColor: {
                        description: { tr: "Özel kayan arka plan rengi/token'ı.", en: "Custom floating background color/token." },
                        type: "string",
                        defaultValue: "theme.background",
                    },
                    color: {
                        description: { tr: "Otomatik hesaplanan metin rengini ezer.", en: "Overrides the automatically calculated text color." },
                        type: "string",
                        defaultValue: "auto",
                    },
                    disableMultipleBlock: {
                        description: {
                            tr: "false olduğunda (varsayılan), global bir popOver id'si yalnızca tek özel örneğin görsel olarak açık kalmasına izin verir; başka bir örneği açmak alanı devralır. true olduğunda birden fazla örnek açık kalabilir; popOverTriggerMarker ile birlikteyken dış pointerdown hedef başka işaretli bir tetikleyiciyse kapanma atlanır.",
                            en: "When false (the default), a global popOver id lets only one exclusive instance remain visually open; opening another takes the slot. When true, multiple instances may stay open; combined with popOverTriggerMarker, outside pointerdown skips closing when the target is another marked trigger.",
                        },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    enableEscaping: {
                        description: { tr: "true olduğunda yalnızca document Escape listener'ı kaydeder (bu flag dış pointer listener'ı eklemez). Varsayılan false'dur.", en: "When true, registers only a document Escape listener (this flag adds no outside pointer listener). Default is false." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    onMouseEnter: {
                        description: { tr: "Kayan paneldeki (varyant kökü) mouse/pointer enter olayı.", en: "Mouse/pointer enter on the floating panel (variant root)." },
                        type: "fn",
                    },
                    onMouseLeave: {
                        description: { tr: "Kayan paneldeki (varyant kökü) mouse/pointer leave olayı.", en: "Mouse/pointer leave on the floating panel (variant root)." },
                        type: "fn",
                    },
                    onClick: {
                        description: { tr: "Kayan paneldeki (varyant kökü) click handler'ı.", en: "Click handler on the floating panel (variant root)." },
                        type: "fn",
                    },
                    exportData: {
                        description: { tr: "Debug/export yardımcısı aktarımı.", en: "Debug/export helper passthrough." },
                        type: "boolean | object",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
