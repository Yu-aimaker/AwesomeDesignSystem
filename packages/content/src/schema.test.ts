import { describe, expect, test } from "vitest";

import { ReferenceRecordSchema, CanonRuleSchema } from "./schema";

const validRef = {
  id: "ref.vercel.web-interface-guidelines",
  title: "Vercel Web Interface Guidelines",
  url: "https://vercel.com/design/guidelines",
  owner: "vercel",
  sourceClass: "design-engineering" as const,
  region: "global" as const,
  language: "en",
  topics: ["interaction", "a11y"],
  observedDate: "2026-07-13",
  lastVerifiedDate: "2026-07-13",
  reviewCadenceDays: 90,
  freshnessState: "healthy" as const,
  evidenceLevel: "first-party-guidance" as const,
  summary: "Implementation-first interface rules.",
  lessons: ["URL-addressable UI state", "keyboard-first interactions"],
  caveats: [],
  licenseNote: "Public documentation; cite and synthesize.",
  antiImitationNote: "Transfer interaction principles, not Vercel brand.",
  linkedRuleIds: ["rule.interaction.url-state"],
  linkedArtifactIds: [],
};

describe("content schemas", () => {
  test("accepts a complete reference record", () => {
    const parsed = ReferenceRecordSchema.parse(validRef);
    expect(parsed.id).toBe(validRef.id);
    expect(parsed.lessons).toHaveLength(2);
  });

  test("rejects invalid URLs and dates", () => {
    expect(() =>
      ReferenceRecordSchema.parse({ ...validRef, url: "not-a-url" }),
    ).toThrow();
    expect(() =>
      ReferenceRecordSchema.parse({
        ...validRef,
        lastVerifiedDate: "13/07/2026",
      }),
    ).toThrow();
  });

  test("rejects invalid enums and id shapes", () => {
    expect(() =>
      ReferenceRecordSchema.parse({
        ...validRef,
        sourceClass: "blog-post",
      }),
    ).toThrow();
    expect(() =>
      ReferenceRecordSchema.parse({ ...validRef, id: "vercel-guidelines" }),
    ).toThrow();
  });

  test("requires canon rules to cite at least one reference", () => {
    expect(() =>
      CanonRuleSchema.parse({
        id: "rule.interaction.url-state",
        title: "URL state",
        domain: "interaction",
        summary: "UI state lives in the URL when shareable.",
        guidance: "Serialize filters and tabs into the address bar.",
        referenceIds: [],
        verification: "Back/Forward restores state.",
      }),
    ).toThrow();
  });
});
