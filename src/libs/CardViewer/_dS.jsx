import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { CardViewer } from ".";
import sampleSrc from "../Image/assets/sample-landscape.svg";

const items = [
    {
        thumb: sampleSrc,
        title: "Lorem ipsum dolor sit amet.",
        description: "Quisque faucibus ex sapien vitae pellentesque sem placerat.",
        to: "/design-system/cardViewer",
    },
    {
        thumb: sampleSrc,
        title: "Consectetur adipiscing elit.",
        description: "In id cursus mi pretium tellus duis convallis.",
        to: "/design-system/cardViewer",
    },
];

const X = () => {
    return (
        <Ds.page
            title="<CardViewer>"
            releasedOn="1.0.0"
            description={{
                tr: "CardViewer, Card datasını listelemek için kullanılan viewer katmanıdır. Array tabanlı kullanım, empty state, layout varyantı, card varyantı, basic pagination ve load more aksiyonlarını destekler. BE destekli kullanımda page, offset, pageSize, total, onPageChange ve onLoadMore proplarıyla dış sorgu akışı bağlanabilir.",
                en: "CardViewer renders collections of Card data. It supports array data, empty state, layout variants, Card variants, basic pagination, and load-more actions. For backend-driven lists, external query state can be connected through page, offset, pageSize, total, onPageChange, and onLoadMore.",
            }}
        >
            <Ds.block
                title={{ tr: "İki Ayrı Varyant Ekseni", en: "Two independent variant axes" }}
                description={{
                    tr: "CardViewer.grid ve CardViewer.masonry yalnızca koleksiyon yerleşimini seçer. cardVariant ise her item için hangi Card varyantının render edileceğini belirler. Bu API'ler birbirinden bağımsızdır: yeni layout varyantları Card API'sini, yeni Card varyantları da viewer yerleşimini miras almak zorunda değildir.",
                    en: "CardViewer.grid and CardViewer.masonry select only the collection layout. cardVariant selects the Card variant rendered for each item. These APIs are independent: future layout variants do not define the Card API, and future Card variants do not define viewer layout behavior.",
                }}
                code={`<CardViewer.grid items={items} cardVariant="amedist" />
<CardViewer.masonry items={items} cardVariant="amedist" />`}
            />
            <Ds.block
                title={{ tr: "Grid", en: "" }}
                description={{
                    tr: "items içindeki her obje Card prop'u gibi değerlendirilir. Grid varyantı aynı row içindeki kartları aynı yüksekliğe stretch eder. Kart genişliği minColumnWidth ile sabit kalır; az item olduğunda alignX ile hizalanır (default: center).",
                    en: "",
                }}
                code={`import { CardViewer } from "${SYS.basePath}";

<CardViewer.grid items={items} />
<CardViewer.grid items={items} alignX="start" />`}
                example={<CardViewer.grid items={items} />}
            />
            <Ds.block
                title={{ tr: "Masonry", en: "" }}
                description={{
                    tr: "Masonry, Pinterest benzeri column bazlı yerleşimdir. Bu varyantta kartlar kendi doğal yüksekliğini korur ve kolonlara akar.",
                    en: "",
                }}
                code={`<CardViewer.masonry
    items={items}
    minColumnWidth={280}
/>`}
                example={<CardViewer.masonry items={items} />}
            />
            <Ds.block
                title={{ tr: "Empty State", en: "" }}
                description={{
                    tr: "items boşsa emptyText gösterilir. emptyText verilmezse globalData.textLibrary.emptyCardMap kullanılır.",
                    en: "",
                }}
                code={`<CardViewer
    items={[]}
    emptyText={{ tr: "Henüz kart yok.", en: "No cards yet." }}
/>`}
            />
            <Ds.block
                title={{ tr: "BE ve Pagination Hazırlığı", en: "" }}
                description={{
                    tr: "CardViewer veri çekmez; sorgu state'ini parent yönetir. page değişiminde parent yeni BE sorgusunu yapar ve items/total değerlerini tekrar gönderir. Load more akışında onLoadMore parent tarafında offset/page artırabilir.",
                    en: "",
                }}
                code={`<CardViewer
    items={items}
    page={page}
    pageSize={12}
    total={total}
    onPageChange={setPage}
    onLoadMore={loadMore}
    hasMore={hasMore}
    loading={loading}
/>`}
            />
            <Ds.api
                args="CardViewer common props"
                props={{
                    items: {
                        description: { tr: "Kart datası array'i.", en: "" },
                        type: "array",
                    },
                    data: {
                        description: {
                            tr: "items için geriye uyumlu alias.",
                            en: "Compatibility alias for items.",
                        },
                        type: "array",
                    },
                    variant: {
                        description: { tr: "CardViewer layout varyantı.", en: "" },
                        type: "string",
                        defaultValue: '"grid"',
                    },
                    cardVariant: {
                        description: { tr: "Kullanılacak Card varyantı.", en: "" },
                        type: "string",
                        defaultValue: '"amedist"',
                    },
                    minColumnWidth: {
                        description: {
                            tr: "Grid kolon genişliği (sabit). Kartlar bu genişliği korur; 1fr ile esnemez.",
                            en: "Fixed grid column width. Cards keep this size instead of stretching with 1fr.",
                        },
                        type: "number | string",
                        defaultValue: "280",
                    },
                    alignX: {
                        description: {
                            tr: "Az kart olduğunda yatay hizalama. center | start | end (left→start, right→end alias).",
                            en: "Horizontal alignment when cards do not fill the row. center | start | end (left→start, right→end aliases).",
                        },
                        type: '"center" | "start" | "end" | "left" | "right"',
                        defaultValue: '"center"',
                    },
                    emptyText: {
                        description: {
                            tr: "Boş state metni. String veya dil objesi kabul eder.",
                            en: "",
                        },
                        type: "string | object",
                    },
                    renderItem: {
                        description: {
                            tr: "Varsayılan Card renderını tamamen değiştiren render callback'i.",
                            en: "Render callback that fully replaces default Card rendering.",
                        },
                        type: "function(item, index)",
                    },
                    getItemProps: {
                        description: {
                            tr: "Her item için Card proplarını genişleten callback.",
                            en: "Callback that extends Card props for each item.",
                        },
                        type: "function(item, index)",
                    },
                    gap: {
                        description: {
                            tr: "Kartlar arasındaki rem tabanlı boşluk.",
                            en: "Rem-based gap between cards.",
                        },
                        type: "number | string",
                        defaultValue: "20",
                    },
                    page: {
                        description: { tr: "1 tabanlı sayfa numarası.", en: "" },
                        type: "number",
                    },
                    offset: {
                        description: { tr: "Slice veya BE sorgusu için offset.", en: "" },
                        type: "number",
                    },
                    pageSize: {
                        description: { tr: "Sayfa başına kart sayısı.", en: "" },
                        type: "number",
                    },
                    total: {
                        description: { tr: "BE tarafındaki toplam kayıt sayısı.", en: "" },
                        type: "number",
                    },
                    onPageChange: {
                        description: { tr: "Pagination sayfa değişim callback'i.", en: "" },
                        type: "function",
                    },
                    onLoadMore: {
                        description: { tr: "Load more callback'i.", en: "" },
                        type: "function",
                    },
                    hasMore: {
                        description: {
                            tr: "Load more aksiyonunun gösterilip gösterilmeyeceği.",
                            en: "Whether the load-more action remains available.",
                        },
                        type: "boolean",
                    },
                    loading: {
                        description: {
                            tr: "Pagination ve load more aksiyonlarının pending/disabled durumu.",
                            en: "Pending/disabled state for pagination and load-more actions.",
                        },
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
