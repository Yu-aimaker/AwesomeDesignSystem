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
import { cache } from "react";
import { unstable_cache } from "next/cache";

import { getContentRoot } from "./path-resolver";

const contentRoot = getContentRoot();
const deploymentKey =
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.VERCEL_DEPLOYMENT_ID;

async function loadAtlasRecords() {
  const [references, rules, artifacts, signals] = await Promise.all([
    loadReferenceRecords(contentRoot),
    loadCanonRules(contentRoot),
    loadArtifactClaims(contentRoot),
    loadSignals(contentRoot),
  ]);
  return { references, rules, artifacts, signals };
}

// Production content is immutable for the lifetime of a deployment. Cache the
// filesystem boundary across nonce-rendered requests; keep development live so
// edits appear without waiting for a revalidation window.
const loadRuntimeAtlasRecords =
  process.env.NODE_ENV === "production" && deploymentKey
    ? unstable_cache(loadAtlasRecords, ["awesome-ds-atlas-v1", deploymentKey], {
        revalidate: 3600,
        tags: ["awesome-ds-atlas"],
      })
    : loadAtlasRecords;

export const getAtlas = cache(async function getAtlas() {
  const { references, rules, artifacts, signals } = await loadRuntimeAtlasRecords();
  const graph = buildEvidenceGraph({ references, rules, artifacts });
  const validation = validateEvidenceGraph(graph);
  const freshness = summarizeFreshness(references);
  return { references, rules, artifacts, signals, graph, validation, freshness };
});

export function filterReferences(
  references: ReferenceRecord[],
  query: {
    q?: string | undefined;
    topic?: string | undefined;
    sourceClass?: string | undefined;
    owner?: string | undefined;
    language?: string | undefined;
    evidenceLevel?: string | undefined;
    medium?: string | undefined;
    driftRisk?: string | undefined;
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
    if (query.owner && ref.owner !== query.owner) return false;
    if (query.language && ref.language !== query.language) return false;
    if (query.evidenceLevel && ref.evidenceLevel !== query.evidenceLevel) return false;
    if (query.medium && ref.medium !== query.medium) return false;
    if (query.driftRisk && ref.driftRisk !== query.driftRisk) return false;
    if (query.region && ref.region !== query.region) return false;
    if (query.freshness && ref.freshnessState !== query.freshness) return false;
    return true;
  });
}

export function findRule(rules: CanonRule[], id: string) {
  return rules.find((r) => r.id === id);
}

export { nav } from "./navigation";
