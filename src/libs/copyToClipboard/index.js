import { baseStore } from "../baseStore";
import { reactNodeToPlainText } from "./reactNodeToPlainText";

const legacyCopyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");

    textarea.style.position = "fixed";
    textarea.style.top = "-999999px";
    textarea.style.left = "-999999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const originalRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.focus();
    textarea.select();

    let success = false;

    try {
        success = document.execCommand("copy");
    } catch {
        success = false;
    }

    document.body.removeChild(textarea);

    if (selection) {
        selection.removeAllRanges();
        if (originalRange) selection.addRange(originalRange);
    }

    return success;
};

const safeJsonStringify = (value) => {
    try {
        return JSON.stringify(value);
    } catch {
        return null;
    }
};

const serializeClipboardValue = (value) => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "bigint" ||
        typeof value === "boolean" ||
        typeof value === "symbol"
    ) {
        return String(value);
    }

    if (value instanceof Error) {
        if (value.stack) return value.stack;
        return `${value.name}: ${value.message}`;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? String(value) : value.toISOString();
    }

    if (typeof value === "function") {
        return value.toString();
    }

    if (Array.isArray(value)) {
        const str = safeJsonStringify(value);
        return str != null ? str : value.map((item) => serializeClipboardValue(item)).join(", ");
    }

    if (typeof value === "object") {
        const str = safeJsonStringify(value);
        return str != null ? str : reactNodeToPlainText(value);
    }

    return reactNodeToPlainText(value);
};

export const copyToClipboard = async (
    value,
    {
        onSuccess,
        onError,
        successMessage = "Copied to clipboard.",
        errorMessage = "Failed to copy text.",
        disableNotifier = false,
        notifierProps,
    } = {},
) => {
    const text = serializeClipboardValue(value);
    const { _notifier } = baseStore.globalData.get() || {};

    const executeSuccess = () => {
        onSuccess?.(text);
        !disableNotifier &&
            _notifier?.add?.(successMessage, {
                ...(notifierProps || {}),
                type: "success",
            });
        return true;
    };

    const executeError = (err) => {
        console.error(errorMessage, err);
        onError?.(err);
        !disableNotifier &&
            _notifier?.add?.(errorMessage, { ...(notifierProps || {}), type: "error" });
        return false;
    };

    if (!text) {
        return executeError(new Error("Nothing to copy."));
    }

    let copied = false;

    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            copied = true;
        } else {
            copied = legacyCopyToClipboard(text);
        }
    } catch {
        copied = legacyCopyToClipboard(text);
    }

    if (!copied) {
        return executeError(new Error(errorMessage));
    }

    try {
        return executeSuccess();
    } catch (err) {
        console.error("Copy succeeded but success handlers failed:", err);
        return true;
    }
};
