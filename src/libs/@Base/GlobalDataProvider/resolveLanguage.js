import { baseStore } from "../../baseStore";

export const LANGUAGE_STORAGE_KEY = "language";

export const isLanguageSupported = (code, languageList) => {
    if (code == null || code === "") return false;
    if (!Array.isArray(languageList) || languageList.length === 0) return true;
    return languageList.includes(code);
};

/** PROJECT_SETTINGS.languageSettings */
export const getLanguageSettings = (projectSettings = {}) =>
    projectSettings.languageSettings ?? {};

/** Active language config from globalData (falls back to PROJECT_SETTINGS). */
export const getGlobalLanguageSettings = (globalData = {}) =>
    globalData.languageSettings ?? getLanguageSettings(globalData._projectSettings ?? {});

export const getStoredLanguage = (languageList) => {
    if (typeof localStorage === "undefined") return null;
    try {
        const raw = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (raw == null || raw === "") return null;
        const code = String(raw).trim().toLowerCase().split("-")[0];
        if (!isLanguageSupported(code, languageList)) return null;
        return code;
    } catch {
        return null;
    }
};

export const setStoredLanguage = (code) => {
    if (typeof localStorage === "undefined" || code == null || code === "") return;
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, String(code));
    } catch {
        /* ignore quota / private mode */
    }
};

/** Deepest match with handle.language (from prepareRoutes). */
export const getPageLanguageFromMatches = (matches, languageList) => {
    if (!Array.isArray(matches) || matches.length === 0) return null;
    for (let i = matches.length - 1; i >= 0; i--) {
        const raw = matches[i]?.handle?.language;
        if (raw == null || raw === "") continue;
        const code = String(raw).trim().toLowerCase().split("-")[0];
        if (!isLanguageSupported(code, languageList)) continue;
        return code;
    }
    return null;
};

/**
 * Active route handle slice for setLanguage navigation.
 * LanguageManager copies this to globalData._languageRoute so setLanguage (non-React)
 * can read handle.relatives for the current page without useMatches().
 */
export const getRouteLanguageContextFromMatches = (matches) => {
    if (!Array.isArray(matches) || matches.length === 0) return null;
    for (let i = matches.length - 1; i >= 0; i--) {
        const handle = matches[i]?.handle;
        if (!handle) continue;
        const { language, relatives } = handle;
        if (relatives != null && typeof relatives === "object") {
            return { language, relatives };
        }
        if (language != null && language !== "") {
            return { language, relatives: null };
        }
    }
    return null;
};

export const matchClientLanguageToList = (locale, languageList) => {
    if (locale == null || locale === "" || locale === "undefined") return null;
    const lower = String(locale).toLowerCase();
    const primary = lower.split("-")[0];

    if (!Array.isArray(languageList) || languageList.length === 0) return primary;

    if (languageList.includes(primary)) return primary;
    if (languageList.includes(lower)) return lower;
    return null;
};

/**
 * page (route handle) > localStorage > client (if supported & !ignoreClientLanguage) > defaultLanguage > "en"
 */
export const resolveInitialLanguage = ({
    pageLanguage = null,
    languageSettings = {},
    clientData = {},
    ignoreClientLanguage = false,
}) => {
    const languageList = languageSettings.languageList;
    const defaultLanguage = languageSettings.defaultLanguage ?? null;

    if (pageLanguage) return pageLanguage;

    const fromStorage = getStoredLanguage(languageList);
    if (fromStorage) return fromStorage;

    if (!ignoreClientLanguage) {
        const fromClient = matchClientLanguageToList(clientData?.language, languageList);
        if (fromClient) return fromClient;
    }

    if (defaultLanguage) return defaultLanguage;
    return "en";
};

export const getIgnoreClientLanguage = (projectSettings = {}) => {
    const languageSettings = getLanguageSettings(projectSettings);
    return (
        projectSettings.ignoreClientLanguage ??
        languageSettings.ignoreClientLanguage ??
        false
    );
};

const normalizePathname = (path) => {
    if (path == null || path === "") return "";
    const s = String(path).trim();
    return s.startsWith("/") ? s : `/${s}`;
};

/**
 * Updates globalData.language, localStorage, and optionally navigates via handle.relatives.
 * @param {string} code - Language code (e.g. "tr", "en")
 * @param {{ navigate?: boolean, relatives?: Record<string, string> }} [options]
 *   - navigate: override languageSettings.navigateOnLanguageChange (default true)
 *   - relatives: override active route relatives map
 */
export const setLanguage = (code, options = {}) => {
    const gd = baseStore?.globalData?.get?.() || {};
    const languageSettings = getGlobalLanguageSettings(gd);
    const languageList = languageSettings.languageList;

    if (!isLanguageSupported(code, languageList)) return;

    const shouldNavigate =
        options.navigate ??
        languageSettings.navigateOnLanguageChange ??
        true;

    setStoredLanguage(code);
    baseStore.globalData.set((s) => {
        s.language = code;
    });

    if (shouldNavigate === false) return;

    const relatives = options.relatives ?? gd._languageRoute?.relatives;
    if (relatives == null || typeof relatives !== "object") return;

    const targetPath = relatives[code];
    if (targetPath == null || targetPath === "") return;

    const rrd = gd._reactRouterDom;
    if (!rrd) return;

    const normalizedTarget = normalizePathname(targetPath);
    const currentPath = normalizePathname(rrd.location?.pathname ?? "");
    if (currentPath === normalizedTarget) return;

    if (typeof rrd.navigateWithSearch === "function") {
        rrd.navigateWithSearch(normalizedTarget);
        return;
    }

    if (typeof rrd.navigate === "function") {
        rrd.navigate({ pathname: normalizedTarget, search: rrd.location?.search ?? "" });
    }
};
