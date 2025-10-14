import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
        fetch: "readonly",
        alert: "readonly",
        localStorage: "readonly",
        confirm: "readonly",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "warn",
    },
  },
  {
    ignores: ["dist", "node_modules"],
  },
];
