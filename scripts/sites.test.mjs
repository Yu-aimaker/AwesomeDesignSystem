// Intake rules for AwesomeDS/data/sites.json. Run: node --test scripts/sites.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CATEGORIES,
  CODE_CATEGORIES,
  MAX_AGE_MONTHS,
  MAX_DESCRIPTION,
  MIN_STARS,
  PROVENANCE_KEYS,
  buildEntry,
  datasetProblems,
  entryProblems,
  isTransient,
  liveProblems,
  monthsBefore,
  normalizeUrl,
  parseCandidates,
} from "./lib/sites.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const good = {
  id: "example-ui",
  name: "Example UI",
  url: "https://example-ui.dev",
  category: "component-library",
  description: "見た目を持たない React の部品",
  repo: "example/ui",
  license: "MIT",
  stars: 5000,
  lastUpdated: "2026-10-01",
  source: "https://github.com/example/ui",
  addedAt: "2026-10-21",
};
const site = {
  id: "example-gallery",
  name: "Example Gallery",
  url: "https://gallery.example",
  category: "gallery",
  description: "画面の見本帳",
  repo: null,
  license: null,
  publisher: "Example",
  stars: null,
  lastUpdated: null,
  source: "https://gallery.example",
  addedAt: "2026-10-21",
};
const doc = (sites) => ({ meta: { description: "d", updated: "2026-10-21", sources: ["x"], license: "MIT", criteria: "c", categories: [] }, sites });
const has = (problems, re) => problems.some((p) => re.test(p));

test("doc thresholds and enums match the checker", () => {
  assert.equal(MAX_AGE_MONTHS, 12);
  assert.equal(MIN_STARS, 1000);
  assert.equal(MAX_DESCRIPTION, 80);
  assert.deepEqual(CATEGORIES, ["component-library", "animation", "loading", "gallery", "resource", "skill"]);
  assert.deepEqual(CODE_CATEGORIES, ["component-library", "animation", "loading", "skill"]);
});

test("the committed dataset passes and component libraries are the largest category", () => {
  const data = JSON.parse(readFileSync(join(root, "AwesomeDS/data/sites.json"), "utf8"));
  assert.deepEqual(datasetProblems(data), []);
  const count = (c) => data.sites.filter((e) => e.category === c).length;
  for (const c of ["animation", "loading", "gallery", "resource", "skill"]) assert.ok(count("component-library") > count(c), `component-library vs ${c}`);
  assert.ok(count("animation") >= 2 && count("loading") >= 2);
});

test("a good library and a good site pass", () => {
  assert.deepEqual(entryProblems(good, { checkedAt: "2026-10-21" }), []);
  assert.deepEqual(entryProblems(site, { checkedAt: "2026-10-21" }), []);
});

test("each broken rule is reported", () => {
  const long = "あ".repeat(MAX_DESCRIPTION + 1);
  const cases = [
    [{ url: "http://example-ui.dev" }, /url is not an https URL/],
    [{ source: "http://github.com/example/ui" }, /source is not an https URL/],
    [{ url: "https://x.com/someone/status/1" }, /not a primary source/],
    [{ url: "https://bit.ly/abc" }, /not a primary source/],
    [{ category: "icons" }, /category icons/],
    [{ license: null }, /license unknown/],
    [{ license: "NOASSERTION" }, /license unknown/],
    [{ license: "MIT + Commons Clause", licenseUrl: undefined }, /non-SPDX license needs licenseUrl/],
    [{ repo: null }, /needs a GitHub repo/],
    [{ lastUpdated: "2025-09-30" }, /older than 12 months/],
    [{ stars: 50 }, /fewer than 1000 stars/],
    [{ archived: true }, /archived/],
    [{ deprecated: true }, /marked deprecated/],
    [{ description: "English only" }, /not Japanese/],
    [{ description: "短い—説明" }, /em dash or a line break/],
    [{ description: long }, new RegExp(`longer than ${MAX_DESCRIPTION}`)],
    [{ description: "@someone が保存した部品" }, /account handle/],
    [{ id: "Example_UI" }, /id must be lower-case kebab/],
  ];
  for (const [patch, re] of cases) assert.ok(has(entryProblems({ ...good, ...patch }, { checkedAt: "2026-10-21" }), re), re.source);
  assert.ok(has(entryProblems({ ...site, publisher: undefined }), /needs a publisher/));
  assert.deepEqual(entryProblems({ ...good, license: "MIT + Commons Clause", licenseUrl: "https://example.com/LICENSE" }, { checkedAt: "2026-10-21" }), []);
});

