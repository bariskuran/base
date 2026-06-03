import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { bariskuranBaseAliases, bariskuranBaseResolvePlugin } from "./vite.aliases.mjs";
import { fileURLToPath } from "url";
import path, { resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, "src"),
            ...bariskuranBaseAliases(),
        },
    },
    plugins: [
        bariskuranBaseResolvePlugin(),
        react({
            jsxRuntime: "automatic",
        }),
    ],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./vitest.setup.js",
    },
});
