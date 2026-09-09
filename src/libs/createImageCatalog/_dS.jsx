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
                            en: "createImageCatalog is an image-cataloguing foundation for front-end projects that contain many images. The first step on this page standardises image folders under src/imageCatalog and public/imageCatalog into a common index format and produces technical metadata for every image file.",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "Amaç; site genelinde aynı image variant isimlerini kullanabilmek, responsive image seçimini daha güvenilir hale getirmek, progressive image akışında küçük dosyadan büyük dosyaya kontrollü geçebilmek ve tüm bunları component kullanımında tekrar tekrar manuel tanımlamadan yönetebilmektir.",
                            en: "Its purpose is to use consistent image variant names across the site, make responsive-image selection more reliable, move from small to large files in a controlled progressive-image flow, and manage all of this without repeatedly defining it manually in each component.",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "Bu indexleme adımı tek başına görsel render etmez. Üretilen imageSet verileri sonraki adımlarda createImageCatalog runtime kurulumu, Image komponentinin catalogSet kullanımı ve useCatalogImage hooku ile birlikte kullanılacaktır.",
                            en: "This indexing step does not render images by itself. The generated imageSet data is used in later steps together with the createImageCatalog runtime setup, the Image component's catalogSet usage, and the useCatalogImage hook.",
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
                title={{ tr: "Ne Üretir?", en: "What Does It Generate?" }}
                description={{
                    tr: "Komut, src/imageCatalog ve public/imageCatalog altındaki her görsel klasörünü okur. src altındaki dosyalar için import üretir; public altındaki dosyalar için URL path üretir. imageSet altında key, src, naturalWidth, naturalHeight, aRatio, type, sizeBytes, sizeKBytes, sizeMBytes ve shape bilgilerini yazar. aRatio, w/h oranının tek ondalığa yuvarlanmış halidir. Mevcut kullanıcı datasını korur; description alanını alt alanına taşır; eski orientation bilgisini temizler.",
                    en: "The command reads every image folder under src/imageCatalog and public/imageCatalog. It generates imports for src files and URL paths for public files. It writes key, src, naturalWidth, naturalHeight, aRatio, type, sizeBytes, sizeKBytes, sizeMBytes and shape to imageSet. aRatio is the w/h ratio rounded to one decimal place. Existing user data is preserved, description is moved to alt, and legacy orientation data is removed.",
                }}
            />
            <Ds.block
                title={{ tr: "Runtime Kurulumu", en: "Runtime Setup" }}
                description={{
                    tr: "Index dosyaları üretildikten sonra katalog datasının uygulama başlangıcında baseStore.globalData.__imageCatalog altına yazılması gerekir. Image componentinin catalogSet kullanımı ve useCatalogImage hooku bu runtime katalog üzerinden çalışır.",
                    en: "After index files are generated, the catalog data must be written to baseStore.globalData.__imageCatalog at application startup. The Image component's catalogSet usage and the useCatalogImage hook work through this runtime catalog.",
                }}
                code={`import imageCatalog from "./imageCatalog";
import { createImageCatalog } from "${SYS.basePath}";

createImageCatalog(imageCatalog);`}
            />
            <Ds.block
                title={{ tr: "Otomatik Kurulum", en: "Automatic Setup" }}
                description={{
                    tr: "Bu komut src/imageCatalog ve public/imageCatalog klasörlerini hazırlar ve package.json içine images:index scriptini ekler. Yeni projelerde önerilen başlangıç yoludur.",
                    en: "This command prepares src/imageCatalog and public/imageCatalog folders and adds the images:index script to package.json. It is the recommended starting path for new projects.",
                }}
                code="yarn base-image-catalog-setup"
            />
            <Ds.block
                title={{ tr: "Manuel Kurulum", en: "Manual Setup" }}
                description={{
                    tr: "Otomatik kurulum kullanmak istemiyorsanız src/imageCatalog ve public/imageCatalog klasörlerini oluşturun ve package.json scripts alanına images:index komutunu ekleyin.",
                    en: "If you do not want to use the automatic setup, create src/imageCatalog and public/imageCatalog folders and add the images:index command to the package.json scripts field.",
                }}
                code={`{
    "scripts": {
        "images:index": "node node_modules/@bariskuran/base/src/libs/createImageCatalog/tools/base-image-index.cjs"
    }
}`}
            />
            <Ds.block
                title={{ tr: "Image Klasörlerini Indexleme", en: "Indexing Image Folders" }}
                description={{
                    tr: "src/imageCatalog veya public/imageCatalog altına yeni bir image klasörü eklediğinizde, mevcut klasöre yeni bir dosya koyduğunuzda veya dosya adlarını değiştirdiğinizde bu komutu çalıştırın. Komut client runtime'da değil, geliştirme/build hazırlığı sırasında çalışır.",
                    en: "Run this command when you add a new image folder under src/imageCatalog or public/imageCatalog, add a file to an existing folder, or rename files. The command runs during development/build preparation, not in the client runtime.",
                }}
                code="yarn images:index"
            />
            <Ds.block
                title={{ tr: "Klasör Standardı", en: "Folder Convention" }}
                description={{
                    tr: "Her görselin farklı dimension dosyalarını aynı klasör içinde tutun. Dosya isimleri Image tarafında variant/key gibi kullanılacağı için projede aynı amaçlı görsellerde aynı dosya adlarını kullanmak önemlidir. Örneğin tüm card görsellerinde thumb.webp bulunması, ileride CardViewer veya galeri komponentlerinde tek variant adıyla tutarlı seçim yapılmasını sağlar.",
                    en: "Keep files for the different dimensions of each image in the same folder. Because file names are used as variants/keys by Image, it is important to use the same file names for images serving the same purpose. For example, using thumb.webp for every card image enables CardViewer or gallery components to make consistent selections through a single variant name later.",
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
                title={{ tr: "Index Dosyası Formatı", en: "Index File Format" }}
                description={{
                    tr: "Dosyanın üst bölümünde kullanıcının düzenlediği alanlar kalır. Auto Generated commentinden sonraki shape ve imageSet alanları script tarafından yönetilir. Root shape, imageSet içindeki en büyük doğal piksel alanına sahip görselin oranından türetilir; her variant ayrıca kendi shape bilgisini taşır.",
                    en: "User-managed fields stay at the top of the file. shape and imageSet fields after the Auto Generated comment are managed by the script. Root shape is derived from the ratio of the image with the largest natural pixel area in imageSet; every variant also carries its own shape.",
                }}
                code={`// Auto Generated by \`yarn images:index\`
import placeholder from "./placeholder.webp";
import thumb from "./thumb.webp";
import small from "./small.webp";
import large from "./large.webp";

const image = {
    alt: { tr: "Diyarbakır görsel açıklaması", en: "Diyarbakır image description" },
    keywords: ["Diyarbakır"],

    // Auto Generated by \`yarn images:index\`
    shape: "landscape",
    imageSet: {
        placeholder: {
            key: "placeholder",
            src: placeholder,
            naturalWidth: 405,
            naturalHeight: 270,
            aRatio: 1.5,
            type: "image/webp",
            sizeBytes: 4200,
            sizeKBytes: 4.1,
            sizeMBytes: 0.004,
            shape: "landscape",
        },
        thumb: {
            key: "thumb",
            src: thumb,
            naturalWidth: 320,
            naturalHeight: 640,
            aRatio: 0.5,
            type: "image/webp",
            sizeBytes: 12840,
            sizeKBytes: 12.54,
            sizeMBytes: 0.012,
            shape: "portrait",
        },
    },
};

export default image;`}
            />
            <Ds.block
                title={{ tr: "Korunan ve Yönetilen Alanlar", en: "Preserved and Managed Fields" }}
                description={{
                    tr: "keywords, alt ve sizin eklediğiniz custom alanlar korunur. imageSet, eski images alanı, dosya adıyla çakışan root keyler, name, originalName ve originalPath script tarafından temizlenir. description varsa alt alanına taşınır. alt hiç yoksa alt: \"\" üretilir.",
                    en: "keywords, alt and any custom fields you add are preserved. imageSet, legacy images fields, root keys that collide with a file name, name, originalName and originalPath are cleaned by the script. If description exists it is moved to alt. If no alt exists, alt: \"\" is generated.",
                }}
            />
            <Ds.block
                title={{ tr: "Shape ve aRatio Mantığı", en: "Shape and aRatio Logic" }}
                description={{
                    tr: "Variant dosyalarının oranları farklı olabilir. Bu yüzden her imageSet kaydının kendi shape ve aRatio alanı vardır. Root shape, katalog setinin genel temsil değeridir ve en büyük naturalWidth x naturalHeight alanına sahip dosyadan hesaplanır. Image progressive yüklemede placeholder seçerken aRatio eşleşmesini kullanır; böylece farklı orandaki thumb kart görselleri ana görselin placeholder’ı olmaz.",
                    en: "Variant files can have different aspect ratios. For that reason every imageSet record has its own shape and aRatio. Root shape is the catalog set's general representative value and is calculated from the file with the largest naturalWidth × naturalHeight area. Image uses an aRatio match when choosing a progressive placeholder, preventing a thumb card image with a different ratio from becoming the main image's placeholder.",
                }}
            />
            <Ds.block
                title={{ tr: "Neden Gerekli?", en: "Why Is It Needed?" }}
                description={{
                    tr: "Az sayıda statik görselde manuel kullanım yeterli olabilir. Ancak onlarca veya yüzlerce görsel bulunan FE tabanlı projelerde görsel variantlarını, alt metinlerini, dosya boyutlarını, doğal ölçülerini ve oranlarını tek tek takip etmek hızla kırılgan hale gelir. Bu indexleme katmanı, Image komponentinin ileride responsive ve progressive seçimleri otomatik yapabilmesi için güvenilir veri tabanı hazırlar.",
                    en: "Manual usage can be sufficient for a small number of static images. In front-end projects with dozens or hundreds of images, however, tracking image variants, alt text, file sizes, natural dimensions and ratios one by one quickly becomes fragile. This indexing layer prepares dependable data so the Image component can make responsive and progressive selections automatically later.",
                }}
            />
            <Ds.api
                args="yarn images:index"
                props={{
                    imageSet: {
                        description: {
                            tr: "Script tarafından üretilen ve Image komponentinin katalog akışında kullanacağı görsel seti.",
                            en: "The image set generated by the script and used by the Image component's catalog flow.",
                        },
                        type: "object",
                    },
                    naturalWidth: {
                        description: {
                            tr: "Dosyanın doğal genişliği. Ekranda kullanılacak CSS genişliği değildir.",
                            en: "The file's natural width, not the CSS width used on screen.",
                        },
                        type: "number",
                    },
                    naturalHeight: {
                        description: {
                            tr: "Dosyanın doğal yüksekliği. Aspect ratio ve layout kararlarında kullanılır.",
                            en: "The file's natural height. Used for aspect-ratio and layout decisions.",
                        },
                        type: "number",
                    },
                    aRatio: {
                        description: {
                            tr: "naturalWidth / naturalHeight oranının tek ondalığa yuvarlanmış hali. Image progressive placeholder seçiminde kullanılır.",
                            en: "naturalWidth / naturalHeight rounded to one decimal place. Used when Image selects a progressive placeholder.",
                        },
                        type: "number",
                    },
                    sizeBytes: {
                        description: {
                            tr: "Dosyanın byte cinsinden boyutu.",
                            en: "File size in bytes.",
                        },
                        type: "number",
                    },
                    sizeKBytes: {
                        description: {
                            tr: "Dosyanın KB cinsinden yuvarlanmış boyutu.",
                            en: "Rounded file size in KB.",
                        },
                        type: "number",
                    },
                    sizeMBytes: {
                        description: {
                            tr: "Dosyanın MB cinsinden yuvarlanmış boyutu.",
                            en: "Rounded file size in MB.",
                        },
                        type: "number",
                    },
                    shape: {
                        description: {
                            tr: "Görsel oranı. landscape, portrait veya square değerlerinden biri olur.",
                            en: "Image ratio classification: landscape, portrait or square.",
                        },
                        type: '"landscape" | "portrait" | "square"',
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
