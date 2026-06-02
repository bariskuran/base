import { baseStore } from "../baseStore";

const resolveLang = (overrideLibrary) => {
    const gd = baseStore?.globalData?.get?.() || {};

    return {
        language: gd.language ?? gd.defaultLanguage ?? gd._clientData?.language ?? "en",
        textLibrary: overrideLibrary ?? gd.textLibrary ?? {},
    };
};

export const getText = (keyOrEntry, overrideLibrary) => {
    if (!keyOrEntry) return "";
    const { language, textLibrary } = resolveLang(overrideLibrary);

    if (typeof keyOrEntry === "object") {
        const v = keyOrEntry[language];
        if (v != null && v !== "") return v;
        const en = keyOrEntry.en;
        if (en != null && en !== "") return en;
        const first = Object.values(keyOrEntry).find((x) => typeof x === "string" && x !== "");
        return first ?? "";
    }

    if (typeof keyOrEntry === "string") {
        const entry = textLibrary?.[keyOrEntry];

        if (typeof entry === "string") return entry;

        if (entry && typeof entry === "object") {
            return entry[language] ?? keyOrEntry;
        }

        return keyOrEntry;
    }

    return "";
};
