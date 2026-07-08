import Ds from "./index";
import { t } from "../getText";

const X = () => (
    <Ds.page
        title={t({ tr: "Design System", en: "Design System" })}
        releasedOn="1.0.0"
        description={t({
            tr: (
                <>
                    <b>Design System</b>, base içindeki komponentleri, hookları, yardımcı
                    fonksiyonları ve proje kurulum kararlarını canlı örneklerle incelemek için
                    kullanılan geliştirme dokümantasyonudur. Normal kullanımda uygulamanın üretim
                    çıktısına dahil edilmez; böylece son kullanıcıya giden bundle gereksiz
                    dokümantasyon kodu taşımaz.
                </>
            ),
            en: (
                <>
                    <b>Design System</b> is the development documentation used to inspect base
                    components, hooks, helpers, and setup decisions with live examples. It is not
                    included in the production output by default, so the user-facing bundle does not
                    carry unnecessary documentation code.
                </>
            ),
        })}
    >
        <Ds.block
            title={t({ tr: "Çalışma Modeli", en: "Runtime Model" })}
            description={t({
                tr: (
                    <>
                        Design System development ortamında otomatik çalışır. Production build
                        içinde görünmesi istenirse proje tarafında build-time environment variable
                        olarak <b>VITE_ENABLE_DESIGN_SYSTEM=true</b> verilmelidir. Mevcut projede
                        bu değer <b>false</b> tutulur. Değişken <b>true</b> değilse Design System
                        route'u üretim router'ına eklenmez.
                    </>
                ),
                en: (
                    <>
                        Design System works automatically in development. If it must be available in
                        a production build, set <b>VITE_ENABLE_DESIGN_SYSTEM=true</b> as a
                        build-time environment variable in the project. This project keeps it as{" "}
                        <b>false</b> by default. When this variable is missing or not <b>true</b>,
                        the Design System route is not added to the production router.
                    </>
                ),
            })}
            code={`# .env
VITE_ENABLE_DESIGN_SYSTEM=false

# production build içinde Design System gerekli ise
VITE_ENABLE_DESIGN_SYSTEM=true yarn build`}
            lastBlock
        />
    </Ds.page>
);

export default X;
