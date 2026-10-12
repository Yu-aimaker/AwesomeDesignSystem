#!/usr/bin/env node
// Append new OSS / guideline / release candidates. Does not display them on the site.
//   node scripts/discover-candidates.mjs [--no-fetch] [--report report.json]
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { planDiscoveries, readImageSize, renderReport, topicQuery } from "./lib/growth.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "AwesomeDS/data/candidates.json");
const NO_FETCH = process.argv.includes("--no-fetch");
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const UA = "awesomeds-growth";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? "" : process.argv[i + 1];
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function flagshipUrls() {
  const text = readFileSync(join(root, "web/src/lib/design-systems.ts"), "utf8");
  return [...text.matchAll(/\n\s+url: "(https:\/\/[^"]+)"/g)].map((m) => m[1]);
}

function githubReposFromWatchlist() {
  const text = readFileSync(join(root, "Plugin/awesome-ds/skills/knowledge-curator/reference/watchlist.md"), "utf8");
  return [...new Set([...text.matchAll(/https:\/\/github\.com\/([^/\s)]+)\/([^/\s)]+)/g)].map((m) => `${m[1]}/${m[2]}`))];
}

async function gh(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": UA, "X-GitHub-Api-Version": "2022-11-28" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

function attr(html, name) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i");
  return html.match(re)?.[1] || html.match(re2)?.[1] || null;
}

async function probe(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    const html = (await res.text()).slice(0, 400_000);
    const raw = attr(html, "og:image") || attr(html, "og:image:url");
    let ogWidth = null;
    let ogHeight = null;
    if (raw) {
      const imgUrl = new URL(raw.replace(/&amp;/g, "&"), res.url).href;
      const img = await fetch(imgUrl, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
      const size = readImageSize(Buffer.from(await img.arrayBuffer()));
      ogWidth = size?.width ?? null;
      ogHeight = size?.height ?? null;
    }
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? url;
    return { url, title, http: res.status, ogWidth, ogHeight };
  } catch {
    return { url, title: url, http: 0, ogWidth: null, ogHeight: null };
  }
}

function newBrandUrls() {
  const head = readJson(join(root, "AwesomeDS/data/brands.json"));
  let baseIds = new Set();
  try {
    const base = JSON.parse(execFileSync("git", ["show", "HEAD:AwesomeDS/data/brands.json"], { encoding: "utf8" }));
    baseIds = new Set((base.brands ?? []).map((b) => b.id));
  } catch {
    return [];
  }
  return (head.brands ?? [])
    .filter((b) => !baseIds.has(b.id) && typeof b.url === "string" && b.url.startsWith("https://"))
    .map((b) => ({ url: b.url, title: b.name }))
    .slice(0, 30);
}

const today = new Date().toISOString().slice(0, 10);
const previousDoc = readJson(OUT);
if (NO_FETCH) {
  console.log("discover-candidates: --no-fetch, left candidates.json unchanged");
  process.exit(0);
}

const since = topicQuery().match(/pushed:>(\d{4}-\d{2}-\d{2})/)?.[1] ?? today;
const queries = [
  `topic:design-system stars:>300 pushed:>${since}`,
  `topic:design-tokens stars:>300 pushed:>${since}`,
  `topic:ui-components stars:>300 pushed:>${since}`,
  `shadcn stars:>300 pushed:>${since}`,
  `agent-skills design stars:>300 pushed:>${since}`,
];
const ossItems = [];
for (const q of queries) {
  try {
    const res = await gh(`/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=20`);
    ossItems.push(...(res.items ?? []));
  } catch (e) {
    console.log(`discover-candidates: search skipped (${e.message})`);
  }
}

const guidelines = [];
for (const row of newBrandUrls()) guidelines.push(await probe(row.url));

const releases = [];
for (const repo of githubReposFromWatchlist()) {
  try {
    const rels = await gh(`/repos/${repo}/releases?per_page=1`);
    const tag = rels?.[0]?.tag_name;
    if (!tag) continue;
    releases.push({ repo, tag, url: rels[0].html_url, title: `${repo} ${tag}` });
  } catch {
    /* a repo with no releases is not a failure */
  }
}

const curated = readJson(join(root, "AwesomeDS/data/sources/curated-repos.json"));
const blocklist = readJson(join(root, "AwesomeDS/data/sources/blocklist.json")).repos ?? [];
const planned = planDiscoveries({
  today,
  previous: previousDoc.candidates ?? [],
  curatedKeys: Object.keys(curated),
  blocklist,
  flagshipUrls: flagshipUrls(),
  ossItems,
  guidelines,
  releases,
});
const next = {
  ...previousDoc,
  meta: { ...previousDoc.meta, updated: today, generator: "scripts/discover-candidates.mjs" },
  candidates: planned.candidates,
};
writeFileSync(OUT, JSON.stringify(next, null, 2) + "\n");
const reportPath = arg("--report");
const fresh = planned.candidates.filter((c) => c.firstSeen === today && c.status === "new");
if (reportPath) {
  writeFileSync(reportPath, JSON.stringify({ excluded: planned.excluded, fresh }, null, 2) + "\n");
}
console.log(renderReport({
  date: today,
  guard: { meaningful: fresh.length > 0, ok: true, reasons: [], stats: { reposBase: 0, reposHead: 0, brandsBase: 0, brandsHead: 0, fetchErrors: 0 } },
  excluded: planned.excluded,
  newCandidates: fresh,
}));
console.log(`discover-candidates: ${planned.candidates.length} stored, ${fresh.length} new`);
