import baseConfig from "./eslint.config.js";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  // 1. Tell ESLint to ignore build artifacts globally
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/.turbo/**",
      "**/*.d.ts"
    ],
  },
  // 2. Load your base rules
  ...(Array.isArray(baseConfig) ? baseConfig : [baseConfig]),
  // 3. Add the specific cleanup rules
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],
    },
  },
];