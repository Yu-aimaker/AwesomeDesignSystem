import {
  EVIDENCE_LEVELS,
  SOURCE_CLASSES,
  type CanonRule,
  type ReferenceRecord,
} from "@awesome-ds/content";

import { filterReferences } from "./content";

export const AGENT_API_VERSION = "v1";
export const AGENT_API_SCHEMA_VERSION = "1.0.0";
export const AGENT_API_CACHE_CONTROL =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
export const AGENT_API_NO_STORE = "no-store";

const DEFAULT_SITE_ORIGIN = "https://awesome-design-system.yumaker.studio";
const REFERENCE_LIMIT_DEFAULT = 50;
const REFERENCE_LIMIT_MAX = 100;
const RULE_LIMIT_DEFAULT = 100;
const RULE_LIMIT_MAX = 200;

const RULE_STATUSES = ["canon", "draft", "deprecated"] as const;

type RuleStatus = (typeof RULE_STATUSES)[number];

export class AgentApiRequestError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "AgentApiRequestError";
  }
}

export class AtlasIntegrityError extends Error {
  readonly status = 503;

  constructor(message = "The AwesomeDS Atlas is temporarily unavailable.") {
    super(message);
    this.name = "AtlasIntegrityError";
  }
}

export type AgentApiMeta = {
  schema: string;
  schemaVersion: typeof AGENT_API_SCHEMA_VERSION;
  apiVersion: typeof AGENT_API_VERSION;
  generatedAt: string;
  canonical: string;
};

export type ReferenceFilters = {
  q?: string | undefined;
  topic?: string | undefined;
  sourceClass?: string | undefined;
  owner?: string | undefined;
  language?: string | undefined;
  evidenceLevel?: string | undefined;
  limit: number;
  offset: number;
};

export type RuleFilters = {
  id?: string | undefined;
  domain?: string | undefined;
  status?: RuleStatus | undefined;
  limit: number;
};

export type PublicReference = Omit<ReferenceRecord, "contentHash"> & {
  links: {
    canonical: string;
    source: string;
  };
};

export type PublicRule = CanonRule & {
  links: {
    canonical: string;
  };
};

function compareIds(left: { id: string }, right: { id: string }): number {
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

function getSiteOrigin(): string {
  const configured = process.env.AWESOME_DS_SITE_URL;
  if (!configured) return DEFAULT_SITE_ORIGIN;

  try {
    const url = new URL(configured);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.origin;
    }
  } catch {
    // A public API must never emit a malformed configured origin.
  }
  return DEFAULT_SITE_ORIGIN;
}

function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${getSiteOrigin()}/`).toString();
}

export function createAgentApiMeta(
  schema: string,
  pathname: string,
  now = new Date(),
): AgentApiMeta {
  return {
    schema,
    schemaVersion: AGENT_API_SCHEMA_VERSION,
    apiVersion: AGENT_API_VERSION,
    generatedAt: now.toISOString(),
    canonical: absoluteUrl(pathname),
  };
}

function getBoundedValue(
  params: URLSearchParams,
  key: string,
  maxLength: number,
): string | undefined {
  const values = params.getAll(key);
  if (values.length > 1) {
    throw new AgentApiRequestError(
      `Query parameter \"${key}\" may only be provided once.`,
    );
  }
  const value = values[0]?.trim();
  if (!value) return undefined;
  if (value.length > maxLength) {
    throw new AgentApiRequestError(
      `Query parameter \"${key}\" must be ${maxLength} characters or fewer.`,
    );
  }
  return value;
}

function getEnumValue<T extends string>(
  params: URLSearchParams,
  key: string,
  values: readonly T[],
): T | undefined {
  const value = getBoundedValue(params, key, 80);
  if (value === undefined) return undefined;
  if (!values.includes(value as T)) {
    throw new AgentApiRequestError(
      `Unsupported ${key}. Allowed values: ${values.join(", ")}.`,
    );
  }
  return value as T;
}

function getLimit(
  params: URLSearchParams,
  defaultLimit: number,
  maximum: number,
): number {
  const raw = getBoundedValue(params, "limit", 8);
  if (raw === undefined) return defaultLimit;
  if (!/^\d+$/.test(raw)) {
    throw new AgentApiRequestError(
      'Query parameter "limit" must be an integer.',
    );
  }
  const value = Number(raw);
  if (value < 1 || value > maximum) {
    throw new AgentApiRequestError(
      `Query parameter \"limit\" must be between 1 and ${maximum}.`,
    );
  }
  return value;
}

