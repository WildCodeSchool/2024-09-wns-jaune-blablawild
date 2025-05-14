// import js from "@eslint/js";
// import globals from "globals";
// import reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
// import tseslint from "typescript-eslint";
// import prettier from "eslint-plugin-prettier/recommended";

// export default tseslint.config(
//   { ignores: ["dist"] },
//   {
//     extends: [js.configs.recommended, ...tseslint.configs.recommended],
//     files: ["**/*.{ts,tsx}"],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//       parser: tseslint.parser,
//       parserOptions: {
//         project: ["./tsconfig.json"],
//       },
//     },
//     plugins: {
//       "react-hooks": reactHooks,
//       "react-refresh": reactRefresh,
//       prettier: prettier,
//     },
//     rules: {
//       ...reactHooks.configs.recommended.rules,
//       "react-refresh/only-export-components": [
//         "warn",
//         { allowConstantExport: true },
//       ],
//       "prettier/prettier": "error",
//       "no-console": "warn",
//       "no-unused-vars": "off", // TypeScript handles this
//       "@typescript-eslint/no-unused-vars": ["warn"],
//       "@typescript-eslint/explicit-function-return-type": "off",
//       "@typescript-eslint/no-explicit-any": "warn",
//     },
//   }
// );
