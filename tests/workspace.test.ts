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

  test("requires the minimum Node release supported by the toolchain", async () => {
    const manifest = JSON.parse(await readFile("package.json", "utf8")) as {
      engines?: { node?: string };
    };

    expect(manifest.engines?.node).toBe(">=22.12.0");
  });

  test("uses Vitest projects instead of the deprecated workspace flag", async () => {
    const manifest = JSON.parse(await readFile("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };
    const config = await readFile("vitest.config.ts", "utf8");

    expect(manifest.scripts?.test).not.toContain("--workspace");
    expect(config).toContain("projects:");
  });
});
