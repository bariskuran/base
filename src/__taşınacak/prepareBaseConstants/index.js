import { getDate } from "../getDate";
import { getIsDevMode } from "../Base/getIsDevMode";
import { prepareAllThemes } from "../SYSTEM_THEMES/prepareAllThemes";

export const prepareBaseConstants = (BASE_SETTINGS = {}) => {
    const allThemes = prepareAllThemes(BASE_SETTINGS.styleManager);
    const defThemeNo = BASE_SETTINGS.styleManager.themes?.defaultThemeNo || 0;
    const theme = allThemes[defThemeNo];
    const themeName = theme.themeName;

    return {
        allThemes,
        theme,
        /* */
        isDevMode2: getIsDevMode(BASE_SETTINGS.fetchManager?.env),
        env2: BASE_SETTINGS.fetchManager.env,
        isDark: BASE_SETTINGS.styleManager.antAlgorithm?.[themeName] === "dark",
        date: getDate(
            BASE_SETTINGS.dateManager?.dateFormat,
            BASE_SETTINGS.dateManager?.firstDayOfWeek,
        ),
    };
};
