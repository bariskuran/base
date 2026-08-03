import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Space } from "../Space";
import { Typo } from "../Typo";
import { ParalaxItem } from ".";

const DemoCard = ({ label, speed, bg }) => (
    <ParalaxItem.speed speed={speed}>
        <Flex
            direction="column"
            gap={8}
            padding={20}
            minHeight={140}
            minWidth={140}
            xAlign="center"
            yAlign="center"
            bgColor={bg}
        >
            <Typo.h4>{label}</Typo.h4>
            <Typo.span>{`speed ${speed}`}</Typo.span>
        </Flex>
    </ParalaxItem.speed>
);

const coverDemoSrc =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85";

const CoverImageDemo = () => (
    <Flex.column gap={0} full>
        <Space size={180} />
        <ParalaxItem.coverImage src={coverDemoSrc} alt="Paralaks kapak örneği" />
        <Space size={180} />
    </Flex.column>
);

const ParalaxDemo = () => (
    <Flex.column gap={0} full style={{ position: "relative" }}>
        <Space size={280} />
        <Flex
            gap={24}
            xAlign="center"
            yAlign="center"
            full
            style={{
                position: "relative",
            }}
        >
            <Flex
                aria-hidden="true"
                style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    top: "50%",
                    height: 1,
                    background: "currentColor",
                    opacity: 0.35,
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            />
            <DemoCard label="1" speed={-50} bg="greys.shade20" />
            <DemoCard label="2" speed={0} bg="greys.shade30" />
            <DemoCard label="3" speed={50} bg="greys.shade20" />
        </Flex>
        <Space size={480} />
        <Typo.p style={{ textAlign: "center", opacity: 0.7 }}>
            Origin çizgisi viewport Y ortasıdır. Scroll ederken itemların hız farkını izleyin.
        </Typo.p>
        <Space size={280} />
    </Flex.column>
);

