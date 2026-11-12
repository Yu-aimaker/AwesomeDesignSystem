#!/usr/bin/env node
// Drop OSS ledger rows that fail the same rules as a new discovery.
// The candidate ledger itself is not treated as a catalogue.
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { githubRequest } from "./lib/http-retry.mjs";
import { cataloguedRepoKeys, githubRepoKey, unresolvedSpdx } from "./lib/growth.mjs";
import { ledgerDropSummary, licenseFromNote, ossLedgerRows, pruneOssLedger } from "./lib/knowledge-append.mjs";

function arg(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1] ?? fallback;
}

const root = resolve(arg("--root", join(dirname(fileURLToPath(import.meta.url)), "..")));
const LEDGERS = [
  "Knowledge/research/oss-candidates.md",
  "Plugin/awesome-ds/knowledge/research/oss-candidates.md",
];
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function markdownTexts() {
  const dir = join(root, "Knowledge");
  const texts = [];
  for (const name of readdirSync(dir, { recursive: true })) {
    const rel = String(name).replaceAll("\\", "/");
    if (!rel.endsWith(".md") || rel === "research/oss-candidates.md") continue;
    texts.push(readFileSync(join(dir, rel), "utf8"));
  }
  return texts;
}

function catalog() {
  const curated = readJson(join(root, "AwesomeDS/data/sources/curated-repos.json"));
  const sites = readJson(join(root, "AwesomeDS/data/sites.json"));
  const ranked = readJson(join(root, "AwesomeDS/data/repos.json"));
  return cataloguedRepoKeys({
    curatedKeys: Object.keys(curated),
    siteRepos: (sites.sites ?? []).map((site) => site.repo),
    rankedRepos: (ranked.repos ?? []).map((repo) => `${repo.owner}/${repo.name}`),
    texts: markdownTexts(),
  });
}

async function gh(path) {
  return githubRequest(path, { token: TOKEN, log: (line) => console.log(`prune-oss-ledgers: ${line}`) });
}

async function licenseTexts(rows) {
  const cache = new Map();
  let failures = 0;
  for (const row of rows) {
    const spdx = licenseFromNote(row.note);
    if (spdx && !unresolvedSpdx(spdx)) continue;
    const repo = githubRepoKey(row.url);
    if (!repo) continue;
    const key = repo.toLowerCase();
    if (cache.has(key)) continue;
    try {
      const doc = await gh(`/repos/${repo}/license`);
      const text = doc?.encoding === "base64" && typeof doc.content === "string"
        ? Buffer.from(doc.content, "base64").toString("utf8").slice(0, 200_000)
        : "";
      cache.set(key, text);
    } catch (error) {
      if (error.status === 404) {
        cache.set(key, "");
        continue;
      }
      failures += 1;
      const status = error.status ? `status ${error.status}` : "request failed";
      console.error(`prune-oss-ledgers: license lookup failed (${status})`);
    }
  }
  if (failures) process.exit(1);
  return cache;
}

function remember(summary) {
  const reportPath = join(root, ".growth/report.md");
  if (!existsSync(reportPath)) return;
  const marker = "## 落とした候補";
  const section = `${marker}\n\n${summary}\n`;
  const current = readFileSync(reportPath, "utf8");
  const next = current.includes(marker)
    ? current.replace(new RegExp(`${marker}[\\s\\S]*$`), section)
    : `${current.trimEnd()}\n\n${section}`;
  writeFileSync(reportPath, next.endsWith("\n") ? next : `${next}\n`);
}

const cataloguedKeys = catalog();
const rows = LEDGERS.flatMap((path) => {
  const full = join(root, path);
  return existsSync(full) ? ossLedgerRows(readFileSync(full, "utf8")) : [];
});
const texts = await licenseTexts(rows);
const today = new Date().toISOString().slice(0, 10);
const dropped = [];
for (const path of LEDGERS) {
  const full = join(root, path);
  if (!existsSync(full)) continue;
  const current = readFileSync(full, "utf8");
  const next = pruneOssLedger(current, {
    cataloguedKeys,
    today,
    licenseTextFor: (row) => texts.get(githubRepoKey(row.url).toLowerCase()) ?? "",
  });
  if (next.markdown !== current) writeFileSync(full, next.markdown);
  dropped.push(...next.dropped);
}
const summary = ledgerDropSummary(dropped);
console.log(`prune-oss-ledgers: ${summary}`);
remember(summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n${summary}\n`);
