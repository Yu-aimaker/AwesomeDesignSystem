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

const verifier: ArtifactClaim = {
  id: "artifact.test.component-contracts",
  kind: "test",
  title: "Component contracts",
  path: "packages/react/src/components/Components.test.tsx",
  ruleIds: ["rule.a11y.wcag-aa"],
  referenceIds: [],
  verifiesArtifactIds: [artifact.id],
};

describe("evidence graph", () => {
  test("accepts a valid bidirectional graph", () => {
    const graph = buildEvidenceGraph({
      references: [ref],
      rules: [rule],
      artifacts: [artifact, verifier],
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

  test("flags unverified implementations and unknown verification targets", () => {
    const unverified = buildEvidenceGraph({ references: [ref], rules: [rule], artifacts: [artifact] });
    expect(unverified.issues.some((issue) => issue.code === "unverified-artifact")).toBe(true);

    const unknownTarget = buildEvidenceGraph({
      references: [ref],
      rules: [rule],
      artifacts: [artifact, { ...verifier, verifiesArtifactIds: ["artifact.component.missing"] }],
    });
    expect(unknownTarget.issues.some((issue) => issue.code === "unknown-verification-target")).toBe(true);
  });

  test("flags one-way rule and artifact links", () => {
    const graph = buildEvidenceGraph({
      references: [ref],
      rules: [rule],
      artifacts: [{ ...artifact, ruleIds: ["rule.other.missing-backlink"] }],
    });
    expect(graph.issues.some((i) => i.code === "missing-rule-backlink")).toBe(true);
    expect(graph.issues.some((i) => i.code === "unknown-rule-on-artifact")).toBe(true);
  });

  test("flags one-way rule and reference links in either direction", () => {
    const missingReferenceBacklink = buildEvidenceGraph({
      references: [{ ...ref, linkedRuleIds: [] }],
      rules: [rule],
      artifacts: [artifact],
    });
    expect(missingReferenceBacklink.issues.some((issue) => issue.code === "missing-reference-backlink")).toBe(true);

    const missingRuleForwardLink = buildEvidenceGraph({
      references: [ref],
      rules: [{ ...rule, referenceIds: [] }],
      artifacts: [artifact],
    });
    expect(missingRuleForwardLink.issues.some((issue) => issue.code === "missing-rule-forward-link")).toBe(true);
  });

  test("flags one-way artifact and reference links in either direction", () => {
    const missingReferenceBacklink = buildEvidenceGraph({
      references: [{ ...ref, linkedArtifactIds: [] }],
      rules: [rule],
      artifacts: [artifact],
    });
    expect(missingReferenceBacklink.issues.some((issue) => issue.code === "missing-artifact-reference-backlink")).toBe(true);

    const missingArtifactForwardLink = buildEvidenceGraph({
      references: [ref],
      rules: [rule],
      artifacts: [{ ...artifact, referenceIds: [] }],
    });
    expect(missingArtifactForwardLink.issues.some((issue) => issue.code === "missing-artifact-forward-link")).toBe(true);
  });
});
