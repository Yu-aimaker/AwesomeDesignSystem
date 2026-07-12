import type { ArtifactClaim, CanonRule, ReferenceRecord } from "./schema";

export type GraphIssue = {
  code:
    | "duplicate-id"
    | "missing-reference"
    | "orphaned-rule"
    | "artifact-without-rule"
    | "unknown-rule-on-artifact"
    | "unknown-artifact-on-rule"
    | "missing-rule-backlink"
    | "unknown-rule-on-reference";
  message: string;
  id?: string;
};

export type EvidenceGraph = {
  references: Map<string, ReferenceRecord>;
  rules: Map<string, CanonRule>;
  artifacts: Map<string, ArtifactClaim>;
  issues: GraphIssue[];
};

function collectDuplicates(
  ids: string[],
  kind: string,
  issues: GraphIssue[],
): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      issues.push({
        code: "duplicate-id",
        id,
        message: `Duplicate ${kind} id: ${id}`,
      });
    }
    seen.add(id);
  }
}

export function buildEvidenceGraph(input: {
  references: ReferenceRecord[];
  rules: CanonRule[];
  artifacts: ArtifactClaim[];
}): EvidenceGraph {
  const issues: GraphIssue[] = [];

  collectDuplicates(
    input.references.map((r) => r.id),
    "reference",
    issues,
  );
  collectDuplicates(
    input.rules.map((r) => r.id),
    "rule",
    issues,
  );
  collectDuplicates(
    input.artifacts.map((a) => a.id),
    "artifact",
    issues,
  );

  const references = new Map(input.references.map((r) => [r.id, r]));
  const rules = new Map(input.rules.map((r) => [r.id, r]));
  const artifacts = new Map(input.artifacts.map((a) => [a.id, a]));

  for (const rule of input.rules) {
    for (const refId of rule.referenceIds) {
      if (!references.has(refId)) {
        issues.push({
          code: "missing-reference",
          id: rule.id,
          message: `Rule ${rule.id} references missing source ${refId}`,
        });
      }
    }
    for (const artifactId of rule.artifactIds) {
      if (!artifacts.has(artifactId)) {
        issues.push({
          code: "unknown-artifact-on-rule",
          id: rule.id,
          message: `Rule ${rule.id} points to unknown artifact ${artifactId}`,
        });
      } else if (!artifacts.get(artifactId)?.ruleIds.includes(rule.id)) {
        issues.push({
          code: "missing-rule-backlink",
          id: rule.id,
          message: `Rule ${rule.id} points to ${artifactId}, but the artifact does not link back`,
        });
      }
    }
  }

  for (const artifact of input.artifacts) {
    if (artifact.ruleIds.length === 0) {
      issues.push({
        code: "artifact-without-rule",
        id: artifact.id,
        message: `Artifact ${artifact.id} has no implementing rule IDs`,
      });
    }
    for (const ruleId of artifact.ruleIds) {
      if (!rules.has(ruleId)) {
        issues.push({
          code: "unknown-rule-on-artifact",
          id: artifact.id,
          message: `Artifact ${artifact.id} implements unknown rule ${ruleId}`,
        });
      }
    }
    for (const refId of artifact.referenceIds) {
      if (!references.has(refId)) {
        issues.push({
          code: "missing-reference",
          id: artifact.id,
          message: `Artifact ${artifact.id} references missing source ${refId}`,
        });
      }
    }
  }

  for (const ref of input.references) {
    for (const ruleId of ref.linkedRuleIds) {
      if (!rules.has(ruleId)) {
        issues.push({
          code: "unknown-rule-on-reference",
          id: ref.id,
          message: `Reference ${ref.id} links unknown rule ${ruleId}`,
        });
      }
    }
  }

  // Orphaned rules: no backlink from references and no artifact implementation
  for (const rule of input.rules) {
    const linkedFromRef = input.references.some((r) =>
      r.linkedRuleIds.includes(rule.id),
    );
    const implemented = input.artifacts.some((a) =>
      a.ruleIds.includes(rule.id),
    );
    if (!linkedFromRef && !implemented && rule.artifactIds.length === 0) {
      issues.push({
        code: "orphaned-rule",
        id: rule.id,
        message: `Rule ${rule.id} has no reference backlink or artifact implementation`,
      });
    }
  }

  return { references, rules, artifacts, issues };
}

export function validateEvidenceGraph(graph: EvidenceGraph): {
  ok: boolean;
  issues: GraphIssue[];
} {
  return { ok: graph.issues.length === 0, issues: graph.issues };
}
