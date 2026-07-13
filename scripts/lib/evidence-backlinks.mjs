/**
 * Evidence ownership:
 * - Canon rule.referenceIds is authoritative for reference.linkedRuleIds.
 * - Artifact ruleIds is authoritative for canon rule.artifactIds.
 * - Artifact referenceIds is authoritative for reference.linkedArtifactIds.
 *
 * Reverse arrays are derived from scratch. Treating both directions as input
 * would make stale backlinks resurrect a deliberately removed forward edge.
 */
export function synchronizeEvidenceBacklinks(input) {
  const references = structuredClone(input.references);
  const rules = structuredClone(input.rules);
  const artifacts = structuredClone(input.artifacts);
  const referencesById = new Map(references.map((record) => [record.id, record]));
  const rulesById = new Map(rules.map((record) => [record.id, record]));

  for (const reference of references) {
    reference.linkedRuleIds = [];
    reference.linkedArtifactIds = [];
  }
  for (const rule of rules) rule.artifactIds = [];

  const requireRecord = (map, id, owner) => {
    const record = map.get(id);
    if (!record) throw new Error(`${owner} points to unknown evidence ID ${id}`);
    return record;
  };
  const add = (record, field, value) => {
    if (!record[field].includes(value)) record[field].push(value);
  };

  for (const rule of rules) {
    for (const referenceId of rule.referenceIds) {
      add(requireRecord(referencesById, referenceId, rule.id), "linkedRuleIds", rule.id);
    }
  }
  for (const artifact of artifacts) {
    for (const ruleId of artifact.ruleIds) {
      add(requireRecord(rulesById, ruleId, artifact.id), "artifactIds", artifact.id);
    }
    for (const referenceId of artifact.referenceIds) {
      add(requireRecord(referencesById, referenceId, artifact.id), "linkedArtifactIds", artifact.id);
    }
  }

  for (const record of [...references, ...rules, ...artifacts]) {
    for (const field of ["linkedRuleIds", "linkedArtifactIds", "referenceIds", "artifactIds", "ruleIds"]) {
      if (Array.isArray(record[field])) record[field].sort();
    }
  }
  return { references, rules, artifacts };
}
