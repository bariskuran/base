import { css } from "styled-components";

const CSS_IMPORT_RE = /@import\s+(?:url\([^)]+\)|["'][^"']+["'])[^;]*;/gi;
const CSS_IMPORT_URL_RE =
    /@import\s+(?:url\(\s*(['"]?)([^"')]+)\1\s*\)|(['"])([^"']+)\3)[^;]*;/gi;

const collectCssStrings = (value) => {
    if (value == null) return [];
    if (typeof value === "string" || typeof value === "number") return [String(value)];
    if (Array.isArray(value)) return value.flatMap(collectCssStrings);
    return [];
};

export const getCssDeclarationValue = (value, propertyName) => {
    if (!propertyName) return null;
    const declarationRe = new RegExp(`${propertyName}\\s*:\\s*([^;]+)`, "i");

    for (const chunk of collectCssStrings(value)) {
        const match = declarationRe.exec(chunk);
        if (match?.[1]) return match[1].replace(/\s*!important\s*$/i, "").trim();
    }

    return null;
};

export const collectFontImports = (fonts = {}) => {
    const imports = new Set();

    Object.values(fonts || {}).forEach((fontCss) => {
        collectCssStrings(fontCss).forEach((chunk) => {
            const matches = chunk.match(CSS_IMPORT_RE);
            matches?.forEach((match) => imports.add(match.trim()));
        });
    });

    return imports.size ? css`${Array.from(imports).join("\n")}` : null;
};

export const collectFontImportUrls = (fonts = {}) => {
    const urls = new Set();

    Object.values(fonts || {}).forEach((fontCss) => {
        collectCssStrings(fontCss).forEach((chunk) => {
            CSS_IMPORT_URL_RE.lastIndex = 0;
            let match = CSS_IMPORT_URL_RE.exec(chunk);
            while (match) {
                const url = match[2] || match[4];
                if (url) urls.add(url.trim());
                match = CSS_IMPORT_URL_RE.exec(chunk);
            }
        });
    });

    return Array.from(urls);
};

export const stripCssImports = (value) => {
    if (value == null) return value;
    if (typeof value === "string") return value.replace(CSS_IMPORT_RE, "");
    if (Array.isArray(value)) {
        return value.map((item) => (typeof item === "string" ? stripCssImports(item) : item));
    }
    return value;
};
