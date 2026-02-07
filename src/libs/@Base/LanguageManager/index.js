import { useMemo } from "react";
import { useMatches } from "react-router-dom";
import { baseStore } from "../../@baseStore";
import { useEffectAfterMount } from "../../useEffectAfterMount";

export const LanguageManager = () => {
    const [clientData, usersLanguage, usersLanguageList, currentGlobalLanguage, setGlobal] =
        baseStore.useGlobal((s) => [s._clientData, s.defaultLanguage, s.languageList, s.language]);
    const matches = useMatches();
    const clientLanguage = clientData?.language;
    const pathLanguage = matches?.[matches.length - 1]?.handle?.language;
    const isMultiLang = Array.isArray(usersLanguageList) && usersLanguageList.length > 1;
    const language = useMemo(
        () => pathLanguage ?? clientLanguage ?? usersLanguage ?? "en",
        [pathLanguage, clientLanguage, usersLanguage],
    );

    useEffectAfterMount(() => {
        if (!isMultiLang) return;
        if (!language) return;
        if (language !== currentGlobalLanguage) setGlobal({ language });
    }, [language, currentGlobalLanguage]);

    return null;
};
