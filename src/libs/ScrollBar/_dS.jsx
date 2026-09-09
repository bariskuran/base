import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollBar } from "./";
import { generateRandom } from "../generateRandom";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { t } from "../getText";
import styled, { css } from "styled-components";
import { useRef } from "react";

const longText = generateRandom.loremIpsum(1000);
const shortText = generateRandom.loremIpsum(50);
const SOURCE_BY_ID = "ds-scrollbar-source-by-id-demo";

const flexProps = {
    width: 150,
    height: 100,
    bgColor: "aliceblue",
    yAlign: "start",
    xAlign: "start",
    overflow: "hidden",
    padding: 10,
};

const TwoAxisLargeContent = ({ children, childrenProps, short }) => (
    <Flex {...flexProps} childrenProps={childrenProps}>
        <div>{short ? shortText : longText}</div>
        {children}
    </Flex>
);

export const CustomVariant = styled.div`
    ${() => css`
        &[data-slot="track"] {
            background: skyblue;
            overflow: visible !important;
        }
        & > [data-slot="thumb"] {
            transform: scaleX(20);
            background: blue;
        }
    `}
`;

const X = () => {
    const flexRef1 = useRef(null);

    /* RETURN */
    return (
        <Ds.page
            title="<ScrollBar>"
            releasedOn="1.0.0"
            description={
                <>
                    {t({ tr: "ScrollBar, parent container'ın overflow davranışına göre özel scrollbar render eden gelişmiş bir yardımcıdır. X ve/veya Y eksenindeki taşmayı otomatik algılar, tarayıcının native scrollbar'larını gizler ve stillendirilmiş etkileşimli scrollbar ile değiştirir. Overlay modunda çalışır ve içerik için layout alanı ayırmaz. Günlük, layout açısından güvenli kullanım için ScrollFlex tercih edin.", en: "ScrollBar is an advanced utility that renders custom scrollbars from its parent container's overflow behaviour. It automatically detects overflow on the X and/or Y axis, hides native browser scrollbars, and replaces them with styled interactive scrollbars. It works in overlay mode and does not reserve layout space for content. For most layout-safe daily use cases, prefer ScrollFlex." })} <br />
                    <br />
                    {t({ tr: "Sayfa seviyesindeki (body/window) scroll alanını özelleştirmeniz gerektiğinde, temel düşük seviye kullanım alanı bu olduğu için ScrollBar doğrudan body prop'u ile kullanılmalıdır.", en: "When you need to customise the page-level (body/window) scroll area, use ScrollBar directly through the body prop; that is its primary low-level use case." })}
                    <br />
                    <br /> {t({ tr: "Yaygın kullanım için ", en: "See " })}<Button.string to="/design-system/scrollFlex" label="ScrollFlex" />{t({ tr: " sayfasına bakın.", en: " for common usage." })}
                </>
            }
        >
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
                description={{ tr: "ScrollBar parent container'ın varsayılan tarayıcı scrollbar'ını gizler ve gerekirse X/Y eksenleri için kendi scrollbar'ını gösterir. X veya Y için ayrıca yapılandırma gerekmez.", en: "ScrollBar hides the parent container's default browser scrollbar and shows its own scrollbar for the X and Y axes when needed. You do not need to configure either axis separately." }}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        const longText = generateRandom.loremIpsum(1000);
                        const shortText = generateRandom.loremIpsum(50);

                        const TwoAxisLargeContent = ({ children, childrenProps, short }) => (
                            <Flex
                                width={150}
                                height={100}
                                bgColor="aliceblue"
                                yAlign="start"
                                overflow="hidden"
                                padding={10}
                                childrenProps={childrenProps}
                            >
                                <div>{short ? shortText : longText}</div>
                                {children}
                            </Flex>
                        );

                        <Flex gap={10}>
                            <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                                <ScrollBar />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent childrenProps={[{ width: 1500 }]} short>
                                <ScrollBar />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar />
                            </TwoAxisLargeContent>
                        </Flex>`}
                example={
                    <Flex gap={10}>
                        <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent childrenProps={[{ width: 1500 }]} short>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Ekseni Devre Dışı Bırakma", en: "Disabling Axis" }}
                description={{ tr: "disableX veya disableY proplarıyla belirli bir eksendeki scrollbar devre dışı bırakılabilir. ScrollBar, hangi eksenin scroll'u tetikleyeceğine otomatik karar verir. Y ekseni yoksa veya kapalıysa Y scroll tetikleyicisi X eksenini de scroll eder.", en: "You can disable a specific axis with disableX or disableY. ScrollBar automatically decides which axis should trigger scrolling. If the Y axis is absent or disabled, Y scroll input also drives the X axis." }}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <Flex gap={10}>
                            <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                                <ScrollBar disableX />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                                <ScrollBar disableY />
                            </TwoAxisLargeContent>
                        </Flex>`}
                example={
                    <Flex gap={10}>
                        <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                            <ScrollBar disableX />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                            <ScrollBar disableY />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Mirror ve Opposite Konumu", en: "Mirror and Opposite Position" }}
                description={`The "mirror" and "opposite" props determine the position of the scrollBar. The "mirror" prop mirrors the scrollBar's position — for example, a scrollBar that would normally appear on the left is instead positioned on the right. For the x-axis, a scrollBar that would be at the bottom is instead shown at the top.

                    The "opposite" prop visually swaps the x and y axes. For example, the scrollBar for the y-axis is displayed where the x-axis scrollBar would usually be (at the bottom). This is only a visual change; axis functionality remains the same.

                    Both props can be used together.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <Flex gap={10}>
                            <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                                <ScrollBar disableX />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                                <ScrollBar disableY />
                            </TwoAxisLargeContent>
                        </Flex>`}
                example={
                    <Flex gap={10}>
                        <TwoAxisLargeContent>
                            <ScrollBar mirror />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar opposite />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar opposite mirror />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Stil", en: "Styling" }}
                description={`trackMargin, edgeMargin, truckColor, thumbColor, thickness, maxLength, minThumbLenght, exactThumbSize props are avaliable for styling.
                `}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <Flex gap={10} wrap>
                            <TwoAxisLargeContent>
                                <ScrollBar thickness={10} />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar maxLength={50} />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar minThumbLength={5} />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar truckColor="red" />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar thumbColor="primary" />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar trackMargin={30} />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar edgeMargin={30} />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar exactThumbSize={3} />
                            </TwoAxisLargeContent>
                            <TwoAxisLargeContent>
                                <ScrollBar disableOpacityEffect />
                            </TwoAxisLargeContent>
                        </Flex>`}
                example={
                    <Flex gap={10} wrap>
                        <TwoAxisLargeContent>
                            <ScrollBar thickness={10} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar maxLength={50} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar minThumbLength={5} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar truckColor="red" />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar thumbColor="primary" />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar trackMargin={30} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar edgeMargin={30} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar exactThumbSize={3} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar disableOpacityEffect />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Thumb Scale'i Etkinleştirme", en: "Enable Thumb Scale" }}
                description={`As default, the thumb scale effect is disabled. You can enable it by using the enableThumbScale prop.

                Keep in mind, a variant can override this prop.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <TwoAxisLargeContent>
                            <ScrollBar enableThumbScale />
                        </TwoAxisLargeContent>`}
                example={
                    <TwoAxisLargeContent>
                        <ScrollBar enableThumbScale />
                    </TwoAxisLargeContent>
                }
            />
            <Ds.block
                title="fillMode"
                description={`You can change the behavior of the thumb. When you enable this prop, the thumb will fill the entire track area. fillMode ignores minThumbLength, exactThumbSize props.

                    fillMode also ignores mouse thumb dragging. Because there is no thumb to drag.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <TwoAxisLargeContent childrenProps={[{ width: 1500 }]}>
                            <ScrollBar fillMode />
                        </TwoAxisLargeContent>`}
                example={
                    <TwoAxisLargeContent>
                        <ScrollBar fillMode thumbColor="primary" />
                    </TwoAxisLargeContent>
                }
            />
            <Ds.block
                title={{ tr: "Harici bir elementi scroll etme", en: "Scrolling an External Element" }}
                description={`ScrollBar normally scrolls the parent container automatically. However, you can scroll an external element by using the sourceByRef or sourceById props.

                    This gives you flexibility with the position of the ScrollBar. When either of these two props is enabled, automatic positioning props such as mirror and opposite, as well as positioning-related props like trackMargin and edgeMargin, are disabled.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <Flex {...flexProps} ref={flexRef1}>
                            {longText}
                        </Flex>
                        <Flex {...flexProps} id={SOURCE_BY_ID}>
                            {longText}
                        </Flex>
                        <Flex
                            width={150}
                            height={150}
                            bgColor="aliceblue"
                            aria-label="source by ref"
                        >
                            <ScrollBar sourceByRef={flexRef1} />
                        </Flex>
                        <Flex width={20} height={200}>
                            <ScrollBar sourceById={SOURCE_BY_ID} />
                        </Flex>`}
                example={
                    <Flex gap={10}>
                        <Flex {...flexProps} ref={flexRef1}>
                            {longText}
                        </Flex>
                        <Flex {...flexProps} id={SOURCE_BY_ID}>
                            {longText}
                        </Flex>
                        <Flex
                            width={150}
                            height={150}
                            bgColor="aliceblue"
                            aria-label="source by ref"
                        >
                            <ScrollBar sourceByRef={flexRef1} />
                        </Flex>
                        <Flex width={20} height={200}>
                            <ScrollBar sourceById={SOURCE_BY_ID} />
                        </Flex>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Varyantlar", en: "Variants" }}
                description={{ tr: "Base kütüphanesinin geri kalanında olduğu gibi, varyantı prop ile veya Component.variantName compound component deseniyle değiştirebilirsiniz.", en: "As in the rest of Base, you can change the variant with a prop or through the Component.variantName compound-component pattern." }}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <ScrollBar />
                        <ScrollBar variant="primary" />
                        <ScrollBar.fullTop />`}
                example={
                    <Ds.variant
                        variants={[
                            [
                                "default",
                                <TwoAxisLargeContent key="default">
                                    <ScrollBar />
                                </TwoAxisLargeContent>,
                            ],
                            [
                                "primary",
                                <TwoAxisLargeContent key="primary">
                                    <ScrollBar variant="primary" />
                                </TwoAxisLargeContent>,
                            ],
                            [
                                "fullTop",
                                <TwoAxisLargeContent key="fullTop">
                                    <ScrollBar.fullTop />
                                </TwoAxisLargeContent>,
                            ],
                        ]}
                    />
                }
            />
            <Ds.block
                title={{ tr: "Özel Varyant", en: "Custom Variant" }}
                description={`As shown in the example code, you can fully style the track and thumb using your own custom CSS. Since some styles are set by the component itself, you may need to use !important to override them.

                I can't fully guarantee all behaviors when using custom variants. Therefore, please be careful and test thoroughly when creating your own variant.`}
                code={`import { ScrollBar, styled, css } from "${SYS.basePath}";

                        export const CustomVariant = styled.div\`
                            ${() => css`
                                &[data-slot="track"] {
                                    background: skyblue;
                                    overflow: visible !important;
                                }
                                & > [data-slot="thumb"] {
                                    transform: scaleX(20);
                                    background: blue;
                                }
`}
                        \`};

                        <TwoAxisLargeContent>
                            <ScrollBar variant={CustomVariant} />
                        </TwoAxisLargeContent>
`}
                example={
                    <Flex gap={10}>
                        <TwoAxisLargeContent>
                            <ScrollBar variant={CustomVariant} thickness={2} enableThumbScale />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Body Entegrasyonu", en: "Body Integration" }}
                description={`'body' prop can be used to integrate the ScrollBar into the body of the page.

                    You should place it on layout level and enable 'body' prop. It will add a new scrollbar to the body of the page.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <AppLevelContainer>
                            <ScrollBar body />
                        </AppLevelContainer>`}
            />
            <Ds.api
                args="<ScrollBar />"
                props={{
                    body: {
                        description: { tr: "Parent container scroll'u yerine sayfa/window scroll'unu kullanır. Sayfa seviyesindeki özel scrollbar kullanımı için önerilir.", en: "Uses page/window scrolling instead of parent-container scrolling. Recommended for page-level custom scrollbar usage." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    sourceByRef: {
                        description: { tr: "Harici bir scroll elementini ref ile kontrol eder.", en: "Controls an external scroll element through a ref." },
                        type: "React ref | HTMLElement",
                    },
                    sourceById: {
                        description: { tr: "Harici bir scroll elementini DOM id ile kontrol eder.", en: "Controls an external scroll element through a DOM id." },
                        type: "string",
                    },
                    positionSourceByRef: {
                        description: { tr: "Scrollbar konumlandırmasında hangi elementin kullanılacağını ref ile belirler. Verilmezse source elementi kullanılır.", en: "Controls which element is used for scrollbar positioning through a ref. When omitted, the source element is used." },
                        type: "React ref | HTMLElement",
                    },
                    variant: {
                        description: { tr: "Scrollbar track'ini render eden görsel varyant componenti.", en: "Visual variant component used to render the scrollbar track." },
                        type: "React component",
                        defaultValue: "DefaultVariant",
                    },
                    disableX: {
                        description: { tr: "Yatay scrollbar'ı kapatır ve yatay scroll'u engeller.", en: "Disables the horizontal scrollbar and prevents horizontal scrolling." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disableY: {
                        description: { tr: "Dikey scrollbar'ı kapatır ve dikey scroll'u engeller. Yatay taşma varsa dikey wheel hareketi yine yatay scroll'u sürebilir.", en: "Disables the vertical scrollbar and prevents vertical scrolling. If horizontal overflow exists, vertical wheel input can still drive horizontal scrolling." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    opposite: {
                        description: { tr: "Scrollbar'ın görsel yönünü değiştirir. Y ekseni yatay, X ekseni dikey gösterilir.", en: "Swaps the scrollbar's visual orientation. The Y axis is shown horizontally and the X axis vertically." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    mirror: {
                        description: { tr: "Scrollbar yerleşimini aynalar. Dikey barlar sağdan sola, yatay barlar alttan üste taşınır.", en: "Mirrors scrollbar placement. Vertical bars move from right to left and horizontal bars from bottom to top." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    truckColor: {
                        description: { tr: "Scrollbar track rengi.", en: "Colour of the scrollbar track." },
                        type: "string",
                        defaultValue: "theme.foreground",
                    },
                    thumbColor: {
                        description: { tr: "Scrollbar thumb rengi.", en: "Colour of the scrollbar thumb." },
                        type: "string",
                        defaultValue: "truckColor",
                    },
                    thickness: {
                        description: { tr: "rem cinsinden scrollbar kalınlığı.", en: "Scrollbar thickness in rem." },
                        type: "number",
                        defaultValue: "4",
                    },
                    maxLength: {
                        description: { tr: "Scroll host'un yüzdesi olarak maksimum track uzunluğu. Verildiğinde track ana ekseninde ortalanır.", en: "Maximum track length as a percentage of the scroll host. When provided, the track is centred on its main axis." },
                        type: "number",
                    },
                    trackMargin: {
                        description: { tr: "Track yönündeki iki uçta boşluk. Önceki adı marginToSide idi.", en: "Spacing at both ends of the track along its direction. Formerly marginToSide." },
                        type: "number",
                        defaultValue: "5",
                    },
                    edgeMargin: {
                        description: { tr: "Scrollbar ile en yakın container/sayfa kenarı arasındaki mesafe. Önceki adı marginToBorder idi.", en: "Distance between the scrollbar and the nearest container/page edge. Formerly marginToBorder." },
                        type: "number",
                        defaultValue: "5",
                    },
                    edgeMarginX: {
                        description: { tr: "Yatay konumda render edilen scrollbar'lar için kenar boşluğu. Yatay barlarda edgeMargin'i ezer.", en: "Edge margin for scrollbars rendered horizontally. Overrides edgeMargin for horizontal bars." },
                        type: "number",
                    },
                    edgeMarginY: {
                        description: { tr: "Dikey konumda render edilen scrollbar'lar için kenar boşluğu. Dikey barlarda edgeMargin'i ezer.", en: "Edge margin for scrollbars rendered vertically. Overrides edgeMargin for vertical bars." },
                        type: "number",
                    },
                    minThumbLength: {
                        description: { tr: "Thumb boyutu otomatik hesaplandığında piksel cinsinden minimum thumb uzunluğu.", en: "Minimum thumb length in pixels when thumb size is calculated automatically." },
                        type: "number",
                        defaultValue: "24",
                    },
                    exactThumbSize: {
                        description: { tr: "Thumb uzunluğunu sabit piksel değerine zorlar. fillMode açıkken yok sayılır.", en: "Forces thumb length to a fixed pixel value. Ignored when fillMode is enabled." },
                        type: "number",
                    },
                    fillMode: {
                        description: { tr: "Thumb'ı track başlangıcından itibaren progress fill olarak render eder. Sürükleme kapalıdır; track'e tıklamak yine scroll eder.", en: "Renders the thumb as a progress fill from the start of the track. Dragging is disabled, but clicking the track still scrolls." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    exportData: {
                        description: { tr: "Gelişmiş entegrasyonlar için dahili ScrollBar state ve handler'larını dışa aktarır.", en: "Exports internal ScrollBar state and handlers for advanced integrations." },
                        type: "string | object",
                    },
                    enableThumbScale: {
                        description: { tr: "Thumb scale efektini açar. Bir varyant iç scale efekti kullanıyorsa bu prop yok sayılabilir.", en: "Enables the thumb scale effect. This prop may be ignored if a variant uses an inner scale effect." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disableOpacityEffect: {
                        description: { tr: "Destekleyen varyantlarda pasif opacity efektini kapatır. Davranış varyant tabanlıdır; özel varyantlar yok sayabilir.", en: "Disables the inactive opacity effect for supporting variants. The behaviour is variant-based and custom variants may ignore it." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;
