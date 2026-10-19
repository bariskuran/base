/* global console */

// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { bariskuranBaseAliases, bariskuranBaseResolvePlugin } from "@bariskuran/base/vite";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseSourceRoot = path.resolve(__dirname, "../base/src");

const isBaseModule = (id = "") => id.startsWith(baseSourceRoot);
const isImage = (name = "") => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(name);

const getAssetSourceNames = (asset) => [
    ...(asset.originalFileNames || []),
    ...(asset.names || []),
    asset.name || "",
];

export default defineConfig(({ command }) => ({
    test: {
        environment: "jsdom",
        setupFiles: "./vitest.setup.js",
        globals: true,
        restoreMocks: true,
        clearMocks: true,
        mockReset: true,
    },

    resolve: {
        dedupe: ["react", "react-dom", "react-router-dom", "styled-components"],
        extensions: [".mjs", ".js", ".jsx", ".json"],
        alias: {
            base: "@bariskuran/base",
            ...bariskuranBaseAliases(),
            src: "/src",
            global: "/src/global",
            components: "/src/components",
            images: "/src/images",
            views: "/src/views",
            hooks: "/src/hooks",
            functions: "/src/functions",
            assets: "/src/assets",
        },
    },

    server: {
        host: true, // networkte erişilebilir hale getirir
        port: 3000,
        sourcemapIgnoreList: false, // Tüm dosyaları source map'te göster
    },

    // Development için detaylı source map
    css: {
        devSourcemap: true,
    },

    plugins: [
        bariskuranBaseResolvePlugin(),
        react({
            jsxRuntime: "automatic",
        }),
        eslint({
            include: [`${path.resolve(__dirname, "")}/**/*.{js,jsx}`],
        }),
    ],

    optimizeDeps: {
        force: true,
        exclude: ["_backUp/*"],
    },

    // Inline maps are useful in development but add the full source map to every
    // production JavaScript file.
    esbuild: {
        jsx: "automatic",
        sourcemap: command === "serve" ? "inline" : false,
    },

    build: {
        sourcemap: true, // Build için source map
        minify: "esbuild",
        rollupOptions: {
            output: {
                entryFileNames: "chunks/[name]-[hash].js",
                chunkFileNames: (chunk) => {
                    const moduleIds = chunk.moduleIds || [];
                    const isBaseChunk = moduleIds.length > 0 && moduleIds.every(isBaseModule);

                    return isBaseChunk ? "base/[name]-[hash].js" : "chunks/[name]-[hash].js";
                },
                assetFileNames: (asset) => {
                    const sourceNames = getAssetSourceNames(asset);

                    if (sourceNames.some(isBaseModule)) {
                        return "base/[name]-[hash][extname]";
                    }

                    if (sourceNames.some(isImage)) {
                        return "images/[name]-[hash][extname]";
                    }

                    return "chunks/[name]-[hash][extname]";
                },
            },
        },
    },
}));
