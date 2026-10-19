import { ICONS_LIBRARY } from "./ICONS_LIBRARY";
import { css } from "base";
import { TEXT_LIBRARY } from "./TEXT_LIBRARY";
import { SuspenceFallback } from "components/SuspenceFallback";
import { Layout } from "components/Layout";
import { SITEMAP } from "./SITEMAP";

export const PROJECT_SETTINGS = {
    SuspenseFallback: <SuspenceFallback />,
    /** Text Library */
    textLibrary: TEXT_LIBRARY,

    /** RRD Settings */
    rrdSettings: {
        Layout: Layout,
        SITEMAP: SITEMAP,
        overridePrepareRoutes: null,
    },

    // languageSettings
    languageSettings: {
        defaultLanguage: "tr",
        ignoreClientLanguage: true,
        languageList: ["tr", "en"],
    },

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
        fonts: {
            primaryFont: css`
                @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap");
                font-family: "Montserrat", sans-serif !important;
                font-size: 14rem;
                font-weight: 400;
                line-height: 1.75;
            `,
            openSans: css`
                @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&display=swap");
                font-family: "Open Sans", sans-serif !important;
                font-size: 14rem;
                font-weight: 400;
                line-height: 1.75;
            `,
        },
        globalStyle: css`
            html,
            body {
                margin: 0;
                height: auto;
                min-height: 100vh;
            }

            #root {
                width: 100%;
                height: auto;
                min-height: 100vh;
                overflow: unset;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
            }
        `,
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
        showInternalDs: true, // allows to show internal ds in development. // to enable it externally, set .env VITE_ENABLE_DESIGN_SYSTEM=true
    },
};
