import { baseStore } from "../@baseStore";
import { reactNodeToPlainText } from "./reactNodeToPlainText";

/**
 * Copies a given value to the clipboard.
 *
 * - Uses the modern Clipboard API when available
 * - Falls back to `document.execCommand("copy")` when necessary
 * - Optionally triggers a notifier success message
 *
 * @async
 * @function copyToClipboard
 *
 * @param {*} text
 * The value to copy.
 * If not a string, it will be converted using `String(value)`.
 *
 * @param {Object} [options]
 * Optional configuration object.
 *
 * @param {Function} [options.onSuccess]
 * Callback executed after a successful copy operation.
 *
 * @param {Function} [options.onError]
 * Callback executed if copying fails.
 * Receives the thrown `Error` as its argument.
 *
 * @param {boolean} [options.addToNotifier=false]
 * When `true`, triggers a success notification via `baseStore.useNotifier`.
 *
 * @returns {Promise<boolean>}
 * Resolves to:
 * - `true` if the copy operation succeeds
 * - `false` if it fails or if `text` is `null` / `undefined`
 *
 * @example
 * // Basic usage
 * await copyToClipboard("Hello world");
 *
 * @example
 * // With success & error callbacks
 * await copyToClipboard("Hello world", {
 *   onSuccess: () => console.log("Copied!"),
 *   onError: (err) => console.error("Copy failed:", err),
 * });
 *
 * @example
 * // With notifier integration
 * await copyToClipboard("Hello world", {
 *   addToNotifier: true,
 * });
 *
 * @example
 * // Copying a non-string value
 * await copyToClipboard(12345, {
 *   onSuccess: () => console.log("Number copied"),
 * });
 */
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
