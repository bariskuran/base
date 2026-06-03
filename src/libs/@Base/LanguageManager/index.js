import { useEffect, useMemo } from "react";
import { useLocation, useMatches } from "react-router-dom";
import { baseStore } from "../../baseStore";
import {
    getIgnoreClientLanguage,
    getLanguageSettings,
    getPageLanguageFromMatches,
    getRouteLanguageContextFromMatches,
    resolveInitialLanguage,
    setStoredLanguage,
} from "../GlobalDataProvider/resolveLanguage";

export const LanguageManager = () => {
    const location = useLocation();
    const matches = useMatches();

    const [clientData, languageSettings, currentGlobalLanguage, projectSettings] = baseStore.useGlobal(
        (s) => [s._clientData, s.languageSettings, s.language, s._projectSettings],
    );

    const resolvedLanguageSettings = useMemo(
        () => languageSettings ?? getLanguageSettings(projectSettings ?? {}),
        [languageSettings, projectSettings],
    );
    const ignoreClientLanguage = getIgnoreClientLanguage(projectSettings ?? {});

    const pageLanguage = useMemo(
        () => getPageLanguageFromMatches(matches, resolvedLanguageSettings.languageList),
        [matches, resolvedLanguageSettings.languageList, location.pathname],
    );

    const routeLanguageContext = useMemo(
        () => getRouteLanguageContextFromMatches(matches),
        [matches, location.pathname],
    );

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
