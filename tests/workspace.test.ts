import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";
import { parse } from "yaml";

const requiredScripts = [
  "dev",
  "build",
  "typecheck",
  "lint",
  "test",
  "test:a11y",
  "test:e2e",
  "validate",
  "qa",
];

describe("workspace foundation", () => {
  test("declares application and package workspace globs", async () => {
    const workspace = parse(await readFile("pnpm-workspace.yaml", "utf8")) as {
      packages?: string[];
    };

    expect(workspace.packages).toEqual(
      expect.arrayContaining(["apps/*", "packages/*"]),
    );
  });

  test("provides every required root verification script", async () => {
    const manifest = JSON.parse(await readFile("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(Object.keys(manifest.scripts ?? {})).toEqual(
      expect.arrayContaining(requiredScripts),
    );
  });
});
