#!/usr/bin/env node
// Validates AwesomeDS/data/*.json so the site never receives a broken data set.
// Run: node scripts/validate-data.mjs   (exit 1 with a list of problems)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { candidateProblems, sourceProblems } from "./lib/growth.mjs";
import { datasetProblems as siteProblems } from "./lib/sites.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "AwesomeDS/data");
const HEX = /^#[0-9a-f]{6}$/;
const URL_RE = /^https:\/\/[^\s]+$/;
const problems = [];
const bad = (file, msg) => problems.push(`${file}: ${msg}`);

function load(name) {
  try {
    return JSON.parse(readFileSync(join(dir, name), "utf8"));
  } catch (e) {
    bad(name, `cannot parse: ${e.message}`);
    return null;
  }
}
function meta(name, data) {
  if (!data?.meta) return bad(name, "meta missing");
  for (const k of ["description", "updated", "sources", "license"]) if (!data.meta[k]) bad(name, `meta.${k} missing`);
  if (data.meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(data.meta.updated)) bad(name, "meta.updated is not YYYY-MM-DD");
  for (const s of data.meta.sources ?? []) if (!/^(https:\/\/|AwesomeDS\/)/.test(s)) bad(name, `source is not a URL or repo path: ${s}`);
}
function unique(name, items, key = "id") {
  const seen = new Set();
  for (const it of items) {
    if (!it[key]) bad(name, `${key} missing on ${JSON.stringify(it).slice(0, 60)}`);
    if (seen.has(it[key])) bad(name, `duplicate ${key}: ${it[key]}`);
    seen.add(it[key]);
  }
}

const required = ["brands.json", "palettes.json", "fonts.json", "stack.json", "repos.json", "candidates.json", "sites.json"];
const present = readdirSync(dir).filter((f) => f.endsWith(".json"));
for (const f of required) if (!present.includes(f)) bad(f, "file missing");

// brands
const brands = load("brands.json");
if (brands) {
  meta("brands.json", brands);
  if (!Array.isArray(brands.brands) || brands.brands.length < 50) bad("brands.json", "fewer than 50 brands");
  unique("brands.json", brands.brands ?? []);
  for (const b of brands.brands ?? []) {
    for (const k of ["canvas", "ink", "accent"]) if (!HEX.test(b.colors?.[k] ?? "")) bad("brands.json", `${b.id}: colors.${k} is not #rrggbb`);
    if (!URL_RE.test(b.source ?? "")) bad("brands.json", `${b.id}: source URL missing`);
    if (!["global", "jp"].includes(b.region)) bad("brands.json", `${b.id}: region`);
  }
}

// palettes
const palettes = load("palettes.json");
if (palettes) {
  meta("palettes.json", palettes);
  if ((palettes.curated ?? []).length !== 24) bad("palettes.json", `expected 24 curated, got ${(palettes.curated ?? []).length}`);
  unique("palettes.json", palettes.curated ?? []);
  unique("palettes.json", palettes.brand ?? []);
  for (const p of palettes.curated ?? []) {
    for (const k of ["canvas", "ink", "accent", "accentHover", "accentSoft"]) if (!HEX.test(p[k] ?? "")) bad("palettes.json", `${p.id}: ${k}`);
    for (const k of ["canvas", "ink", "accent"]) if (!HEX.test(p.dark?.[k] ?? "")) bad("palettes.json", `${p.id}: dark.${k}`);
    if ((p.contrast?.accentOnCanvas ?? 0) < 4.5) bad("palettes.json", `${p.id}: light accent contrast ${p.contrast?.accentOnCanvas} < 4.5`);
    if ((p.contrast?.darkAccentOnCanvas ?? 0) < 4.5) bad("palettes.json", `${p.id}: dark accent contrast ${p.contrast?.darkAccentOnCanvas} < 4.5`);
    if (!p.use) bad("palettes.json", `${p.id}: use missing`);
  }
  if (brands && (palettes.brand ?? []).length !== brands.brands.length) bad("palettes.json", "brand count differs from brands.json (run scripts/build-palettes.mjs)");
}

