import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadReferenceRecords } from "../packages/content/src/index.ts";
import { mapWithConcurrency, observeTrackedSource } from "./lib/source-observation.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict") || process.env.AWESOME_DS_STRICT_LINKS === "1";
const references = await loadReferenceRecords(path.join(root, "content"));
let allowlisted = new Set();
let policies = {};
try {
  const config = JSON.parse(await readFile(path.join(root, "content/link-allowlist.json"), "utf8"));
  allowlisted = new Set(config.sourceIds ?? []);
} catch {}
try {
  policies = JSON.parse(await readFile(path.join(root, "content/observation-policy.json"), "utf8")).sources ?? {};
} catch {}

const observations = await mapWithConcurrency(references, 6, (ref) =>
  observeTrackedSource(ref, { retries: 2, timeoutMs: 8_000, githubToken: process.env.GITHUB_TOKEN, hashMode: policies[ref.id]?.hashMode }),
);
const results = observations.map((row) => ({ ...row, allowlisted: allowlisted.has(row.sourceId) }));
const failures = results.filter((row) => row.result === "fetch_failed" && !row.allowlisted);

await mkdir(path.join(root, "reports"), { recursive: true });
await writeFile(path.join(root, "reports/link-check.json"), JSON.stringify({ checkedAt: new Date().toISOString(), sourceCount: references.length, strict, results }, null, 2));
console.log(JSON.stringify({ sourceCount: references.length, checked: results.length, failed: failures.length, allowlisted: results.filter((row) => row.allowlisted).length }, null, 2));
if (strict && failures.length > 0) process.exitCode = 1;
