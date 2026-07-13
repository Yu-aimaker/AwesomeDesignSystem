import { describe, expect, test } from "vitest";
import { parseFreshnessReport } from "../lib/freshness-report";

describe("status freshness report", () => {
  test("groups actionable failures and exposes report staleness", () => {
    const view = parseFreshnessReport(
      JSON.stringify({ generatedAt: "2026-07-01T00:00:00.000Z", observationSummary: { unchanged: 1, adapter_degraded: 1 } }),
      JSON.stringify({ items: [
        { sourceId: "ref.github", title: "GitHub source", url: "https://github.com/acme/design", reason: "github-adapter-failed", observedAt: "2026-07-01T00:00:00.000Z", firstFailedAt: "2026-06-20T00:00:00.000Z", failureAgeDays: 11, persistent: true, allowlisted: false, error: "GitHub HTTP 503" },
        { sourceId: "ref.changed", title: "Changed source", url: "https://example.com/design", reason: "upstream-content-changed", observedAt: "2026-07-01T00:00:00.000Z", failureAgeDays: 0, persistent: false, allowlisted: false },
      ] }),
      new Date("2026-07-13T00:00:00.000Z"),
    );

    expect(view.stale).toBe(true);
    expect(view.ageDays).toBe(12);
    expect(view.groups.adapterFailures[0]).toMatchObject({ sourceId: "ref.github", persistent: true, error: "GitHub HTTP 503" });
    expect(view.groups.changed[0]).toMatchObject({ sourceId: "ref.changed" });
  });
});
