import { isValidElement } from "react";
const safeStringify = (value) => {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
};

const normalizeJoinedText = (text = "") =>
    text
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/[ \t]{2,}/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

const joinTextParts = (parts = []) => {
    let out = "";

    for (const part of parts) {
        if (!part) continue;

        if (!out) {
            out = part;
            continue;
        }

        const prevChar = out[out.length - 1];
        const nextChar = part[0];
        const prevEndsWithSpace = /\s/.test(prevChar);
        const nextStartsWithSpace = /\s/.test(nextChar);

        if (prevChar === "\n" || nextChar === "\n") {
            out += part;
            continue;
        }

        if (!prevEndsWithSpace && !nextStartsWithSpace) {
            out += part;
            continue;
        }

        out += part;
    }

    return normalizeJoinedText(out);
};

export const reactNodeToPlainText = (node) => {
    const walk = (value) => {
        if (value == null) return "";

        if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
            return String(value);
        }

        if (typeof value === "boolean") {
            return safeStringify(value);
        }

        if (Array.isArray(value)) {
            return joinTextParts(value.map(walk));
        }

        if (isValidElement(value)) {
            if (value.type === "br") return "\n";
            return walk(value.props?.children);
        }

        if (typeof value === "object") {
            return safeStringify(value);
        }

        return String(value);
    };

    return normalizeJoinedText(walk(node));
};
