import { describe, expect, test } from "vitest";
import { parseFreshnessReport, parseLinkCheckReport } from "../lib/freshness-report";

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

  test("rejects malformed freshness and queue reports instead of hiding corruption", () => {
    expect(() => parseFreshnessReport(
      "{broken",
      JSON.stringify({ items: [] }),
    )).toThrow("not valid JSON");
    expect(() => parseFreshnessReport(
      JSON.stringify({ generatedAt: "2026-07-13T00:00:00.000Z", observationSummary: {} }),
      JSON.stringify({ items: [{ sourceId: "incomplete" }] }),
    )).toThrow("malformed");
  });

  test("summarizes strict link-check results and validates integrity", () => {
    const view = parseLinkCheckReport(JSON.stringify({
      checkedAt: "2026-07-12T00:00:00.000Z",
      strict: true,
      results: [
        { sourceId: "ref.ok", url: "https://example.com", result: "unchanged", allowlisted: false, adapterHealth: "degraded" },
        { sourceId: "ref.changed", url: "https://example.com/new", result: "changed", allowlisted: false },
        { sourceId: "ref.failed", url: "https://example.com/down", result: "fetch_failed", allowlisted: false },
        { sourceId: "ref.allowed", url: "https://example.com/allowed", result: "fetch_failed", allowlisted: true },
      ],
    }), new Date("2026-07-13T00:00:00.000Z"));
    expect(view).toMatchObject({ total: 4, healthy: 2, failed: 1, allowlisted: 1, strict: true });
    expect(view.ageDays).toBe(1);

    expect(() => parseLinkCheckReport(JSON.stringify({
      checkedAt: "invalid",
      strict: true,
      results: [],
    }))).toThrow("checkedAt");

    expect(() => parseLinkCheckReport(JSON.stringify({
      checkedAt: "2026-07-13T00:00:00.000Z",
      strict: true,
      results: [
        { sourceId: "ref.corrupt", url: "https://example.com", result: "looks_fine", allowlisted: false },
      ],
    }))).toThrow("malformed");
  });
});
