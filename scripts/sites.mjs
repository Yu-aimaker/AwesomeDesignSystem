#!/usr/bin/env node
// Recommended sites (AwesomeDS/data/sites.json). Rules: Knowledge/research/recommended-sites.md
//
//   node scripts/sites.mjs                      offline check of the dataset (CI)
//   node scripts/sites.mjs --network            also load every url and GitHub repo
//   node scripts/sites.mjs --network --refresh  update stars and dates; drop entries that now fail
//   node scripts/sites.mjs --intake FILE        check candidates in the paste-in format
//   node scripts/sites.mjs --intake FILE --write  add the candidates that pass
//   --report out.json  write what was accepted, rejected and dropped
//   --gh               read GitHub through the gh CLI instead of unauthenticated fetch
// GITHUB_TOKEN or GH_TOKEN, when set, is sent to api.github.com (the weekly job has one).
// Exit 1 when the dataset or any candidate fails.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildEntry, datasetProblems, entryProblems, isTransient, liveProblems, normalizeUrl, parseCandidates } from "./lib/sites.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const arg = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : "");
const DATA = arg("--data") || join(root, "AwesomeDS/data/sites.json");
const TODAY = arg("--today") || new Date().toISOString().slice(0, 10);
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const UA = "Mozilla/5.0 (compatible; awesomeds-sites/1.0; +https://github.com/Yu-aimaker/AwesomeDesignSystem)";

async function loadUrl(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,*/*" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    await res.body?.cancel();
    return { status: res.status, finalUrl: res.url };
  } catch (e) {
    return { error: netError(e) };
  }
}

/** A short reason for a thrown fetch: the errno code, or "timeout". */
function netError(e) {
  if (e?.name === "TimeoutError") return "timeout";
  return e?.cause?.code ?? e?.message ?? "no response";
}

async function loadRepo(repo) {
  if (has("--gh")) {
    try {
      return { gh: JSON.parse(execFileSync("gh", ["api", `repos/${repo}`], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })) };
    } catch (e) {
      // gh prints "HTTP 404", "HTTP 401: Bad credentials" or a rate-limit line ending in "(HTTP 403)".
      const text = String(e.stderr || e.message);
      return { ghError: text.match(/HTTP (\d{3})/)?.[1] ?? text.trim().split("\n")[0] };
    }
  }
  const headers = { Accept: "application/vnd.github+json", "User-Agent": UA, "X-GitHub-Api-Version": "2022-11-28" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(20000) });
    if (!res.ok) return { ghError: String(res.status) };
    return { gh: await res.json() };
  } catch (e) {
    return { ghError: netError(e) };
  }
}

/** Live check of one candidate or entry. Returns { entry, problems, gh }. */
async function check(c) {
  const [live, r, licenseLive] = await Promise.all([loadUrl(c.url), c.repo ? loadRepo(c.repo) : Promise.resolve({}), c.licenseUrl ? loadUrl(c.licenseUrl) : null]);
  const entry = buildEntry(c, { today: c.addedAt ?? TODAY, gh: r.gh });
  const problems = [...liveProblems(c, { live, ...r, licenseLive }), ...entryProblems(entry, { checkedAt: TODAY })];
  return { entry, problems, gh: r.gh };
}

async function inBatches(items, fn, size = 6) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

const doc = JSON.parse(readFileSync(DATA, "utf8"));
const report = { date: TODAY, accepted: [], rejected: [], dropped: [], warnings: [] };
let failed = false;

const offline = datasetProblems(doc);
if (offline.length) {
  failed = true;
  console.error(`sites.json: ${offline.length} problem(s)\n  ${offline.join("\n  ")}`);
}

