import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => {
    return (
        <Ds.page
            title="<Slider>"
            releasedOn="1.0.0"
            description={{
                tr: "Slider varyant ailesinin giriş noktasıdır. Slider şu anda Slider.amedist ile aynı komponenti gösterir; bu yalnızca varsayılan varyant aliasıdır. Amedist'e ait prop ve davranışlar gelecekte eklenecek diğer Slider varyantları için sözleşme oluşturmaz. Üretim kodunda ihtiyaç duyulan tasarımı açıkça belirtmek için Slider.amedist kullanılması önerilir.",
                en: "Slider is the entry point for the slider variant family. Slider currently resolves to the same component as Slider.amedist; this is only a default-variant alias. Props and behavior documented for Amedist are not a contract for future Slider variants. Prefer Slider.amedist in production code when that specific design is required.",
            }}
        >
            <Ds.block
                title={{ tr: "Varyant Seçimi", en: "Choosing a variant" }}
                description={{
                    tr: "Slider kısa yazımı varsayılan varyantı kullanır ve varsayılan zamanla değişebilir. Belirli bir görsel dil veya feature setine bağımlı ekranlarda varyant adı açıkça kullanılmalıdır.",
                    en: "The Slider shorthand uses the default variant, which may change over time. Use an explicit variant name when a screen depends on a particular visual language or feature set.",
                }}
                code={`import { Slider } from "${SYS.basePath}";

<Slider.amedist slides={slides} />

// Shorthand for the current default variant:
<Slider slides={slides} />`}
            />
            <Ds.block
                title={{ tr: "Amedist — Temel Kullanım", en: "Amedist — Basic usage" }}
                description={{
                    tr: "Amedist tam viewport sunum, otomatik oynatma, bullet navigasyonu, görünürlük bazlı pause/resume ve sağ/sol klavye kontrolü sunar. Slider viewport dışındayken timer ve klavye kontrolü pasiftir.",
                    en: "Amedist provides a full-viewport presentation, autoplay, bullet navigation, visibility-based pause/resume, and left/right keyboard navigation. Its timer and keyboard controls are inactive while the slider is outside the viewport.",
                }}
                code={`const slides = [
    {
        title: { tr: "Birinci slayt", en: "First slide" },
        description: { tr: "Açıklama", en: "Description" },
        image: "/images/slide-1.webp",
        ctaText: { tr: "İncele", en: "Explore" },
        ctaHref: "/detail",
    },
    {
        title: { tr: "İkinci slayt", en: "Second slide" },
        image: "/images/slide-2.webp",
    },
];

<Slider.amedist slides={slides} slideDurationSec={6} />`}
            />
            <Ds.block
                title={{
                    tr: "Amedist — Ortak Slide Alanları",
                    en: "Amedist — Shared slide fields",
                }}
                description={{
                    tr: "slideCommons içindeki title, description, ctaText ve ctaHref her slide için fallback olur. Slide üzerinde verilen değer ortak değeri ezer. Bir slide kendi CTA alanlarından birini verirse CTA o slide'a özel kabul edilir.",
                    en: "title, description, ctaText, and ctaHref in slideCommons act as fallbacks for every slide. A value on an individual slide overrides the shared value. If a slide defines either CTA field, its CTA is treated as slide-specific.",
                }}
                code={`<Slider.amedist
    slides={slides}
    slideCommons={{
        ctaText: { tr: "Detay", en: "Details" },
        ctaHref: "/discover",
    }}
/>`}
            />
            <Ds.block
                title={{ tr: "Amedist — Görsel Katmanları", en: "Amedist — Image layers" }}
                description={{
                    tr: "image tek URL veya katman dizisi olabilir. Katmanlarda src/im/file, from, floatFrom, scale, fade, candle ve bringToFront kullanılabilir. from; left, right, opposite, center veya default kabul eder. floatFrom; left, right, top veya bottom yönünden girip karşı yönden çıkan kesintisiz bir hareket üretir ve normal item giriş animasyonunu devre dışı bırakır. Yatay harekette görsel slider yüksekliğine, dikey harekette slider genişliğine oturtulur; diğer eksen görselin kendi oranından hesaplanır. Bu nedenle aynı sürede daha uzun mesafe katetmesi gereken geniş veya yüksek görsel doğal olarak daha hızlı hareket eder. Ham dosya çözünürlüğü değil, ekranda render edilen ölçü belirleyicidir. Hareket varsayılan olarak slideDurationSec boyunca sürer; yalnızca image item'ın kendi itemDurationSec değeri varsa onu kullanır. candle, görsel opacity'sini verilen değer ile 1 arasında, her yönde ayrı üretilen rastgele 150–500 ms geçişlerle titreştirir. bringToFront katmanı içerik panelinin önündeki ayrı katmana taşır.",
                    en: "image may be a single URL or an array of layers. Layers support src/im/file, from, floatFrom, scale, fade, candle, and bringToFront. from accepts left, right, opposite, center, or default. floatFrom creates continuous motion entering from left, right, top, or bottom and exiting through the opposite edge, while disabling the normal item entrance animation. Horizontal motion fits the image to the slider height, while vertical motion fits it to the slider width; the other axis follows the image's own aspect ratio. A wider or taller image therefore moves faster when it must cover a longer distance in the same duration. Rendered dimensions, not raw file resolution, determine that distance. The motion lasts for slideDurationSec by default and uses itemDurationSec only when it is defined directly on that image item. candle flickers image opacity between the supplied value and 1, using independently randomized 150–500 ms transitions in each direction. bringToFront moves that layer into the separate layer above the content panel.",
                }}
                code={`<Slider.amedist
    slides={[
        {
            title: "Layered slide",
            image: [
                { src: background, from: "right" },
                { src: cloud, floatFrom: "left" },
                { src: foreground, from: "center", scale: true, candle: 0.8, bringToFront: true },
            ],
        },
    ]}
/>`}
            />
            <Ds.block
                title={{ tr: "Amedist — Zamanlama", en: "Amedist — Timing" }}
                description={{
                    tr: "slideDurationSec slide'ın toplam süresidir ve minimum 2 saniyedir. itemDurationSec her görsel katmanının timeline'daki süresini, itemAnimationSec fade/scale/transform hızını, itemCrossFadeSec ise ardışık item'ların birbirine ne kadar bindirileceğini belirler. Item değerleri root, slide veya image katmanında verilebilir; en yakın değer önceliklidir. itemAnimationSec varsayılan 0.5 saniyedir ve itemDurationSec'i aşamaz. Item süreleri toplamı slideDurationSec'i aşarsa süreler oransal olarak slide'a sığdırılır.",
                    en: "slideDurationSec is the total slide duration and is clamped to at least two seconds. itemDurationSec controls each image layer's timeline duration, itemAnimationSec controls fade/scale/transform speed, and itemCrossFadeSec controls overlap between consecutive items. Item values may be supplied at root, slide, or image-layer level, with the nearest value taking precedence. itemAnimationSec defaults to 0.5 seconds and cannot exceed itemDurationSec. If item durations exceed slideDurationSec in total, they are proportionally fitted into the slide.",
                }}
                code={`<Slider.amedist
    slideDurationSec={7}
    itemDurationSec={1}
    itemAnimationSec={0.5}
    itemCrossFadeSec={0.4}
    slides={slides}
/>`}
            />
            <Ds.api
                args="<Slider.amedist />"
                props={{
                    slides: {
                        description: {
                            tr: "Amedist slide objeleri. Falsy kayıtlar elenir.",
                            en: "Amedist slide objects. Falsy entries are removed.",
                        },
                        type: "array",
                        defaultValue: "[]",
                    },
                    slideCommons: {
                        description: {
                            tr: "Slide metinleri ve CTA için ortak fallback alanları.",
                            en: "Shared fallback fields for slide copy and CTA.",
                        },
                        type: "object",
                        defaultValue: "{}",
                    },
                    slideDurationSec: {
                        description: {
                            tr: "Otomatik geçiş süresi; slide seviyesinde ezilebilir. Minimum 2.",
                            en: "Autoplay duration; may be overridden per slide. Minimum 2.",
                        },
                        type: "number",
                        defaultValue: "2",
                    },
                    itemDurationSec: {
                        description: {
                            tr: "Her görsel item'ın timeline'daki süresi. Toplam süre slide'a sığdırılır.",
                            en: "Timeline duration of each image item. Total duration is fitted into the slide.",
                        },
                        type: "number",
                    },
                    itemAnimationSec: {
                        description: {
                            tr: "Fade, scale ve transform animasyon süresi. Item süresini aşamaz.",
                            en: "Fade, scale, and transform animation duration. Cannot exceed item duration.",
                        },
                        type: "number",
                        defaultValue: "0.5",
                    },
                    itemCrossFadeSec: {
                        description: {
                            tr: "Ardışık item'lar arasındaki overlap süresi.",
                            en: "Overlap duration between consecutive items.",
                        },
                        type: "number",
                    },
                    bottomMargin: {
                        description: {
                            tr: "Alt içerik panelinin rem tabanlı bottom margin değeri.",
                            en: "Rem-based bottom margin for the lower content panel.",
                        },
                        type: "number",
                        defaultValue: "40",
                    },
                    layoutControllerId: {
                        description: {
                            tr: "Menu pause ve header appearance entegrasyonu için hedef Layout.headerAmedist controller kimliği.",
                            en: "Target Layout.headerAmedist controller identity for menu pause and header appearance integration.",
                        },
                        type: "string",
                        defaultValue: "default",
                    },
                }}
            />
            <Ds.api
                args="Amedist slide"
                props={{
                    image: {
                        description: {
                            tr: "Tek görsel veya Amedist görsel katmanları dizisi.",
                            en: "A single image or an array of Amedist image layers.",
                        },
                        type: "string | object | array",
                    },
                    title: {
                        description: {
                            tr: "Lokalize edilebilir slide başlığı.",
                            en: "Localizable slide title.",
                        },
                        type: "string | object",
                    },
                    description: {
                        description: {
                            tr: "Lokalize edilebilir açıklama.",
                            en: "Localizable description.",
                        },
                        type: "string | object",
                    },
                    ctaText: {
                        description: { tr: "CTA etiketi.", en: "CTA label." },
                        type: "string | object",
                    },
                    ctaHref: {
                        description: {
                            tr: "CTA hedefi; yoksa CTA render edilmez.",
                            en: "CTA destination; no CTA is rendered when absent.",
                        },
                        type: "string | object",
                    },
                    color: {
                        description: {
                            tr: "Slide metni ve CTA renk değeri.",
                            en: "Color value for slide copy and CTA.",
                        },
                        type: "string",
                    },
                    headerBackgroundAlpha: {
                        description: {
                            tr: "Slide aktifken bağlı headerAmedist controller'a yayınlanan header arka plan alpha değeri.",
                            en: "Header background alpha published to the connected headerAmedist controller while the slide is active.",
                        },
                        type: "number",
                    },
                    headerColor: {
                        description: {
                            tr: "Slide aktifken bağlı headerAmedist controller'a yayınlanan theme renk yolu veya renk değeri.",
                            en: "Theme color path or color value published to the connected headerAmedist controller while the slide is active.",
                        },
                        type: "string",
                    },
                    slideDurationSec: {
                        description: {
                            tr: "Bu slide'a özel otomatik geçiş süresi.",
                            en: "Autoplay duration for this slide.",
                        },
                        type: "number",
                    },
                    itemDurationSec: {
                        description: {
                            tr: "Bu slide veya image item'a özel gösterim süresi.",
                            en: "Display duration for this slide or image item.",
                        },
                        type: "number",
                    },
                    itemAnimationSec: {
                        description: {
                            tr: "Bu slide veya image item'a özel animasyon süresi.",
                            en: "Animation duration for this slide or image item.",
                        },
                        type: "number",
                    },
                    itemCrossFadeSec: {
                        description: {
                            tr: "Bu slide veya image item'a özel overlap süresi.",
                            en: "Overlap duration for this slide or image item.",
                        },
                        type: "number",
                    },
                    candle: {
                        description: {
                            tr: "Image item opacity'sinin bu değer ile 1 arasında rastgele 150–500 ms sürelerle yanıp sönmesini sağlar. 0–1 aralığına sınırlandırılır; verilmezse kapalıdır.",
                            en: "Flickers an image item's opacity between this value and 1 with random 150–500 ms transitions. Clamped to 0–1; disabled when omitted.",
                        },
                        type: "number",
                    },
                    floatFrom: {
                        description: {
                            tr: "Image item'ı belirtilen sınırdan tamamen dışarıda başlatır ve karşı sınırdan tamamen çıkarır. left, right, top veya bottom kabul eder. Mesafe item'ın render edilen ölçüsüne göre hesaplandığı için aynı sürede daha geniş veya yüksek item daha hızlı hareket eder. Normal giriş animasyonunu kapatır. Süre, item üzerinde doğrudan itemDurationSec verilmedikçe slideDurationSec'tir.",
                            en: "Starts the image item fully outside the specified edge and moves it fully beyond the opposite edge. Accepts left, right, top, or bottom. Travel distance uses the item's rendered dimensions, so a wider or taller item moves faster over the same duration. Disables the normal entrance animation. Duration is slideDurationSec unless itemDurationSec is defined directly on the item.",
                        },
                        type: '"left" | "right" | "top" | "bottom"',
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
