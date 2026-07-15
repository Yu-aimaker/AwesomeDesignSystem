import { readFile } from "node:fs/promises";
import path from "node:path";

import { getReportsRoot } from "./path-resolver";

export const releaseGateIds = [
  "core",
  "browser",
  "accessibility",
  "security",
  "performance",
  "provenance",
  "localization",
] as const;

export type ReleaseGateId = (typeof releaseGateIds)[number];

type ReleaseGate = {
  id: ReleaseGateId;
  status: "pass" | "attention" | "fail";
  command: string;
  evidence: string;
};

export type ReleaseReadinessReport = {
  schemaVersion: 1;
  verifiedAt: string;
  verdict: "ship" | "hold";
  verification: {
    unitTests: number;
    unitTestFiles: number;
    browserTests: { macos: number; linux: number };
    visualTests: number;
    staticGenerationUnits: number;
  };
  evidence: {
    references: number;
    rules: number;
    artifacts: number;
    signals: number;
    graphIssues: number;
    linksChecked: number;
    linkFailures: number;
    reviewQueue: number;
  };
  security: {
    scanner: string;
    packagesScanned: number;
    vulnerabilities: number;
    csp: string;
  };
  performance: {
    largestRouteBytes: number;
    routeBudgetBytes: number;
    englishScriptBytes: number;
    japaneseScriptBytes: number;
    japaneseFontBytes: number;
  };
  gates: ReleaseGate[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`release-readiness.${key} must be a non-negative number`);
  }
  return value;
}

export function parseReleaseReadinessReport(raw: string): ReleaseReadinessReport {
  const value: unknown = JSON.parse(raw);
  if (!isRecord(value) || value.schemaVersion !== 1) {
    throw new Error("release-readiness schemaVersion must be 1");
  }
  if (typeof value.verifiedAt !== "string" || Number.isNaN(Date.parse(value.verifiedAt))) {
    throw new Error("release-readiness.verifiedAt must be an ISO date");
  }
  if (value.verdict !== "ship" && value.verdict !== "hold") {
    throw new Error("release-readiness.verdict must be ship or hold");
  }
  if (!isRecord(value.verification) || !isRecord(value.evidence) || !isRecord(value.security) || !isRecord(value.performance)) {
    throw new Error("release-readiness metric groups are required");
  }
  if (!isRecord(value.verification.browserTests)) {
    throw new Error("release-readiness.verification.browserTests is required");
  }
  if (!Array.isArray(value.gates)) {
    throw new Error("release-readiness.gates must be an array");
  }

  const gates = value.gates.map((gate): ReleaseGate => {
    if (!isRecord(gate) || !releaseGateIds.includes(gate.id as ReleaseGateId)) {
      throw new Error("release-readiness gate id is invalid");
    }
    if (gate.status !== "pass" && gate.status !== "attention" && gate.status !== "fail") {
      throw new Error(`release-readiness.${String(gate.id)} status is invalid`);
    }
    if (typeof gate.command !== "string" || typeof gate.evidence !== "string") {
      throw new Error(`release-readiness.${String(gate.id)} command and evidence are required`);
    }
    return {
      id: gate.id as ReleaseGateId,
      status: gate.status,
      command: gate.command,
      evidence: gate.evidence,
    };
  });
  if (new Set(gates.map((gate) => gate.id)).size !== releaseGateIds.length) {
    throw new Error("release-readiness must contain every gate exactly once");
  }

  return {
    schemaVersion: 1,
    verifiedAt: value.verifiedAt,
    verdict: value.verdict,
    verification: {
      unitTests: requireNumber(value.verification, "unitTests"),
      unitTestFiles: requireNumber(value.verification, "unitTestFiles"),
      browserTests: {
        macos: requireNumber(value.verification.browserTests, "macos"),
        linux: requireNumber(value.verification.browserTests, "linux"),
      },
      visualTests: requireNumber(value.verification, "visualTests"),
      staticGenerationUnits: requireNumber(value.verification, "staticGenerationUnits"),
    },
    evidence: {
      references: requireNumber(value.evidence, "references"),
      rules: requireNumber(value.evidence, "rules"),
      artifacts: requireNumber(value.evidence, "artifacts"),
      signals: requireNumber(value.evidence, "signals"),
      graphIssues: requireNumber(value.evidence, "graphIssues"),
      linksChecked: requireNumber(value.evidence, "linksChecked"),
      linkFailures: requireNumber(value.evidence, "linkFailures"),
      reviewQueue: requireNumber(value.evidence, "reviewQueue"),
    },
    security: {
      scanner: String(value.security.scanner),
      packagesScanned: requireNumber(value.security, "packagesScanned"),
      vulnerabilities: requireNumber(value.security, "vulnerabilities"),
      csp: String(value.security.csp),
    },
    performance: {
      largestRouteBytes: requireNumber(value.performance, "largestRouteBytes"),
      routeBudgetBytes: requireNumber(value.performance, "routeBudgetBytes"),
      englishScriptBytes: requireNumber(value.performance, "englishScriptBytes"),
      japaneseScriptBytes: requireNumber(value.performance, "japaneseScriptBytes"),
      japaneseFontBytes: requireNumber(value.performance, "japaneseFontBytes"),
    },
    gates,
  };
}

export async function loadReleaseReadinessReport(): Promise<ReleaseReadinessReport> {
  const raw = await readFile(path.join(getReportsRoot(), "release-readiness.json"), "utf8");
  return parseReleaseReadinessReport(raw);
}
