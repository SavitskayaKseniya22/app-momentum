import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  ...tsPlugin.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.{ts,mts}"],
  })),
  {
    files: ["*.config.{mjs,mts}"],
    languageOptions: { globals: globals.node },
  },
  prettier,
];
