import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import oxlint from "eslint-plugin-oxlint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript", "prettier"],
  }),
  {
    ignores: ["next-env.d.ts", ".next/**", "out/**", "build/**", "coverage/**"],
  },
  ...oxlint.configs["flat/recommended"],
];

export default eslintConfig;
