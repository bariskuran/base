import { baseStore } from "../@baseStore";

const resolveLang = (overrideLibrary) => {
    const gd = baseStore?.globalData?.get?.() || {};

    return {
        language: gd.language ?? gd.defaultLanguage ?? gd._clientData?.language ?? "en",
        textLibrary: overrideLibrary ?? gd.textLibrary ?? {},
    };
};

/**
 * Simple language-based text resolver.
 *
 * @param {string} key - Text key to resolve
 * @param {Object} [overrideLibrary] - Optional text library override
 * @returns {string}
 *
 * @example
 * t("home");
 *
 * @example
 * t("save", { save: {
 *   tr: "Kaydet",
 *   en: "Save",
 * }});
 * @example
 * t({
 *   tr: "Kaydet",
 *   en: "Save",
 * });
 */
export const getText = (keyOrEntry, overrideLibrary) => {
    if (!keyOrEntry) return "";
    const { language, textLibrary } = resolveLang(overrideLibrary);

    if (typeof keyOrEntry === "object") {
        console.log(keyOrEntry, language, keyOrEntry[language] ?? `unknown (${language})`);
        return keyOrEntry[language] ?? `unknown (${language})`;
    }

    if (typeof keyOrEntry === "string") {
        const entry = textLibrary?.[keyOrEntry];

        if (typeof entry === "string") return entry;

        if (entry && typeof entry === "object") {
            return entry[language] ?? `unknown "${keyOrEntry}" (${language})`;
        }

        return `unknown "${keyOrEntry}"`;
    }

    return "";
};
