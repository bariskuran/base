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
                en: "",
            }}
        >
            <Ds.block
                title={{ tr: "Grid", en: "" }}
                description={{
                    tr: "items içindeki her obje Card prop'u gibi değerlendirilir. Grid varyantı aynı row içindeki kartları aynı yüksekliğe stretch eder.",
                    en: "",
                }}
                code={`import { CardViewer } from "${SYS.basePath}";

<CardViewer.grid items={items} />`}
                example={<CardViewer items={items} />}
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
                args="<CardViewer items />"
                props={{
                    items: {
                        description: { tr: "Kart datası array'i.", en: "" },
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
                        description: { tr: "Grid/masonry kolonları için minimum kolon genişliği.", en: "" },
                        type: "number | string",
                        defaultValue: "280",
                    },
                    emptyText: {
                        description: {
                            tr: "Boş state metni. String veya dil objesi kabul eder.",
                            en: "",
                        },
                        type: "string | object",
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
                }}
            />
        </Ds.page>
    );
};

export default X;
