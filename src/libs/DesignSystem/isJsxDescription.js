import { isValidElement } from "react";

/**
 * `true` when `description` is JSX (element, fragment, or array containing elements) rather than
 * a plain string/number, so the host can use a block wrapper (`div`) instead of `pre`.
 */
export const isJsxDescription = (description) => {
    if (description == null) return false;
    if (typeof description === "string" || typeof description === "number") return false;
    if (typeof description === "boolean") return false;
    if (isValidElement(description)) return true;
    if (Array.isArray(description)) {
        return description.some((child) => isJsxDescription(child));
    }
    return false;
};