// fonts
const fonts = load("fonts.json");
if (fonts) {
  meta("fonts.json", fonts);
  const cats = new Set(fonts.meta?.categories ?? []);
  unique("fonts.json", fonts.fonts ?? []);
  const ids = new Set((fonts.fonts ?? []).map((f) => f.id));
  for (const f of fonts.fonts ?? []) {
    if (!cats.has(f.category)) bad("fonts.json", `${f.id}: category ${f.category}`);
    if (!["OFL", "system", "proprietary"].includes(f.license)) bad("fonts.json", `${f.id}: license ${f.license}`);
    if (!URL_RE.test(f.url ?? "")) bad("fonts.json", `${f.id}: url`);
    if (f.loaded && !(f.cssFamily && f.fontsource)) bad("fonts.json", `${f.id}: loaded without cssFamily/fontsource`);
    for (const p of f.pairs ?? []) if (!ids.has(p)) bad("fonts.json", `${f.id}: unknown pair ${p}`);
    if (!Array.isArray(f.usedBy) || f.usedByCount !== f.usedBy.length) bad("fonts.json", `${f.id}: usedByCount`);
  }
}

// stack
const stack = load("stack.json");
if (stack) {
  meta("stack.json", stack);
  if ((stack.layers ?? []).length < 15) bad("stack.json", "fewer than 15 layers");
  unique("stack.json", stack.layers ?? []);
  for (const l of stack.layers ?? []) {
    if (!l.layer || !l.pick?.name || !l.pick?.why) bad("stack.json", `${l.id}: layer/pick incomplete`);
    if (!URL_RE.test(l.pick?.url ?? "")) bad("stack.json", `${l.id}: pick.url`);
    for (const a of l.alternatives ?? []) if (!a.name || !a.when || !URL_RE.test(a.url ?? "")) bad("stack.json", `${l.id}: alternative ${a.name ?? "?"} incomplete`);
  }
}

// repos
const repos = load("repos.json");
if (repos) {
  meta("repos.json", repos);
  if ((repos.repos ?? []).length < 50) bad("repos.json", "fewer than 50 repos");
  const seen = new Set();
  for (const r of repos.repos ?? []) {
    const key = `${r.owner}/${r.name}`.toLowerCase();
    if (seen.has(key)) bad("repos.json", `duplicate ${key}`);
    seen.add(key);
    if (!r.owner || !r.name || !r.category) bad("repos.json", `${key}: owner/name/category`);
    if (!URL_RE.test(r.url ?? "")) bad("repos.json", `${key}: url`);
    if (r.stars !== null && (typeof r.stars !== "number" || r.stars < 0)) bad("repos.json", `${key}: stars`);
  }
}

// sites: the intake rules in Knowledge/research/recommended-sites.md (offline part)
const sites = load("sites.json");
if (sites) for (const p of siteProblems(sites)) bad("sites.json", p);

const candidates = load("candidates.json");
if (candidates) for (const p of candidateProblems(candidates)) bad("candidates.json", p);

const curatedPath = join(dir, "sources/curated-repos.json");
const blockPath = join(dir, "sources/blocklist.json");
if (!existsSync(curatedPath) || !existsSync(blockPath)) bad("sources", "curated-repos.json or blocklist.json missing");
else {
  try {
    const curated = JSON.parse(readFileSync(curatedPath, "utf8"));
    const blocklist = JSON.parse(readFileSync(blockPath, "utf8"));
    for (const p of sourceProblems(curated, blocklist)) bad("sources", p);
    // The weekly diff guard fails when a curated key is absent from the ranking
    // (for example after a GitHub repo transfer). Catch it here, before a run.
    if (repos?.repos) {
      const ranked = new Set(repos.repos.map((r) => `${r.owner}/${r.name}`.toLowerCase()));
      for (const key of Object.keys(curated)) {
        if (!ranked.has(key.toLowerCase())) bad("sources", `curated key ${key} is not in repos.json (renamed or transferred repo?)`);
      }
    }
  } catch (e) {
    bad("sources", e.message);
  }
}

if (problems.length) {
  console.error(`validate-data: ${problems.length} problem(s)\n  ` + problems.slice(0, 40).join("\n  ") + (problems.length > 40 ? `\n  ...${problems.length - 40} more` : ""));
  process.exit(1);
}
console.log(`validate-data: OK (${present.join(", ")})`);
