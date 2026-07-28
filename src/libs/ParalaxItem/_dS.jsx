import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Space } from "../Space";
import { Typo } from "../Typo";
import { ParalaxItem } from ".";

const DemoCard = ({ label, speed, bg }) => (
    <ParalaxItem speed={speed}>
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
    </ParalaxItem>
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
            tr: "Scroll ile viewport Y ortasına (origin) göre dikey paralaks uygular. Origin’de offset 0’dır; pozitif speed merkezi uzaklaştırır, negatif speed yaklaştırır. speed 0 ise children doğrudan döner. Scroll dinleme, öğe viewport’a ±2× viewport yüksekliği mesafesindeyken aktiftir.",
            en: "Applies vertical parallax relative to the viewport Y center (origin). Offset is 0 at the origin; positive speed moves further from center, negative speed closer. When speed is 0, children are returned as-is. Scroll listening is active while the item is within ±2× viewport height of the visible area.",
        }}
    >
        <Ds.block
            title={{ tr: "Temel kullanım", en: "Basic usage" }}
            description={{
                tr: "Aynı satırdaki üç item farklı speed değerleriyle origin’e yaklaşıp uzaklaşır. Ortadaki sabit çizgi origin’i gösterir.",
                en: "Three items in a row approach and leave the origin at different speeds. The fixed center line marks the origin.",
            }}
            code={`import { ParalaxItem } from "${SYS.basePath}";

<ParalaxItem speed={-50}>
    <SlowItem />
</ParalaxItem>

<ParalaxItem speed={0}>
    <NormalItem />
</ParalaxItem>

<ParalaxItem speed={50}>
    <FastItem />
</ParalaxItem>`}
            example={<ParalaxDemo />}
        />
        <Ds.api
            args="<ParalaxItem speed />"
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
    </Ds.page>
);

export default X;
