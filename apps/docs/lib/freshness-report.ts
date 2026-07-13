export type ReviewReason =
  | "upstream-content-changed"
  | "source-fetch-failed"
  | "github-adapter-failed"
  | "github-adapter-recovered";

export type FreshnessReviewItem = {
  sourceId: string;
  title: string;
  url: string;
  reason: ReviewReason;
  observedAt: string;
  firstFailedAt?: string;
  failureAgeDays: number;
  persistent: boolean;
  allowlisted: boolean;
  error?: string;
  errorCategory?: string;
};

export type FreshnessReportView = {
  generatedAt: string;
  ageDays: number;
  stale: boolean;
  observationSummary: Record<string, number>;
  groups: {
    changed: FreshnessReviewItem[];
    fetchFailures: FreshnessReviewItem[];
    adapterFailures: FreshnessReviewItem[];
    recoveries: FreshnessReviewItem[];
  };
};

const reasons = new Set<ReviewReason>([
  "upstream-content-changed",
  "source-fetch-failed",
  "github-adapter-failed",
  "github-adapter-recovered",
]);

export function parseFreshnessReport(
  freshnessJson: string,
  reviewQueueJson: string,
  now = new Date(),
): FreshnessReportView {
  const freshness = JSON.parse(freshnessJson) as { generatedAt?: unknown; observationSummary?: unknown };
  const queue = JSON.parse(reviewQueueJson) as { items?: unknown };
  if (typeof freshness.generatedAt !== "string" || Number.isNaN(Date.parse(freshness.generatedAt))) {
    throw new Error("Freshness report has no valid generatedAt timestamp");
  }
  const observationSummary = typeof freshness.observationSummary === "object" && freshness.observationSummary
    ? Object.fromEntries(Object.entries(freshness.observationSummary).filter((entry): entry is [string, number] => typeof entry[1] === "number"))
    : {};
  const items = Array.isArray(queue.items) ? queue.items.filter((item): item is FreshnessReviewItem => {
    if (!item || typeof item !== "object") return false;
    const row = item as Partial<FreshnessReviewItem>;
    return typeof row.sourceId === "string"
      && typeof row.title === "string"
      && typeof row.url === "string"
      && typeof row.reason === "string"
      && reasons.has(row.reason as ReviewReason)
      && typeof row.observedAt === "string"
      && typeof row.failureAgeDays === "number"
      && typeof row.persistent === "boolean"
      && typeof row.allowlisted === "boolean";
  }) : [];
  const ageDays = Math.max(0, (now.getTime() - Date.parse(freshness.generatedAt)) / 86_400_000);
  return {
    generatedAt: freshness.generatedAt,
    ageDays,
    stale: ageDays > 8,
    observationSummary,
    groups: {
      changed: items.filter((item) => item.reason === "upstream-content-changed"),
      fetchFailures: items.filter((item) => item.reason === "source-fetch-failed"),
      adapterFailures: items.filter((item) => item.reason === "github-adapter-failed"),
      recoveries: items.filter((item) => item.reason === "github-adapter-recovered"),
    },
  };
}
