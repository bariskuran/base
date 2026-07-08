import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Typo } from "../Typo";
import { t } from "../getText";
import { Button } from "../Button";
import { Flex } from "../Flex";

const X = () => {
    return (
        <Ds.page
            title="createImageCatalog"
            releasedOn="1.0.0"
            description={
                <>
                    <Typo.p>
                        {t({
                            tr: "createImageCatalog, FE tarafında yüksek sayıda görsel taşıyan projeler için hazırlanmış image kataloglama altyapısıdır. Bu sayfadaki ilk adım, src/imageCatalog ve public/imageCatalog altındaki görsel klasörlerini standart bir index formatına getirir ve her görsel dosyası için teknik metadata üretir.",
                            en: "",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "Amaç; site genelinde aynı image variant isimlerini kullanabilmek, responsive image seçimini daha güvenilir hale getirmek, progressive image akışında küçük dosyadan büyük dosyaya kontrollü geçebilmek ve tüm bunları component kullanımında tekrar tekrar manuel tanımlamadan yönetebilmektir.",
                            en: "",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "Bu indexleme adımı tek başına görsel render etmez. Üretilen imageSet verileri sonraki adımlarda createImageCatalog runtime kurulumu, Image komponentinin catalogSet kullanımı ve useCatalogImage hooku ile birlikte kullanılacaktır.",
                            en: "",
                        })}
                    </Typo.p>
                    <Flex gap={8} wrap marginTop={14}>
                        <Button.string to="/design-system/image" label="<Image>" />
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
                title={{ tr: "Ne Üretir?", en: "" }}
                description={{
                    tr: "Komut, src/imageCatalog ve public/imageCatalog altındaki her görsel klasörünü okur. src altındaki dosyalar için import üretir; public altındaki dosyalar için URL path üretir. imageSet altında key, src, naturalWidth, naturalHeight, type, sizeBytes, sizeKBytes, sizeMBytes ve shape bilgilerini yazar. Mevcut kullanıcı datasını korur; description alanını alt alanına taşır; eski orientation bilgisini temizler.",
                    en: "",
                }}
            />
            <Ds.block
                title={{ tr: "Runtime Kurulumu", en: "" }}
                description={{
                    tr: "Index dosyaları üretildikten sonra katalog datasının uygulama başlangıcında baseStore.globalData.__imageCatalog altına yazılması gerekir. Image componentinin catalogSet kullanımı ve useCatalogImage hooku bu runtime katalog üzerinden çalışır.",
                    en: "",
                }}
                code={`import imageCatalog from "./imageCatalog";
import { createImageCatalog } from "${SYS.basePath}";

createImageCatalog(imageCatalog);`}
            />
            <Ds.block
                title={{ tr: "Otomatik Kurulum", en: "" }}
                description={{
                    tr: "Bu komut src/imageCatalog ve public/imageCatalog klasörlerini hazırlar ve package.json içine images:index scriptini ekler. Yeni projelerde önerilen başlangıç yoludur.",
                    en: "",
                }}
                code="yarn base-image-catalog-setup"
            />
            <Ds.block
                title={{ tr: "Manuel Kurulum", en: "" }}
                description={{
                    tr: "Otomatik kurulum kullanmak istemiyorsanız src/imageCatalog ve public/imageCatalog klasörlerini oluşturun ve package.json scripts alanına images:index komutunu ekleyin.",
                    en: "",
                }}
                code={`{
    "scripts": {
        "images:index": "node node_modules/@bariskuran/base/src/libs/createImageCatalog/tools/base-image-index.cjs"
    }
}`}
            />
            <Ds.block
                title={{ tr: "Image Klasörlerini Indexleme", en: "" }}
                description={{
                    tr: "src/imageCatalog veya public/imageCatalog altına yeni bir image klasörü eklediğinizde, mevcut klasöre yeni bir dosya koyduğunuzda veya dosya adlarını değiştirdiğinizde bu komutu çalıştırın. Komut client runtime'da değil, geliştirme/build hazırlığı sırasında çalışır.",
                    en: "",
                }}
                code="yarn images:index"
            />
            <Ds.block
                title={{ tr: "Klasör Standardı", en: "" }}
                description={{
                    tr: "Her görselin farklı dimension dosyalarını aynı klasör içinde tutun. Dosya isimleri Image tarafında variant/key gibi kullanılacağı için projede aynı amaçlı görsellerde aynı dosya adlarını kullanmak önemlidir. Örneğin tüm card görsellerinde thumb.webp bulunması, ileride CardViewer veya galeri komponentlerinde tek variant adıyla tutarlı seçim yapılmasını sağlar.",
                    en: "",
                }}
                code={`src/imageCatalog/
└── _placeholder/
    ├── index.js
    ├── thumb.webp
    ├── small.webp
    └── large.webp

public/imageCatalog/
└── img001/                    // Klasör adı daha sonra set adı olarak kullanılır.
    ├── index.js               // Kullanıcının kataloglanacak manuel datası.
    ├── thumb.webp             // Aynı ham görselin thumb dimension dosyası.
    ├── phone.webp             // Aynı ham görselin phone dimension dosyası.
    ├── tablet.webp            // Aynı ham görselin tablet dimension dosyası.
    ├── desktop.webp           // Aynı ham görselin desktop dimension dosyası.
    └── 4K.webp                // Aynı ham görselin 4K dimension dosyası.

// index.js:
// Kullanıcı burada alt metni, keywords ve ihtiyaç duyduğu custom datayı ekler.
// alt alanı erişilebilirlik için verilmelidir.
// Kullanıcının manuel eklemesi gereken veriler dışındaki teknik veri
// yarn images:index ile otomatik üretilir.

// Görsel dosyaları:
// Bu dosyalar otomatik üretilmez; aynı görselin farklı ölçü/dimension çıktılarıdır.
// Dosya isimleri daha sonra variant/key olarak çağrılacağı için ilişkili görseller
// arasında aynı adlandırma standardını korumak önemlidir.`}
            />
            <Ds.block
                title={{ tr: "Index Dosyası Formatı", en: "" }}
                description={{
                    tr: "Dosyanın üst bölümünde kullanıcının düzenlediği alanlar kalır. Auto Generated commentinden sonraki shape ve imageSet alanları script tarafından yönetilir. Root shape, imageSet içindeki en büyük doğal piksel alanına sahip görselin oranından türetilir; her variant ayrıca kendi shape bilgisini taşır.",
                    en: "",
                }}
                code={`// Auto Generated by \`yarn images:index\`
import thumb from "./thumb.webp";
import small from "./small.webp";
import large from "./large.webp";

const image = {
    alt: { tr: "Diyarbakır görsel açıklaması", en: "" },
    keywords: ["Diyarbakır"],

    // Auto Generated by \`yarn images:index\`
    shape: "landscape",
    imageSet: {
        thumb: {
            key: "thumb",
            src: thumb,
            naturalWidth: 320,
            naturalHeight: 213,
            type: "image/webp",
            sizeBytes: 12840,
            sizeKBytes: 12.54,
            sizeMBytes: 0.012,
            shape: "landscape",
        },
    },
};

export default image;`}
            />
            <Ds.block
                title={{ tr: "Korunan ve Yönetilen Alanlar", en: "" }}
                description={{
                    tr: "keywords, alt ve sizin eklediğiniz custom alanlar korunur. imageSet, eski images alanı, dosya adıyla çakışan root keyler, name, originalName ve originalPath script tarafından temizlenir. description varsa alt alanına taşınır. alt hiç yoksa alt: \"\" üretilir.",
                    en: "",
                }}
            />
            <Ds.block
                title={{ tr: "Shape Mantığı", en: "" }}
                description={{
                    tr: "Variant dosyalarının oranları farklı olabilir. Bu yüzden her imageSet kaydının kendi shape alanı vardır. Root shape ise katalog setinin genel temsil değeridir ve en büyük naturalWidth x naturalHeight alanına sahip dosyadan hesaplanır. Böylece thumb dosyaları özel olarak landscape üretilse bile orijinal/large görsel portrait ise setin root shape değeri portrait olur.",
                    en: "",
                }}
            />
            <Ds.block
                title={{ tr: "Neden Gerekli?", en: "" }}
                description={{
                    tr: "Az sayıda statik görselde manuel kullanım yeterli olabilir. Ancak onlarca veya yüzlerce görsel bulunan FE tabanlı projelerde görsel variantlarını, alt metinlerini, dosya boyutlarını, doğal ölçülerini ve oranlarını tek tek takip etmek hızla kırılgan hale gelir. Bu indexleme katmanı, Image komponentinin ileride responsive ve progressive seçimleri otomatik yapabilmesi için güvenilir veri tabanı hazırlar.",
                    en: "",
                }}
            />
            <Ds.api
                args="yarn images:index"
                props={{
                    imageSet: {
                        description: {
                            tr: "Script tarafından üretilen ve Image komponentinin katalog akışında kullanacağı görsel seti.",
                            en: "",
                        },
                        type: "object",
                    },
                    naturalWidth: {
                        description: {
                            tr: "Dosyanın doğal genişliği. Ekranda kullanılacak CSS genişliği değildir.",
                            en: "",
                        },
                        type: "number",
                    },
                    naturalHeight: {
                        description: {
                            tr: "Dosyanın doğal yüksekliği. Aspect ratio ve layout kararlarında kullanılır.",
                            en: "",
                        },
                        type: "number",
                    },
                    sizeBytes: {
                        description: {
                            tr: "Dosyanın byte cinsinden boyutu.",
                            en: "",
                        },
                        type: "number",
                    },
                    sizeKBytes: {
                        description: {
                            tr: "Dosyanın KB cinsinden yuvarlanmış boyutu.",
                            en: "",
                        },
                        type: "number",
                    },
                    sizeMBytes: {
                        description: {
                            tr: "Dosyanın MB cinsinden yuvarlanmış boyutu.",
                            en: "",
                        },
                        type: "number",
                    },
                    shape: {
                        description: {
                            tr: "Görsel oranı. landscape, portrait veya square değerlerinden biri olur.",
                            en: "",
                        },
                        type: '"landscape" | "portrait" | "square"',
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
