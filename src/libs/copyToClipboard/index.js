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

export const copyToClipboard = async (
    value,
    {
        onSuccess,
        onError,
        successMessage = "Copied to clipboard.",
        errorMessage = "Failed to copy text.",
    } = {},
) => {
    const text = reactNodeToPlainText(value);
    const { _notifier } = baseStore.globalData.get() || {};

    const executeSuccess = () => {
        onSuccess?.(text);
        _notifier?.add?.(successMessage, { type: "success" });
        return true;
    };

    const executeError = (err) => {
        console.error(errorMessage, err);
        onError?.(err);
        _notifier?.add?.(errorMessage, { type: "error" });
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
