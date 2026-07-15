import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import {
  parseReleaseReadinessReport,
  releaseGateIds,
} from "../lib/release-report";
import { getReportsRoot } from "../lib/path-resolver";

const reportPath = `${getReportsRoot()}/release-readiness.json`;

describe("release readiness report", () => {
  test("parses the repository-owned report and requires every control gate", async () => {
    const report = parseReleaseReadinessReport(await readFile(reportPath, "utf8"));
    expect(report.verdict).toBe("ship");
    expect(report.gates.map((gate) => gate.id).sort()).toEqual([...releaseGateIds].sort());
    expect(report.gates.every((gate) => gate.status === "pass")).toBe(true);
  });

  test("rejects duplicate or incomplete gate sets", async () => {
    const value = JSON.parse(await readFile(reportPath, "utf8"));
    value.gates = value.gates.slice(0, -1);
    expect(() => parseReleaseReadinessReport(JSON.stringify(value))).toThrow(
      "every gate exactly once",
    );
  });

  test("keeps security and performance claims bounded by measured values", async () => {
    const report = parseReleaseReadinessReport(await readFile(reportPath, "utf8"));
    expect(report.security.vulnerabilities).toBe(0);
    expect(report.performance.largestRouteBytes).toBeLessThanOrEqual(
      report.performance.routeBudgetBytes,
    );
    expect(report.evidence.graphIssues).toBe(0);
  });
});
