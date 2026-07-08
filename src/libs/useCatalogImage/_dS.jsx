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
                            en: "",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "Dönen obje, src/images altındaki ilgili klasörün index.js dosyasında duran kullanıcı datasını ve script tarafından üretilen imageSet metadata'sını birlikte taşır. Böylece alt, keywords, shape, imageSet.thumb.sizeBytes veya herhangi bir custom alan aynı kaynaktan okunabilir.",
                            en: "",
                        })}
                    </Typo.p>
                    <Typo.p>
                        {t({
                            tr: "useCatalogImage görsel render etmek zorunda değildir. Listeleme, filtreleme, grid oranı seçme veya tasarım varyantı kararları için kullanılabilir.",
                            en: "",
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
                title={{ tr: "Temel Kullanım", en: "" }}
                description={{
                    tr: "Hook set adını alır. Katalog henüz oluşturulmadıysa veya set bulunamazsa null döner.",
                    en: "",
                }}
                code={`import { useCatalogImage } from "${SYS.basePath}";

const image = useCatalogImage("i0030");

if (!image) return null;`}
            />
            <Ds.block
                title={{ tr: "Katalog Datası Okuma", en: "" }}
                description={{
                    tr: "Kullanıcı tarafından eklenen alanlar ve otomatik üretilen teknik metadata aynı obje içinde korunur.",
                    en: "",
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
                            en: "",
                        },
                        type: "string",
                        required: true,
                    },
                }}
                returnProps={{
                    image: {
                        description: {
                            tr: "Katalog objesi veya set bulunamazsa null.",
                            en: "",
                        },
                        type: "object | null",
                    },
                    imageSet: {
                        description: {
                            tr: "Set içindeki variant dosyalarının src ve metadata kayıtları.",
                            en: "",
                        },
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
