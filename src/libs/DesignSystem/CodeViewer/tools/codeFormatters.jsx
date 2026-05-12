import { Fragment } from "react";

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

const getLineIndentAt = (text = "", index = 0) => {
    let i = index - 1;
    while (i >= 0 && text[i] !== "\n") i -= 1;
    const start = i + 1;
    const before = text.slice(start, index);
    return before.match(/^[ \t]*/)?.[0] ?? "";
};

const findTagEnd = (text = "", startIndex = 0) => {
    let quote = null;
    let braceDepth = 0;
    let parenDepth = 0;
    let bracketDepth = 0;

    for (let i = startIndex; i < text.length; i += 1) {
        const ch = text[i];
        const prev = text[i - 1];

        if (quote) {
            if (ch === quote && prev !== "\\") quote = null;
            continue;
        }

        if (ch === '"' || ch === "'" || ch === "`") {
            quote = ch;
            continue;
        }

        if (ch === "{") {
            braceDepth += 1;
            continue;
        }

        if (ch === "}") {
            braceDepth = Math.max(0, braceDepth - 1);
            continue;
        }

        if (ch === "(") {
            parenDepth += 1;
            continue;
        }

        if (ch === ")") {
            parenDepth = Math.max(0, parenDepth - 1);
            continue;
        }

        if (ch === "[") {
            bracketDepth += 1;
            continue;
        }

        if (ch === "]") {
            bracketDepth = Math.max(0, bracketDepth - 1);
            continue;
        }

        if (ch === ">" && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
            return i;
        }
    }

    return -1;
};

const findFirstTopLevelWhitespace = (text = "") => {
    let quote = null;
    let braceDepth = 0;
    let parenDepth = 0;
    let bracketDepth = 0;

    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        const prev = text[i - 1];

        if (quote) {
            if (ch === quote && prev !== "\\") quote = null;
            continue;
        }

        if (ch === '"' || ch === "'" || ch === "`") {
            quote = ch;
            continue;
        }

        if (ch === "{") {
            braceDepth += 1;
            continue;
        }

        if (ch === "}") {
            braceDepth = Math.max(0, braceDepth - 1);
            continue;
        }

        if (ch === "(") {
            parenDepth += 1;
            continue;
        }

        if (ch === ")") {
            parenDepth = Math.max(0, parenDepth - 1);
            continue;
        }

        if (ch === "[") {
            bracketDepth += 1;
            continue;
        }

        if (ch === "]") {
            bracketDepth = Math.max(0, bracketDepth - 1);
            continue;
        }

        if (/\s/.test(ch) && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
            return i;
        }
    }

    return -1;
};

const splitTopLevelProps = (text = "") => {
    const result = [];
    let current = "";
    let quote = null;
    let braceDepth = 0;
    let parenDepth = 0;
    let bracketDepth = 0;

    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        const prev = text[i - 1];

        if (quote) {
            current += ch;
            if (ch === quote && prev !== "\\") quote = null;
            continue;
        }

        if (ch === '"' || ch === "'" || ch === "`") {
            quote = ch;
            current += ch;
            continue;
        }

        if (ch === "{") {
            braceDepth += 1;
            current += ch;
            continue;
        }

        if (ch === "}") {
            braceDepth = Math.max(0, braceDepth - 1);
            current += ch;
            continue;
        }

        if (ch === "(") {
            parenDepth += 1;
            current += ch;
            continue;
        }

        if (ch === ")") {
            parenDepth = Math.max(0, parenDepth - 1);
            current += ch;
            continue;
        }

        if (ch === "[") {
            bracketDepth += 1;
            current += ch;
            continue;
        }

        if (ch === "]") {
            bracketDepth = Math.max(0, bracketDepth - 1);
            current += ch;
            continue;
        }

        if (/\s/.test(ch) && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
            if (current.trim()) {
                result.push(current.trim());
                current = "";
            }
            continue;
        }

        current += ch;
    }

    if (current.trim()) result.push(current.trim());

    return result;
};

