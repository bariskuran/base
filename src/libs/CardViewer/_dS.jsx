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
                title={{ tr: "Grid", en: "Grid" }}
                description={{
                    tr: "items içindeki her obje Card prop'u gibi değerlendirilir. Grid varyantı aynı row içindeki kartları aynı yüksekliğe stretch eder. Kart genişliği minColumnWidth ile sabit kalır; autoWidth açıldığında aynı satırdaki iki veya daha fazla kart kalan alanı paylaşır.",
                    en: "Each object in items is treated as Card props. The Grid variant stretches cards in the same row to equal height. Card width remains fixed by minColumnWidth; when autoWidth is enabled, two or more cards in the same row share the remaining space.",
                }}
                code={`import { CardViewer } from "${SYS.basePath}";

<CardViewer.grid items={items} />
<CardViewer.grid items={items} alignX="start" />
<CardViewer.grid items={items} autoWidth />`}
                example={<CardViewer.grid items={items} />}
            />
            <Ds.block
                title={{ tr: "Masonry", en: "Masonry" }}
                description={{
                    tr: "Masonry, Pinterest benzeri column bazlı yerleşimdir. Bu varyantta kartlar kendi doğal yüksekliğini korur ve kolonlara akar.",
                    en: "Masonry is a Pinterest-like column-based layout. Cards retain their natural height and flow into columns.",
                }}
                code={`<CardViewer.masonry
    items={items}
    minColumnWidth={280}
/>`}
                example={<CardViewer.masonry items={items} />}
            />
            <Ds.block
                title={{ tr: "Boş Durum", en: "Empty State" }}
                description={{
                    tr: "items boşsa emptyText gösterilir. emptyText verilmezse globalData.textLibrary.emptyCardMap kullanılır.",
                    en: "When items is empty, emptyText is displayed. If emptyText is omitted, globalData.textLibrary.emptyCardMap is used.",
                }}
                code={`<CardViewer
    items={[]}
    emptyText={{ tr: "Henüz kart yok.", en: "No cards yet." }}
/>`}
            />
            <Ds.block
                title={{ tr: "BE ve Pagination Hazırlığı", en: "Backend and Pagination Readiness" }}
                description={{
                    tr: "CardViewer veri çekmez; sorgu state'ini parent yönetir. page değişiminde parent yeni BE sorgusunu yapar ve items/total değerlerini tekrar gönderir. Load more akışında onLoadMore parent tarafında offset/page artırabilir.",
                    en: "CardViewer does not fetch data; the parent manages query state. On page changes, the parent makes the new backend query and passes items/total again. In a load-more flow, onLoadMore can increment offset or page in the parent.",
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
                        description: { tr: "Kart datası dizisi.", en: "Array of Card data." },
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
                        description: { tr: "CardViewer yerleşim varyantı.", en: "CardViewer layout variant." },
                        type: "string",
                        defaultValue: '"grid"',
                    },
                    cardVariant: {
                        description: { tr: "Kullanılacak Card varyantı.", en: "Card variant to use." },
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
                    autoWidth: {
                        description: {
                            tr: "true olduğunda tek satırda iki veya daha fazla kart varsa, gap korunarak kartlar kalan genişliği paylaşır. Tek kart minColumnWidth değerinde kalır.",
                            en: "When true and a row has two or more cards, cards share the remaining width while preserving the gap. A single card keeps minColumnWidth.",
                        },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    emptyText: {
                        description: {
                            tr: "Boş state metni. String veya dil objesi kabul eder.",
                            en: "Empty-state copy. Accepts a string or a language object.",
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
                        description: { tr: "1 tabanlı sayfa numarası.", en: "1-based page number." },
                        type: "number",
                    },
                    offset: {
                        description: { tr: "Slice veya backend sorgusu için offset.", en: "Offset for a slice or backend query." },
                        type: "number",
                    },
                    pageSize: {
                        description: { tr: "Sayfa başına kart sayısı.", en: "Number of cards per page." },
                        type: "number",
                    },
                    total: {
                        description: { tr: "Backend tarafındaki toplam kayıt sayısı.", en: "Total record count on the backend." },
                        type: "number",
                    },
                    onPageChange: {
                        description: { tr: "Pagination sayfa değişim callback'i.", en: "Pagination page-change callback." },
                        type: "function",
                    },
                    onLoadMore: {
                        description: { tr: "Load-more callback'i.", en: "Load-more callback." },
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
