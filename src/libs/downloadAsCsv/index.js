/**
 * Downloads a 2D array as CSV file.
 *
 * @param {any[][]} data - Rows x columns.
 * @param {string} [fileName="data"] - Name without extension.
 * @param {Object} [options]
 * @param {() => void} [options.onSuccess]
 * @param {(err: any) => void} [options.onError]
 * @param {string} [options.separator=","] - CSV separator.
 * @param {boolean} [options.includeBom=true] - Add UTF-8 BOM for Excel compatibility.
 * @param {boolean} [options.preventExcelInjection=true] - Prefix dangerous cells with `'`.
 */
export const downloadAsCsv = (
    data,
    fileName = "data",
    { onSuccess, onError, separator = ",", includeBom = true, preventExcelInjection = true } = {},
) => {
    try {
        if (!Array.isArray(data)) {
            throw new Error("downloadAsCsv: data must be a 2D array.");
        }

        const needsQuoting = (s) =>
            s.includes(separator) || s.includes('"') || s.includes("\n") || s.includes("\r");

        const sanitizeForExcel = (s) => {
            if (!preventExcelInjection) return s;
            return /^[=+\-@]/.test(s) ? `'${s}` : s;
        };

        const escapeCell = (cell) => {
            let s = cell == null ? "" : String(cell);
            s = sanitizeForExcel(s);

            if (needsQuoting(s)) {
                s = `"${s.replace(/"/g, '""')}"`;
            }
            return s;
        };

        const rows = data.map((row) => {
            const safeRow = Array.isArray(row) ? row : [row];
            return safeRow.map(escapeCell).join(separator);
        });

        const csvText = (includeBom ? "\uFEFF" : "") + rows.join("\r\n");

        // Blob approach (safer than data URI)
        const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.csv`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        onSuccess?.();
        return true;
    } catch (error) {
        onError?.(error);
        return false;
    }
};
