import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { t } from "../getText";

const projectSettingsExample = `export const PROJECT_SETTINGS = {
    SuspenseFallback: <SuspenceFallback />,
    textLibrary: TEXT_LIBRARY,
    iconsLibrary: ICONS_LIBRARY,

    rrdSettings: {
        Layout,
        SITEMAP,
        overridePrepareRoutes: null,
    },

    languageSettings: {
        defaultLanguage: "tr",
        languageList: ["tr", "en"],
        ignoreClientLanguage: false,
        navigateOnLanguageChange: true,
    },

    baseDateSettings: {
        disable: false,
        defaultFormat: "|DD|-|MM|-|YYYY|",
        defaultTimeZone: "UTC",
        firstDayOfWeek: 1,
    },

    idleManagerSettings: {
        enabled: true,
        allowedIdleTime: 30,
        onIdle: () => {},
        onActive: () => {},
    },

    notifierSettings: {
        killAfter: 5,
        closingDelay: 0.5,
    },

    baseFetchSettings: {
        disableLoadingApi: false,
        disableAuth: true,
        cacheTime: 10,
    },

    styledSettings: { /* themes, primaryFont, globalStyle, … */ },
    baseFormSettings: { helperMode: "auto" },
    validationRules: {},
    defaultVariants: {},
    adminSettings: {
        showDsOnline: false,
        showInternalDs: true,
    },
};`;

const X = () => (
    <Ds.page
        title={t({ tr: "Kurulum", en: "How To Setup" })}
        releasedOn="1.0.0"
        description={t({
            tr: (
                <>
                    Base&apos;i kurun, ardından rotaları ve proje ayarlarını yapılandırın.{" "}
                    <Button.string to="/design-system/base" label="<Base>" /> bileşeninin üst
                    düzeyde ne yaptığı Base sayfasında açıklanmıştır.
                </>
            ),
            en: (
                <>
                    Install Base, then wire routes and project settings. What{" "}
                    <Button.string to="/design-system/base" label="<Base>" /> does at a high level
                    is described on the Base page.
                </>
            ),
        })}
    >
        <Ds.block
            title={t({ tr: "Kurulum", en: "Install" })}
            example={
                <Flex.column gap={8} full>
                    <Typo.code copy>npm i @bariskuran/base</Typo.code>
                    <Typo.code copy>yarn add @bariskuran/base</Typo.code>
                </Flex.column>
            }
        />
        <Ds.block
            title={t({ tr: "Otomatik kurulum", en: "Automatic set up" })}
            description={t({
                tr: "Klasör yapısı ve zorunlu dosyaların otomatik kurulmasını sağlar. Ancak henüz tamamlanmadı. Yazılması planlandı.",
                en: "Automatically sets up folder layout and required files. Not built yet; planned.",
            })}
        />
        <Ds.block
            title={t({
                tr: "Manuel kurulum — Adım 1: PROJECT_SETTINGS",
                en: "Manual Set Up Step1 - PROJECT_SETTINGS",
            })}
            description={t({
                tr: (
                    <>
                        <b>PROJECT_SETTINGS</b> dosyasını oluşturun. Tüm alanlar detaylı olarak{" "}
                        <Button.string to="/design-system/base" label="Base" /> sayfasında
                        anlatılmıştır.
                    </>
                ),
                en: (
                    <>
                        Create your <b>PROJECT_SETTINGS</b> file. All fields are documented on the{" "}
                        <Button.string to="/design-system/base" label="Base" /> page.
                    </>
                ),
            })}
            example={<Typo.code copy content={projectSettingsExample} />}
        />
        <Ds.block
            title={t({
                tr: "Adım 2 — Uygulamayı Base ile sarın",
                en: "Step2 — Wrap App with Base",
            })}
            description={t({
                tr: (
                    <>
                        React uygulamanızın en üstüne, <b>PROJECT_SETTINGS</b> ile birlikte{" "}
                        <b>&lt;Base&gt;</b> bileşenini sarın.
                    </>
                ),
                en: (
                    <>
                        Wrap your React app with <b>&lt;Base&gt;</b> and pass{" "}
                        <b>projectSettings={"{"}PROJECT_SETTINGS{"}"}</b>.
                    </>
                ),
            })}
            example={
                <Typo.code copy>
                    {`import { Base } from "${SYS.basePath}";
import { PROJECT_SETTINGS } from "global/PROJECT_SETTINGS";

const App = () => <Base projectSettings={PROJECT_SETTINGS} />;`}
                </Typo.code>
            }
            lastBlock
        />
    </Ds.page>
);

export default X;
