import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateFreshness, loadReferenceRecords } from "../packages/content/src/index.ts";
import { buildObservationReviewItems, isActionablePersistentAdapterFailure, isActionablePersistentFailure, mapWithConcurrency, observeTrackedSource } from "./lib/source-observation.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = process.env.AWESOME_DS_DATA_ROOT ? path.resolve(process.env.AWESOME_DS_DATA_ROOT) : root;
const reportsRoot = path.join(dataRoot, "reports");
const references = await loadReferenceRecords(path.join(dataRoot, "content"));
const now = process.env.AWESOME_DS_NOW ? new Date(process.env.AWESOME_DS_NOW) : new Date();
if (Number.isNaN(now.getTime())) throw new Error("AWESOME_DS_NOW must be an ISO-8601 date");
const strict = process.argv.includes("--strict") || process.env.AWESOME_DS_STRICT_FRESHNESS === "1";
const failureThresholdDays = Number(process.env.AWESOME_DS_FAILURE_THRESHOLD_DAYS ?? 7);
const retries = Number(process.env.AWESOME_DS_OBSERVATION_RETRIES ?? 2);
const timeoutMs = Number(process.env.AWESOME_DS_OBSERVATION_TIMEOUT_MS ?? 8_000);
let previous = new Map();
let policies = {};
let failureAllowlist = new Set();
try {
  const stored = JSON.parse(await readFile(path.join(reportsRoot, "source-observations.json"), "utf8"));
  previous = new Map((stored.observations ?? []).map((row) => [row.sourceId, row]));
} catch {}
try {
  const policyConfig = JSON.parse(await readFile(path.join(dataRoot, "content/observation-policy.json"), "utf8"));
  policies = policyConfig.sources ?? {};
  failureAllowlist = new Set(policyConfig.failureAllowlistSourceIds ?? []);
} catch {}

const observations = await mapWithConcurrency(references, 6, (ref) =>
  observeTrackedSource(ref, {
    previousHash: previous.get(ref.id)?.contentHash ?? previous.get(ref.id)?.lastSuccessfulHash ?? ref.contentHash,
    previousEtag: previous.get(ref.id)?.etag ?? previous.get(ref.id)?.lastSuccessfulEtag,
    previousLastModified: previous.get(ref.id)?.lastModified ?? previous.get(ref.id)?.lastSuccessfulLastModified,
    previousHashes: previous.get(ref.id)?.lastSuccessfulHashes,
    retries,
    timeoutMs,
    githubToken: process.env.GITHUB_TOKEN,
    hashMode: policies[ref.id]?.hashMode,
    previousFirstFailedAt: previous.get(ref.id)?.result === "fetch_failed" ? previous.get(ref.id)?.firstFailedAt : undefined,
    previousAdapterHealth: previous.get(ref.id)?.adapterHealth,
    previousAdapterFirstFailedAt: previous.get(ref.id)?.adapterFirstFailedAt,
  }),
);
const rows = references.map((ref) => {
  const observation = observations.find((row) => row.sourceId === ref.id);
  const result = evaluateFreshness({
    lastVerifiedDate: ref.lastVerifiedDate,
    reviewCadenceDays: ref.reviewCadenceDays,
    now,
    fetchFailed: observation?.result === "fetch_failed",
    previousHash: previous.get(ref.id)?.contentHash ?? previous.get(ref.id)?.lastSuccessfulHash ?? ref.contentHash,
    currentHash: observation?.result === "unchanged"
      ? (previous.get(ref.id)?.contentHash ?? previous.get(ref.id)?.lastSuccessfulHash ?? ref.contentHash)
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
  if (row.adapterHealth === "degraded") acc.adapter_degraded = (acc.adapter_degraded ?? 0) + 1;
  if (row.adapterRecoveredAt) acc.adapter_recovered = (acc.adapter_recovered ?? 0) + 1;
  return acc;
}, {});
const reviewQueue = references.flatMap((ref) => {
  const observation = observations.find((row) => row.sourceId === ref.id);
  return observation ? buildObservationReviewItems(ref, observation, failureAllowlist, failureThresholdDays, now) : [];
});
const persistentFailures = observations.filter((row) =>
  isActionablePersistentFailure(row, failureAllowlist, failureThresholdDays, now)
  || isActionablePersistentAdapterFailure(row, failureAllowlist, failureThresholdDays, now));
const markdown = `# Freshness summary\n\nGenerated: ${now.toISOString()}\n\n- Sources: ${observations.length}\n- Changed: ${observationSummary.changed ?? 0}\n- Unchanged: ${observationSummary.unchanged ?? 0}\n- Fetch failed: ${observationSummary.fetch_failed ?? 0}\n- GitHub adapter degraded: ${observationSummary.adapter_degraded ?? 0}\n- GitHub adapter recovered: ${observationSummary.adapter_recovered ?? 0}\n- Persistent failures (>= ${failureThresholdDays} days): ${persistentFailures.length}\n- Review queue: ${reviewQueue.length}\n`;

await mkdir(reportsRoot, { recursive: true });
await Promise.all([
  writeFile(path.join(reportsRoot, "freshness.json"), JSON.stringify({ generatedAt: now.toISOString(), summary, observationSummary, rows }, null, 2)),
  writeFile(path.join(reportsRoot, "source-observations.json"), JSON.stringify({ generatedAt: now.toISOString(), observations }, null, 2)),
  writeFile(path.join(reportsRoot, "review-queue.json"), JSON.stringify({ generatedAt: now.toISOString(), items: reviewQueue }, null, 2)),
  writeFile(path.join(reportsRoot, "freshness-summary.md"), markdown),
]);
console.log(JSON.stringify({ freshness: summary, observations: observationSummary, reviewQueue: reviewQueue.length, persistentFailures: persistentFailures.length }, null, 2));
if (strict && persistentFailures.length > 0) process.exitCode = 1;
