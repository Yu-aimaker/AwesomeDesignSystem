import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

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
      const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
      expect(frontmatter, `${name}: YAML frontmatter`).not.toBeNull();
      const metadata = parse(frontmatter![1]!) as { name?: string; description?: string };
      expect(metadata.name, `${name}: stable skill name`).toBe(name);
      expect(metadata.description?.trim().length, `${name}: trigger description`).toBeGreaterThan(40);
      expect(text).toContain("rule-contract.md");
      expect(text).toContain("reference-atlas.md");
      expect(text).toContain("DESIGN.md");
      expect(text).toContain("@awesome-ds/react");

      const relativeReferences = [...text.matchAll(/`(\.\.\/\.\.\/(?:DESIGN\.md|design-system\/[A-Za-z0-9._/-]*|skills\/shared\/[A-Za-z0-9._/-]+))`/g)].map((match) => match[1]!);
      expect(relativeReferences.length, `${name}: local routing references`).toBeGreaterThanOrEqual(4);
      for (const reference of new Set(relativeReferences)) {
        await expect(access(path.resolve(path.dirname(skillPath), reference)), `${name}: ${reference} resolves`).resolves.toBeUndefined();
      }
    }
  });

  test("skill rule and reference IDs resolve to graph records", async () => {
    const ruleIds = new Set<string>();
    const referenceIds = new Set<string>();
    for (const directory of ["content/canon", "content/references"]) {
      const { readdir } = await import("node:fs/promises");
      for (const file of await readdir(path.join(process.cwd(), directory))) {
        if (!file.endsWith(".json")) continue;
        const record = JSON.parse(await readFile(path.join(process.cwd(), directory, file), "utf8")) as { id?: string };
        if (record.id?.startsWith("rule.")) ruleIds.add(record.id);
        if (record.id?.startsWith("ref.")) referenceIds.add(record.id);
      }
    }
    for (const name of skills) {
      const text = await readFile(path.join(process.cwd(), "skills", name, "SKILL.md"), "utf8");
      for (const id of text.match(/\brule\.[a-z0-9.-]+\b/g) ?? []) expect(ruleIds.has(id), `${name}: ${id}`).toBe(true);
      for (const id of text.match(/\bref\.[a-z0-9.-]+\b/g) ?? []) expect(referenceIds.has(id), `${name}: ${id}`).toBe(true);
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
