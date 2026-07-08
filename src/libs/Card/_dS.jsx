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
                en: "",
            }}
        >
            <Ds.block
                title={{ tr: "Amedist", en: "" }}
                description={{
                    tr: "thumb, title, subtitle, description ve cta alanları opsiyoneldir. to, href veya onClick verilirse tüm kart tıklanabilir olur. İçteki Button görsel aksiyon alanıdır ve kart hover olduğunda hoverManually ile anime edilir.",
                    en: "",
                }}
                code={`import { Card } from "${SYS.basePath}";

<Card
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
                args="<Card />"
                props={{
                    thumb: {
                        description: { tr: "String src veya React node olarak görsel alanı.", en: "" },
                        type: "string | ReactNode",
                    },
                    catalogSet: {
                        description: { tr: "Image catalog set adı. Thumb variantı seçilir.", en: "" },
                        type: "string",
                    },
                    title: {
                        description: { tr: "Kart başlığı.", en: "" },
                        type: "string | object",
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
                        description: { tr: "Kart aksiyon metni.", en: "" },
                        type: "string | object",
                    },
                    to: {
                        description: { tr: "Internal route.", en: "" },
                        type: "string",
                    },
                    href: {
                        description: { tr: "External veya direct URL.", en: "" },
                        type: "string",
                    },
                    onClick: {
                        description: { tr: "Kart tıklama callback'i.", en: "" },
                        type: "function",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
