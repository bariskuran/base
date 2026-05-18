import { byPath } from "../byPath";

const splitSetPath = (setPath) =>
    typeof setPath === "string" && setPath.trim()
        ? setPath.trim().split(".").filter(Boolean)
        : [];

export const mergeIncomingInto = (existing, incoming) => {
    if (incoming == null || typeof incoming !== "object" || Array.isArray(incoming)) {
        return incoming;
    }

    const target =
        existing != null && typeof existing === "object" && !Array.isArray(existing)
            ? { ...existing }
            : {};

    for (const key of Object.keys(incoming)) {
        target[key] = incoming[key];
    }

    return target;
};

const mergeIncomingIntoDraft = (target, incoming) => {
    if (incoming == null || typeof incoming !== "object" || Array.isArray(incoming)) return;
    if (target == null || typeof target !== "object" || Array.isArray(target)) return;

    for (const key of Object.keys(incoming)) {
        target[key] = incoming[key];
    }
};

/** Merges parsed query via baseStore set (draft updater) at setPath or root. */
export const applyImportToStore = ({ set, setPath, incoming }) => {
    if (typeof set !== "function") return;

    const hasSetPath = splitSetPath(setPath).length > 0;

    set((draft) => {
        if (!hasSetPath) {
            mergeIncomingIntoDraft(draft, incoming);
            return;
        }

        const current = byPath.get(draft, setPath);
        byPath.set(draft, setPath, mergeIncomingInto(current, incoming), true);
    });
};
