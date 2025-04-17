import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default tseslint.config(
    // Fichiers à ignorer
    { ignores: ["node_modules", "dist", "build", "coverage", "*.d.ts"] },

    // Configuration de base pour tout le projet
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },

    // Configuration spécifique au frontend
    {
        files: ["Frontend/**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true }
            ],
            "react/react-in-jsx-scope": "off",
        },
    },

    // Configuration spécifique au backend
    {
        files: ["Backend/**/*.{ts,js}"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // Configuration Prettier
    {
        files: ["**/*.{ts,tsx,js,jsx,json}"],
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            "prettier/prettier": ["error", {
                "singleQuote": true,
                "semi": false,
                "tabWidth": 2,
                "trailingComma": "es5",
                "printWidth": 100
            }],
        },
    }
);