const formatOpeningTag = (rawTag = "", lineIndent = "", indentUnit = "    ") => {
    if (!rawTag.startsWith("<") || !rawTag.endsWith(">")) return rawTag;
    if (rawTag.startsWith("</")) return rawTag;
    if (rawTag === "<>" || rawTag === "</>") return rawTag;
    if (rawTag.startsWith("<!--")) return rawTag;

    const isSelfClosing = /\/>\s*$/.test(rawTag);
    const inner = rawTag.slice(1, isSelfClosing ? -2 : -1).trim();

    if (!inner) return rawTag;

    const firstWs = findFirstTopLevelWhitespace(inner);
    if (firstWs === -1) return rawTag;

    const tagName = inner.slice(0, firstWs).trim();
    const propsText = inner.slice(firstWs).trim();

    if (!tagName || !propsText) return rawTag;

    const props = splitTopLevelProps(propsText);
    if (props.length <= 1) return rawTag;

    const propIndent = lineIndent + indentUnit;
    const closing = isSelfClosing ? " />" : ">";

    return [
        `<${tagName}`,
        ...props.map(
            (prop, index) => `${propIndent}${prop}${index === props.length - 1 ? closing : ""}`,
        ),
    ].join("\n");
};

export const formatJsxPropsForViewer = (text = "", indentUnit = "    ") => {
    let result = "";
    let i = 0;

    while (i < text.length) {
        const ch = text[i];

        if (ch !== "<") {
            result += ch;
            i += 1;
            continue;
        }

        const next = text[i + 1];

        if (next === "/" || next === ">" || next === "!" || next === "?") {
            result += ch;
            i += 1;
            continue;
        }

        const tagEnd = findTagEnd(text, i + 1);

        if (tagEnd === -1) {
            result += text.slice(i);
            break;
        }

        const rawTag = text.slice(i, tagEnd + 1);
        const lineIndent = getLineIndentAt(text, i);
        const formattedTag = formatOpeningTag(rawTag, lineIndent, indentUnit);

        result += formattedTag;
        i = tagEnd + 1;
    }

    return result;
};

/** `(` indeksinden itibaren eşleşen kapanan `)` (string / iç içe parantez güvenli). */
export const findMatchingCloseParen = (text, openParenIndex) => {
    let depth = 0;
    let quote = null;

    for (let i = openParenIndex; i < text.length; i += 1) {
        const ch = text[i];
        const prev = i > 0 ? text[i - 1] : "";

        if (quote) {
            if (ch === quote && prev !== "\\") quote = null;
            continue;
        }

        if (ch === '"' || ch === "'" || ch === "`") {
            quote = ch;
            continue;
        }

        if (ch === "(") {
            depth += 1;
            continue;
        }

        if (ch === ")") {
            depth -= 1;
            if (depth === 0) return i;
        }
    }

    return -1;
};

/** Virgülle ayrılmış üst seviye parçalar (obje / dizi / parantez derinliği ve string güvenli). */
export const splitTopLevelByDelimiter = (text, delimiterChar = ",") => {
    const result = [];
    let current = "";
    let quote = null;
    let brace = 0;
    let paren = 0;
    let bracket = 0;

    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        const prev = i > 0 ? text[i - 1] : "";

        if (quote) {
            current += ch;
            if (ch === quote && prev !== "\\") quote = null;
            continue;
        }

        if (ch === '"' || ch === "'" || ch === "`") {
            quote = ch;
            current += ch;
            continue;
        }

        if (ch === "{") {
            brace += 1;
            current += ch;
            continue;
        }

        if (ch === "}") {
            brace -= 1;
            current += ch;
            continue;
        }

        if (ch === "(") {
            paren += 1;
            current += ch;
            continue;
        }

        if (ch === ")") {
            paren -= 1;
            current += ch;
            continue;
        }

        if (ch === "[") {
            bracket += 1;
            current += ch;
            continue;
        }

        if (ch === "]") {
            bracket -= 1;
            current += ch;
            continue;
        }

        if (ch === delimiterChar && brace === 0 && paren === 0 && bracket === 0) {
            if (current.trim()) result.push(current.trim());
            current = "";
            continue;
        }

        current += ch;
    }

    if (current.trim()) result.push(current.trim());

    return result;
};

const findTopLevelColonForPair = (text) => {
    let quote = null;
    let brace = 0;
    let paren = 0;
    let bracket = 0;

    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        const prev = i > 0 ? text[i - 1] : "";

        if (quote) {
            if (ch === quote && prev !== "\\") quote = null;
            continue;
        }

        if (ch === '"' || ch === "'" || ch === "`") {
            quote = ch;
            continue;
        }

        if (ch === "{") {
            brace += 1;
            continue;
        }

        if (ch === "}") {
            brace -= 1;
            continue;
        }

        if (ch === "(") {
            paren += 1;
            continue;
        }

        if (ch === ")") {
            paren -= 1;
            continue;
        }

        if (ch === "[") {
            bracket += 1;
            continue;
        }

        if (ch === "]") {
            bracket -= 1;
            continue;
        }

        if (ch === ":" && brace === 0 && paren === 0 && bracket === 0) return i;
    }

    return -1;
};

