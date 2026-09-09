import Ds from "../DesignSystem";
import { ImageGalery } from ".";
import { SYS } from "../../constants/SYS";

const sampleImages = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
];

const X = () => (
    <Ds.page
        title="<ImageGalery>"
        releasedOn="1.0.0"
        description={{ tr: "Tam boyutlu PopUp görüntüleyicisi olan thumbnail galerisi. Thumbnail'ler viewport'a sığdığında ScrollFlex kullanılmadan alignX ile hizalanırlar (varsayılan center); taşma yatay scroll'u etkinleştirir.", en: "Thumbnail gallery with a full-size PopUp viewer. When thumbs fit the viewport they align via alignX (default center) without ScrollFlex; overflow enables horizontal scrolling." }}
    >
        <Ds.block
            title="Amedist"
            description={{ tr: "String'ler doğrudan path/URL veya image-catalog anahtarı olabilir. Image source nesneleri ve external image set'leri de desteklenir.", en: "Strings may be direct paths/URLs or image-catalog keys. Image source objects and external image sets are also supported." }}
            code={`import { ImageGalery } from "${SYS.basePath}";

                    <ImageGalery images={[
                        "/images/photo-1.jpg",
                        "i5283",
                        { externalSet: imageSet, alt: "Museum detail" }
                    ]} />`}
            example={<ImageGalery images={sampleImages} />}
        />
        <Ds.block
            title="alignX"
            description={{ tr: "Tüm thumbnail'ler viewport'a sığdığında ScrollFlex atlanır ve thumbnail'ler alignX ile hizalanır (varsayılan center). left/start ve right/end alias'tır. Taşma yine yatay scroll'u etkinleştirir.", en: "When all thumbnails fit the viewport, ScrollFlex is skipped and thumbs align with alignX (default center). left/start and right/end are aliases. Overflow still enables horizontal scrolling." }}
            code={`import { ImageGalery } from "${SYS.basePath}";

                    <ImageGalery images={images} alignX="center" />
                    <ImageGalery images={images} alignX="start" />`}
            example={<ImageGalery images={sampleImages} alignX="center" />}
        />
        <Ds.api
            args="<ImageGalery />"
            props={{
                images: {
                    description: { tr: "Doğrudan path'ler, URL'ler, image catalog anahtarları, Image props nesneleri veya external image set'leri. Alt, item'dan veya catalog anahtarlarında image catalog'dan gelir; varsa PopUp içinde t(alt) olarak gösterilir.", en: "Direct paths, URLs, image catalog keys, Image props objects, or external image sets. Alt comes from the item or, for catalog keys, from the image catalog; it is shown as t(alt) in the PopUp when present." },
                    type: "array",
                    required: true,
                },
                thumbnailHeight: {
                    description: { tr: "Ortak thumbnail satır yüksekliği. Genişlik her görselin aspect ratio'sunu izler.", en: "Shared thumbnail row height. Width follows each image aspect ratio." },
                    type: "number",
                    defaultValue: "150",
                },
                gap: {
                    description: { tr: "Thumbnail'ler arasındaki boşluk.", en: "Space between thumbnails." },
                    type: "number",
                    defaultValue: "10",
                },
                alignX: {
                    description: { tr: "Thumbnail'ler scroll olmadan sığdığında yatay hizalama. center | start | end (left→start, right→end). ScrollFlex yalnızca içerik taştığında kullanılır.", en: "Horizontal alignment when thumbnails fit without scrolling. center | start | end (left→start, right→end). ScrollFlex is used only when content overflows." },
                    type: '"center" | "start" | "end" | "left" | "right"',
                    defaultValue: '"center"',
                },
                marginToEdge: {
                    description: { tr: "Thumbnail satırı scroll olduğunda baştaki/sondaki boşluk (tüm thumbnail'ler sığdığında yok sayılır).", en: "Leading/trailing spacer when the thumbnail row scrolls (ignored when all thumbs fit)." },
                    type: "number | string",
                    defaultValue: "150",
                },
            }}
        />
    </Ds.page>
);

export default X;
