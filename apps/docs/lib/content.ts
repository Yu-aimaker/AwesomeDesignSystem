import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildEvidenceGraph,
  loadArtifactClaims,
  loadCanonRules,
  loadReferenceRecords,
  loadSignals,
  summarizeFreshness,
  validateEvidenceGraph,
  type CanonRule,
  type ReferenceRecord,
} from "@awesome-ds/content";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const contentRoot = path.join(repoRoot, "content");

export async function getAtlas() {
  const [references, rules, artifacts, signals] = await Promise.all([
    loadReferenceRecords(contentRoot),
    loadCanonRules(contentRoot),
    loadArtifactClaims(contentRoot),
    loadSignals(contentRoot),
  ]);
  const graph = buildEvidenceGraph({ references, rules, artifacts });
  const validation = validateEvidenceGraph(graph);
  const freshness = summarizeFreshness(references);
  return { references, rules, artifacts, signals, graph, validation, freshness };
}

export function filterReferences(
  references: ReferenceRecord[],
  query: {
    q?: string | undefined;
    topic?: string | undefined;
    sourceClass?: string | undefined;
    region?: string | undefined;
    freshness?: string | undefined;
  },
) {
  const q = query.q?.toLowerCase().trim();
  return references.filter((ref) => {
    if (q) {
      const hay = [ref.title, ref.summary, ref.owner, ...ref.topics, ...ref.lessons]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (query.topic && !ref.topics.includes(query.topic)) return false;
    if (query.sourceClass && ref.sourceClass !== query.sourceClass) return false;
    if (query.region && ref.region !== query.region) return false;
    if (query.freshness && ref.freshnessState !== query.freshness) return false;
    return true;
  });
}

export function findRule(rules: CanonRule[], id: string) {
  return rules.find((r) => r.id === id);
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/principles", label: "Principles" },
  { href: "/foundations", label: "Foundations" },
  { href: "/brand", label: "Brand" },
  { href: "/review", label: "Review" },
  { href: "/interaction", label: "Interaction" },
  { href: "/patterns", label: "Patterns" },
  { href: "/ai-design", label: "AI Design" },
  { href: "/components", label: "Components" },
  { href: "/motion", label: "Motion" },
  { href: "/references", label: "Reference Atlas" },
  { href: "/playground", label: "Playground" },
  { href: "/status", label: "Status" },
] as const;
