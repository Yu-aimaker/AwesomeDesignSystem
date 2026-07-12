import { describe, expect, test } from "vitest";

import { buildEvidenceGraph, validateEvidenceGraph } from "./graph";
import type { ArtifactClaim, CanonRule, ReferenceRecord } from "./schema";

const ref: ReferenceRecord = {
  id: "ref.w3c.wcag-22",
  title: "WCAG 2.2",
  url: "https://www.w3.org/TR/WCAG22/",
  owner: "w3c",
  sourceClass: "standard",
  region: "global",
  language: "en",
  topics: ["accessibility"],
  observedDate: "2026-07-13",
  lastVerifiedDate: "2026-07-13",
  reviewCadenceDays: 180,
  freshnessState: "healthy",
  evidenceLevel: "standard",
  summary: "Accessibility standard.",
  lessons: ["Contrast and keyboard access are non-negotiable."],
  caveats: [],
  licenseNote: "W3C document license.",
  antiImitationNote: "Standards are shared; implementation is original.",
  linkedRuleIds: ["rule.a11y.wcag-aa"],
  linkedArtifactIds: ["artifact.component.button"],
};

const rule: CanonRule = {
  id: "rule.a11y.wcag-aa",
  title: "Meet WCAG 2.2 AA",
  domain: "accessibility",
  summary: "Ship AA by default.",
  guidance: "Treat AA as a release gate for interactive surfaces.",
  do: ["Test contrast and keyboard paths"],
  dont: ["Ship mouse-only flows"],
  referenceIds: ["ref.w3c.wcag-22"],
  artifactIds: ["artifact.component.button"],
  verification: "axe + keyboard suite green",
  status: "canon",
};

const artifact: ArtifactClaim = {
  id: "artifact.component.button",
  kind: "component",
  title: "Button",
  path: "packages/react/src/components/Button.tsx",
  ruleIds: ["rule.a11y.wcag-aa"],
  referenceIds: ["ref.w3c.wcag-22"],
};

describe("evidence graph", () => {
  test("accepts a valid bidirectional graph", () => {
    const graph = buildEvidenceGraph({
      references: [ref],
      rules: [rule],
      artifacts: [artifact],
    });
    const result = validateEvidenceGraph(graph);
    expect(result.ok).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  test("flags missing reference IDs", () => {
    const graph = buildEvidenceGraph({
      references: [ref],
      rules: [{ ...rule, referenceIds: ["ref.missing.thing"] }],
      artifacts: [artifact],
    });
    expect(graph.issues.some((i) => i.code === "missing-reference")).toBe(true);
  });

  test("flags orphaned rules and artifacts without rules", () => {
    const orphanRule: CanonRule = {
      ...rule,
      id: "rule.philosophy.orphan",
      referenceIds: ["ref.w3c.wcag-22"],
      artifactIds: [],
    };
    const bareArtifact: ArtifactClaim = {
      ...artifact,
      id: "artifact.doc.bare",
      ruleIds: [],
    };
    const graph = buildEvidenceGraph({
      references: [{ ...ref, linkedRuleIds: ["rule.a11y.wcag-aa"] }],
      rules: [rule, orphanRule],
      artifacts: [bareArtifact],
    });
    expect(graph.issues.some((i) => i.code === "orphaned-rule")).toBe(true);
    expect(graph.issues.some((i) => i.code === "artifact-without-rule")).toBe(
      true,
    );
  });

  test("flags duplicate IDs", () => {
    const graph = buildEvidenceGraph({
      references: [ref, { ...ref }],
      rules: [rule],
      artifacts: [artifact],
    });
    expect(graph.issues.some((i) => i.code === "duplicate-id")).toBe(true);
  });
});
