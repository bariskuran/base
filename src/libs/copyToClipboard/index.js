import { baseStore } from "../@baseStore";

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
export const copyToClipboard = async (text, { onSuccess, onError, addToNotifier = false } = {}) => {
    if (text == null) return false;
    const value = typeof text === "string" ? text : String(text);
    const canUseClipboard =
        typeof navigator !== "undefined" &&
        navigator?.clipboard &&
        typeof navigator.clipboard.writeText === "function";
    const { addToNotifier: aTN } = baseStore.notifierData.get();

    const executeSuccess = () => {
        onSuccess?.();
        if (addToNotifier) {
            aTN({
                info: "Copied to clipboard",
                status: "success",
            });
        }
        return true;
    };

    try {
        if (canUseClipboard) {
            await navigator.clipboard.writeText(value);
            return executeSuccess();
        }

        if (typeof document === "undefined") {
            const err = new Error("Clipboard API not available and no document for fallback.");
            onError?.(err);
            return false;
        }

        const elem = document.createElement("textarea");
        elem.value = value;
        elem.setAttribute("readonly", "");
        elem.style.position = "fixed";
        elem.style.top = "-9999px";
        elem.style.left = "-9999px";
        document.body.appendChild(elem);

        elem.focus();
        elem.select();

        const ok = document.execCommand?.("copy") === true;
        document.body.removeChild(elem);

        if (ok) {
            return executeSuccess();
        }

        const err = new Error("Fallback copy failed.");
        onError?.(err);
        return false;
    } catch (err) {
        console.error("Failed to copy text:", err);
        onError?.(err);
        return false;
    }
};
