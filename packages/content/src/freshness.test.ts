import { describe, expect, test } from "vitest";

import { evaluateFreshness } from "./freshness";

describe("freshness evaluation", () => {
  test("marks healthy within cadence", () => {
    const result = evaluateFreshness({
      lastVerifiedDate: "2026-07-01",
      reviewCadenceDays: 90,
      now: new Date("2026-07-13T00:00:00Z"),
    });
    expect(result.state).toBe("healthy");
  });

  test("marks stale after cadence and expired after 2x", () => {
    const stale = evaluateFreshness({
      lastVerifiedDate: "2025-12-01",
      reviewCadenceDays: 90,
      now: new Date("2026-07-13T00:00:00Z"),
    });
    expect(["stale", "expired"]).toContain(stale.state);

    const expired = evaluateFreshness({
      lastVerifiedDate: "2025-01-01",
      reviewCadenceDays: 90,
      now: new Date("2026-07-13T00:00:00Z"),
    });
    expect(expired.state).toBe("expired");
  });

  test("separates fetch failures from content changes", () => {
    const failed = evaluateFreshness({
      lastVerifiedDate: "2026-07-01",
      reviewCadenceDays: 30,
      fetchFailed: true,
    });
    expect(failed.state).toBe("fetch_failed");

    const changed = evaluateFreshness({
      lastVerifiedDate: "2026-07-01",
      reviewCadenceDays: 30,
      previousHash: "aaa",
      currentHash: "bbb",
    });
    expect(changed.state).toBe("changed");
  });
});
