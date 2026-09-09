import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "./";

const Item = () => (
    <Flex bgColor="greys.shade20" width={50} height={50}>
        item
    </Flex>
);

const Box = ({ c = "#ddd", t }) => (
    <div style={{ background: c, padding: 8, borderRadius: 6 }}>{t}</div>
);

const X = () => (
    <Ds.page
        title="<Flex>"
        releasedOn="1.0.0"
        description={{
            tr: "Esnek yerleşim yardımcı componentidir. Flex hem yardımcı propları hem de doğrudan CSS benzeri flex proplarını destekler.",
            en: "Flexible layout utility component. Flex supports both helper props and direct CSS-like flex props.",
        }}
    >
        <Ds.block
            title={{ tr: "Yön ve Hizalama", en: "Direction + Alignment" }}
            description={{
                tr: "Flex hem yardımcı propları hem de doğrudan CSS benzeri flex proplarını destekler. İçeriği hızlıca hizalamak için justify, align, xAlign ve yAlign gibi kısaltmalar kullanılabilir. xAlign ve yAlign sırasıyla align ve justify için alias'tır.",
                en: "Flex supports both helper props and direct CSS-like flex props. Use shorthands such as justify, align, xAlign, and yAlign to align content quickly. xAlign and yAlign are aliases for align and justify respectively.",
            }}
            code={`import { Flex } from "${SYS.basePath}";

                   <Flex gap={10} padding={8}>
                   <div>A</div><div>B</div><div>C</div>
                   </Flex>
                   <Flex.column gap={10} padding={8}>
                   <div>A</div><div>B</div><div>C</div>
                   </Flex.column>
                   <Flex gap={5} bgColor="#fff" padding={5} alignSelf="end">
                   <div>A</div><div>B</div><div>C</div>
                   </Flex>
                   <Flex direction="column-reverse gap={10} padding={8} >
                   <div>A</div><div>B</div><div>C</div>
                   </Flex>`}
            example={
                <Flex direction="row" gap={10} aria-label="Block1" align="start">
                    <Flex gap={10} bgColor="#fff" padding={8}>
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
                    <Flex direction="column" gap={10} bgColor="#fff" padding={8}>
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
                    <Flex gap={10} bgColor="#fff" padding={8} alignSelf="end">
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
                    <Flex direction="column-reverse" gap={10} bgColor="#fff" padding={8}>
                        <Box t="A" />
                        <Box t="B" />
                        <Box t="C" />
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Prop Yönetimi", en: "Props Management" }}
            description={{ tr: "Flex hem yardımcı propları hem de doğrudan CSS benzeri flex proplarını destekler. Örneğin justify-content ve justifyContent birlikte desteklenir.", en: "Flex supports both helper props and direct CSS-like flex props. For example, both justify-content and justifyContent are supported." }}
            code={`import { Flex } from "${SYS.basePath}";

                   <Flex direction="row" gap={8}>
                    <Flex height={120} bgColor="#dbeafe" alignItems="end"> A </Flex>
                    <Flex height={120} bgColor="#dbeafe" yAlign="end"> B </Flex>
                    <Flex height={120} bgColor="#dbeafe" align-items="end"> B </Flex>
                   </Flex>`}
            example={
                <Flex direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex height={120} bgColor="#dbeafe" alignItems="end">
                        A
                    </Flex>
                    <Flex height={120} bgColor="#dbeafe" yAlign="end">
                        B
                    </Flex>
                    <Flex height={120} bgColor="#dbeafe" align-items="end">
                        C
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Boyutlandırma ve Flex Item Propları", en: "Sizing + Flex Item Props" }}
            description={{ tr: "Boyutlandırma propları CSS flex ile aynı davranır.", en: "The sizing props behave exactly like CSS flex." }}
            code={`import { Flex } from "${SYS.basePath}";

                   <Flex width={200} direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex width={50} bgColor="#dbeafe" padding={6}>
                        Fixed
                    </Flex>
                    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>
                        Grow
                    </Flex>
                   </Flex>`}
            example={
                <Flex width={200} direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex width={50} bgColor="#dbeafe" padding={6}>
                        Fixed
                    </Flex>
                    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>
                        Grow
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title="full"
            description={{ tr: 'width="100%" yazmak yerine boolean full propunu kullanın. Parent bir flex container olduğunda (display: flex veya inline-flex), Flex itemın satırı doldurması için flex: 1 1 100% de uygular. width verilmişse full yok sayılır. Responsive breakpointlerle çalışır.', en: 'Instead of writing width="100%", use the boolean full prop. When the parent is a flex container (display: flex or inline-flex), Flex also applies flex: 1 1 100% so the item fills the row. If width is provided, full is ignored. Works with responsive breakpoints.' }}
            code={`import { Flex } from "${SYS.basePath}";

                   <Flex full direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                     <Flex width={50} bgColor="#dbeafe" padding={6}>Fixed</Flex>
                     <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>Grow</Flex>
                   </Flex>`}
            example={
                <Flex full direction="row" gap={8} bgColor="#f8f8f8" padding={8}>
                    <Flex width={50} bgColor="#dbeafe" padding={6}>
                        Fixed
                    </Flex>
                    <Flex flex="1 1 auto" bgColor="#dcfce7" padding={6}>
                        Grow
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "childrenCommon, childrenProps ve iç içe çocuklar", en: "childrenCommon + childrenProps + nested children" }}
            description={{ tr: "childrenCommon tüm çocuklara temel bir prop seti verir; childrenProps ise her çocuğa sırasıyla prop eklemenizi veya prop ezmenizi sağlar. Daha temiz bir arayüz kurulmasına yardımcı olur.", en: "childrenCommon provides a base set of props to all children; childrenProps lets you add or override props for each child in order. This enables a cleaner UI." }}
            code={`import { Flex } from "${SYS.basePath}";

                   <Flex gap={8} childrenCommon={{ bgColor: "#fff", padding: 8 }} childrenProps={[{}, { bgColor: "#ff0000" }, { padding: 0, alignSelf: "end" }]} >
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                   </Flex>
                   <Flex gap={5} padding={2} childrenProps={[ { width: 20, bgColor: "#ffd6d6", direction: "column", gap: 10, childrenProps: [ { bgColor: "#ff0000", padding: 10 }, { bgColor: "#00ff00", padding: 10 }, ], }, { width: 0, bgColor: "#d6ffd6", }, ]} >
                    <div>
                        <div>nested 1</div>
                        <div>nested 2</div>
                    </div>
                    <div>content area</div>
                   </Flex>`}
            example={
                <Flex gap={8}>
                    <Flex
                        gap={8}
                        childrenCommon={{ bgColor: "#fff", padding: 8 }}
                        childrenProps={[
                            {},
                            { bgColor: "#ff0000" },
                            { padding: 0, alignSelf: "end" },
                        ]}
                    >
                        <div>A</div>
                        <div>B</div>
                        <div>C</div>
                    </Flex>
                    <Flex
                        gap={5}
                        padding={2}
                        childrenProps={[
                            {
                                width: 20,
                                bgColor: "#ffd6d6",
                                direction: "column",
                                gap: 10,
                                childrenProps: [
                                    { bgColor: "#ff0000", padding: 10 },
                                    { bgColor: "#00ff00", padding: 10 },
                                ],
                            },
                            {
                                width: 0,
                                bgColor: "#d6ffd6",
                            },
                        ]}
                    >
                        <div>
                            <div>nested 1</div>
                            <div>nested 2</div>
                        </div>
                        <div>content area</div>
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "padding ve margin kısaltmaları", en: "padding & margin shorthands" }}
            code={`import { Flex } from "${SYS.basePath}";

`}
            example={
                <Flex
                    gap={8}
                    childrenCommon={{ bgColor: "aliceblue", gap: 5, padding: 5 }}
                    align="start"
                >
                    <Flex padding="10 20 30 40">
                        <Item>padding 1 2 3 4</Item>
                        <Item>test</Item>
                    </Flex>
                    <Flex padding="1 1 1 1" paddingLeft={50}>
                        <Item>paddingLeft override</Item>
                        <Item>test</Item>
                    </Flex>
                    <Flex margin="20 30">
                        <Item>margin 2 3</Item>
                        <Item>test</Item>
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Responsive özellik", en: "Responsive Feature" }}
            description={{ tr: "responsive prop'u, Flex containerını farklı ekran boyutları için özelleştirmenizi sağlar.", en: "The responsive prop lets you customise the Flex container for different screen sizes." }}
            code={`import { Flex } from "${SYS.basePath}";

                   <Flex gap={2} padding={2} bgColor="#ff0000" responsive={{ tablet: { direction: "column", bgColor: "#00ff00" }, }} >
                    <Item>Responsive 1</Item>
                    <Item>Responsive 2</Item>
                   </Flex>
                   <Flex gap={5} padding={5} childrenProps={[{ width: 10, bgColor: "#ffd6d6" }, { bgColor: "#d6ffd6" }]} responsive={{ phone: { direction: "column", childrenProps: [ { full: true, bgColor: "#red" }, { full: true, bgColor: "#green" }, ], }, }} >
                    <div>Responsive child 1</div>
                    <div>Responsive child 2</div>
                   </Flex>`}
            example={
                <Flex gap={10}>
                    <Flex
                        gap={2}
                        padding={2}
                        bgColor="#ff0000"
                        responsive={{
                            tablet: { direction: "column", bgColor: "#00ff00" },
                        }}
                    >
                        <Item>Responsive 1</Item>
                        <Item>Responsive 2</Item>
                    </Flex>
                    <Flex
                        gap={5}
                        padding={5}
                        childrenProps={[{ width: 10, bgColor: "#ffd6d6" }, { bgColor: "#d6ffd6" }]}
                        responsive={{
                            phone: {
                                direction: "column",
                                childrenProps: [
                                    { full: true, bgColor: "#red" },
                                    { full: true, bgColor: "#green" },
                                ],
                            },
                        }}
                    >
                        <div>Responsive child 1</div>
                        <div>Responsive child 2</div>
                    </Flex>
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Typo entegrasyonu", en: "Typo Integration" }}
            description={{ tr: 'İçeriği Typo ile sarar: typo="h6" → Typo.h6. typography nesnesinde type ve Typo propları birlikte verilir.', en: 'Wraps content with Typo: typo="h6" → Typo.h6. The typography object provides type together with Typo props.' }}
            code={`import { Flex } from "${SYS.basePath}";

                   <Flex typo="h6" padding={12}>
                    h6
                   </Flex>
                   <Flex typography={{ type: "p", bold: true }} padding={12}>
                    typography item, bold is true
                   </Flex>
`}
            example={
                <Flex.column gap={8}>
                    <Flex typo="h6" padding={12}>
                        h6
                    </Flex>
                    <Flex typography={{ type: "p", bold: true }} padding={12}>
                        typography item, bold is true
                    </Flex>
                </Flex.column>
            }
        />
        <Ds.api
            args="<Flex />"
            props={{
                variant: {
                    description: { tr: "Varyant ön ayarı veya özel varyant.", en: "Variant preset or custom variant." },
                    type: "string | component",
                    defaultValue: '"default"',
                },
                children: {
                    description: { tr: "Çocuklar/içerik.", en: "Children/content." },
                    type: "ReactNode",
                },
                bgColor: {
                    description: { tr: "Arka plan rengi.", en: "Background color." },
                    type: "string",
                },
                color: {
                    description: { tr: "Metin rengi.", en: "Text color." },
                    type: "string",
                },
                borderRadius: {
                    description: { tr: "Köşe yarıçapı.", en: "Border radius." },
                    type: "number | string",
                },
                border: {
                    description: { tr: 'Tüm kenarlardaki border. Kısaltma: width style color (ör. "1px solid greys.shade40"). Renkler theme path, hex, rgb/rgba ve adlandırılmış CSS renklerini destekler.', en: 'Border on all sides. Shorthand: width style color (e.g. "1px solid greys.shade40"). Colors support theme paths, hex, rgb/rgba, and named CSS colors.' },
                    type: "string | number",
                },
                borderTop: {
                    description: { tr: "Üst border. border ile aynı değer formatı.", en: "Top border. Same value format as border." },
                    type: "string | number",
                },
                borderRight: {
                    description: { tr: "Sağ border. border ile aynı değer formatı.", en: "Right border. Same value format as border." },
                    type: "string | number",
                },
                borderBottom: {
                    description: { tr: "Alt border. border ile aynı değer formatı.", en: "Bottom border. Same value format as border." },
                    type: "string | number",
                },
                borderLeft: {
                    description: { tr: "Sol border. border ile aynı değer formatı.", en: "Left border. Same value format as border." },
                    type: "string | number",
                },
                borderInline: {
                    description: { tr: "Mantıksal inline eksen border'ı (LTR'de sol+sağ).", en: "Logical inline-axis border (left+right in LTR)." },
                    type: "string | number",
                },
                borderBlock: {
                    description: { tr: "Mantıksal block eksen border'ı (üst+alt).", en: "Logical block-axis border (top+bottom)." },
                    type: "string | number",
                },
                borderInlineStart: {
                    description: { tr: "Mantıksal inline başlangıç border'ı.", en: "Logical inline-start border." },
                    type: "string | number",
                },
                borderInlineEnd: {
                    description: { tr: "Mantıksal inline bitiş border'ı.", en: "Logical inline-end border." },
                    type: "string | number",
                },
                borderBlockStart: {
                    description: { tr: "Mantıksal block başlangıç border'ı.", en: "Logical block-start border." },
                    type: "string | number",
                },
                borderBlockEnd: {
                    description: { tr: "Mantıksal block bitiş border'ı.", en: "Logical block-end border." },
                    type: "string | number",
                },
                direction: {
                    description: { tr: "row | column | row-reverse | column-reverse | x | y.", en: "row | column | row-reverse | column-reverse | x | y." },
                    type: "string",
                    defaultValue: '"row"',
                },
                flexFlow: {
                    description: { tr: "CSS flex-flow kısaltması.", en: "CSS flex-flow shorthand." },
                    type: "string",
                },
                flex: {
                    description: { tr: "CSS flex kısaltması.", en: "CSS flex shorthand." },
                    type: "string | number",
                },
                flexGrow: {
                    description: { tr: "CSS flex-grow. Alias'lar: grow, flex-grow.", en: "CSS flex-grow. Aliases: grow, flex-grow." },
                    type: "string | number",
                },
                flexShrink: {
                    description: { tr: "CSS flex-shrink. Alias'lar: shrink, flex-shrink.", en: "CSS flex-shrink. Aliases: shrink, flex-shrink." },
                    type: "string | number",
                },
                flexBasis: {
                    description: { tr: "CSS flex-basis. Alias'lar: basis, flex-basis.", en: "CSS flex-basis. Aliases: basis, flex-basis." },
                    type: "string | number",
                },
                order: {
                    description: { tr: "CSS order.", en: "CSS order." },
                    type: "string | number",
                },
                width: {
                    description: { tr: "Genişlik.", en: "Width." },
                    type: "number | string",
                    defaultValue: '"100%" (root)',
                },
                full: {
                    description: { tr: "width verilmediğinde genişliği 100% yapar. Parent bir flex container ise flex: 1 1 100% de uygular (display:flex olan HTML div dahil). width veya flex/flexGrow/flexShrink/flexBasis verildiğinde yok sayılır.", en: "When width is omitted, sets width to 100%. If the parent is a flex container, also sets flex to 1 1 100% (including an HTML div with display:flex). Ignored when width or flex/flexGrow/flexShrink/flexBasis is set." },
                    type: "boolean",
                },
                height: {
                    description: { tr: "Yükseklik.", en: "Height." },
                    type: "number | string",
                },
                maxWidth: {
                    description: { tr: "Maksimum genişlik.", en: "Maximum width." },
                    type: "number | string",
                },
                maxHeight: {
                    description: { tr: "Maksimum yükseklik.", en: "Maximum height." },
                    type: "number | string",
                },
                minWidth: {
                    description: { tr: "Minimum genişlik.", en: "Minimum width." },
                    type: "number | string",
                },
                minHeight: {
                    description: { tr: "Minimum yükseklik.", en: "Minimum height." },
                    type: "number | string",
                },
                padding: {
                    description: { tr: "Padding kısaltması.", en: "Padding shorthand." },
                    type: "number | string",
                },
                paddingTop: {
                    description: { tr: "Üst padding.", en: "Padding top." },
                    type: "number | string",
                },
                paddingRight: {
                    description: { tr: "Sağ padding.", en: "Padding right." },
                    type: "number | string",
                },
                paddingBottom: {
                    description: { tr: "Alt padding.", en: "Padding bottom." },
                    type: "number | string",
                },
                paddingLeft: {
                    description: { tr: "Sol padding.", en: "Padding left." },
                    type: "number | string",
                },
                margin: {
                    description: { tr: "Margin kısaltması.", en: "Margin shorthand." },
                    type: "number | string",
                },
                marginTop: {
                    description: { tr: "Üst margin.", en: "Margin top." },
                    type: "number | string",
                },
                marginRight: {
                    description: { tr: "Sağ margin.", en: "Margin right." },
                    type: "number | string",
                },
                marginBottom: {
                    description: { tr: "Alt margin.", en: "Margin bottom." },
                    type: "number | string",
                },
                marginLeft: {
                    description: { tr: "Sol margin.", en: "Margin left." },
                    type: "number | string",
                },
                align: {
                    description: { tr: "Her iki eksen için hizalama kısaltması.", en: "Shorthand alignment for both axes." },
                    type: "string",
                },
                xAlign: {
                    description: { tr: "Ana eksen hizalama yardımcısı.", en: "Main-axis alignment helper." },
                    type: "string",
                },
                yAlign: {
                    description: { tr: "Çapraz eksen hizalama yardımcısı.", en: "Cross-axis alignment helper." },
                    type: "string",
                },
                justify: {
                    description: { tr: "justify-content alias'ı.", en: "justify-content alias." },
                    type: "string",
                },
                justifyContent: {
                    description: { tr: "CSS justify-content.", en: "CSS justify-content." },
                    type: "string",
                },
                alignItems: {
                    description: { tr: "CSS align-items.", en: "CSS align-items." },
                    type: "string",
                },
                alignSelf: {
                    description: { tr: "CSS align-self.", en: "CSS align-self." },
                    type: "string",
                },
                justifySelf: {
                    description: { tr: "CSS justify-self.", en: "CSS justify-self." },
                    type: "string",
                },
                alignContent: {
                    description: { tr: "CSS align-content.", en: "CSS align-content." },
                    type: "string",
                },
                placeContent: {
                    description: { tr: "CSS place-content kısaltması.", en: "CSS place-content shorthand." },
                    type: "string",
                },
                placeItems: {
                    description: { tr: "CSS place-items kısaltması.", en: "CSS place-items shorthand." },
                    type: "string",
                },
                placeSelf: {
                    description: { tr: "CSS place-self kısaltması.", en: "CSS place-self shorthand." },
                    type: "string",
                },
                gap: {
                    description: { tr: "Boşluk.", en: "Gap." },
                    type: "number | string",
                    defaultValue: "0",
                },
                rowGap: {
                    description: { tr: "Satır boşluğu.", en: "Row gap." },
                    type: "number | string",
                },
                columnGap: {
                    description: { tr: "Kolon boşluğu.", en: "Column gap." },
                    type: "number | string",
                },
                wrap: {
                    description: { tr: "Satır kırma modu.", en: "Wrap mode." },
                    type: "boolean | string",
                },
                overflow: {
                    description: { tr: "Overflow kısaltması (CSS).", en: "Overflow shorthand (CSS)." },
                    type: "string",
                },
                overflowX: {
                    description: { tr: "overflow-x.", en: "overflow-x." },
                    type: "string",
                },
                overflowY: {
                    description: { tr: "overflow-y.", en: "overflow-y." },
                    type: "string",
                },
                userSelect: {
                    description: { tr: "CSS user-select (ör. none, text, all, auto). Kebab-case user-select kabul edilir.", en: "CSS user-select (e.g. none, text, all, auto). Kebab-case user-select is accepted." },
                    type: "string | boolean",
                },
                textAlign: {
                    description: { tr: "CSS text-align (ör. start, end, left, right, center, justify). Kebab-case text-align kabul edilir.", en: "CSS text-align (e.g. start, end, left, right, center, justify). Kebab-case text-align is accepted." },
                    type: "string",
                },
                scale: {
                    description: { tr: "Tekdüze scale (transform). 3'ten büyük sayı veya % yüzde kabul edilir (110 → scale(110%)); daha küçük sayılar birimsizdir (1.1 → scale(1.1)). Boşlukla ayrılan iki değer scale(sx, sy) olur. scaleX/scaleY verildiğinde yok sayılır. Kebab-case kullanılmaz; eksenler için scaleX/scaleY alias'larını kullanın.", en: "Uniform scale (transform). A number >3 or % is treated as percent (110 → scale(110%)); smaller numbers are unitless (1.1 → scale(1.1)). Two space-separated values become scale(sx, sy). Ignored when scaleX/scaleY are set. Kebab-case is not used; use scaleX/scaleY aliases for axes." },
                    type: "number | string",
                },
                scaleX: {
                    description: { tr: "Yatay scale (scaleX). scale-x kebab alias'ını kabul eder. scale ile aynı değer kuralları geçerlidir.", en: "Horizontal scale (scaleX). Accepts the scale-x kebab alias. Uses the same value rules as scale." },
                    type: "number | string",
                },
                scaleY: {
                    description: { tr: "Dikey scale (scaleY). scale-y kebab alias'ını kabul eder. scale ile aynı değer kuralları geçerlidir.", en: "Vertical scale (scaleY). Accepts the scale-y kebab alias. Uses the same value rules as scale." },
                    type: "number | string",
                },
                transformOrigin: {
                    description: { tr: "CSS transform-origin. Kısaltma: origin. Kebab-case transform-origin kabul edilir. Anahtar kelimeler (center, top, left, …); 0–100 sayıları % olur (50 → 50%); daha büyük sayılar cssNormalizeSize aracılığıyla rem kullanır.", en: "CSS transform-origin. Shorthand: origin. Kebab-case transform-origin is accepted. Keywords (center, top, left, …); 0–100 numbers become % (50 → 50%); larger numbers use rem via cssNormalizeSize." },
                    type: "number | string",
                },
                origin: {
                    description: { tr: "transformOrigin kısaltma alias'ı.", en: "transformOrigin shorthand alias." },
                    type: "number | string",
                },
                transition: {
                    description: { tr: "CSS transition kısaltması (ör. all 0.3s, opacity 300). Birimsiz sayılar: 300 → 300ms, 0.3 → 0.3s.", en: "CSS transition shorthand (e.g. all 0.3s, opacity 300). Bare numbers: 300 → 300ms, 0.3 → 0.3s." },
                    type: "number | string",
                },
                transitionX: {
                    description: { tr: "Transform transition kısaltması (ör. 300 → transform 300ms ease). transition-x kebab alias'ını kabul eder. transition / transitionY ile birleştirilir.", en: "Transform transition shorthand (e.g. 300 → transform 300ms ease). Accepts the transition-x kebab alias. Merged with transition / transitionY." },
                    type: "number | string",
                },
                transitionY: {
                    description: { tr: "Transform transition kısaltması. transition-y kebab alias'ını kabul eder. transition / transitionX ile birleştirilir.", en: "Transform transition shorthand. Accepts the transition-y kebab alias. Merged with transition / transitionX." },
                    type: "number | string",
                },
                content: {
                    description: { tr: "children yerine kullanılabilen içerik (ikisi birlikte verilirse children önceliklidir).", en: "Content that can be used instead of children (children takes priority when both are provided)." },
                    type: "ReactNode",
                },
                typo: {
                    description: { tr: 'Typo varyant anahtarı (ör. "h6" → Typo.h6). typography ile çakışırsa typography alınır.', en: 'Typo variant key (e.g. "h6" → Typo.h6). typography takes priority when both are provided.' },
                    type: "string",
                },
                typography: {
                    description: { tr: "{ type, ...Typo props } — type ile varyant, kalanı Typo'ya spread edilir.", en: "{ type, ...Typo props } — type selects the variant and the remainder is spread to Typo." },
                    type: "string | object",
                },
                childrenCommon: {
                    description: { tr: "Tüm çocuklara önce uygulanan ortak prop çantası; childrenProps girdileri bunun üzerine birleştirilir.", en: "A shared prop bag applied to all children first; childrenProps entries are merged on top of it." },
                    type: "object",
                },
                childrenProps: {
                    description: { tr: "Çocuk başına prop dizisi (nth-child ile eşlenir).", en: "Per-child prop array (matched by nth-child)." },
                    type: "array",
                },
                responsive: {
                    description: { tr: "Breakpoint tabanlı ezmeler.", en: "Breakpoint-based overrides." },
                    type: "object",
                },
                exportData: {
                    description: { tr: "Debug/export yardımcısı aktarımı.", en: "Debug/export helper passthrough." },
                    type: "boolean | function | object",
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
