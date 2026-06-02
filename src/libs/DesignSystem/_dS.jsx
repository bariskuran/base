import Ds from ".";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";

const projectSettingsExample = `export const PROJECT_SETTINGS = {
    /** Suspense Fallback */
    SuspenseFallback: <SuspenceFallback />,

    /** Text Library */
    textLibrary: TEXT_LIBRARY,

    // globalBaseStoreVariables
    globalBaseStoreVariables: { defaultlanguage: "tr", languageList: ["tr", "en"] },

    // baseDateSettings
    baseDateSettings: {
        disable: false,
        defaultFormat: "|DD|-|MM|-|YYYY|",
        defaultTimeZone: "UTC",
        firstDayOfWeek: 1, // monday
    },

    // iconsLibrary
    iconsLibrary: ICONS_LIBRARY,

    // idleManagerSettings
    idleManagerSettings: {
        enabled: true,
        allowedIdleTime: 30, // mins
        onIdle: () => {
            console.log("onIdle");
        },
        onActive: () => {
            console.log("onActive");
        },
    },

    // notifierManager Settings
    notifierSettings: {
        killAfter: 5, // secs
        // disableNotifier: true,
        // disableAutoKill: true,
        closingDelay: 0.5, // secs
    },

    // Suspence Settings
    otherSuspenseProps: {},

    // baseFetch Settings
    baseFetchSettings: {
        disableApiLoading: false,
        disableAuth: true,
        getTokenFrom: () => {},
        token: null,
        cacheTime: 10, // mins
    },

    // styledComponents Settings
    styledSettings: {
        // breakpoints,
        //maxAspRatio,
        //minAspRatio,
        //remSettings,
        primaryFont: css\`
            @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap");
            font-family: "Open Sans", "Helvetica", "Arial", "Verdana", sans-serif !important;
            font-size: 14rem;
            font-weight: 400;
            line-height: 1.75;
        \`,
        globalStyle: css\`
            #root {
                width: 100%;
                min-height: 100vh;
                overflow: unset;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
            }
        \`,
        themes: {
            light: {
                _props: {
                    isDefault: true,
                    label: { tr: "Açık Tonlar", en: "Light Theme" },
                },
                background: "#E0E0E0",
                foreground: "#17181c",
                grey: "#3A3A3A",
                primary: "#ff6f00",
                secondary: "#305664",
                error: "#803939",
                success: "#146314",
                warning: "#7C5A07",
            },
            dark: {
                _props: {
                    label: { tr: "Koyu Tonlar", en: "Dark Theme" },
                },
                background: "#17181c",
                foreground: "#E0E0E0",
                primary: "#ffbf00",
                secondary: "#305A7A",
            },
        },
        makeAntdTheme: (t) => ({
            token: {
                colorPrimary: t.primary,
                colorSuccess: t.success,
                colorWarning: t.warning,
                colorError: t.error,

                colorText: t.foreground,
                colorTextBase: t.foreground,

                colorBgBase: t.background,
                colorBgContainer: t.background,
                colorBorder: t.grey,
            },
        }),
    },

    // BaseForm Settings
    baseFormSettings: {
        HelperComponent: null,
        helperMode: "auto", // auto, enabled, disabled -- default is auto
    },

    // Validation Rules
    validationRules: {},

    // Default Variants
    defaultVariants: {},

    // adminSettings
    adminSettings: {
        showDsOnline: false, // allows to show ds after build.
        showInternalDs: true, // allows to show internal ds in development.
    },
};`;

const X = () => (
    <Ds.page
        title="How To Setup"
        releasedOn="1.0.0"
        description={
            <>
                Install Base, then wire routes and project settings. What{" "}
                <Button.string to="/design-system/base" label="<Base>" /> does at a high level is
                described on the Base page.
            </>
        }
    >
        <Ds.block
            title="Install"
            code={`npm i @bariskuran/base

                       yarn add @bariskuran/base`}
        />
        <Ds.block
            title="Automatic set up"
            description="Folder layout and required files — not yet; planned to build."
        />
        <Ds.block
            title="Manual set up — Step 1: wrap App with Base"
            code={`import { Base } from "${SYS.basePath}";
import { PROJECT_SETTINGS } from "global/PROJECT_SETTINGS";
import { ROUTES } from "global/ROUTES";

const App = () => <Base routes={ROUTES} projectSettings={PROJECT_SETTINGS} />;`}
        />
        <Ds.block title="Manual set up — Step 2: ROUTES" description="Add your routes." />
        <Ds.block
            title="Manual set up — Step 3: PROJECT_SETTINGS"
            description="Each setting is documented on its own DS page (notifier, baseDate, IdleManager, baseFetch, getText, and so on)."
            code={projectSettingsExample}
        />
    </Ds.page>
);

export default X;
