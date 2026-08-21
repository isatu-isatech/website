import next from "eslint-config-next/core-web-vitals";
import oxlint from "eslint-plugin-oxlint";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  ...next,
  eslintConfigPrettier,
  {
    ignores: ["coverage/**", ".reasonix/**"],
  },
  {
    // react-hooks v6 (introduced by eslint-config-next 16) enforces these as
    // errors with many false positives on pre-existing patterns (R3F object
    // mutation in lanyard, media-query/carousel effect init, quiz state sync).
    // Same findings are already advisory warnings in oxlint; keep them
    // non-blocking here rather than churn working code.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
  ...oxlint.configs["flat/recommended"],
];

export default eslintConfig;