if (has("--network")) {
  const results = await inBatches(doc.sites, async (e) => ({ e, ...(await check(e)) }));
  const keep = [];
  for (const { e, entry, problems, gh } of results) {
    const hard = problems.filter((p) => !isTransient(p));
    if (problems.length) console.error(`${hard.length ? "FAIL" : "WARN"} ${problems.join("; ")}`);
    if (hard.length) {
      failed = true;
      report.dropped.push({ id: e.id, problems: hard });
      continue;
    }
    if (problems.length) report.warnings.push({ id: e.id, problems });
    if (!has("--refresh")) continue;
    // Keep curated text; refresh GitHub fields when the API answered (even if the URL warn was transient).
    keep.push(gh ? { ...e, repo: entry.repo, stars: entry.stars, lastUpdated: entry.lastUpdated, license: entry.license ?? e.license } : e);
  }
  if (has("--refresh")) {
    // Many drops at once means our side broke (token, network), not the sites. Write nothing.
    const limit = Math.max(3, Math.ceil(doc.sites.length * 0.1));
    if (report.dropped.length > limit) {
      console.error(`not written: ${report.dropped.length} entries would be dropped (limit ${limit}). Check the token and the network, then run again.`);
      if (arg("--report")) writeFileSync(arg("--report"), `${JSON.stringify(report, null, 2)}\n`);
      process.exit(1);
    }
    // Dropped entries are listed in the report for the PR.
    if (report.dropped.length) console.log(`dropped ${report.dropped.length}: ${report.dropped.map((d) => d.id).join(", ")}`);
    doc.sites = keep;
    doc.meta.updated = TODAY;
    failed = offline.length > 0;
  }
}

if (has("--intake")) {
  const { candidates, errors } = parseCandidates(readFileSync(arg("--intake"), "utf8"));
  for (const err of errors) report.rejected.push({ line: err, problems: [err] });
  const known = new Map(doc.sites.flatMap((e) => [[normalizeUrl(e.url), e.id], ...(e.repo ? [[e.repo.toLowerCase(), e.id]] : [])]));
  const results = await inBatches(candidates, check);
  for (const { entry, problems } of results) {
    const dup = known.get(normalizeUrl(entry.url)) ?? (entry.repo && known.get(entry.repo.toLowerCase()));
    if (dup) problems.push(`${entry.id}: already listed as ${dup}`);
    if (doc.sites.some((e) => e.id === entry.id) || report.accepted.some((e) => e.id === entry.id)) problems.push(`${entry.id}: id already used`);
    if (problems.length) {
      report.rejected.push({ id: entry.id, url: entry.url, problems });
      console.error(`REJECT ${problems.join("; ")}`);
    } else {
      report.accepted.push(entry);
      known.set(normalizeUrl(entry.url), entry.id);
      if (entry.repo) known.set(entry.repo.toLowerCase(), entry.id);
      console.log(`ACCEPT ${entry.id} (${entry.category})`);
    }
  }
  if (has("--write")) {
    doc.sites.push(...report.accepted);
    doc.meta.updated = TODAY;
  }
  // Exit 1 when any candidate fails (including parse errors), even if --write kept the rest.
  if (report.rejected.length) failed = true;
}

if (has("--refresh") || (has("--intake") && has("--write"))) {
  const order = new Map(doc.meta.categories.map((c, i) => [c, i]));
  doc.sites.sort((a, b) => order.get(a.category) - order.get(b.category) || (b.stars ?? -1) - (a.stars ?? -1) || a.id.localeCompare(b.id));
  doc.meta.counts = Object.fromEntries(doc.meta.categories.map((c) => [c, doc.sites.filter((e) => e.category === c).length]));
  const after = datasetProblems(doc);
  if (after.length) {
    console.error(`not written, the result would fail:\n  ${after.join("\n  ")}`);
    process.exit(1);
  }
  writeFileSync(DATA, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`wrote ${DATA}: ${doc.sites.length} sites`);
}

if (arg("--report")) writeFileSync(arg("--report"), `${JSON.stringify(report, null, 2)}\n`);
if (!failed && !report.dropped.length) console.log(`sites.json: ${doc.sites.length} sites pass${has("--network") ? " (offline and live)" : " (offline)"}`);
else if (!failed) console.log(`sites.json: ${doc.sites.length} sites kept after dropping ${report.dropped.length}`);
process.exit(failed ? 1 : 0);
