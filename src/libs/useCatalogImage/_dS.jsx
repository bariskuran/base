import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { t } from "../getText";

const X = () => {
    return (
        <Ds.page
            title="useCatalogImage()"
            releasedOn="1.0.0"
            description={
                <>
                    <Typo.p>
                        {t({
                            tr: "useCatalogImage, createImageCatalog ile globalData içine yazılmış tek bir image setinin katalog datasını okumak için kullanılan hooktur. Image komponenti bu datayı kendi içinde kullanır; hook ise aynı veriye component dışındaki kararlar, filtreler ve custom UI ihtiyaçları için erişim sağlar.",
                            en: "useCatalogImage is a hook for reading the catalog data of one image set written into globalData by createImageCatalog. Image uses this data internally; the hook exposes it for decisions outside the component, filters, and custom UI needs.",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "Dönen obje, src/images altındaki ilgili klasörün index.js dosyasında duran kullanıcı datasını ve script tarafından üretilen imageSet metadata'sını birlikte taşır. Böylece alt, keywords, shape, imageSet.thumb.sizeBytes veya herhangi bir custom alan aynı kaynaktan okunabilir.",
                            en: "The returned object contains both user data from the relevant index.js file under src/images and script-generated imageSet metadata. This lets you read alt, keywords, shape, imageSet.thumb.sizeBytes, or any custom field from the same source.",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "useCatalogImage görsel render etmek zorunda değildir. Listeleme, filtreleme, grid oranı seçme veya tasarım varyantı kararları için kullanılabilir.",
                            en: "useCatalogImage does not have to render an image. Use it for listing, filtering, grid-ratio selection, or design-variant decisions.",
                        })}
                    </Typo.p>
                    <Flex gap={8} wrap marginTop={14}>
                        <Button.string
                            to="/design-system/createImageCatalog"
                            label="createImageCatalog"
                        />
                        <Button.string to="/design-system/image" label="<Image>" />
                    </Flex>
                </>
            }
        >
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
                description={{
                    tr: "Hook set adını alır. Katalog henüz oluşturulmadıysa veya set bulunamazsa null döner.",
                    en: "The hook receives a set name. It returns null when the catalog has not been created yet or the set cannot be found.",
                }}
                code={`import { useCatalogImage } from "${SYS.basePath}";

const image = useCatalogImage("i0030");

if (!image) return null;`}
            />
            <Ds.block
                title={{ tr: "Katalog Datası Okuma", en: "Reading Catalog Data" }}
                description={{
                    tr: "Kullanıcı tarafından eklenen alanlar ve otomatik üretilen teknik metadata aynı obje içinde korunur.",
                    en: "User-added fields and automatically generated technical metadata are preserved in the same object.",
                }}
                code={`const image = useCatalogImage("i0030");

const keywords = image?.keywords || [];
const rootShape = image?.shape;
const thumbSize = image?.imageSet?.thumb?.sizeKBytes;`}
            />
            <Ds.api
                args="const image = useCatalogImage(setName);"
                props={{
                    set: {
                        description: {
                            tr: "createImageCatalog içinde kaydedilmiş katalog set adı.",
                            en: "Catalog set name registered through createImageCatalog.",
                        },
                        type: "string",
                        required: true,
                    },
                }}
                returnProps={{
                    image: {
                        description: {
                            tr: "Katalog objesi veya set bulunamazsa null.",
                            en: "Null when the catalog object or set cannot be found.",
                        },
                        type: "object | null",
                    },
                    imageSet: {
                        description: {
                            tr: "Set içindeki variant dosyalarının src ve metadata kayıtları.",
                            en: "src and metadata records for variant files in the set.",
                        },
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
