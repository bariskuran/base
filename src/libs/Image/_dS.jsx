import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { t } from "../getText";
import { Image } from ".";
import sampleSrc from "./assets/sample-landscape.svg";

const externalSet = {
    thumb: {
        src: sampleSrc,
        naturalWidth: 320,
        naturalHeight: 180,
    },
    desktop: {
        src: sampleSrc,
        naturalWidth: 1280,
        naturalHeight: 720,
    },
};

const X = () => {
    return (
        <Ds.page
            title="<Image>"
            releasedOn="1.0.0"
            description={
                <>
                    <Typo.p>
                        {t({
                            tr: "Image, base içindeki görsel render katmanıdır. Tek bir src ile geleneksel img gibi çalışabilir; externalSet ile metadata verilmiş dış görsel setlerini yönetebilir; catalogSet ile createImageCatalog tarafından globalData'ya yazılan kataloglanmış setleri okuyabilir.",
                            en: "",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "Responsive ve progressive seçimler, yalnızca set içinde doğal ölçü bilgisi varsa aktiftir. Kataloglanan görsellerde bu metadata otomatik üretilir. Dışarıdan gelen setlerde naturalWidth/naturalHeight veya dimensionWidth/dimensionHeight verilirse Image container genişliğine ve device pixel ratio değerine göre uygun dosyayı seçer.",
                            en: "",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "catalogSet akışı için önce createImageCatalog runtime kurulumu yapılmalıdır. Katalog datasına component dışında erişmek istediğinizde useCatalogImage hooku kullanılır.",
                            en: "",
                        })}
                    </Typo.p>
                    <Flex gap={8} wrap marginTop={14}>
                        <Button.string
                            to="/design-system/createImageCatalog"
                            label="createImageCatalog"
                        />
                        <Button.string
                            to="/design-system/useCatalogImage"
                            label="useCatalogImage"
                        />
                    </Flex>
                </>
            }
        >
            <Ds.block
                title={{ tr: "Standart Görsel", en: "" }}
                description={{
                    tr: "src verildiğinde Image doğrudan img gibi davranır. Bu kullanımda responsive ve progressive seçim yapılmaz.",
                    en: "",
                }}
                code={`import { Image } from "${SYS.basePath}";

<Image
    src="/images/example.webp"
    alt="Görsel açıklaması"
/>`}
                example={<Image src={sampleSrc} alt="Örnek görsel" w={280} />}
            />
            <Ds.block
                title={{ tr: "External Set", en: "" }}
                description={{
                    tr: "externalSet dış kaynaklardan veya BE'den gelen görseller içindir. Set içindeki entry'lerde doğal ölçü metadata'sı varsa responsive ve progressive seçim çalışır. Sadece string array verilirse Image boyutları bilemeyeceği için ilk geçerli görseli kullanır.",
                    en: "",
                }}
                code={`const externalSet = {
    thumb: {
        src: thumbUrl,
        naturalWidth: 320,
        naturalHeight: 180,
    },
    desktop: {
        src: desktopUrl,
        naturalWidth: 1280,
        naturalHeight: 720,
    },
};

<Image externalSet={externalSet} alt="Dış kaynak görseli" />`}
                example={<Image externalSet={externalSet} alt="External set örneği" w={280} />}
            />
            <Ds.block
                title={{ tr: "Catalog Set", en: "" }}
                description={{
                    tr: "catalogSet, createImageCatalog ile baseStore.globalData.__imageCatalog içine yazılmış set adını alır. alt prop verilmezse katalogdaki alt alanı kullanılmaya çalışılır. Katalog kurulum adımları için createImageCatalog sayfasına bakın.",
                    en: "",
                }}
                code={`<Image catalogSet="i0030" />`}
            />
            <Ds.block
                title={{ tr: "Variant Kullanımı", en: "" }}
                description={{
                    tr: "variant verildiğinde Image ilgili key'i doğrudan kullanır. Variant bulunamazsa normal seçim akışına geri döner. Bu kullanım, belirli tasarım alanlarında thumb, phone veya desktop gibi sabit dosya adlarını bilinçli seçmek için uygundur.",
                    en: "",
                }}
                code={`<Image
    catalogSet="i0030"
    variant="thumb"
/>`}
            />
            <Ds.block
                title={{ tr: "Viewport Yükleme ve Loading Animation", en: "" }}
                description={{
                    tr: "loadInViewport true olduğunda görsel viewport'a girene kadar src img üzerine basılmaz. loadingAnimation, görsel yüklenene kadar gösterilen animasyonu yönetir. Görsel yüklendikten sonra animasyon durur. none veya false verilirse animasyon kapatılır.",
                    en: "",
                }}
                code={`<Image
    catalogSet="i0030"
    loadInViewport
    loadingAnimation="pulse"
/>`}
            />
            <Ds.api
                args="<Image src externalSet catalogSet />"
                props={{
                    src: {
                        description: {
                            tr: "Tek görsel URL'i. Verildiğinde responsive/progressive seçim yapılmaz.",
                            en: "",
                        },
                        type: "string",
                    },
                    externalSet: {
                        description: {
                            tr: "Katalog dışından gelen image set. Metadata varsa responsive/progressive seçim yapılabilir.",
                            en: "",
                        },
                        type: "object | array",
                    },
                    catalogSet: {
                        description: {
                            tr: "createImageCatalog ile kaydedilmiş set adı.",
                            en: "",
                        },
                        type: "string",
                    },
                    variant: {
                        description: {
                            tr: "Set içindeki belirli key'i doğrudan seçer.",
                            en: "",
                        },
                        type: "string",
                    },
                    responsive: {
                        description: {
                            tr: "Metadata varsa container genişliğine göre en uygun görseli seçer.",
                            en: "",
                        },
                        type: "boolean",
                        defaultValue: "true",
                    },
                    progressive: {
                        description: {
                            tr: "Final görsel yüklenmeden önce en küçük uygun preview'i kullanır.",
                            en: "",
                        },
                        type: "boolean",
                        defaultValue: "true",
                    },
                    loadInViewport: {
                        description: {
                            tr: "Görseli yalnızca viewport'a girdikten sonra yükler.",
                            en: "",
                        },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    loadingAnimation: {
                        description: {
                            tr: "Görsel yüklenene kadar gösterilecek animasyon.",
                            en: "",
                        },
                        type: '"pulse" | "none" | false',
                        defaultValue: '"pulse"',
                    },
                    w: {
                        description: {
                            tr: "width aliası.",
                            en: "",
                        },
                        type: "number | string",
                    },
                    h: {
                        description: {
                            tr: "height aliası.",
                            en: "",
                        },
                        type: "number | string",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
