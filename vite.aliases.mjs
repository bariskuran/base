import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(packageRoot, "src");

const resolveWithExtensions = (basePath) => {
    const candidates = [
        basePath,
        `${basePath}.js`,
        `${basePath}.jsx`,
        path.join(basePath, "index.js"),
        path.join(basePath, "index.jsx"),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) return candidate;
    }
    return basePath;
};

export const bariskuranBaseAliases = () => ({
    helpers: path.join(srcRoot, "helpers"),
    libs: path.join(srcRoot, "libs"),
});

export const bariskuranBaseResolvePlugin = () => ({
    name: "bariskuran-base-internal-aliases",
    enforce: "pre",
    resolveId(source, importer) {
        if (!importer?.includes("@bariskuran/base")) return null;

        if (source.startsWith("helpers/")) {
            return resolveWithExtensions(path.join(srcRoot, "helpers", source.slice(8)));
        }

        if (source.startsWith("libs/")) {
            return resolveWithExtensions(path.join(srcRoot, "libs", source.slice(5)));
        }

        return null;
    },
});
