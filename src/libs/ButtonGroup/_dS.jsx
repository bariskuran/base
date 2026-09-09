import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { ButtonGroup } from ".";

const items = [
    {
        bgColor: "error",
        label: "test",
        hoverLabel: "test hover",
        prefix: { icon: "bullet" },
        onClick: () => console.log("click"),
    },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
];

const items2 = [
    {
        bgColor: "error",
        label: "test",
        hoverLabel: "test hover",
        prefix: { icon: "bullet" },
        onClick: () => console.log("click"),
    },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
];

const groupProps = {
    bgColor: "success",
    prefix: {
        icon: "user",
    },
    size: 100,
};

const X = () => {
    return (
        <Ds.page
            title="<ButtonGroup>"
            releasedOn="1.0.0"
            description={{
                tr: <>
                    Bu, Group componentinin Button için özelleştirilmiş sürümüdür; items ve groupProps davranışı
                    aynıdır. Flex sarmalayıcısı yerine ScrollFlex kullanır.
                    <br />
                    <br />
                    scrollEdgeShadow prop'u bu componente özeldir.
                </>,
                en: <>
                    This is a version of the 'Group' component specialized for 'Button', so the
                    'items' and 'groupProps' behavior is the same. Instead of a 'Flex' wrapper, it
                    uses 'ScrollFlex'.
                    <br />
                    <br />
                    The 'scrollEdgeShadow' prop is unique to this component.
                </>,
            }}
        >
            <Ds.block
                title={{ tr: "Dikey Kullanım", en: "Vertical Usage" }}
                code={`import { ButtonGroup } from "${SYS.basePath}";

                       const items = [
                        {
                            bgColor: "error",
                            label: "test",
                            hoverLabel: "test hover",
                            prefix: {
                                icon: "bullet"
                            },
                            onClick: () => console.log("click"),
                        },
                        {
                            label: "test2",
                            onClick: () => console.log("click2")
                        },
                       ];

                       const groupProps = {
                        bgColor: "success",
                        prefix: { icon: "user" },
                        size: 100,
                       };

                       <Flex gap={10} height={200}>
                        <ButtonGroup.column
                            items={items}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                        <ButtonGroup.column
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                       </Flex>`}
                example={
                    <Flex gap={10} height={200}>
                        <ButtonGroup.column
                            items={items}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                        <ButtonGroup.column
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                    </Flex>
                }
            />
            <Ds.block
                title={{ tr: "Yatay Kullanım", en: "Horizontal Usage" }}
                code={`import { ButtonGroup } from "${SYS.basePath}";

                       <Flex.column gap={10} height={200} full>
                        <ButtonGroup
                            items={items}
                            groupProps={groupProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                                paddingBottom: 0,
                            }}
                            scrollBarProps={{
                                trackMargin: 0,
                                variant: "primary",
                                disableOpacityEffect: true,
                            }}
                            scrollEdgeShadow
                        />
                        <ButtonGroup
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                            }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                       </Flex.column>`}
                example={
                    <Flex.column gap={10} height={200} full>
                        <ButtonGroup
                            items={items}
                            groupProps={groupProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                                paddingBottom: 0,
                            }}
                            scrollBarProps={{
                                trackMargin: 0,
                                variant: "primary",
                                disableOpacityEffect: true,
                            }}
                            scrollEdgeShadow
                        />
                        <ButtonGroup
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                            }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title={{ tr: "flat (ScrollFlex olmadan)", en: "flat (no ScrollFlex)" }}
                code={`import { ButtonGroup, Flex } from "${SYS.basePath}";

                       <Flex direction="row" gap={8}>
                        <ButtonGroup
                            flat
                            items={[
                                { label: "One", onClick: () => {} },
                                { label: "Two", onClick: () => {} },
                            ]}
                            groupProps={{ variant: "plain" }}
                        />
                       </Flex>`}
                description={{ tr: "Dış Variant, iç Flex veya ScrollFlex kullanılmaz; yalnızca fragment içindeki Button node'ları render edilir. Böylece gap, yön ve scroll kontrolü parent'a (ör. PopOver ScrollFlex content Flex) ait olur.", en: "No outer Variant, no inner Flex or ScrollFlex: only Button nodes in a fragment so the parent (e.g. PopOver ScrollFlex content Flex) owns gap, direction, and scroll." }}
                example={
                    <Flex direction="row" gap={8}>
                        <ButtonGroup
                            flat
                            items={[
                                { label: "One", onClick: () => {} },
                                { label: "Two", onClick: () => {} },
                                { label: "Three", onClick: () => {} },
                            ]}
                            groupProps={{ variant: "plain" }}
                        />
                    </Flex>
                }
            />
            <Ds.api
                args="<ButtonGroup items={[]} groupProps={{}} />"
                props={{
                    items: {
                        description: { tr: "Prop nesneleri dizisi; her kayıt bir Button üzerine spread edilir.", en: "Array of prop objects; each entry is spread onto a Button." },
                        type: "array",
                        required: true,
                    },
                    groupProps: {
                        description: { tr: "Her item ile deep-merge edilir; item'a ait anahtarlar bu varsayılanları ezer.", en: "Deep-merged into every item; per-item keys override these defaults." },
                        type: "object",
                    },
                    flexProps: {
                        description: { tr: `flat false olduğunda ScrollFlex içeriğine (iç Flex) aktarılır. flat true olduğunda yok sayılır (item'lar parent'ın doğrudan çocuklarıdır). width/height verilmezse boyut içerikten gelir; ScrollFlex kabuğu taşmayı sınırlar (ör. max-width: 100%). ButtonGroup.column, flat false iken direction: "column" değerini flexProps ile birleştirir.`, en: `Forwarded to ScrollFlex content (inner Flex) when flat is false. Ignored when flat is true (items are direct children of the parent). Without width/height, sizing follows content; the ScrollFlex shell limits overflow (e.g. max-width: 100%). ButtonGroup.column merges direction: "column" into flexProps when flat is false.` },
                        type: "object",
                    },
                    scrollBarProps: {
                        description: { tr: "flat false olduğunda ScrollFlex içindeki ScrollBar'a aktarılır. flat true olduğunda yok sayılır.", en: "Forwarded to ScrollBar inside ScrollFlex when flat is false. Ignored when flat is true." },
                        type: "object",
                    },
                    variant: {
                        description: {
                            tr: "variant bir ScrollFlex preset string'iyle (`plain`, `border`, `shadow`, `hoverShadow`; `WithShadow`, `WithHoverShadow` aliasları dâhil) eşleştiğinde yalnız iç ScrollFlex'e uygulanır; dış ButtonGroup sarmalayıcısı componentCreator kurallarını izlemeye devam eder (nested olduğunda DefaultVariant veya PlainVariant). Başka bir string ya da component dış sarmalayıcının Variant'ını seçer. flat true olduğunda yok sayılır (sarmalayıcı ve ScrollFlex yoktur).",
                            en: "When variant matches a ScrollFlex preset string (`plain`, `border`, `shadow`, `hoverShadow`; aliases include `WithShadow`, `WithHoverShadow`), it is applied only to the inner ScrollFlex—the outer ButtonGroup wrapper still follows componentCreator rules (DefaultVariant or PlainVariant when nested). Any other string or component selects the outer wrapper Variant. Ignored when flat is true (no wrapper, no ScrollFlex).",
                        },
                        type: "string | component",
                    },
                    flat: {
                        description: {
                            tr: "true olduğunda yalnız fragment içindeki Button node'larını render eder: DefaultVariant/PlainVariant sarmalayıcısı, ScrollFlex, iç Flex ve row-clamp grid yoktur. Yerleşim (gap, yön, scroll) parent'tan gelir. flexProps, scrollBarProps, ScrollFlex varyant string'leri ve liste sarmalayıcısındaki style/ref etkisizdir.",
                            en: "When true, renders only Button nodes in a fragment: no DefaultVariant/PlainVariant wrapper, no ScrollFlex, no inner Flex, no row clamp grid. Layout (gap, direction, scroll) comes from the parent. flexProps, scrollBarProps, scrollFlex variant strings, and style/ref on the list wrapper have no effect.",
                        },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    scrollEdgeShadow: {
                        description: {
                            tr: "Scroll alanı üzerindeki isteğe bağlı içe dönük kenar gölgeleri. Row yerleşiminde sol/sağ, column yerleşiminde üst/alt kullanılır. Başlangıç kenarı (sol/üst) yalnız scroll sonrasında görünür; bitiş kenarı (sağ/alt) sona gelindiğinde kaybolur. Opacity 0,25 saniyede geçiş yapar.",
                            en: "Optional inward edge shadows over the scroll area. Row layout: left/right; column layout: top/bottom. Start edge (left/top) appears only after scrolling; end edge (right/bottom) hides when scrolled to the end. Opacity transitions over 0.25s.",
                        },
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
