import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals"; // 👈 Import globals

export default [
  js.configs.recommended,
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", ".next/**"],
  },
  {
    files: ["**/*.{js,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      // 👈 This is the magic part
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker, // Important for your Cloudflare Worker
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-unused-vars": "off", // Handled by our other config
      "no-undef": "error",
    },
  },
];