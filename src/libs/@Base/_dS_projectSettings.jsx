import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const section = (body) => `${body.trim()}\n`;

const X = () => (
    <>
        <Ds.api
            disableLastBlock
            title="Top-level"
            args={section(`SuspenseFallback: <SuspenceFallback />,
textLibrary: TEXT_LIBRARY,
iconsLibrary: ICONS_LIBRARY,`)}
            props={{
                SuspenseFallback: {
                    description:
                        "React node shown as Suspense fallback while lazy routes/components load.",
                    type: "ReactNode",
                    required: true,
                },
                textLibrary: {
                    description:
                        "Merged into globalData.textLibrary (with Base TEXT_LIBRARY). Used by getText().",
                    type: "object",
                    defaultValue: "{}",
                },
                iconsLibrary: {
                    description: "Icon name → component map for globalData._iconsLibrary.",
                    type: "object",
                    defaultValue: "{}",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="rrdSettings"
            args={section(`rrdSettings: {
    Layout,
    SITEMAP,
    overridePrepareRoutes: null,
},`)}
            props={{
                Layout: {
                    description:
                        "App layout route component (Outlet shell). Base wraps prepared routes as its children.",
                    type: "React component",
                    required: true,
                },
                SITEMAP: {
                    description:
                        "Route tree: page _route modules and/or category groups (title, prefixPath, children). Base runs prepareRoutes.",
                    type: "array",
                    required: true,
                },
                overridePrepareRoutes: {
                    description:
                        "Optional (sitemap) => preparedRoutes[]. Replaces built-in prepareRoutes when provided.",
                    type: "function | null",
                    defaultValue: "null",
                },
                "getPageRrdInfo()": {
                    description: `Active route snapshot from globalData. Package export: import { getPageRrdInfo } from "${SYS.basePath}".`,
                    type: "function",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="languageSettings"
            args={section(`languageSettings: {
    defaultLanguage: "tr",
    languageList: ["tr", "en"],
    ignoreClientLanguage: false,
    navigateOnLanguageChange: true,
},`)}
            props={{
                defaultLanguage: {
                    description: "Fallback when route, storage, and browser locale do not apply.",
                    type: "string",
                },
                languageList: {
                    description: "Supported language codes. Used for validation and route expansion.",
                    type: "string[]",
                },
                ignoreClientLanguage: {
                    description:
                        "When true, skips navigator locale (localStorage and route language still apply). May also be set on PROJECT_SETTINGS root.",
                    type: "boolean",
                    defaultValue: "false",
                },
                navigateOnLanguageChange: {
                    description:
                        "When false, setLanguage() only updates store + localStorage (no URL change via handle.relatives).",
                    type: "boolean",
                    defaultValue: "true",
                },
                "setLanguage(code)": {
                    description: `Changes globalData.language and optionally navigates. Package export: import { setLanguage } from "${SYS.basePath}".`,
                    type: "function",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="baseDateSettings"
            args={section(`baseDateSettings: {
    disable: false,
    defaultFormat: "|DD|-|MM|-|YYYY|",
    defaultTimeZone: "UTC",
    firstDayOfWeek: 1,
},`)}
            props={{
                disable: {
                    description: "Disables baseDate package initialization when true.",
                    type: "boolean",
                    defaultValue: "false",
                },
                defaultFormat: {
                    description: "Default date format string for baseDate helpers.",
                    type: "string",
                },
                defaultTimeZone: {
                    description: "Default IANA timezone; merged with client timezone when omitted.",
                    type: "string",
                },
                firstDayOfWeek: {
                    description: "0 = Sunday, 1 = Monday, etc.",
                    type: "number",
                    defaultValue: "1",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="idleManagerSettings"
            args={section(`idleManagerSettings: {
    enabled: true,
    allowedIdleTime: 30,
    onIdle: () => {},
    onActive: () => {},
},`)}
            props={{
                enabled: {
                    description: "Turns IdleManager listeners on or off.",
                    type: "boolean",
                    defaultValue: "true",
                },
                allowedIdleTime: {
                    description: "Minutes without activity before onIdle runs.",
                    type: "number",
                    defaultValue: "30",
                },
                onIdle: {
                    description: "Called once when idle threshold is reached.",
                    type: "function | null",
                    defaultValue: "null",
                },
                onActive: {
                    description: "Called when user returns from idle (not every micro-activity).",
                    type: "function | null",
                    defaultValue: "null",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="notifierSettings"
            args={section(`notifierSettings: {
    killAfter: 5,
    closingDelay: 0.5,
    disableNotifier: false,
    disableAutoKill: false,
    Box: null,
},`)}
            props={{
                killAfter: {
                    description: "Auto-dismiss after N seconds (when autoKill is enabled).",
                    type: "number",
                    defaultValue: "5",
                },
                closingDelay: {
                    description: "Exit animation duration in seconds.",
                    type: "number",
                    defaultValue: "0.5",
                },
                disableNotifier: {
                    description: "Suppresses all notifier.add output.",
                    type: "boolean",
                    defaultValue: "false",
                },
                disableAutoKill: {
                    description: "Keeps notification until manual close.",
                    type: "boolean",
                    defaultValue: "false",
                },
                Box: {
                    description: "Custom styled notifier box component (optional).",
                    type: "component | null",
                    defaultValue: "null",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="baseFetchSettings"
            args={section(`baseFetchSettings: {
    disableLoadingApi: false,
    disableAuth: true,
    getTokenFrom: () => {},
    token: null,
    cacheTime: 10,
    envUrl: null,
},`)}
            props={{
                disableLoadingApi: {
                    description: "Skips global loading queue for API calls.",
                    type: "boolean",
                    defaultValue: "false",
                },
                disableAuth: {
                    description: "Disables auth header injection.",
                    type: "boolean",
                    defaultValue: "false",
                },
                getTokenFrom: {
                    description: "Returns auth token for requests.",
                    type: "function | null",
                    defaultValue: "null",
                },
                token: {
                    description: "Static token override.",
                    type: "string | null",
                    defaultValue: "null",
                },
                cacheTime: {
                    description: "Response cache TTL in minutes.",
                    type: "number",
                    defaultValue: "10",
                },
                envUrl: {
                    description: "Base API URL when not using per-call url.",
                    type: "string | null",
                    defaultValue: "null",
                },
                responseErrorPaths: {
                    description: "Paths to read error messages from API responses.",
                    type: "string[]",
                    defaultValue: "[]",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="styledSettings"
            args={section(`styledSettings: {
    fonts: {
        primaryFont: css\`...\`,
        montserrat: css\`...\`,
    },
    globalStyle: css\`...\`,
    themes: { light: { /* ... */ }, dark: { /* ... */ } },
},`)}
            props={{
                fonts: {
                    description:
                        "Named styled-components css font map. fonts.primaryFont is mandatory and used as the default global font; other keys can be consumed by components such as <Button fontFamily=\"montserrat\" />.",
                    type: "Record<string, css>",
                    required: true,
                },
                "fonts.primaryFont": {
                    description: "Default styled-components css font injected as body/root font.",
                    type: "css",
                    required: true,
                },
                globalStyle: {
                    description: "Global styled-components css (e.g. #root layout).",
                    type: "css",
                },
                themes: {
                    description:
                        "Named theme tokens (background, foreground, primary, …). _props.label supports i18n objects.",
                    type: "object",
                    required: true,
                },
                breakpoints: {
                    description: "Custom breakpoint map for responsive helpers.",
                    type: "object",
                },
                remSettings: {
                    description: "Root rem scaling configuration.",
                    type: "object",
                },
                maxAspRatio: {
                    description: "Max aspect ratio cap for client layout helpers.",
                    type: "number",
                },
                minAspRatio: {
                    description: "Min aspect ratio cap for client layout helpers.",
                    type: "number",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="baseFormSettings"
            args={section(`baseFormSettings: {
    HelperComponent: null,
    helperMode: "auto",
},`)}
            props={{
                HelperComponent: {
                    description: "Custom helper UI component for baseForm fields.",
                    type: "component | null",
                    defaultValue: "null",
                },
                helperMode: {
                    description: '"auto" | "enabled" | "disabled" — field helper visibility.',
                    type: "string",
                    defaultValue: '"auto"',
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="validationRules"
            args={section(`validationRules: {
    myRule: (value) => value != null,
},`)}
            props={{
                rules: {
                    description:
                        "Named validators merged into globalData._validationRules (with Base VALIDATION_RULES). Keys are rule names.",
                    type: "Record<string, function>",
                    defaultValue: "{}",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="defaultVariants"
            args={section(`defaultVariants: {
    Button: { variant: "primary" },
},`)}
            props={{
                variants: {
                    description:
                        'Per-component default variant props (e.g. Button: { variant: "primary" }). Used by componentCreator.',
                    type: "Record<string, object>",
                    defaultValue: "{}",
                },
            }}
        />
        <Ds.api
            title="adminSettings"
            args={section(`adminSettings: {
    showInternalDs: true,
},`)}
            props={{
                showInternalDs: {
                    description:
                        "Shows internal DS sitemap entries in development (with dev mode).",
                    type: "boolean",
                    defaultValue: "false",
                },
            }}
        />
    </>
);

export default X;
