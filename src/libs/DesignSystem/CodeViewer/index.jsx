import { Fragment, useMemo } from "react";
import { Button } from "../../Button";
import { copyToClipboard } from "../../copyToClipboard";
import S from "./_styled";

const dedent = (text = "") => {
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

const formatJsxPropsForViewer = (text = "", indentUnit = "    ") => {
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

const renderHighlightedCode = (text = "") => {
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

        nodes.push(
            <S.tagStart key={key++}>
                {"<"}
                {tagName}
            </S.tagStart>,
        );

        lastIndex = start + fullMatch.length;
    }

    if (lastIndex < text.length) {
        nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
    }

    return nodes;
};

const CodeViewer = ({
    code,
    children,
    as = "pre",
    tabSize = 4,
    padding = 12,
    radius = 12,
    bg,
    color,
    maxHeight,
    wrap = false,
    formatJsxProps = true,
    ...props
}) => {
    const rawContent = code ?? children ?? "";

    const normalizedContent = useMemo(() => {
        const base = dedent(rawContent);
        return formatJsxProps ? formatJsxPropsForViewer(base) : base;
    }, [rawContent, formatJsxProps]);

    const renderedContent = useMemo(
        () => renderHighlightedCode(normalizedContent),
        [normalizedContent],
    );

    return (
        <S.container
            as={as}
            $tabSize={tabSize}
            $padding={padding}
            $radius={radius}
            $bg={bg}
            $color={color}
            $maxHeight={maxHeight}
            $wrap={wrap}
            {...props}
        >
            <code>{renderedContent}</code>

            <S.buttonArea>
                <Button
                    onClick={() => {
                        copyToClipboard(normalizedContent, { addToNotifier: true });
                    }}
                    bgColor="greys.shade15"
                    prefix={{
                        icon: "copy",
                        width: 16,
                        color: "greys.shade30",
                        onHoverColor: "greys.shade60",
                        onActiveIcon: "check",
                    }}
                    popTip="Copy to clipboard"
                />
            </S.buttonArea>
        </S.container>
    );
};

export default CodeViewer;
