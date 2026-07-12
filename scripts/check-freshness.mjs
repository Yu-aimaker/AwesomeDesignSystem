import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateFreshness, loadReferenceRecords } from "../packages/content/src/index.ts";
import { isActionablePersistentFailure, isPersistentFailure, mapWithConcurrency, observeTrackedSource } from "./lib/source-observation.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportsRoot = path.join(root, "reports");
const references = await loadReferenceRecords(path.join(root, "content"));
const now = new Date();
const strict = process.argv.includes("--strict") || process.env.AWESOME_DS_STRICT_FRESHNESS === "1";
const failureThresholdDays = Number(process.env.AWESOME_DS_FAILURE_THRESHOLD_DAYS ?? 7);
let previous = new Map();
let policies = {};
let failureAllowlist = new Set();
try {
  const stored = JSON.parse(await readFile(path.join(reportsRoot, "source-observations.json"), "utf8"));
  previous = new Map((stored.observations ?? []).map((row) => [row.sourceId, row]));
} catch {}
try {
  const policyConfig = JSON.parse(await readFile(path.join(root, "content/observation-policy.json"), "utf8"));
  policies = policyConfig.sources ?? {};
  failureAllowlist = new Set(policyConfig.failureAllowlistSourceIds ?? []);
} catch {}

const observations = await mapWithConcurrency(references, 6, (ref) =>
  observeTrackedSource(ref, {
    previousHash: previous.get(ref.id)?.contentHash ?? ref.contentHash,
    previousEtag: previous.get(ref.id)?.etag,
    previousLastModified: previous.get(ref.id)?.lastModified,
    retries: 2,
    timeoutMs: 8_000,
    githubToken: process.env.GITHUB_TOKEN,
    hashMode: policies[ref.id]?.hashMode,
    previousFirstFailedAt: previous.get(ref.id)?.result === "fetch_failed" ? previous.get(ref.id)?.firstFailedAt : undefined,
  }),
);
const rows = references.map((ref) => {
  const observation = observations.find((row) => row.sourceId === ref.id);
  const result = evaluateFreshness({
    lastVerifiedDate: ref.lastVerifiedDate,
    reviewCadenceDays: ref.reviewCadenceDays,
    now,
    fetchFailed: observation?.result === "fetch_failed",
    previousHash: previous.get(ref.id)?.contentHash ?? ref.contentHash,
    currentHash: observation?.result === "unchanged"
      ? (previous.get(ref.id)?.contentHash ?? ref.contentHash)
      : observation?.contentHash,
  });
  return { id: ref.id, title: ref.title, ...result, recordedState: ref.freshnessState, observation: observation?.result };
});
const summary = rows.reduce((acc, row) => {
  acc[row.state] = (acc[row.state] ?? 0) + 1;
  return acc;
}, {});
const observationSummary = observations.reduce((acc, row) => {
  acc[row.result] = (acc[row.result] ?? 0) + 1;
  return acc;
}, {});
const reviewQueue = observations.filter((row) => row.result !== "unchanged").map((row) => ({
  sourceId: row.sourceId,
  reason: row.result === "changed" ? "upstream-content-changed" : "source-fetch-failed",
  observedAt: row.observedAt,
  firstFailedAt: row.firstFailedAt,
  persistent: isPersistentFailure(row, failureThresholdDays, now),
  allowlisted: failureAllowlist.has(row.sourceId),
}));
const persistentFailures = observations.filter((row) => isActionablePersistentFailure(row, failureAllowlist, failureThresholdDays, now));
const markdown = `# Freshness summary\n\nGenerated: ${now.toISOString()}\n\n- Sources: ${observations.length}\n- Changed: ${observationSummary.changed ?? 0}\n- Unchanged: ${observationSummary.unchanged ?? 0}\n- Fetch failed: ${observationSummary.fetch_failed ?? 0}\n- Persistent failures (>= ${failureThresholdDays} days): ${persistentFailures.length}\n- Review queue: ${reviewQueue.length}\n`;

await mkdir(reportsRoot, { recursive: true });
await Promise.all([
  writeFile(path.join(reportsRoot, "freshness.json"), JSON.stringify({ generatedAt: now.toISOString(), summary, observationSummary, rows }, null, 2)),
  writeFile(path.join(reportsRoot, "source-observations.json"), JSON.stringify({ generatedAt: now.toISOString(), observations }, null, 2)),
  writeFile(path.join(reportsRoot, "review-queue.json"), JSON.stringify({ generatedAt: now.toISOString(), items: reviewQueue }, null, 2)),
  writeFile(path.join(reportsRoot, "freshness-summary.md"), markdown),
]);
console.log(JSON.stringify({ freshness: summary, observations: observationSummary, reviewQueue: reviewQueue.length, persistentFailures: persistentFailures.length }, null, 2));
if (strict && persistentFailures.length > 0) process.exitCode = 1;
