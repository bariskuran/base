import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Card } from ".";
import sampleSrc from "../Image/assets/sample-landscape.svg";

const X = () => {
    return (
        <Ds.page
            title="<Card>"
            releasedOn="1.0.0"
            description={{
                tr: "Card, base içindeki tıklanabilir içerik kartı katmanıdır. İlk varyant Amedist olarak hazırlanmıştır. Kart genişliği her zaman bulunduğu alanın %100'ünü alır; genişlik kararını CardViewer veya parent layout verir.",
                en: "Card is the clickable content-card layer in base. Its first variant is Amedist. A card always fills the width supplied by its parent; CardViewer or the parent layout owns sizing.",
            }}
        >
            <Ds.block
                title={{ tr: "Varyant Sözleşmesi", en: "Variant contract" }}
                description={{
                    tr: "Card şu anda Card.amedist aliasıdır. Base katmanı görsel kaynağı, lokalize metinleri, tıklama/klavye davranışını ve disabled durumunu normalize eder. Yerleşim, tipografi ve CTA görünümü varyanta aittir; yeni bir Card varyantının Amedist görünümünü veya tüm alanlarını desteklemesi zorunlu değildir. Belirli tasarıma bağımlı kullanımda Card.amedist yazın.",
                    en: "Card currently aliases Card.amedist. The base layer normalizes image sources, localized copy, click/keyboard behavior, and the disabled state. Layout, typography, and CTA presentation belong to the variant; a future Card variant does not have to reproduce Amedist's presentation or every field. Use Card.amedist when the design specifically depends on Amedist.",
                }}
                code={`<Card.amedist {...cardProps} />

// Current default-variant shorthand:
<Card {...cardProps} />`}
            />
            <Ds.block
                title={{ tr: "Amedist", en: "Amedist" }}
                description={{
                    tr: "thumb, supTitle, title, subtitle ve description alanları opsiyoneldir. supTitle title üstünde gösterilir ve title-case uygulanır (TR locale). supTitleIcon ile ikon eklenebilir. ctaLabel verilmezse lokalize İncele/View etiketi kullanılır; disabled kartta CTA gizlenir. to verilen kart React Router Link, href veya dış URL verilen kart anchor olarak render edilir; yalnızca onClick verilen kart button semantiğini kullanır. CTA yalnızca görsel bir işarettir.",
                    en: "thumb, supTitle, title, subtitle, and description are optional. supTitle renders above title with title-case formatting. Use supTitleIcon for an optional icon. ctaLabel defaults to the localized View label; the CTA is hidden for a disabled card. A card with to renders as a React Router Link, while href or an external URL renders as an anchor; button semantics are reserved for onClick-only cards. The CTA is visual only.",
                }}
                code={`import { Card } from "${SYS.basePath}";

<Card.amedist
    thumb={thumbUrl}
    title="Lorem ipsum dolor sit amet consectetur adipiscing elit."
    description="Lorem ipsum dolor sit amet consectetur adipiscing elit."
    ctaLabel="İncele"
    to="/detail"
/>`}
                example={
                    <div style={{ width: 300 }}>
                        <Card
                            thumb={sampleSrc}
                            title="Lorem ipsum dolor sit amet consectetur adipiscing elit."
                            description="Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat."
                            ctaLabel=""
                            to="/design-system/card"
                        />
                    </div>
                }
            />
            <Ds.block
                title={{ tr: "Catalog Thumb", en: "" }}
                description={{
                    tr: "catalogSet verildiğinde Card, Image komponentini thumb variantı ile kullanır. Katalogda thumb yoksa Image normal seçim akışına geri döner.",
                    en: "",
                }}
                code={`<Card
    catalogSet="i0030"
    title="Diyarbakır"
    description="Katalogdan gelen thumb ile kart."
/>`}
            />
            <Ds.api
                args="Card base props"
                props={{
                    thumb: {
                        description: {
                            tr: "String src veya React node olarak görsel alanı.",
                            en: "",
                        },
                        type: "string | ReactNode",
                    },
                    catalogSet: {
                        description: {
                            tr: "Image catalog set adı. Thumb variantı seçilir.",
                            en: "",
                        },
                        type: "string",
                    },
                    src: {
                        description: {
                            tr: "Image komponentine aktarılan tekil görsel URL'i.",
                            en: "Single image URL forwarded to Image.",
                        },
                        type: "string",
                    },
                    externalSet: {
                        description: {
                            tr: "Image komponentine aktarılan harici görsel seti.",
                            en: "External image set forwarded to Image.",
                        },
                        type: "object | array",
                    },
                    thumbAlt: {
                        description: {
                            tr: "Kart görselinin alt metni.",
                            en: "Alt text for the card image.",
                        },
                        type: "string | object",
                    },
                    title: {
                        description: { tr: "Kart başlığı.", en: "" },
                        type: "string | object",
                    },
                    supTitle: {
                        description: {
                            tr: "Title üstündeki üst başlık. String değerler title-case uygulanır (ör. TARİHİ MİRAS → Tarihi Miras).",
                            en: "Overline above title. String values are title-cased (e.g. HISTORICAL HERITAGE → Historical Heritage).",
                        },
                        type: "string | object | ReactNode",
                    },
                    supTitleIcon: {
                        description: {
                            tr: "supTitle yanında gösterilecek Icon adı.",
                            en: "Icon name rendered beside supTitle.",
                        },
                        type: "string",
                    },
                    subtitle: {
                        description: { tr: "Kart alt başlığı.", en: "" },
                        type: "string | object",
                    },
                    description: {
                        description: { tr: "Kart açıklaması.", en: "" },
                        type: "string | object",
                    },
                    ctaLabel: {
                        description: {
                            tr: "Kart aksiyon metni; varsayılan İncele/View.",
                            en: "Card action copy; defaults to View.",
                        },
                        type: "string | object",
                    },
                    to: {
                        description: { tr: "Internal route.", en: "" },
                        type: "string",
                    },
                    state: {
                        description: {
                            tr: "React Router Link state. Örn. { fromCategory: \"tarihi-miras\" }.",
                            en: "React Router Link state. e.g. { fromCategory: \"tarihi-miras\" }.",
                        },
                        type: "object",
                    },
                    href: {
                        description: { tr: "External veya direct URL.", en: "" },
                        type: "string",
                    },
                    onClick: {
                        description: { tr: "Kart tıklama callback'i.", en: "" },
                        type: "function",
                    },
                    target: {
                        description: {
                            tr: "href/to hedef davranışı; _blank güvenli window.open kullanır.",
                            en: "Destination target; _blank uses a safe window.open call.",
                        },
                        type: "string",
                    },
                    disabled: {
                        description: {
                            tr: "Tıklama ve klavye aktivasyonunu kapatır.",
                            en: "Disables click and keyboard activation.",
                        },
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
