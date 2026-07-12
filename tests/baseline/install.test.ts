import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "vitest";

describe("compatibility baseline — installer contract", () => {
  test("install.sh is executable shell and targets skills directory", async () => {
    const installPath = path.join(process.cwd(), "install.sh");
    await access(installPath);
    const script = await readFile(installPath, "utf8");

    expect(script.startsWith("#!")).toBe(true);
    expect(script).toMatch(/skills/);
    expect(script).toMatch(/awesome-ds|Awesome/);
  });

  test("skill packages remain outside monorepo package graph", async () => {
    const workspace = await readFile(
      path.join(process.cwd(), "pnpm-workspace.yaml"),
      "utf8",
    );
    expect(workspace).not.toMatch(/skills\/\*/);
  });
});
