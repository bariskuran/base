import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import path from "node:path";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({
    baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ["**/dist", "**/.eslintrc.cjs"],
    },
    ...fixupConfigRules(
        compat.extends(
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:react/jsx-runtime",
            "plugin:react-hooks/recommended",
        ),
    ),
    {
        files: ["**/*.js", "**/*.jsx"],
        plugins: {
            react: fixupPluginRules(react),
            "react-hooks": fixupPluginRules(reactHooks),
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            ecmaVersion: "latest",
            sourceType: "module",
        },

        settings: {
            react: {
                version: "^18.3.1",
            },
        },

        rules: {
            "react/no-children-prop": "off",
            "react/no-unescaped-entities": "off",
            "no-unreachable": "warn",
            "no-var": "error",
            "no-undef": ["error", { typeof: true }],
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "react-hooks/exhaustive-deps": "off",
            "react-compiler/react-compiler": "off",
            "react-hooks/preserve-manual-memoization": "off",
            "react/jsx-no-undef": [
                "error",
                {
                    allowGlobals: false,
                },
            ],

            "react/jsx-curly-brace-presence": [
                "error",
                {
                    children: "ignore",
                    props: "never",
                },
            ],

            "react/jsx-no-bind": [
                "error",
                {
                    allowArrowFunctions: true,
                },
            ],

            "react/jsx-no-literals": "off",
            "react/jsx-no-target-blank": "off",
            "react/no-deprecated": "off",
            "react/prop-types": "off",
            "prettier/prettier": "off",
            "require-await": "error",
            "space-before-function-paren": "off",
            "no-prototype-builtins": "warn",
            "react/jsx-runtime": "off",
            "react/jsx-filename-extension": [0],
        },
    },
    {
        files: ["**/.eslintrc.{js,cjs}"],

        languageOptions: {
            globals: {
                ...globals.node,
            },

            ecmaVersion: 5,
            sourceType: "commonjs",
        },
    },
    {
        files: ["*.cjs", ".prettierrc.cjs"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.js"],
        rules: {
            // ❌ JSX is forbidden in .js files
            "react/jsx-filename-extension": ["error", { extensions: [".jsx"] }],
        },
    },
    {
        files: ["**/*.jsx"],
        rules: {
            // ❌ .jsx files must contain JSX
            "no-restricted-syntax": [
                "error",
                {
                    selector: "Program:not(:has(JSXElement)):not(:has(JSXFragment))",
                    message:
                        "This file has a .jsx extension but contains no JSX. Rename it to .js.",
                },
            ],
        },
    },
];
