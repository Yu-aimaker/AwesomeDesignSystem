import { describe, expect, test } from "vitest";
import { synchronizeEvidenceBacklinks } from "../scripts/lib/evidence-backlinks.mjs";

describe("evidence backlink synchronization", () => {
  test("rebuilds derived backlinks from forward authority without resurrecting deletions", () => {
    const input = {
      references: [{ id: "ref.a", linkedRuleIds: ["rule.deleted"], linkedArtifactIds: ["artifact.deleted"] }],
      rules: [{ id: "rule.deleted", referenceIds: [], artifactIds: ["artifact.deleted"] }],
      artifacts: [{ id: "artifact.deleted", ruleIds: [], referenceIds: [] }],
    };

    const synchronized = synchronizeEvidenceBacklinks(input);

    expect(synchronized.references[0]).toMatchObject({ linkedRuleIds: [], linkedArtifactIds: [] });
    expect(synchronized.rules[0]).toMatchObject({ artifactIds: [] });
  });

  test("is idempotent and derives every reverse edge from its documented authority", () => {
    const input = {
      references: [{ id: "ref.a", linkedRuleIds: [], linkedArtifactIds: [] }],
      rules: [{ id: "rule.a", referenceIds: ["ref.a"], artifactIds: [] }],
      artifacts: [{ id: "artifact.a", ruleIds: ["rule.a"], referenceIds: ["ref.a"] }],
    };

    const once = synchronizeEvidenceBacklinks(input);
    const twice = synchronizeEvidenceBacklinks(once);

    expect(once).toEqual(twice);
    expect(once.references[0]).toMatchObject({ linkedRuleIds: ["rule.a"], linkedArtifactIds: ["artifact.a"] });
    expect(once.rules[0]).toMatchObject({ artifactIds: ["artifact.a"] });
  });
});
