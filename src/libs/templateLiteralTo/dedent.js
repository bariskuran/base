
export const dedent = (text = "") => {
    const lines = String(text).replace(/\r\n/g, "\n").split("\n");

    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

    const nonEmpty = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line.trim() !== "")
        .map(({ line, index }) => ({
            index,
            indent: line.match(/^(\s*)/)?.[1].length ?? 0,
        }));

    if (nonEmpty.length === 0) return "";

    const [firstNonEmpty] = nonEmpty;
    const remaining = nonEmpty.slice(1);

    const baseIndent =
        firstNonEmpty?.indent === 0 && remaining.length > 0
            ? Math.min(...remaining.map((item) => item.indent))
            : Math.min(...nonEmpty.map((item) => item.indent));

    return lines
        .map((line) => {
            const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
            const trimCount = Math.min(baseIndent, indent);
            return line.slice(trimCount);
        })
        .join("\n");
};

export const splitParagraphs = (text = "") => {
    const body = dedent(text).trim();
    if (!body) return [];

    const byBlank = body.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
    if (byBlank.length > 1) return byBlank;

    return body
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);
};
