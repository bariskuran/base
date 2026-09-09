import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollFlex } from "./";
import { generateRandom } from "../generateRandom";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { useRef } from "react";
import { t } from "../getText";
import im from "./tools/01.jpg";

const longText = generateRandom.loremIpsum(1000);
const shortText = generateRandom.loremIpsum(50);
const HEIGHT_BY_ID_DEMO_SOURCE = "ds-scrollflex-height-by-id-demo";

const Content = ({ width, height, short }) => (
    <Flex width={width} height={height} yAlign="start" bgColor="greys.shade20">
        {short ? shortText : longText}
    </Flex>
);

const X = () => {
    const flexRef1 = useRef(null);

    return (
        <Ds.page
            title="<ScrollFlex>"
            releasedOn="1.0.0"
            description={
                <>
                    {t({ tr: "ScrollFlex, istenen herhangi bir boyutta scroll edilebilir Flex container oluşturmak için Flex'i ScrollBar ile birleştirir.", en: "ScrollFlex integrates Flex with ScrollBar to create a scrollable Flex container at any desired size." })}
                    <br />
                    <br />
                    {t({ tr: "Günlük kullanım için idealdir. Daha gelişmiş senaryolarda, özelleştirilmiş bir ", en: "It is ideal for everyday use. For advanced scenarios, use " })}<Button.string to="/design-system/scrollBar" label="ScrollBar" />{t({ tr: " bileşenini özelleştirilmiş bir ", en: " with a customised " })}<Button.string to="/design-system/flex" label="Flex" />{t({ tr: " veya özel içerik alanıyla kullanın.", en: " or custom content area." })}
                </>
            }
        >
            <Ds.block
                title={{ tr: "Temel kullanım", en: "Basic Usage" }}
                description={{ tr: "ScrollFlex kullanırken özellikle height vermeniz önerilir. En temiz sonucu bu sağlar.", en: "It is recommended to specify height when using ScrollFlex. This produces the cleanest result." }}
                code={`import { ScrollFlex } from "${SYS.basePath}"

                        <ScrollFlex width={200} height={100}>
                            {longText}
                        </ScrollFlex>
                        <ScrollFlex width={200} height={100} padding={10}>
                            {longText}
                        </ScrollFlex>
                        <ScrollFlex width={200} height={100}>
                            <Flex full padding={10}>
                                {longText}
                            </Flex>
                        </ScrollFlex>`}
                example={
                    <Flex gap={10}>
                        <ScrollFlex width={200} height={100}>
                            <img src={im} alt="image" width={400} height={400} />
                        </ScrollFlex>
                        <ScrollFlex width={200} height={100} padding={10}>
                            {longText}
                        </ScrollFlex>
                        <Flex width={200} height={100}>
                            <ScrollFlex enableDragging>
                                <img src={im} alt="image" width={400} height={400} />
                            </ScrollFlex>
                        </Flex>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Gelişmiş kullanım", en: "Advanced Usage" }}
                description={{ tr: "ScrollFlex'i flexProps ve scrollBarProps ile daha ayrıntılı özelleştirebilirsiniz. Ayrıca gelişmiş kullanım için ek propları vardır.", en: "You can further customise ScrollFlex through flexProps and scrollBarProps. It also has additional props for advanced usage." }}
                code={`import { ScrollFlex } from "${SYS.basePath}"

                       <Flex gap={10} height={100}>
                        <ScrollFlex
                            variant="hoverShadow"
                            scrollBarProps={{ variant: "primary", fillMode: true }}
                            width={200}
                        >
                            {longText}
                        </ScrollFlex>
                        <ScrollFlex
                            variant="shadow"
                            scrollBarProps={{ variant: "primary" }}
                            flexProps={{
                                minWidth: 400,
                                justify: "center",
                                borderRadius: 10,
                                bgColor: "foreground",
                                color: "backgrounds.tint90",
                                padding: 10,
                            }}
                            width={200}
                            padding={10}
                            paddingRight={0}
                        >
                            {longText}
                        </ScrollFlex>
                        <ScrollFlex
                            variant="plain"
                            scrollBarProps={{ variant: "primary" }}
                            flexProps={{
                                bgColor: "primary",
                                color: "foreground",
                                padding: 10,
                                textAlign: "center",
                            }}
                            width={200}
                            padding={10}
                            paddingRight={0}
                        >
                            {longText}
                        </ScrollFlex>
                       </Flex>`}
                example={
                    <Flex gap={10} height={100}>
                        <ScrollFlex
                            variant="hoverShadow"
                            scrollBarProps={{ variant: "primary", fillMode: true }}
                            width={200}
                        >
                            {longText}
                        </ScrollFlex>
                        <ScrollFlex
                            variant="shadow"
                            scrollBarProps={{ variant: "primary" }}
                            flexProps={{
                                minWidth: 400,
                                justify: "center",
                                borderRadius: 10,
                                bgColor: "foreground",
                                color: "backgrounds.tint90",
                                padding: 10,
                            }}
                            width={200}
                            padding={10}
                            paddingRight={0}
                        >
                            {longText}
                        </ScrollFlex>
                        <ScrollFlex
                            variant="plain"
                            scrollBarProps={{ variant: "primary" }}
                            flexProps={{
                                bgColor: "primary",
                                color: "foreground",
                                padding: 10,
                                textAlign: "center",
                            }}
                            width={200}
                            padding={10}
                            paddingRight={0}
                        >
                            {longText}
                        </ScrollFlex>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Otomatik Eksen Yönetimi", en: "Auto Axis Management" }}
                description={{ tr: "Scrollbar, içerik boyutuna göre scrollbar eksenini otomatik yönetir.", en: "Scrollbar automatically manages its axis from content size." }}
                code={`import { ScrollFlex } from "${SYS.basePath}"

                        <ScrollFlex width={150} height={100} padding={0}>
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100}>
                            <Content />
                        </ScrollFlex>
                        <ScrollFlex
                            width={150}
                            height={100}
                            scrollBarProps={{ mirror: true, opposite: true }}
                        >
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100} scrollBarProps={{ mirror: true }}>
                            <Content />
                        </ScrollFlex>`}
                example={
                    <Flex gap={10}>
                        <ScrollFlex
                            width={150}
                            height={100}
                            scrollBarProps={{ disableOpacityEffect: true }}
                        >
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100}>
                            <Content />
                        </ScrollFlex>
                        <ScrollFlex
                            width={150}
                            height={100}
                            scrollBarProps={{ mirror: true, opposite: true }}
                        >
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100} scrollBarProps={{ mirror: true }}>
                            <Content />
                        </ScrollFlex>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Otomatik Genişlik ve Yükseklik", en: "Auto Width & Height" }}
                description={{ tr: "width veya height verilmediğinde ScrollFlex autoWidth ve autoHeight kullanır (ikisi de varsayılan true). İçerik boyutunu parent ile karşılaştırır: içerik küçükse kutu, ilgili eksende bar olduğunda scrollbar boşluğu dahil içeriğe küçülür; büyükse max-width veya max-height 100% ile parent boyutu kullanılır. Açık width/height, flexProps boyutları veya *ByRef / *ById ilgili otomatik ekseni kapatır.", en: "When width or height are omitted, ScrollFlex uses autoWidth and autoHeight (both default to true). It compares content size with the parent: if content is smaller, the box shrinks to content plus the scrollbar gutter when that axis has a bar; if content is larger, parent size is used with max-width or max-height 100%. Explicit width, height, flexProps dimensions, or *ByRef / *ById disable the matching auto axis." }}
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"

                       <Flex gap={10}>
                        <Flex>
                            <ScrollFlex>{longText}</ScrollFlex>
                        </Flex>
                        <Flex height={150}>
                            <ScrollFlex>{longText}</ScrollFlex>
                        </Flex>
                        <Flex height={150}>
                            <Flex>
                                <ScrollFlex>{longText}</ScrollFlex>
                            </Flex>
                        </Flex>
                        <Flex height={150}>
                            <Flex>
                                <Flex>
                                    <ScrollFlex>{longText}</ScrollFlex>
                                </Flex>
                            </Flex>
                        </Flex>
                       </Flex>`}
                example={
                    <Flex gap={10}>
                        <Flex height={150}>
                            <ScrollFlex>a</ScrollFlex>
                        </Flex>
                        <Flex width={150} height={150}>
                            <ScrollFlex autoWidth={false} autoHeight={false}>
                                abc
                            </ScrollFlex>
                        </Flex>
                        <Flex width={200} height={200}>
                            <ScrollFlex>{longText}</ScrollFlex>
                        </Flex>
                        <Flex width={150} height={150}>
                            <Flex>
                                <ScrollFlex>{longText}</ScrollFlex>
                            </Flex>
                        </Flex>
                        <Flex width={100} height={100}>
                            <Flex>
                                <Flex>
                                    <ScrollFlex>{longText}</ScrollFlex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Ref ile Göreli Yükseklik ve Genişlik", en: "Relative Height & Width by Ref" }}
                description={`You can set the height of ScrollFlex by referencing another DOM element that is not in the same region. You can use a React ref to point to this element. The "height" or "flexProps.height" props take precedence over the "heightByRef" and "heightById" props.

                    The same feature can be used for width via the "widthByRef" or "widthById" props.`}
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"

                       <Flex gap={10} align="stretch">
                        <Flex height={150} width={150} bgColor="aliceblue" ref={flexRef1}>
                            Source 150x150
                        </Flex>
                        <ScrollFlex heightByRef={flexRef1}>{longText}</ScrollFlex>
                       </Flex>`}
                example={
                    <Flex gap={10} align="stretch">
                        <Flex height={150} width={150} bgColor="aliceblue" ref={flexRef1}>
                            Source 150x150
                        </Flex>
                        <ScrollFlex heightByRef={flexRef1}>{longText}</ScrollFlex>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "DOM id ile Göreli Genişlik ve Yükseklik", en: "Relative Width & Height by DOM ID" }}
                description={{ tr: "heightByRef ile aynı mantıktadır, ancak kaynak element document.getElementById ile çözülür. Yüksekliğini yansıtmak istediğiniz elemente sayfada benzersiz ve sabit bir id verin. Açık height ve heightByRef, heightById üzerinde hâlâ önceliklidir. widthById genişlik için aynı şekilde çalışır.", en: "Works like heightByRef, but resolves the source element with document.getElementById. Use a stable, page-unique id on the element whose height you want to mirror. Explicit height and heightByRef still take precedence over heightById. widthById works the same way for width." }}
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"

                       <Flex gap={10} align="stretch">
                        <Flex
                            id={HEIGHT_BY_ID_DEMO_SOURCE}
                            height={150}
                            width={150}
                            bgColor="aliceblue"
                        >
                            Source 150x150
                        </Flex>
                        <ScrollFlex
                            widthById={HEIGHT_BY_ID_DEMO_SOURCE}
                            heightById={HEIGHT_BY_ID_DEMO_SOURCE}
                        >
                            {longText}
                        </ScrollFlex>
                       </Flex>`}
                example={
                    <Flex gap={10} align="stretch">
                        <Flex
                            id={HEIGHT_BY_ID_DEMO_SOURCE}
                            height={150}
                            width={150}
                            bgColor="aliceblue"
                        >
                            Source 150x150
                        </Flex>
                        <ScrollFlex
                            widthById={HEIGHT_BY_ID_DEMO_SOURCE}
                            heightById={HEIGHT_BY_ID_DEMO_SOURCE}
                        >
                            {longText}
                        </ScrollFlex>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Sürükleyerek Scroll (enableDragging)", en: "Drag-to-Scroll (enableDragging)" }}
                description={
                    <>
                        <code>enableDragging</code> is disabled by default. When set to{" "}
                        <code>true</code>, the scroll container shell shows the <code>grab</code> /{" "}
                        <code>grabbing</code> cursor and allows you to scroll the content both
                        horizontally and vertically by dragging with the mouse or touch. Dragging
                        will not start when interacting with links, buttons, or form elements inside
                        the scroll area.
                    </>
                }
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"

                       <ScrollFlex
                        enableDragging
                        width={180}
                        height={120}
                        flexProps={{ width: 400, height: 300 }}
                       >
                        <Flex
                            width={400}
                            height={300}
                            bgColor="mistyrose"
                            justify="center"
                            yAlign="center"
                        >
                            Large content — drag to scroll.
                        </Flex>
                       </ScrollFlex>`}
                example={
                    <ScrollFlex
                        enableDragging
                        width={180}
                        height={120}
                        flexProps={{
                            minWidth: 400,
                            height: 300,
                            bgColor: "mistyrose",
                        }}
                    >
                        Large content — drag to scroll.
                    </ScrollFlex>
                }
            />

            <Ds.block
                title={{ tr: "Varyantlar", en: "Variants" }}
                description={{ tr: "Base kütüphanesinin geri kalanında olduğu gibi varyantı prop ile veya Component.variantName compound component deseniyle değiştirebilirsiniz.", en: "As in the rest of Base, you can change the variant with a prop or through the Component.variantName compound-component pattern." }}
                code={`import { ScrollFlex } from "${SYS.basePath}";

                        <ScrollFlex ... />
                        <ScrollFlex.border ... /> // same as default
                        <ScrollFlex variant="shadow" ... />
                        <ScrollFlex.hoverShadow `}
                example={
                    <Ds.variant
                        variants={[
                            [
                                "default or border",
                                <Flex width={150} height={100} key="border">
                                    <ScrollFlex height={100}>{longText}</ScrollFlex>
                                </Flex>,
                            ],
                            [
                                "plain",
                                <Flex width={150} height={100} key="border">
                                    <ScrollFlex.plain height={100}>{longText}</ScrollFlex.plain>
                                </Flex>,
                            ],
                            [
                                "shadow",
                                <Flex width={150} height={100} key="shadow">
                                    <ScrollFlex.shadow height={100}>{longText}</ScrollFlex.shadow>
                                </Flex>,
                            ],
                            [
                                "hoverShadow",
                                <Flex width={150} height={100} key="hoverShadow">
                                    <ScrollFlex.hoverShadow height={100}>
                                        {longText}
                                    </ScrollFlex.hoverShadow>
                                </Flex>,
                            ],
                        ]}
                    />
                }
            />
            <Ds.api
                args="<ScrollFlex />"
                props={{
                    width: {
                        description: { tr: "ScrollBox genişliği. Verilmezse parent genişliğini kullanır.", en: "ScrollBox width. Uses parent width when omitted." },
                        type: "number | string",
                        defaultValue: "100%",
                    },
                    height: {
                        description: { tr: "ScrollFlex yüksekliği. Açık height, referans tabanlı yükseklik üzerinde önceliklidir.", en: "ScrollFlex height. Explicit height takes precedence over reference-based height." },
                        type: "number | string",
                    },
                    autoWidth: {
                        description: { tr: "true olduğunda (varsayılan) ve ScrollFlex, flexProps veya widthByRef/widthById üzerinde width verilmediğinde, genişlik içerik ile parent karşılaştırılarak seçilir (içerik küçük → içerik genişliği + yatay bar boşluğu; aksi halde max-width 100% ile parent genişliği).", en: "When true (default) and width is not set on ScrollFlex, flexProps, or through widthByRef/widthById, width is chosen from content versus parent (smaller content → content width + horizontal-bar gutter; otherwise parent width with max-width 100%)." },
                        type: "boolean",
                        defaultValue: "true",
                    },
                    autoHeight: {
                        description: { tr: "true olduğunda (varsayılan) ve ScrollFlex, flexProps veya heightByRef/heightById üzerinde height verilmediğinde, yükseklik içerik ile parent karşılaştırılarak seçilir (içerik küçük → içerik yüksekliği + dikey bar boşluğu; aksi halde max-height 100% ile parent yüksekliği).", en: "When true (default) and height is not set on ScrollFlex, flexProps, or through heightByRef/heightById, height is chosen from content versus parent (smaller content → content height + vertical-bar gutter; otherwise parent height with max-height 100%)." },
                        type: "boolean",
                        defaultValue: "true",
                    },
                    heightByRef: {
                        description: { tr: "height ve flexProps.height verilmediğinde React ref elementinin yüksekliğini kullanır.", en: "Uses a React ref element's height when height and flexProps.height are not provided." },
                        type: "React ref",
                    },
                    heightById: {
                        description: { tr: "height, flexProps.height ve heightByRef verilmediğinde DOM elementinin id üzerinden yüksekliğini kullanır.", en: "Uses a DOM element's height by id when height, flexProps.height, and heightByRef are not provided." },
                        type: "string",
                    },
                    widthByRef: {
                        description: { tr: "width ve flexProps.width verilmediğinde React ref elementinin genişliğini kullanır.", en: "Uses a React ref element's width when width and flexProps.width are not provided." },
                        type: "React ref",
                    },
                    widthById: {
                        description: { tr: "width, flexProps.width ve widthByRef verilmediğinde DOM elementinin id üzerinden genişliğini kullanır.", en: "Uses a DOM element's width by id when width, flexProps.width, and widthByRef are not provided." },
                        type: "string",
                    },
                    scrollBarProps: {
                        description: (
                            <>
                                {t({ tr: "Şuraya bakın: ", en: "See " })}<Button.string to="/design-system/scrollBar" label="ScrollBar" /> {t({ tr: "API'si.", en: " API." })}
                            </>
                        ),
                        type: "object",
                    },
                    flexProps: {
                        description: (
                            <>
                                {t({ tr: "Şuraya bakın: ", en: "See " })}<Button.string to="/design-system/flex" label="Flex" /> {t({ tr: "API'si.", en: " API." })}
                            </>
                        ),
                        type: "object",
                    },
                    enableDragging: {
                        description: { tr: "Varsayılan false'dur. true olduğunda shell içinde fareyle sürükleyerek hem yatay hem dikey scroll'u açar; imleç grab / grabbing olur. Drag-to-scroll interaktif alt elementlerden (buton, link, input vb.) başlamaz.", en: "Default is false. When true, dragging with the mouse enables both horizontal and vertical shell scrolling; the cursor becomes grab / grabbing. Drag-to-scroll does not start from interactive sub-elements (buttons, links, inputs, etc.)." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    padding: {
                        description: { tr: "ScrollFlex shell için padding değeri (içerik için değil; içerik padding'i için flexProps.padding kullanın). paddingTop gibi eksen propları da desteklenir.", en: "Padding value for the ScrollFlex shell, not its content. Use flexProps.padding for content padding. Axis props such as paddingTop are also supported." },
                        type: "number",
                        defaultValue: 0,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
