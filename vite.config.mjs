// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { bariskuranBaseAliases, bariskuranBaseResolvePlugin } from "./vite.aliases.mjs";
import { fileURLToPath } from "url";
import path, { resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: "./vitest.setup.js",
        globals: true,
        restoreMocks: true,
        clearMocks: true,
        mockReset: true,
    },

    resolve: {
        extensions: [".mjs", ".js", ".jsx", ".json"],
        alias: {
            src: resolve(__dirname, "src"),
            ...bariskuranBaseAliases(),
        },
    },

    server: {
        port: 3000,
    },

    plugins: [
        bariskuranBaseResolvePlugin(),
        react({
            jsxRuntime: "automatic",
            // Tüm JSX dosyalarını işle (test dosyaları dahil)
        }),
        eslint({
            include: [`${path.resolve(__dirname, "")}/**/*.{js,jsx}`],
        }),
    ],

    optimizeDeps: {
        force: true,
        exclude: ["_backUp/*"],
    },

    esbuild: {
        // only affects esbuild transforms Vite performs
        jsx: "automatic",
    },

    build: {
        lib: {
            entry: resolve(__dirname, "src/index.js"),
            name: "BariskuranBase",
            fileName: "bariskuran-base",
            formats: ["es", "umd"],
        },

        rollupOptions: {
            external: ["react", "react-dom", "react-router-dom", "styled-components"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react-router-dom": "ReactRouterDOM",
                    "styled-components": "styled",
                },
            },
        },

        minify: "esbuild",
    },
});
