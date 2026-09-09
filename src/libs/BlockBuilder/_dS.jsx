import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { BlockBuilder } from ".";
import sampleSrc from "../Image/assets/sample-landscape.svg";

const imageProps = {
    src: sampleSrc,
    alt: "BlockBuilder sample",
};

const blocks = [
    {
        slideDesign: "amedistHorizontalRight",
        text: [
            { as: "h3", data: "Horizontal Right" },
            "Metin solda ve aşağıda; görsel sağda konumlanır.",
        ],
        imageProps,
    },
    {
        slideDesign: "amedistHorizontalLeft",
        text: [
            { as: "h3", data: "Horizontal Left" },
            "Görsel solda; metin sağda ve yukarıda konumlanır.",
        ],
        imageProps,
    },
    {
        slideDesign: "amedistVertical",
        text: ["Sol metin alanı yukarı hizalanır.", "İkinci metin alanı sağda ve aşağı hizalanır."],
        imageProps,
    },
];

const X = () => (
    <Ds.page
        title="<BlockBuilder>"
        releasedOn="1.0.0"
        description={{
            tr: "Story slide verisini sayfa içinde alt alta sıralanan içerik blocklarına dönüştürür.",
            en: "Converts story slide data into content blocks stacked within the page.",
        }}
    >
        <Ds.block
            title={{ tr: "Amedist", en: "Amedist" }}
            description={{
                tr: "slideDesign alanı üç yerleşimden birini seçer: amedistHorizontalRight, amedistHorizontalLeft veya amedistVertical.",
                en: "The slideDesign field selects one of three layouts: amedistHorizontalRight, amedistHorizontalLeft, or amedistVertical.",
            }}
            code={`import { BlockBuilder } from "${SYS.basePath}";

const blocks = [{
    slideDesign: "amedistHorizontalRight",
    text: ["..."],
    image: "catalogImageId",
}];

<BlockBuilder.amedist blocks={blocks} space={150} />`}
            example={<BlockBuilder.amedist blocks={blocks} />}
        />
        <Ds.api
            args="<BlockBuilder.amedist />"
            props={{
                blocks: {
                    description: {
                        tr: "slideDesign, text ve image alanlarını taşıyan block listesi.",
                        en: "List of blocks containing slideDesign, text, and image fields.",
                    },
                    type: "array",
                    required: true,
                },
                space: {
                    description: {
                        tr: "Block'lar arasındaki boşluk. Number değerler rem olarak uygulanır. Varsayılan: 150rem.",
                        en: "Spacing between blocks. Number values are applied as rem. Default: 150rem.",
                    },
                    type: "number | string",
                    defaultValue: "150",
                },
            }}
        />
    </Ds.page>
);

export default X;
