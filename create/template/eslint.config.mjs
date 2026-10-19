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
        ignores: ["**/dist", "**/.eslintrc.cjs", "**/_notlar.js"],
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
        files: ["**/*.{js,jsx}"],
        plugins: {
            react: fixupPluginRules(react),
            "react-hooks": fixupPluginRules(reactHooks),
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                process: true,
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
            "react-hooks/refs": "off",
            "react/no-children-prop": "off",
            "react/no-unescaped-entities": "off",
            "no-unreachable": "warn",
            "no-var": "error",
            "no-undef": "error",
            "no-unused-vars": "warn",
            "react-hooks/exhaustive-deps": "off",

            "react/jsx-no-undef": [
                "error",
                {
                    allowGlobals: true,
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
                process: true,
            },

            ecmaVersion: 5,
            sourceType: "commonjs",
        },
    },
    {
        files: ["**/*.js"],
        rules: {
            // ❌ JSX is forbidden in .js files
            "react/jsx-filename-extension": ["error", { extensions: [".jsx"] }],
        },
    },
];