test("a small repo passes only with a publisher", () => {
  assert.deepEqual(entryProblems({ ...good, stars: 900, publisher: "LottieFiles" }, { checkedAt: "2026-10-21" }), []);
});

test("duplicates by id, url, or repo fail", () => {
  assert.ok(has(datasetProblems(doc([good, { ...good, id: "other", url: "https://www.example-ui.dev/" }])), /duplicate url/));
  assert.ok(has(datasetProblems(doc([good, { ...good, id: "other", url: "https://b.dev", repo: "Example/UI" }])), /duplicate repo/));
  assert.ok(has(datasetProblems(doc([good, { ...good, url: "https://b.dev", repo: "b/b" }])), /duplicate id/));
});

test("url normalization ignores www, case, and a trailing slash", () => {
  assert.equal(normalizeUrl("https://WWW.Example.dev/Docs/"), normalizeUrl("https://example.dev/docs"));
  assert.equal(monthsBefore("2026-10-21", MAX_AGE_MONTHS), "2025-10-21");
});

test("the paste-in format parses, infers the repo, and rejects unknown fields", () => {
  const { candidates, errors } = parseCandidates(
    [
      "# comment",
      "",
      "component-library | https://github.com/a/b | B | 部品",
      "gallery | https://g.example | G | 見本帳 | publisher=Some_Org",
      "loading | https://l.example | L | 読み込み | note=私が保存した",
      "animation | https://a.example | A | 動き | licenseUrl=https://ex.com/foo_bar license=MIT_+_Commons_Clause",
      "only | two",
    ].join("\n"),
  );
  assert.equal(candidates.length, 3);
  assert.equal(candidates[0].repo, "a/b");
  assert.equal(candidates[1].publisher, "Some Org");
  assert.equal(candidates[2].licenseUrl, "https://ex.com/foo_bar");
  assert.equal(candidates[2].license, "MIT + Commons Clause");
  assert.ok(errors.some((e) => /unknown option note=/.test(e)));
  assert.ok(errors.some((e) => /expected/.test(e)));
});

test("live results: moved, missing, renamed, and transient", () => {
  const c = { name: "B", url: "https://b.dev", repo: "a/b" };
  assert.ok(has(liveProblems(c, { live: { status: 200, finalUrl: "https://new.dev/" } }), /moved to/));
  assert.ok(has(liveProblems(c, { live: { status: 404 } }), /answered 404/));
  assert.ok(has(liveProblems(c, { live: { status: 200, finalUrl: "https://b.dev/" }, gh: { full_name: "c/b" } }), /is now c\/b/));
  assert.ok(isTransient("b: url answered 403, expected 200"));
  assert.ok(isTransient("b: url answered 429, expected 200"));
  assert.ok(isTransient("b: url answered 503, expected 200"));
  assert.ok(isTransient("b: url did not load (TimeoutError)"));
  assert.ok(isTransient("b: url did not load (timeout)"));
  assert.ok(isTransient("b: GitHub repo a/b not readable (401)"));
  assert.ok(isTransient("b: GitHub repo a/b not readable (ECONNRESET)"));
  assert.ok(!isTransient("b: url did not load (ENOTFOUND)"));
  assert.ok(!isTransient("b: url did not load (CERT_HAS_EXPIRED)"));
  assert.ok(!isTransient("b: url did not load (ECONNREFUSED)"));
  assert.ok(isTransient("b: GitHub repo a/b not readable (The operation was aborted)"));
  assert.ok(!isTransient("b: url answered 404, expected 200"));
  assert.ok(!isTransient("b: GitHub repo a/b not readable (404)"));
  const lic = { ...c, licenseUrl: "https://b.dev/LICENSE" };
  assert.ok(has(liveProblems(lic, { live: { status: 200 }, licenseLive: { status: 404 } }), /licenseUrl answered 404/));
  assert.ok(!isTransient("b: licenseUrl answered 404, expected 200"));
});

