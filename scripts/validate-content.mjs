import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildEvidenceGraph,
  loadArtifactClaims,
  loadCanonRules,
  loadReferenceRecords,
  loadSignals,
  validateEvidenceGraph,
} from "../packages/content/src/index.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");

const [references, rules, artifacts, signals] = await Promise.all([
  loadReferenceRecords(contentRoot),
  loadCanonRules(contentRoot),
  loadArtifactClaims(contentRoot),
  loadSignals(contentRoot),
]);

const graph = buildEvidenceGraph({ references, rules, artifacts });
const result = validateEvidenceGraph(graph);

console.log(
  JSON.stringify(
    {
      references: references.length,
      rules: rules.length,
      artifacts: artifacts.length,
      signals: signals.length,
      ok: result.ok,
      issues: result.issues,
    },
    null,
    2,
  ),
);

if (!result.ok) process.exit(1);
