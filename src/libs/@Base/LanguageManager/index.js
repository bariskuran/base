import { useEffect, useMemo } from "react";
import { useLocation, useMatches } from "react-router-dom";
import { baseStore } from "../../baseStore";
import { getPageRrdInfo } from "../../getPageRrdInfo";
import {
    getIgnoreClientLanguage,
    getLanguageSettings,
    getRouteLanguageContextFromMatches,
    isLanguageSupported,
    resolveInitialLanguage,
    setStoredLanguage,
} from "../GlobalDataProvider/resolveLanguage";

const normalizePathname = (path) => {
    if (path == null || path === "") return "";
    const s = String(path).trim();
    return s.startsWith("/") ? s : `/${s}`;
};

const routeHasDistinctLanguagePaths = (routeLanguageContext) => {
    const relatives = routeLanguageContext?.relatives;
    if (relatives == null || typeof relatives !== "object") return true;

    const paths = Object.values(relatives).filter((path) => path != null && path !== "");
    if (paths.length <= 1) return true;

    return new Set(paths.map(normalizePathname)).size > 1;
};

export const LanguageManager = () => {
    const location = useLocation();
    const matches = useMatches();

    const [clientData, languageSettings, currentGlobalLanguage, projectSettings] =
        baseStore.useGlobal((s) => [
            s._clientData,
            s.languageSettings,
            s.language,
            s._projectSettings,
        ]);

    const resolvedLanguageSettings = useMemo(
        () => languageSettings ?? getLanguageSettings(projectSettings ?? {}),
        [languageSettings, projectSettings],
    );
    const ignoreClientLanguage = getIgnoreClientLanguage(projectSettings ?? {});

    const routeLanguageContext = useMemo(() => {
        const fromMatches = getRouteLanguageContextFromMatches(matches);
        if (fromMatches?.relatives) return fromMatches;

        // Fallback: same relatives resolution as useRelative / setLanguage
        const { handle, relatives } = getPageRrdInfo(location.pathname);
        if (relatives) {
            return {
                language: handle?.language ?? fromMatches?.language ?? null,
                relatives,
            };
        }
        return fromMatches;
    }, [matches, location.pathname]);

    const pageLanguage = useMemo(() => {
        if (!routeHasDistinctLanguagePaths(routeLanguageContext)) return null;

        const code = routeLanguageContext?.language;
        if (!isLanguageSupported(code, resolvedLanguageSettings.languageList)) return null;

        return code;
    }, [routeLanguageContext, resolvedLanguageSettings.languageList]);

    const language = useMemo(
        () =>
            resolveInitialLanguage({
                pageLanguage,
                languageSettings: resolvedLanguageSettings,
                clientData,
                ignoreClientLanguage,
            }),
        [pageLanguage, clientData, resolvedLanguageSettings, ignoreClientLanguage],
    );

    useEffect(() => {
        baseStore.globalData.set((s) => {
            s._languageRoute = routeLanguageContext;
        });
    }, [routeLanguageContext]);

    useEffect(() => {
        if (!language) return;
        if (language === currentGlobalLanguage) return;
        setStoredLanguage(language);
        baseStore.globalData.set((s) => {
            s.language = language;
        });
    }, [language, currentGlobalLanguage]);

    return null;
};