const formatLeafPairOrExpr = (ft, innerIndent, indentUnit) => {
    if (!ft) return "";
    if (ft[0] === "{" || ft[0] === "[") {
        return prettyPrintOuterLiteral(ft, innerIndent, indentUnit);
    }

    const ci = findTopLevelColonForPair(ft);
    if (ci === -1) return `${innerIndent}${ft}`;

    const key = ft.slice(0, ci).trim();
    const val = ft.slice(ci + 1).trim();

    if (val[0] === "{" || val[0] === "[") {
        const nested = prettyPrintOuterLiteral(val, innerIndent, indentUnit);
        return `${innerIndent}${key}:\n${nested}`;
    }

    return `${innerIndent}${key}: ${val}`;
};

/** Obje / dizi literalini çıktı görünümü için satırlara böler (JSX değil). */
export const prettyPrintOuterLiteral = (s, baseIndent, indentUnit = "    ") => {
    const t = s.trim();
    const open = t[0];
    if (open !== "{" && open !== "[") return `${baseIndent}${t}`;

    const close = open === "{" ? "}" : "]";
    if (t[t.length - 1] !== close) return `${baseIndent}${t}`;

    const inner = t.slice(1, -1).trim();
    if (!inner) return `${baseIndent}${open}${close}`;

    const parts = splitTopLevelByDelimiter(inner, ",");
    const innerIndent = baseIndent + indentUnit;
    const formattedParts = parts.map((p) => formatLeafPairOrExpr(p.trim(), innerIndent, indentUnit));

    return `${baseIndent}${open}\n${formattedParts.join(`,\n`)}\n${baseIndent}${close}`;
};

/**
 * `isDeepEqual({ a: 1 }, …)` gibi tek üst seviye çağrıları okunur biçimde satırlara böler.
 * JSX biçimlendirmesinden sonra uygulanır; eşleşmezse metni olduğu gibi döndürür.
 */
export const formatFnCallSnippetForViewer = (text = "", indentUnit = "    ") => {
    const raw = String(text)
        .trim()
        .replace(/;+\s*$/, "");
    const m = raw.match(/^([\w$]+(?:\.[\w$]+)*)\s*\(/);
    if (!m) return text;

    const openIdx = raw.indexOf("(");
    const closeIdx = findMatchingCloseParen(raw, openIdx);
    if (closeIdx === -1) return text;

    const tail = raw.slice(closeIdx + 1).trim();
    if (tail !== "" && tail !== ";") return text;

    const inner = raw.slice(openIdx + 1, closeIdx).trim();
    const name = m[1];
    if (!inner) return text;

    const args = splitTopLevelByDelimiter(inner, ",");
    const complex =
        args.length > 1 ||
        args.some((a) => {
            const x = a.trim();
            return x.length > 48 || /[{[\]}]/.test(x);
        });

    if (!complex) return text;

    const argIndent = indentUnit;
    const formattedArgs = args.map((a) => {
        const x = a.trim();
        if (x[0] === "{" || x[0] === "[") {
            return prettyPrintOuterLiteral(x, argIndent, indentUnit);
        }
        return `${argIndent}${x}`;
    });

    return `${name}(\n${formattedArgs.join(`,\n`)}\n)`;
};

export const renderHighlightedCode = (text = "", TagStartComp) => {
    const regex = /<(?!\/|>|!|\?)([A-Z][A-Za-z0-9._-]*)/g;
    const nodes = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        const fullMatch = match[0];
        const tagName = match[1];
        const start = match.index;

        if (start > lastIndex) {
            nodes.push(<Fragment key={key++}>{text.slice(lastIndex, start)}</Fragment>);
        }

        if (TagStartComp) {
            nodes.push(
                <TagStartComp key={key++}>
                    {"<"}
                    {tagName}
                </TagStartComp>,
            );
        } else {
            nodes.push(
                <Fragment key={key++}>
                    {"<"}
                    {tagName}
                </Fragment>,
            );
        }

        lastIndex = start + fullMatch.length;
    }

    if (lastIndex < text.length) {
        nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
    }

    return nodes;
};
