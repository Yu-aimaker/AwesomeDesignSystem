import { describe, expect, test } from "vitest";

import {
  AgentApiRequestError,
  AtlasIntegrityError,
  buildLlmsText,
  buildReferenceAtlasPayload,
  buildRulesPayload,
  parseReferenceFilters,
  parseRuleFilters,
} from "../apps/docs/lib/agent-api";
import type {
  CanonRule,
  ReferenceRecord,
} from "../packages/content/src/schema";

const now = new Date("2026-07-16T00:00:00.000Z");

function reference(
  id: string,
  overrides: Partial<ReferenceRecord> = {},
): ReferenceRecord {
  return {
    id,
    title: id,
    url: `https://example.com/${id}`,
    owner: "Example",
    sourceClass: "official-system",
    medium: "documentation",
    driftRisk: "medium",
    region: "global",
    language: "en",
    topics: ["tokens"],
    observedDate: "2026-07-01",
    lastVerifiedDate: "2026-07-15",
    reviewCadenceDays: 90,
    freshnessState: "healthy",
    evidenceLevel: "first-party-guidance",
    summary: "A primary design-system source.",
    lessons: ["Use semantic tokens."],
    caveats: [],
    licenseNote: "Link only.",
    antiImitationNote: "Adapt the principle to product context.",
    linkedRuleIds: [],
    linkedArtifactIds: [],
    contentHash: "must-not-be-public",
    ...overrides,
  };
}

function rule(id: string, overrides: Partial<CanonRule> = {}): CanonRule {
  return {
    id,
    title: id,
    domain: "tokens",
    summary: "Prefer semantic decisions.",
    guidance: "Map intent to semantic tokens.",
    do: ["Name intent."],
    dont: ["Encode appearance in names."],
    referenceIds: ["ref.example.tokens"],
    artifactIds: [],
    verification: "Inspect token usage.",
    status: "canon",
    ...overrides,
  };
}

describe("agent API query contracts", () => {
  test("parses the documented reference subset and enforces its limit", () => {
    expect(
      parseReferenceFilters(
        new URLSearchParams(
          "q=semantic&topic=tokens&sourceClass=official-system&owner=Example&language=en&evidenceLevel=first-party-guidance&limit=25&offset=10",
        ),
      ),
    ).toEqual({
      q: "semantic",
      topic: "tokens",
      sourceClass: "official-system",
      owner: "Example",
      language: "en",
      evidenceLevel: "first-party-guidance",
      limit: 25,
      offset: 10,
    });
    expect(() =>
      parseReferenceFilters(new URLSearchParams("limit=101")),
    ).toThrow(AgentApiRequestError);
  });

  test("rejects unsupported enums and duplicate parameters", () => {
    expect(() =>
      parseReferenceFilters(new URLSearchParams("sourceClass=untrusted")),
    ).toThrow(AgentApiRequestError);
    expect(() =>
      parseRuleFilters(new URLSearchParams("status=canon&status=draft")),
    ).toThrow(AgentApiRequestError);
  });
});

describe("agent API payloads", () => {
  test("filters, sorts, limits, links, and redacts reference records", () => {
    const payload = buildReferenceAtlasPayload(
      [
        reference("ref.zeta.tokens", { owner: "Elsewhere" }),
        reference("ref.example.tokens"),
        reference("ref.alpha.tokens"),
      ],
      {
        owner: "Example",
        limit: 1,
        offset: 0,
      },
      now,
    );

    expect(payload.meta).toMatchObject({
      schema: "awesome-ds/reference-atlas",
      schemaVersion: "1.0.0",
      apiVersion: "v1",
      generatedAt: now.toISOString(),
    });
    expect(payload.query).toMatchObject({
      total: 3,
      matched: 2,
      returned: 1,
      truncated: true,
      nextOffset: 1,
    });
    expect(payload.references.map((item) => item.id)).toEqual([
      "ref.alpha.tokens",
    ]);
    expect(payload.references[0]?.links.canonical).toContain(
      "/en/references/ref.alpha.tokens",
    );
    expect(payload.references[0]).not.toHaveProperty("contentHash");
  });

  test("paginates the complete reference Atlas without unreachable records", () => {
    const references = Array.from({ length: 117 }, (_, index) =>
      reference(`ref.example.item-${String(index).padStart(3, "0")}`),
    );
    const first = buildReferenceAtlasPayload(
      references,
      { limit: 100, offset: 0 },
      now,
    );
    const second = buildReferenceAtlasPayload(
      references,
      { limit: 100, offset: first.query.nextOffset! },
      now,
    );

    expect(first.references).toHaveLength(100);
    expect(second.references).toHaveLength(17);
    expect(second.query).toMatchObject({
      returned: 17,
      truncated: false,
      nextOffset: null,
    });
    expect(
      new Set(
        [...first.references, ...second.references].map((item) => item.id),
      ).size,
    ).toBe(117);
  });

  test("filters canon rules by id, domain, and status with stable order", () => {
    const payload = buildRulesPayload(
      [
        rule("rule.tokens.zeta"),
        rule("rule.tokens.alpha"),
        rule("rule.motion.alpha", { domain: "motion", status: "draft" }),
      ],
      { domain: "tokens", status: "canon", limit: 100 },
      now,
    );
    expect(payload.rules.map((item) => item.id)).toEqual([
      "rule.tokens.alpha",
      "rule.tokens.zeta",
    ]);
  });

  test("fails closed when a required Atlas collection is empty", () => {
    expect(() =>
      buildReferenceAtlasPayload([], { limit: 50, offset: 0 }, now),
    ).toThrow(AtlasIntegrityError);
    expect(() => buildRulesPayload([], { limit: 100 }, now)).toThrow(
      AtlasIntegrityError,
    );
  });

  test("publishes a compact llms.txt discovery surface", () => {
    const text = buildLlmsText({
      references: [reference("ref.example.tokens")],
      rules: [rule("rule.tokens.semantic")],
      artifacts: [{}],
      signals: [],
      validation: { ok: true, issues: [] },
    });
    expect(text).toContain("# Awesome Design System");
    expect(text).toContain("/api/v1/manifest");
    expect(text).toContain("References: 1");
    expect(text).not.toContain("must-not-be-public");
    expect(text).not.toContain("/Users/");
  });
});
