import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "motion",
    include: ["src/**/*.test.ts"],
  },
});
