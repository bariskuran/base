import Ds from "../DesignSystem";
import { Button } from "../Button";
import { t } from "../getText";
import ProjectSettingsApis from "./_dS_projectSettings";

const X = () => (
    <Ds.page
        title="<Base>"
        releasedOn="1.0.0"
        description={t({
            tr: (
                <>
                    <b>&lt;Base&gt;</b> sarmalayıcısı; styled-components, tema ve stil ayarları, React
                    Router (RRD), IdleManager, uygulama dili (appLanguage), globalData, notifier,
                    baseFetch, baseDate ve ilgili alt sistemlerin kurulumunu ve yönetimini tek
                    noktadan yapar; bunları uygulamanın tüm bileşenleriyle paylaşır.
                    <br />
                    <br />
                    <b>base</b> genelinde bazı alt kütüphane ve yardımcılar &lt;Base&gt; olmadan da
                    kullanılabilir; ancak çoğu alt kütüphane <b>theme</b> veya <b>globalData</b>yı
                    merkez kabul ettiği için &lt;Base&gt; sarmalayıcısını özellikle tavsiye ediyoruz.
                    Kurulmadığında alt kütüphanelerin nasıl davranacağı konusunda garanti veremeyiz.
                    <br />
                    <br />
                    &lt;Base&gt;in temel kurulumu{" "}
                    <Button.string to="/design-system/how-to-setup" label="How To Setup" />{" "}
                    sayfasında anlatılmıştır. Bu sayfa ayrıntılı olarak{" "}
                    <b>PROJECT_SETTINGS</b> kullanımına odaklanır.
                </>
            ),
            en: (
                <>
                    The <b>&lt;Base&gt;</b> wrapper sets up and shares styled-components, theme and
                    style settings, React Router (RRD), IdleManager, app language, globalData,
                    notifier, baseFetch, baseDate, and related subsystems across your app.
                    <br />
                    <br />
                    Some <b>base</b> helpers work without &lt;Base&gt;, but most libraries assume{" "}
                    <b>theme</b> or <b>globalData</b> as the hub — we strongly recommend wrapping
                    with &lt;Base&gt;. Behavior without it is not guaranteed.
                    <br />
                    <br />
                    Basic setup is on{" "}
                    <Button.string to="/design-system/how-to-setup" label="How To Setup" />. This
                    page documents <b>PROJECT_SETTINGS</b> in detail.
                </>
            ),
        })}
    >
        <ProjectSettingsApis />
    </Ds.page>
);

export default X;
