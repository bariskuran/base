import Ds from "../DesignSystem";
import { Button } from "../Button";
import { Typo } from "../Typo";

const X = () => (
    <Ds.page
        title="<Base>"
        releasedOn="1.0.0"
        description={
            <>
                <Typo.p>
                    Base, React projelerini hem yazılım hem de UI anlamında destekleyen bir
                    frameworktür. Base ve altındaki tüm kütüphaneler, bir projede ihtiyacınız
                    olabilecek birçok sistemi hızlıca yerelleştirmenizi ve birkaç dakika içinde
                    projenizi inşa etmeye başlamanızı amaçlar. Normalde bunun için onlarca farklı
                    ekip tarafından yazılmış üçüncü parti kütüphane kurmak yerine, sadece Base&apos;i
                    kurarak üretim ve bakım sürecinizi basitleştirebilirsiniz.
                </Typo.p>
                <Typo.p>
                    Base yalnızca tek bir soruna odaklanmış — sadece UI ya da sadece FE
                    yardımcıları — bir kütüphane değildir. Tüm ihtiyaçları hem FE hem de UI
                    gözünden karşılamayı amaçlayan bir framework fikrinin ilk adımlarıdır. Devam
                    eden sürümlerde farklı fikirler ve alt kütüphanelerle geliştirmeye devam
                    edilecektir.
                </Typo.p>
                <Typo.p>
                    Base&apos;e ait alt kütüphaneleri, yardımcı fonksiyonları ve hook&apos;ları kullanmak
                    için <Typo.code>&lt;Base&gt;</Typo.code> bileşeninin kurulması gerekli değildir.
                    Ancak bazı alt kütüphaneler <Typo.code>&lt;Base&gt;</Typo.code>&apos;e ihtiyaç
                    duyabilir.
                </Typo.p>
                <Typo.p>
                    Kurulum adımları için{" "}
                    <Button.string to="/design-system" label="How To Setup" /> sayfasına bakın.
                </Typo.p>
            </>
        }
    />
);

export default X;
