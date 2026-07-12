import { access, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
  buildEvidenceGraph,
  loadArtifactClaims,
  loadCanonRules,
  loadReferenceRecords,
  validateEvidenceGraph,
} from "./index.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

describe("content coverage", () => {
  test("graph remains valid with expanded corpus", async () => {
    const contentRoot = path.join(repoRoot, "content");
    const [references, rules, artifacts] = await Promise.all([
      loadReferenceRecords(contentRoot),
      loadCanonRules(contentRoot),
      loadArtifactClaims(contentRoot),
    ]);
    expect(references.length).toBeGreaterThanOrEqual(40);
    expect(rules.length).toBeGreaterThanOrEqual(12);
    const result = validateEvidenceGraph(
      buildEvidenceGraph({ references, rules, artifacts }),
    );
    expect(result.ok, JSON.stringify(result.issues, null, 2)).toBe(true);
  });

  test("design-system has expanded brand and review modules", async () => {
    const required = [
      "brand/cross-medium-coherence.md",
      "brand/voice-tone-matrix.md",
      "review/interface-quality-checklist.md",
      "case-studies/duolingo-lessons.md",
    ];
    for (const rel of required) {
      const entries = await readdir(path.join(repoRoot, "design-system", path.dirname(rel)));
      expect(entries).toContain(path.basename(rel));
    }
  });

  test("every claimed artifact path exists", async () => {
    const artifacts = await loadArtifactClaims(path.join(repoRoot, "content"));
    for (const artifact of artifacts) {
      await expect(access(path.join(repoRoot, artifact.path)), `${artifact.id}: ${artifact.path}`).resolves.toBeUndefined();
    }
  });
});