function getOffset(params: URLSearchParams): number {
  const raw = getBoundedValue(params, "offset", 8);
  if (raw === undefined) return 0;
  if (!/^\d+$/.test(raw)) {
    throw new AgentApiRequestError(
      'Query parameter "offset" must be a non-negative integer.',
    );
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value)) {
    throw new AgentApiRequestError(
      'Query parameter "offset" exceeds the supported range.',
    );
  }
  return value;
}

export function parseReferenceFilters(
  params: URLSearchParams,
): ReferenceFilters {
  return {
    q: getBoundedValue(params, "q", 120),
    topic: getBoundedValue(params, "topic", 80),
    sourceClass: getEnumValue(params, "sourceClass", SOURCE_CLASSES),
    owner: getBoundedValue(params, "owner", 80),
    language: getBoundedValue(params, "language", 35),
    evidenceLevel: getEnumValue(params, "evidenceLevel", EVIDENCE_LEVELS),
    limit: getLimit(params, REFERENCE_LIMIT_DEFAULT, REFERENCE_LIMIT_MAX),
    offset: getOffset(params),
  };
}

export function parseRuleFilters(params: URLSearchParams): RuleFilters {
  return {
    id: getBoundedValue(params, "id", 120),
    domain: getBoundedValue(params, "domain", 80),
    status: getEnumValue(params, "status", RULE_STATUSES),
    limit: getLimit(params, RULE_LIMIT_DEFAULT, RULE_LIMIT_MAX),
  };
}

export function assertAtlasIntegrity(input: {
  references?: readonly ReferenceRecord[];
  rules?: readonly CanonRule[];
}): void {
  if (input.references !== undefined && input.references.length === 0) {
    throw new AtlasIntegrityError();
  }
  if (input.rules !== undefined && input.rules.length === 0) {
    throw new AtlasIntegrityError();
  }
}

function toPublicReference(reference: ReferenceRecord): PublicReference {
  const publicFields = { ...reference };
  delete publicFields.contentHash;
  return {
    ...publicFields,
    topics: [...reference.topics].sort(),
    linkedRuleIds: [...reference.linkedRuleIds].sort(),
    linkedArtifactIds: [...reference.linkedArtifactIds].sort(),
    links: {
      canonical: absoluteUrl(
        `/en/references/${encodeURIComponent(reference.id)}`,
      ),
      source: reference.url,
    },
  };
}

function toPublicRule(rule: CanonRule): PublicRule {
  return {
    ...rule,
    referenceIds: [...rule.referenceIds].sort(),
    artifactIds: [...rule.artifactIds].sort(),
    links: {
      canonical: absoluteUrl(`/en/rules/${encodeURIComponent(rule.id)}`),
    },
  };
}

export function buildReferenceAtlasPayload(
  references: ReferenceRecord[],
  filters: ReferenceFilters,
  now = new Date(),
) {
  assertAtlasIntegrity({ references });
  const { limit, offset, ...query } = filters;
  const matches = filterReferences(references, query).sort(compareIds);
  const page = matches.slice(offset, offset + limit);
  return {
    meta: createAgentApiMeta(
      "awesome-ds/reference-atlas",
      "/api/v1/references",
      now,
    ),
    query: {
      filters: query,
      limit,
      offset,
      total: references.length,
      matched: matches.length,
      returned: page.length,
      truncated: offset + page.length < matches.length,
      nextOffset:
        offset + page.length < matches.length ? offset + page.length : null,
    },
    references: page.map(toPublicReference),
  };
}

export function buildRulesPayload(
  rules: CanonRule[],
  filters: RuleFilters,
  now = new Date(),
) {
  assertAtlasIntegrity({ rules });
  const { limit, ...query } = filters;
  const matches = rules
    .filter((rule) => {
      if (query.id && rule.id !== query.id) return false;
      if (query.domain && rule.domain !== query.domain) return false;
      if (query.status && rule.status !== query.status) return false;
      return true;
    })
    .sort(compareIds);

  return {
    meta: createAgentApiMeta("awesome-ds/canon-rules", "/api/v1/rules", now),
    query: {
      filters: query,
      limit,
      total: rules.length,
      matched: matches.length,
      returned: Math.min(matches.length, limit),
      truncated: matches.length > limit,
    },
    rules: matches.slice(0, limit).map(toPublicRule),
  };
}

