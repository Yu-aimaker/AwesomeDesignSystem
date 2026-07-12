import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

const skills = [
  "awesome-ds",
  "make-awesome-ds",
  "awesome-review",
  "awesome-motion",
  "awesome-html",
] as const;

describe("skill integration smoke", () => {
  test("five public skills exist and route to platform contracts", async () => {
    for (const name of skills) {
      const skillPath = path.join(process.cwd(), "skills", name, "SKILL.md");
      await access(skillPath);
      const text = await readFile(skillPath, "utf8");
      expect(text).toMatch(/name:\s*/);
      expect(text).toContain("rule-contract.md");
      expect(text).toContain("reference-atlas.md");
      expect(text).toContain("DESIGN.md");
      expect(text).toContain("@awesome-ds/react");
    }
  });

  test("shared contract files exist", async () => {
    for (const rel of [
      "skills/shared/rule-contract.md",
      "skills/shared/reference-atlas.md",
      "DESIGN.md",
      "design-system/INDEX.md",
      "design-system/review/interface-quality-checklist.md",
    ]) {
      await access(path.join(process.cwd(), rel));
    }
  });
});
