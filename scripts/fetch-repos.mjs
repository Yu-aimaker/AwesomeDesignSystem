#!/usr/bin/env node
// Refreshes AwesomeDS/data/repos.json: GitHub star ranking of design / AI-frontend open source.
//   - a curated list in AwesomeDS/data/sources/curated-repos.json
//   - plus the top 20 results of topic:design-system stars:>500 pushed within 90 days
//     (AwesomeDS/data/sources/blocklist.json is excluded from the topic slice)
// Run: node scripts/fetch-repos.mjs [--seed <file.json>] [--no-fetch]
//   GITHUB_TOKEN / GH_TOKEN  raise the rate limit from 60/h to 5000/h.
//   --seed <file>            merge an array of GitHub API repository objects as if fetched (offline bootstrap).
//   --no-fetch               do not touch the network (use with --seed).
// Robustness: any failure keeps the previous entry from the existing file and is recorded in meta.fetchErrors.
// The file is only written when every curated repo has an entry (fetched, seeded or previous), so the site never
// receives a partial list.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { filterTopicRepos, topicQuery } from "./lib/growth.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "AwesomeDS/data/repos.json");
const args = process.argv.slice(2);
const seedPath = args.includes("--seed") ? args[args.indexOf("--seed") + 1] : null;
const NO_FETCH = args.includes("--no-fetch");
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const TOPIC_QUERY = topicQuery();
const TOPIC_TOP = 20;
const MAX_WAIT_MS = 15 * 60 * 1000;

// Curated owner/name -> category. Edit AwesomeDS/data/sources/curated-repos.json.
function loadCurated() {
  return JSON.parse(readFileSync(join(root, "AwesomeDS/data/sources/curated-repos.json"), "utf8"));
}

