import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ["tests/**/*.test.ts"],
          name: "root",
        },
      },
      "apps/*/vitest.config.ts",
      "packages/*/vitest.config.ts",
    ],
  },
});
