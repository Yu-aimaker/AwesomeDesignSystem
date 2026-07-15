import { z } from "zod";

export const SOURCE_CLASSES = [
  "standard",
  "official-system",
  "design-engineering",
  "implementation",
  "brand",
  "research",
  "book",
  "repository",
  "signal",
] as const;

export const EVIDENCE_LEVELS = [
  "standard",
  "first-party-guidance",
  "first-party-implementation",
  "observed-behavior",
  "inferred-pattern",
  "emerging-signal",
] as const;

export const FRESHNESS_STATES = [
  "healthy",
  "due",
  "stale",
  "expired",
  "unknown",
] as const;

export const REGIONS = [
  "global",
  "us",
  "eu",
  "jp",
  "kr",
  "cn",
  "other",
] as const;

export const REFERENCE_MEDIA = [
  "standard",
  "documentation",
  "website",
  "repository",
  "article",
  "book",
] as const;

export const DRIFT_RISKS = ["low", "medium", "high"] as const;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD date");

const refId = z
  .string()
  .regex(/^ref\.[a-z0-9-]+\.[a-z0-9-]+$/, "expected ref.<owner>.<slug>");

const ruleId = z
  .string()
  .regex(/^rule\.[a-z0-9-]+\.[a-z0-9-]+$/, "expected rule.<domain>.<slug>");

const artifactId = z
  .string()
  .regex(
    /^artifact\.[a-z0-9-]+\.[a-z0-9-]+$/,
    "expected artifact.<kind>.<slug>",
  );

export const ReferenceRecordSchema = z.object({
  id: refId,
  title: z.string().min(1),
  url: z.string().url(),
  sourceUrls: z.array(z.string().url()).min(1).optional(),
  owner: z.string().min(1),
  sourceClass: z.enum(SOURCE_CLASSES),
  medium: z.enum(REFERENCE_MEDIA),
  driftRisk: z.enum(DRIFT_RISKS),
  region: z.enum(REGIONS),
  language: z.string().min(2),
  topics: z.array(z.string().min(1)).min(1),
  observedDate: isoDate,
  lastVerifiedDate: isoDate,
  reviewCadenceDays: z.number().int().positive(),
  freshnessState: z.enum(FRESHNESS_STATES),
  evidenceLevel: z.enum(EVIDENCE_LEVELS),
  summary: z.string().min(1),
  lessons: z.array(z.string().min(1)).min(1),
  caveats: z.array(z.string()).default([]),
  licenseNote: z.string().min(1),
  antiImitationNote: z.string().min(1),
  linkedRuleIds: z.array(ruleId).default([]),
  linkedArtifactIds: z.array(artifactId).default([]),
  contentHash: z
    .string()
    .regex(
      /^sha256:[a-f0-9]{64}$/,
      "expected a lowercase sha256:<hex> content hash",
    )
    .optional(),
});

export const CanonRuleSchema = z.object({
  id: ruleId,
  title: z.string().min(1),
  domain: z.string().min(1),
  summary: z.string().min(1),
  guidance: z.string().min(1),
  do: z.array(z.string()).default([]),
  dont: z.array(z.string()).default([]),
  referenceIds: z.array(refId).min(1),
  artifactIds: z.array(artifactId).default([]),
  verification: z.string().min(1),
  status: z.enum(["canon", "draft", "deprecated"]).default("canon"),
});

export const ArtifactClaimSchema = z.object({
  id: artifactId,
  kind: z.enum([
    "token",
    "component",
    "motion-recipe",
    "test",
    "skill",
    "doc",
    "script",
    "app",
  ]),
  title: z.string().min(1),
  path: z.string().min(1),
  ruleIds: z.array(ruleId).min(1),
  referenceIds: z.array(refId).default([]),
  /** Test/review artifacts declare the implementation artifacts they verify. */
  verifiesArtifactIds: z.array(artifactId).optional(),
});

export const SignalRecordSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^signal\.[a-z0-9-]+\.[a-z0-9-]+$/,
        "expected signal.<owner>.<slug>",
      ),
    title: z.string().min(1),
    url: z.string().url(),
    observedDate: isoDate,
    summary: z.string().min(1),
    relatedTopics: z.array(z.string()).default([]),
    promotionBlockedReason: z.string().min(1),
    candidateRuleIds: z.array(ruleId).default([]),
    promotionAssessment: z.object({
      primaryEvidenceCount: z.number().int().nonnegative(),
      workingImplementation: z.boolean(),
      accessibilityReviewed: z.boolean(),
      performanceReviewed: z.boolean(),
      decision: z.enum(["pending", "promote", "reject"]),
    }),
  })
  .superRefine((signal, context) => {
    if (signal.promotionAssessment.decision !== "promote") return;
    const assessment = signal.promotionAssessment;
    if (
      assessment.primaryEvidenceCount < 2 ||
      !assessment.workingImplementation ||
      !assessment.accessibilityReviewed ||
      !assessment.performanceReviewed
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["promotionAssessment"],
        message:
          "promotion requires two primary sources, a working implementation, and accessibility/performance review",
      });
    }
  });

export type ReferenceRecord = z.infer<typeof ReferenceRecordSchema>;
export type CanonRule = z.infer<typeof CanonRuleSchema>;
export type ArtifactClaim = z.infer<typeof ArtifactClaimSchema>;
export type SignalRecord = z.infer<typeof SignalRecordSchema>;
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];
export type FreshnessState = (typeof FRESHNESS_STATES)[number];
export type ReferenceMedium = (typeof REFERENCE_MEDIA)[number];
export type DriftRisk = (typeof DRIFT_RISKS)[number];