async function main() {
const CURATED = loadCurated();
const BLOCKLIST = JSON.parse(readFileSync(join(root, "AwesomeDS/data/sources/blocklist.json"), "utf8")).repos ?? [];
const lower = (s) => s.toLowerCase();
const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { repos: [] };
const previous = new Map((existing.repos || []).map((r) => [lower(`${r.owner}/${r.name}`), r]));
const fetchErrors = [];
let stopAll = false;

function toEntry(api, category) {
  return {
    owner: api.owner?.login ?? api.full_name.split("/")[0],
    name: api.name ?? api.full_name.split("/")[1],
    url: api.html_url,
    description: api.description ?? null,
    stars: api.stargazers_count ?? null,
    forks: api.forks_count ?? null,
    language: api.language ?? null,
    topics: api.topics ?? [],
    pushedAt: api.pushed_at ?? api.updated_at ?? null,
    license: api.license?.spdx_id ?? null,
    archived: Boolean(api.archived),
    category,
    fetchedAt: new Date().toISOString().slice(0, 10),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function gh(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "awesomeds-data", "X-GitHub-Api-Version": "2022-11-28" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, { headers });
    if (res.ok) return res.json();
    const body = await res.text();
    const remaining = res.headers.get("x-ratelimit-remaining");
    const reset = Number(res.headers.get("x-ratelimit-reset")) * 1000;
    if ((res.status === 403 || res.status === 429) && remaining === "0" && reset) {
      const wait = reset - Date.now() + 2000;
      if (wait > MAX_WAIT_MS) throw new Error(`rate limit exhausted; resets in ${Math.round(wait / 60000)} min`);
      console.log(`fetch-repos: rate limited, sleeping ${Math.round(wait / 1000)}s`);
      await sleep(wait);
      continue;
    }
    if (res.status === 403 && /not enabled for this session/i.test(body)) {
      stopAll = true;
      throw new Error("GitHub API blocked in this environment");
    }
    if (res.status === 404) throw new Error("404 not found");
    if (res.status >= 500 || res.status === 429) { await sleep(1500 * (attempt + 1)); continue; }
    throw new Error(`${res.status} ${body.slice(0, 120)}`);
  }
  throw new Error("gave up after 3 attempts");
}

const seeded = new Map();
if (seedPath) {
  const arr = JSON.parse(readFileSync(seedPath, "utf8"));
  for (const api of arr) seeded.set(lower(api.full_name), api);
  console.log(`fetch-repos: seeded ${seeded.size} repositories from ${seedPath}`);
}

const result = new Map(); // key -> entry
let fetched = 0, kept = 0;

// 1. curated list
for (const [full, category] of Object.entries(CURATED)) {
  const key = lower(full);
  const prev = previous.get(key);
  if (seeded.has(key)) { result.set(key, toEntry(seeded.get(key), category)); continue; }
  if (NO_FETCH || stopAll) {
    if (prev) { result.set(key, { ...prev, category }); kept++; }
    else { result.set(key, { owner: full.split("/")[0], name: full.split("/")[1], url: `https://github.com/${full}`, description: null, stars: null, forks: null, language: null, topics: [], pushedAt: null, license: null, archived: false, category, fetchedAt: null, note: "not fetched yet" }); }
    if (!NO_FETCH) fetchErrors.push(`${full}: skipped (API unavailable)`);
    continue;
  }
  try {
    const api = await gh(`/repos/${full}`);
    result.set(key, toEntry(api, category));
    fetched++;
    if (!TOKEN) await sleep(300);
  } catch (e) {
    fetchErrors.push(`${full}: ${e.message}`);
    if (prev) { result.set(key, { ...prev, category }); kept++; }
    else result.set(key, { owner: full.split("/")[0], name: full.split("/")[1], url: `https://github.com/${full}`, description: null, stars: null, forks: null, language: null, topics: [], pushedAt: null, license: null, archived: false, category, fetchedAt: null, note: `fetch failed: ${e.message}` });
  }
}

// 2. topic search (top 20 by stars). Seeded objects tagged with `_topic: true` count as search results.
let topicNames = [];
if (!NO_FETCH && !stopAll) {
  try {
    const res = await gh(`/search/repositories?q=${encodeURIComponent(TOPIC_QUERY)}&sort=stars&order=desc&per_page=${TOPIC_TOP}`);
    const topicItems = filterTopicRepos(res.items || [], BLOCKLIST);
    for (const api of topicItems) {
      const key = lower(api.full_name);
      topicNames.push(key);
      if (!result.has(key)) result.set(key, toEntry(api, "topic:design-system"));
      else result.get(key).topics = api.topics ?? result.get(key).topics;
    }
    fetched += topicItems.length;
  } catch (e) {
    fetchErrors.push(`search ${TOPIC_QUERY}: ${e.message}`);
  }
}
const blocked = new Set(BLOCKLIST.map((name) => name.toLowerCase()));
if (topicNames.length === 0) {
  // fall back to seed entries marked as topic results, then to the previous file's topic entries
  for (const [key, api] of seeded) if (api._topic && !result.has(key) && !blocked.has(key)) { result.set(key, toEntry(api, "topic:design-system")); topicNames.push(key); }
  if (topicNames.length === 0) for (const [key, r] of previous) if (r.category === "topic:design-system" && !result.has(key) && !blocked.has(key)) { result.set(key, r); topicNames.push(key); kept++; }
}
for (const key of topicNames) {
  const r = result.get(key);
  if (r && !r.inTopicTop) r.inTopicTop = true;
}

const repos = [...result.values()].sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1) || a.name.localeCompare(b.name));
const missing = repos.filter((r) => r.stars === null).length;
if (repos.length < Object.keys(CURATED).length) {
  console.error("fetch-repos: internal error, fewer entries than curated list; not writing");
  process.exit(1);
}
const out = {
  meta: {
    description: "GitHub star ranking of design and AI-frontend open source: a curated list (component libraries, headless, animation, icons, tokens, fonts, agent skills, AI UI, tools) plus the top 20 GitHub search results for topic:design-system. Stars, forks, language, topics and pushedAt come from the GitHub REST API. Entries with stars: null could not be fetched yet.",
    updated: new Date().toISOString().slice(0, 10),
    sources: ["https://api.github.com/repos/{owner}/{name}", `https://api.github.com/search/repositories?q=${TOPIC_QUERY}&sort=stars`],
    license: "Repository metadata is public GitHub data; each repository keeps its own license (see `license`).",
    generator: "scripts/fetch-repos.mjs",
    counts: { total: repos.length, curated: Object.keys(CURATED).length, topicTop: topicNames.length, fetched, keptFromPrevious: kept, missing },
    categories: [...new Set(repos.map((r) => r.category))].sort(),
    fetchErrors,
  },
  repos,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`fetch-repos: wrote ${repos.length} repos (${fetched} fetched, ${kept} kept, ${missing} without stars, ${fetchErrors.length} errors) -> ${OUT}`);
if (fetchErrors.length) console.log("fetch-repos: errors:\n  " + fetchErrors.slice(0, 20).join("\n  ") + (fetchErrors.length > 20 ? `\n  ...${fetchErrors.length - 20} more` : ""));

}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirect) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