const X = () => (
    <Ds.page
        title="<ParalaxItem>"
        releasedOn="1.0.0"
        description={{
            tr: "Her paralaks davranışı kendi varyantında tanımlanır. Mevcut hız temelli davranış ParalaxItem.speed, kapak görseli davranışı ise ParalaxItem.coverImage olarak kullanılır.",
            en: "Each parallax behavior is defined in its own variant. The existing speed-based behavior is used through ParalaxItem.speed, while the cover-image behavior is used through ParalaxItem.coverImage.",
        }}
    >
        <Ds.block
            title={{ tr: "speed", en: "speed" }}
            description={{
                tr: "Aynı satırdaki üç item farklı speed değerleriyle origin’e yaklaşıp uzaklaşır. Ortadaki sabit çizgi origin’i gösterir.",
                en: "Three items in a row approach and leave the origin at different speeds. The fixed center line marks the origin.",
            }}
            code={`import { ParalaxItem } from "${SYS.basePath}";

<ParalaxItem.speed speed={-50}>
    <SlowItem />
</ParalaxItem.speed>

<ParalaxItem.speed speed={0}>
    <NormalItem />
</ParalaxItem.speed>

<ParalaxItem.speed speed={50}>
    <FastItem />
</ParalaxItem.speed>`}
            example={<ParalaxDemo />}
        />
        <Ds.api
            disableLastBlock
            args="<ParalaxItem.speed speed />"
            props={{
                speed: {
                    description: {
                        tr: "Paralaks katsayısı. 0 efektsiz (children doğrudan). Negatif: origin’e daha yakın. Pozitif: origin’den daha uzak. Tipik aralık ±50 civarı.",
                        en: "Parallax factor. 0 disables the effect (children returned directly). Negative: closer to origin. Positive: further from origin. Typical range around ±50.",
                    },
                    type: "number",
                    defaultValue: "0",
                },
                children: {
                    description: {
                        tr: "Paralaks uygulanacak içerik.",
                        en: "Content that receives the parallax transform.",
                    },
                    type: "ReactNode",
                    required: true,
                },
                className: {
                    description: {
                        tr: "Wrapper’a iletilen className. speed 0 iken wrapper yok.",
                        en: "className passed to the wrapper. No wrapper when speed is 0.",
                    },
                    type: "string",
                },
                style: {
                    description: {
                        tr: "Wrapper’a iletilen style. speed 0 iken wrapper yok.",
                        en: "style passed to the wrapper. No wrapper when speed is 0.",
                    },
                    type: "CSSProperties",
                },
            }}
        />
        <Ds.block
            title={{ tr: "coverImage", en: "coverImage" }}
            description={{
                tr: "Alan sayfayla normal hızda akar. Varyant, görselin çerçeve dışındaki gerçek piksel alanını ölçer ve girişte ilk, çıkışta son görünür piksele ulaşır. horizontal panoramik görseli soldan sağa kaydırır.",
                en: "The frame scrolls at the normal page speed. The variant measures the image's real pixel overflow and reaches the first visible pixel on entry and the last one on exit. horizontal pans a panoramic image from left to right.",
            }}
            code={`import { ParalaxItem } from "${SYS.basePath}";

<ParalaxItem.coverImage
    catalogSet="city-gate"
    alt="Şehir kapısı"
    w="100%"
    h="50vh"
/>`}
            example={<CoverImageDemo />}
        />
        <Ds.block
            title={{ tr: "Yatay panorama", en: "Horizontal panorama" }}
            description={{
                tr: "horizontal true olduğunda, görsel çerçeveye yüksekliğinden oturur ve scroll ile soldan sağa pan yapılır.",
                en: "When horizontal is true, the image is fitted by height and scroll pans it from left to right.",
            }}
            code={`<ParalaxItem.coverImage
    src="/images/panorama.jpg"
    alt="Panoramik şehir görünümü"
    horizontal
    h="50vh"
/>`}
        />
        <Ds.api
            args="<ParalaxItem.coverImage src externalSet catalogSet />"
            props={{
                src: {
                    description: {
                        tr: "Tek görsel URL'i. Image ile aynı kaynak API'sini kullanır.",
                        en: "Single image URL. Uses the same source API as Image.",
                    },
                    type: "string",
                },
                externalSet: {
                    description: {
                        tr: "Katalog dışından gelen image set.",
                        en: "Image set supplied outside the catalog.",
                    },
                    type: "object | array",
                },
                catalogSet: {
                    description: {
                        tr: "createImageCatalog ile kaydedilmiş set adı.",
                        en: "Name of a set registered with createImageCatalog.",
                    },
                    type: "string",
                },
                w: {
                    description: {
                        tr: "Dış kapak alanının genişliği. width ile eşdeğerdir.",
                        en: "Width of the outer cover frame. Alias for width.",
                    },
                    type: "string | number",
                    defaultValue: '"100%"',
                },
                h: {
                    description: {
                        tr: "Dış kapak alanının yüksekliği. height ile eşdeğerdir.",
                        en: "Height of the outer cover frame. Alias for height.",
                    },
                    type: "string | number",
                    defaultValue: '"50vh"',
                },
                width: {
                    description: {
                        tr: "w için alternatif genişlik prop'u.",
                        en: "Alternative width prop for w.",
                    },
                    type: "string | number",
                },
                height: {
                    description: {
                        tr: "h için alternatif yükseklik prop'u.",
                        en: "Alternative height prop for h.",
                    },
                    type: "string | number",
                },
                horizontal: {
                    description: {
                        tr: "true olduğunda panoramik görseli soldan sağa kaydırır. false olduğunda görsel üstten alta kayar.",
                        en: "When true, pans a panoramic image from left to right. When false, the image moves from top to bottom.",
                    },
                    type: "boolean",
                    defaultValue: "false",
                },
                threshold: {
                    description: {
                        tr: "Hareket başlamadan ve bitmeden önce viewport uçlarında bırakılan yüzde tampon alanı. 20 olduğunda girişte ilk %20 sabit kalır, çıkıştaki son %20'ye gelindiğinde hareket tamamlanır.",
                        en: "Percentage buffer kept at both viewport edges before motion starts and after it ends. At 20, the first 20% of entry is still and motion is complete by the final 20% of exit.",
                    },
                    type: "number",
                    defaultValue: "25",
                },
                alt: {
                    description: {
                        tr: "Görselin alternatif metni.",
                        en: "Alternative text for the image.",
                    },
                    type: "string",
                    defaultValue: '""',
                },
            }}
        />
    </Ds.page>
);

export default X;
