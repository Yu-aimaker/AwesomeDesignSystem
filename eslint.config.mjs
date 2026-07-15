import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const nextWithoutPagesRouterRule = nextVitals.map((config) => ({
  ...config,
  settings: {
    ...config.settings,
    react: { version: "19.2" },
  },
  rules: { ...config.rules, "@next/next/no-html-link-for-pages": "off" },
}));

export default defineConfig([
  ...nextWithoutPagesRouterRule,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "**/.next/**",
    ".turbo/**",
    "**/.vercel/**",
    ".worktrees/**",
    "node_modules/**",
    "packages/tokens/dist/**",
    "**/dist/**",
    "reports/**",
    "research/case-studies/raw/**",
    "test-results/**",
    "**/*.tsbuildinfo",
    "apps/docs/next-env.d.ts",
  ]),
  {
    files: ["**/*.{ts,tsx,mjs}"],
    settings: {
      next: { rootDir: "apps/docs" },
      react: { version: "19.2" },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "no-console": "off",
    },
  },
]);
