import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="useLayout"
        releasedOn="1.0.0"
        description={{
            tr: "useLayout, Layout varyantlarının controller çıktılarına erişir. Dönen state ve aksiyonlar varyanta göre değiştiği için bu sayfa yalnızca controller seçme biçimini açıklar. Kullanılabilir alanlar ve davranışlar için hedef Layout varyantının Design System sayfasına bakılmalıdır.",
            en: "useLayout accesses controller outputs exposed by Layout variants. Since returned state and actions vary by variant, this page only documents controller selection. See the target Layout variant's Design System page for its available fields and behavior.",
        }}
    >
        <Ds.block
            title={{ tr: "Tek varyant", en: "Single variant" }}
            description={{
                tr: "String kullanım default controllerId değerini hedefler. Aynı varyantın isimlendirilmiş bir instance'ı için controllerId ayrıca verilebilir.",
                en: "The string form targets the default controllerId. Provide controllerId when targeting a named instance of the same variant.",
            }}
            code={`import { useLayout } from "${SYS.basePath}";

const header = useLayout("headerAmedist");

const mainHeader = useLayout("headerAmedist", {
    controllerId: "main",
});`}
        />
        <Ds.block
            title={{ tr: "Çoklu varyant", en: "Multiple variants" }}
            description={{
                tr: "Birden fazla controller array ile istenir. Sonuçlar selector'larla aynı sırada array olarak döner; farklı varyantların aynı isimli alanları birleştirilmez.",
                en: "Request multiple controllers with an array. Results are returned as an array in selector order; same-named fields from different variants are not merged.",
            }}
            code={`const [header, footer, main] = useLayout([
    { name: "headerAmedist", controllerId: "main" },
    { name: "footerAmedist", controllerId: "main" },
    { name: "mainAmedist", controllerId: "main" },
]);

// Each string uses controllerId: "default"
const [defaultHeader, defaultFooter] = useLayout([
    "headerAmedist",
    "footerAmedist",
]);`}
        />
        <Ds.block
            title={{ tr: "Varyant API'ları", en: "Variant APIs" }}
            description={{
                tr: "useLayout dönüşleri ortak bir sözleşmeye zorlanmaz. Menu status, search aksiyonları, header status veya başka çıktılar yalnızca bunları sağlayan varyantın kendi sayfasında belgelenir.",
                en: "useLayout results are not forced into one shared contract. Menu status, search actions, header status, and other outputs are documented only on the page of the variant that provides them.",
            }}
        />
    </Ds.page>
);

export default X;
