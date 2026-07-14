import type { FreshnessState, ReferenceRecord } from "./schema";

export type FreshnessCheckInput = {
  lastVerifiedDate: string;
  reviewCadenceDays: number;
  now?: Date | undefined;
  fetchFailed?: boolean | undefined;
  previousHash?: string | undefined;
  currentHash?: string | undefined;
};

export type FreshnessResult = {
  state: FreshnessState | "fetch_failed" | "changed";
  daysSinceVerified: number;
  daysUntilDue: number;
};

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!));
}

function dayDiff(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function evaluateFreshness(input: FreshnessCheckInput): FreshnessResult {
  if (input.fetchFailed) {
    return {
      state: "fetch_failed",
      daysSinceVerified: 0,
      daysUntilDue: input.reviewCadenceDays,
    };
  }

  if (
    input.previousHash &&
    input.currentHash &&
    input.previousHash !== input.currentHash
  ) {
    return {
      state: "changed",
      daysSinceVerified: 0,
      daysUntilDue: input.reviewCadenceDays,
    };
  }

  const now = input.now ?? new Date();
  const last = parseDate(input.lastVerifiedDate);
  const daysSinceVerified = dayDiff(last, now);
  const daysUntilDue = input.reviewCadenceDays - daysSinceVerified;

  let state: FreshnessState = "healthy";
  if (daysSinceVerified > input.reviewCadenceDays * 2) {
    state = "expired";
  } else if (daysSinceVerified > input.reviewCadenceDays) {
    state = "stale";
  } else if (daysSinceVerified > input.reviewCadenceDays * 0.8) {
    state = "due";
  }

  return { state, daysSinceVerified, daysUntilDue };
}

export function summarizeFreshness(records: ReferenceRecord[], now = new Date()) {
  const buckets = {
    healthy: 0,
    due: 0,
    stale: 0,
    expired: 0,
    unknown: 0,
    changed: 0,
    fetch_failed: 0,
  };

  for (const record of records) {
    const result = evaluateFreshness({
      lastVerifiedDate: record.lastVerifiedDate,
      reviewCadenceDays: record.reviewCadenceDays,
      now,
      previousHash: record.contentHash,
      currentHash: record.contentHash,
    });
    const key = result.state as keyof typeof buckets;
    buckets[key] = (buckets[key] ?? 0) + 1;
  }

  return buckets;
}
