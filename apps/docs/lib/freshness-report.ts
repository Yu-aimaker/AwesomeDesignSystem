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

export type LinkCheckReportView = {
  checkedAt: string;
  ageDays: number;
  stale: boolean;
  strict: boolean;
  total: number;
  healthy: number;
  failed: number;
  allowlisted: number;
};

const reasons = new Set<ReviewReason>([
  "upstream-content-changed",
  "source-fetch-failed",
  "github-adapter-failed",
  "github-adapter-recovered",
]);

const linkResults = new Set(["changed", "unchanged", "fetch_failed"] as const);

function parseObject(json: string, reportName: string): Record<string, unknown> {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    throw new Error(`${reportName} is not valid JSON`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${reportName} must be a JSON object`);
  }
  return value as Record<string, unknown>;
}

function validTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function ageInDays(timestamp: string, now: Date): number {
  return Math.max(0, (now.getTime() - Date.parse(timestamp)) / 86_400_000);
}

function parseReviewItem(value: unknown, index: number): FreshnessReviewItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Review queue item ${index} must be an object`);
  }
  const row = value as Partial<FreshnessReviewItem>;
  const valid = typeof row.sourceId === "string"
    && typeof row.title === "string"
    && typeof row.url === "string"
    && typeof row.reason === "string"
    && reasons.has(row.reason as ReviewReason)
    && validTimestamp(row.observedAt)
    && typeof row.failureAgeDays === "number"
    && Number.isFinite(row.failureAgeDays)
    && row.failureAgeDays >= 0
    && typeof row.persistent === "boolean"
    && typeof row.allowlisted === "boolean"
    && (row.firstFailedAt === undefined || validTimestamp(row.firstFailedAt))
    && (row.error === undefined || typeof row.error === "string")
    && (row.errorCategory === undefined || typeof row.errorCategory === "string");
  if (!valid) throw new Error(`Review queue item ${index} is malformed`);
  return row as FreshnessReviewItem;
}

export function parseFreshnessReport(
  freshnessJson: string,
  reviewQueueJson: string,
  now = new Date(),
): FreshnessReportView {
  const freshness = parseObject(freshnessJson, "Freshness report");
  const queue = parseObject(reviewQueueJson, "Review queue");
  if (!validTimestamp(freshness.generatedAt)) {
    throw new Error("Freshness report has no valid generatedAt timestamp");
  }
  if (!freshness.observationSummary || typeof freshness.observationSummary !== "object" || Array.isArray(freshness.observationSummary)) {
    throw new Error("Freshness report has no valid observationSummary");
  }
  const observationEntries = Object.entries(freshness.observationSummary);
  if (observationEntries.some(([, value]) => typeof value !== "number" || !Number.isFinite(value) || value < 0)) {
    throw new Error("Freshness report observationSummary is malformed");
  }
  if (!Array.isArray(queue.items)) {
    throw new Error("Review queue has no items array");
  }
  const observationSummary = Object.fromEntries(observationEntries) as Record<string, number>;
  const items = queue.items.map(parseReviewItem);
  const ageDays = ageInDays(freshness.generatedAt, now);
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

export function parseLinkCheckReport(
  linkCheckJson: string,
  now = new Date(),
): LinkCheckReportView {
  const report = parseObject(linkCheckJson, "Link-check report");
  if (!validTimestamp(report.checkedAt)) {
    throw new Error("Link-check report has no valid checkedAt timestamp");
  }
  if (typeof report.strict !== "boolean" || !Array.isArray(report.results)) {
    throw new Error("Link-check report is malformed");
  }
  const results = report.results.map((value, index) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Link-check result ${index} must be an object`);
    }
    const row = value as Record<string, unknown>;
    if (typeof row.sourceId !== "string" || typeof row.url !== "string"
      || typeof row.result !== "string" || !linkResults.has(row.result as "changed" | "unchanged" | "fetch_failed")
      || typeof row.allowlisted !== "boolean"
      || (row.adapterHealth !== undefined && row.adapterHealth !== "healthy" && row.adapterHealth !== "degraded")) {
      throw new Error(`Link-check result ${index} is malformed`);
    }
    return row;
  });
  const ageDays = ageInDays(report.checkedAt, now);
  return {
    checkedAt: report.checkedAt,
    ageDays,
    stale: ageDays > 8,
    strict: report.strict,
    total: results.length,
    healthy: results.filter((row) => row.result === "changed" || row.result === "unchanged").length,
    failed: results.filter((row) => row.result === "fetch_failed" && !row.allowlisted).length,
    allowlisted: results.filter((row) => row.allowlisted).length,
  };
}
