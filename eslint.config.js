import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
// 1. Prettier 플러그인 가져오기
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // 2. Prettier 설정을 extends 배열의 '가장 마지막'에 추가
      // 이 설정이 린트 규칙과 충돌하는 포맷팅 규칙을 자동으로 꺼줍니다.
      eslintPluginPrettierRecommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      // 3. 필요한 경우 prettier 규칙을 커스텀할 수 있습니다.
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
]);
