import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      include: ["tests/**/*.test.ts"],
      name: "root",
    },
  },
  "apps/*/vitest.config.ts",
  "packages/*/vitest.config.ts",
]);
