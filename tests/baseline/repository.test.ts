import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, test } from "vitest";

import legacy from "../fixtures/legacy-links.json";

const root = process.cwd();

async function exists(rel: string): Promise<boolean> {
  try {
    await access(path.join(root, rel));
    return true;
  } catch {
    return false;
  }
}

describe("compatibility baseline — repository contract", () => {
  test("keeps multilingual README entry points", async () => {
    for (const file of legacy.readmeFiles) {
      expect(await exists(file), file).toBe(true);
      const text = await readFile(path.join(root, file), "utf8");
      expect(text.length).toBeGreaterThan(100);
    }
  });

  test("preserves design-system modules from INDEX", async () => {
    for (const file of legacy.designSystemModules) {
      expect(await exists(file), file).toBe(true);
    }
  });

  test("exposes all five public skill entry points", async () => {
    expect(legacy.skills).toHaveLength(5);
    for (const skill of legacy.skills) {
      expect(await exists(skill.path), skill.path).toBe(true);
      const text = await readFile(path.join(root, skill.path), "utf8");
      expect(text).toMatch(/name:\s*["']?[\w-]+/);
    }
  });

  test("ships install.sh with copy and symlink modes documented in script", async () => {
    expect(await exists(legacy.installer.path)).toBe(true);
    const script = await readFile(path.join(root, legacy.installer.path), "utf8");
    expect(script).toContain("--copy");
    expect(script).toMatch(/ln\s+-s|symlink/i);
  });

  test("requirements matrix maps stable REQ IDs", async () => {
    const matrix = await readFile(
      path.join(root, "docs/requirements-matrix.md"),
      "utf8",
    );
    for (let i = 1; i <= 20; i += 1) {
      const id = `REQ-${String(i).padStart(3, "0")}`;
      expect(matrix).toContain(id);
    }
  });
});
