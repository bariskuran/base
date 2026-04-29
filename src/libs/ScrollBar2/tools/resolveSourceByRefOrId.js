import { isBrowser } from "./isBrowser";

export const resolveSourceByRefOrId = ({ sourceByRef, sourceById }) => {
    if (!isBrowser()) return null;

    const refValue = sourceByRef?.current || sourceByRef;

    if (refValue?.nodeType === 1) return refValue;

    if (typeof sourceById === "string" && sourceById.trim()) {
        return document.getElementById(sourceById);
    }

    return null;
};