test("buildEntry takes stars, date, and license from GitHub, unless the candidate names the license", () => {
  const gh = { full_name: "a/b", stargazers_count: 1234, pushed_at: "2026-10-01T00:00:00Z", license: { spdx_id: "MIT" }, archived: false, description: "No longer maintained" };
  const e = buildEntry({ name: "B", url: "https://b.dev", category: "animation", description: "動き", repo: "a/b" }, { today: "2026-10-21", gh });
  assert.equal(e.stars, 1234);
  assert.equal(e.lastUpdated, "2026-10-01");
  assert.equal(e.license, "MIT");
  assert.equal(e.deprecated, true);
  const cc = buildEntry({ name: "B", url: "https://b.dev", category: "animation", description: "動き", repo: "a/b", license: "MIT + Commons Clause" }, { today: "2026-10-21", gh });
  assert.equal(cc.license, "MIT + Commons Clause");
  const ja = buildEntry({ name: "見本帳", url: "https://gallery.example/path", category: "gallery", description: "見本帳です", publisher: "G" }, { today: "2026-10-21", gh: null });
  assert.equal(ja.id, "gallery-example-path");
  const ja2 = buildEntry({ name: "見本帳", url: "https://gallery.example/other", category: "gallery", description: "見本帳です", publisher: "G" }, { today: "2026-10-21", gh: null });
  assert.notEqual(ja.id, ja2.id);
});

test("provenance fields fail in the dataset and in the paste-in format", () => {
  assert.deepEqual(PROVENANCE_KEYS, ["via", "source_post", "sourcePost", "bookmark", "bookmarked", "like", "liked", "savedBy", "foundBy", "provenance"]);
  for (const k of PROVENANCE_KEYS) assert.ok(has(entryProblems({ ...good, [k]: "x" }), new RegExp(`provenance field ${k} is not allowed`)), k);
  const data = JSON.parse(readFileSync(join(root, "AwesomeDS/data/sites.json"), "utf8"));
  for (const e of data.sites) for (const k of PROVENANCE_KEYS) assert.ok(!(k in e), `${e.id} has ${k}`);
  const { candidates, errors } = parseCandidates(
    [
      "gallery | https://g.example | G | 見本帳 | via=x",
      "gallery | https://h.example | H | 見本帳 | source_post=https://x.com/a/status/1",
      "gallery | https://i.example | I | 見本帳 | bookmark=yes",
      "gallery | https://j.example | J | 見本帳 | x",
    ].join("\n"),
  );
  assert.equal(candidates.length, 0);
  assert.ok(errors.some((e) => /line 1: provenance field via/.test(e)));
  assert.ok(errors.some((e) => /line 2: provenance field source_post/.test(e)));
  assert.ok(errors.some((e) => /line 3: provenance field bookmark/.test(e)));
  assert.ok(errors.some((e) => /line 4: unknown option x/.test(e)));
  const built = buildEntry({ name: "B", url: "https://b.dev", category: "gallery", description: "見本帳", publisher: "P" }, { today: "2026-10-30", gh: null });
  for (const k of PROVENANCE_KEYS) assert.ok(!(k in built), `buildEntry wrote ${k}`);
});

test("extra fields, a social source, and wrong meta counts fail", () => {
  assert.ok(has(entryProblems({ ...good, note: "someone" }), /unknown field note/));
  assert.ok(has(entryProblems({ ...good, source: "https://t.co/abc" }), /source t\.co is not a primary source/));
  const doc = JSON.parse(readFileSync(join(root, "AwesomeDS/data/sites.json"), "utf8"));
  const c = doc.meta.categories[0];
  assert.ok(has(datasetProblems({ ...doc, meta: { ...doc.meta, counts: { ...doc.meta.counts, [c]: doc.meta.counts[c] + 1 } } }), /meta\.counts/));
});