export function buildManifestPayload(
  input: {
    references: ReferenceRecord[];
    rules: CanonRule[];
    artifacts: unknown[];
    signals: unknown[];
    freshness: Record<string, number>;
    validation: { ok: boolean; issues: unknown[] };
  },
  now = new Date(),
) {
  assertAtlasIntegrity(input);
  return {
    meta: createAgentApiMeta("awesome-ds/manifest", "/api/v1/manifest", now),
    name: "Awesome Design System",
    description:
      "Evidence-backed design intelligence for humans and AI agents.",
    defaultLocale: "en",
    supportedLocales: ["en", "ja"],
    counts: {
      references: input.references.length,
      rules: input.rules.length,
      artifacts: input.artifacts.length,
      signals: input.signals.length,
    },
    freshness: input.freshness,
    integrity: {
      ok: input.validation.ok,
      issueCount: input.validation.issues.length,
    },
    endpoints: {
      llms: absoluteUrl("/llms.txt"),
      references: absoluteUrl("/api/v1/references"),
      rules: absoluteUrl("/api/v1/rules"),
      humanDocumentation: absoluteUrl("/en"),
      japaneseDocumentation: absoluteUrl("/ja"),
    },
  };
}

export function buildLlmsText(input: {
  references: ReferenceRecord[];
  rules: CanonRule[];
  artifacts: unknown[];
  signals: unknown[];
  validation: { ok: boolean; issues: unknown[] };
}): string {
  assertAtlasIntegrity(input);
  const lines = [
    "# Awesome Design System",
    "",
    "> Evidence-backed design intelligence for humans and AI agents. Use the Canon for decisions and the Reference Atlas to inspect the supporting primary sources.",
    "",
    `Canonical: ${absoluteUrl("/en")}`,
    `Japanese: ${absoluteUrl("/ja")}`,
    `API version: ${AGENT_API_VERSION}`,
    `Schema version: ${AGENT_API_SCHEMA_VERSION}`,
    "",
    "## Machine-readable interfaces",
    "",
    `- Manifest: ${absoluteUrl("/api/v1/manifest")}`,
    `- Canon rules: ${absoluteUrl("/api/v1/rules")}`,
    `- Reference Atlas: ${absoluteUrl("/api/v1/references")}`,
    "",
    "## Query capabilities",
    "",
    "- References: q, topic, sourceClass, owner, language, evidenceLevel, limit (maximum 100), offset.",
    "- Rules: id, domain, status, limit (maximum 200).",
    "- All collections are sorted by stable ID and are read-only.",
    "",
    "## Dataset snapshot",
    "",
    `- References: ${input.references.length}`,
    `- Canon rules: ${input.rules.length}`,
    `- Evidence artifacts: ${input.artifacts.length}`,
    `- Emerging signals: ${input.signals.length}`,
    `- Evidence graph integrity: ${input.validation.ok ? "valid" : `review required (${input.validation.issues.length} issues)`}`,
    "",
    "## Usage guidance",
    "",
    "1. Start with the manifest, then retrieve only the rules or references relevant to the task.",
    "2. Treat Canon guidance as evidence-backed constraints, not a visual style to imitate wholesale.",
    "3. Follow each record's canonical and source links when exact context or current first-party guidance matters.",
    "4. Respect accessibility, user preferences, reduced motion, localization, and product context.",
    "",
  ];
  return lines.join("\n");
}

export function buildAgentApiError(
  error: unknown,
  pathname: string,
  now = new Date(),
) {
  if (error instanceof AgentApiRequestError) {
    return {
      status: error.status,
      body: {
        meta: createAgentApiMeta("awesome-ds/error", pathname, now),
        error: { code: "INVALID_QUERY", message: error.message },
      },
    };
  }
  return {
    status: 503,
    body: {
      meta: createAgentApiMeta("awesome-ds/error", pathname, now),
      error: {
        code: "ATLAS_INTEGRITY_ERROR",
        message: "The AwesomeDS Atlas is temporarily unavailable.",
      },
    },
  };
}
