import { describe, expect, test } from "vitest";
import { filterReferences } from "../lib/content";
import { nav } from "../lib/navigation";
import type { ReferenceRecord } from "@awesome-ds/content";

const sample: ReferenceRecord = {
  id: "ref.vercel.design",
  title: "Vercel Design",
  url: "https://vercel.com/design",
  owner: "vercel",
  sourceClass: "design-engineering",
  medium: "documentation",
  driftRisk: "high",
  region: "global",
  language: "en",
  topics: ["interaction"],
  observedDate: "2026-07-13",
  lastVerifiedDate: "2026-07-13",
  reviewCadenceDays: 90,
  freshnessState: "healthy",
  evidenceLevel: "first-party-guidance",
  summary: "Interface guidance",
  lessons: ["URL state"],
  caveats: [],
  licenseNote: "docs",
  antiImitationNote: "principles only",
  linkedRuleIds: ["rule.interaction.url-state"],
  linkedArtifactIds: [],
};

describe("docs shell contracts", () => {
  test("exposes all required primary routes", () => {
    const hrefs = nav.map((n) => n.href);
    for (const required of ["/", "/foundations", "/review", "/canon", "/principles", "/brand", "/interaction", "/patterns", "/ai-design", "/components", "/motion", "/references", "/playground", "/status"]) {
      expect(hrefs).toContain(required);
    }
  });

  test("serializes reference filters deterministically", () => {
    expect(filterReferences([sample], { q: "vercel" })).toHaveLength(1);
    expect(filterReferences([sample], { q: "missing" })).toHaveLength(0);
    expect(filterReferences([sample], { topic: "interaction", freshness: "healthy" })).toHaveLength(1);
    expect(filterReferences([sample], { region: "jp" })).toHaveLength(0);
    expect(filterReferences([sample], { owner: "vercel", language: "en", evidenceLevel: "first-party-guidance" })).toHaveLength(1);
    expect(filterReferences([sample], { medium: "documentation", driftRisk: "high" })).toHaveLength(1);
    expect(filterReferences([sample], { medium: "repository" })).toHaveLength(0);
    expect(filterReferences([sample], { language: "ja" })).toHaveLength(0);
  });
});
