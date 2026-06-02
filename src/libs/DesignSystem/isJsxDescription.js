import { isValidElement } from "react";

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
