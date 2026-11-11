import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { auditHtml, htmlDeclaresNoindex, robotsPolicyProblems } from "./check.mjs";
import { loadEntries, parseAppRoutes } from "./collect.mjs";
import { CSP, renderHeaders } from "./headers.mjs";
import { hygieneProblems, publishKnowledge, publishText } from "./hygiene.mjs";
import { mdToHtml } from "./markdown.mjs";
import { contentMarkers, contentStats, datasetCounts, pageContentProblems, routeExtra } from "./route-content.mjs";
import { sanitizeKnowledgeRaw } from "./sanitize-raw.mjs";
import { homeMessages } from "../../src/i18n/messages/home.ts";
import { reportMessages } from "../../src/i18n/messages/report.ts";
import { slidesMessages } from "../../src/i18n/messages/slides.ts";
import { antiSlopMessages } from "../../src/i18n/messages/antiSlop.ts";
import { aboutMessages } from "../../src/i18n/messages/about.ts";
import { characterMessages } from "../../src/i18n/messages/character.ts";
import { flagshipSystems } from "../../src/lib/design-systems.ts";
import { mascotName } from "../../src/mascot/name.ts";
import { SEARCH, TRAINING, parseGroups, renderRobots, rootRules, starDisallowsAll } from "./robots.mjs";
import { contentLanguage, documentTitle, publishedLocales } from "../../src/seo/titles.mjs";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = resolve(webRoot, "..");

const MANAGED_DISALLOW = [
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ClaudeBot",
  "Diffbot",
  "Google-Extended",
  "GPTBot",
  "omgili",
  "anthropic-ai",
  "Claude-Web",
  "cohere-ai",
  "MistralAI-Training",
  "meta-externalagent",
  "GoogleOther",
  "Google-CloudVertexBot",
];

test("training crawlers are disallowed and search crawlers are allowed", () => {
  const robots = renderRobots();
  assert.deepEqual(robotsPolicyProblems(robots), []);
  assert.equal(starDisallowsAll(robots), false);
  assert.equal(parseGroups(robots).some((group) => group.agents.includes("*")), false);
  for (const bot of TRAINING) assert.deepEqual(rootRules(robots, bot.agent), ["disallow"]);
  for (const bot of SEARCH) assert.deepEqual(rootRules(robots, bot.agent), ["allow"]);
});

test("search allows do not clash with the managed disallow list", () => {
  const blocked = new Set(MANAGED_DISALLOW.map((name) => name.toLowerCase()));
  for (const bot of SEARCH) assert.equal(blocked.has(bot.agent.toLowerCase()), false, bot.agent);
});

test("a prepended managed block does not create an Allow/Disallow clash", () => {
  const managed = [
    "User-agent: *",
    "Allow: /",
    "",
    ...MANAGED_DISALLOW.flatMap((agent) => [`User-agent: ${agent}`, "Disallow: /", ""]),
    "# END Cloudflare Managed Content",
    "",
  ].join("\n");
  const combined = `${managed}${renderRobots()}`;
  assert.equal(starDisallowsAll(combined), false);
  assert.equal(parseGroups(combined).filter((group) => group.agents.includes("*")).length, 1);
  for (const bot of TRAINING) {
    const rules = rootRules(combined, bot.agent);
    assert.ok(rules.length >= 1, bot.agent);
    assert.ok(rules.every((rule) => rule === "disallow"), `${bot.agent} ${rules.join(",")}`);
  }
  for (const bot of SEARCH) assert.deepEqual(rootRules(combined, bot.agent), ["allow"], bot.agent);
});

test("Perplexity bots are allowed as search fetchers", () => {
  const bots = SEARCH.filter((bot) => bot.agent.startsWith("Perplexity"));
  assert.deepEqual(
    bots.map((bot) => bot.agent),
    ["PerplexityBot", "Perplexity-User"],
  );
  for (const bot of bots) assert.match(bot.doc, /^https:\/\/docs\.perplexity\.ai\//);
});

test("public robots.txt and _headers match the generators", () => {
  assert.equal(readFileSync(join(webRoot, "public", "robots.txt"), "utf8"), renderRobots());
  assert.equal(readFileSync(join(webRoot, "public", "_headers"), "utf8"), renderHeaders());
  const vercel = JSON.parse(readFileSync(join(webRoot, "vercel.json"), "utf8"));
  const headers = vercel.headers[0].headers;
  assert.equal(headers.find((item) => item.key === "Content-Security-Policy").value, CSP);
  assert.equal(headers.find((item) => item.key === "X-Robots-Tag").value, "noindex, nofollow");
});

test("static routes from App.tsx have copy and redirects stay out of the page list", () => {
  const source = readFileSync(join(webRoot, "src", "App.tsx"), "utf8");
  const pagesSrc = readFileSync(join(webRoot, "src", "seo", "pages.ts"), "utf8");
  const { pages, redirects } = parseAppRoutes(source);
  assert.ok(pages.includes("/"));
  assert.ok(pages.includes("/sites"));
  assert.ok(pages.includes("/anti-slop"));
  assert.equal(pages.includes("/animation"), false);
  assert.deepEqual(redirects, [{ from: "/animation", to: "/motion" }]);
  for (const path of pages) assert.ok(pagesSrc.includes(`"${path}":`), path);
});

test("knowledge urls follow the site slug rules", () => {
  const ids = new Set(loadEntries(repoRoot).map((entry) => entry.id));
  assert.ok(ids.has("anti-slop/anti-slop"));
  assert.ok(ids.has("awesomeds/feedback"));
  assert.equal([...ids].some((id) => id.endsWith("/readme")), false);
});

test("markdown escapes raw html", () => {
  const html = mdToHtml("<script>alert(1)</script>\n\nHello");
  assert.equal(html.includes("<script>"), false);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /<p>Hello<\/p>/);
});

test("html audit rejects a robots noindex meta and ignores the word in prose", () => {
  const problems = auditHtml('<html lang="ja"><head><title>x</title><meta name="robots" content="noindex"></head><body><h1>x</h1></body></html>');
  assert.ok(problems.some((line) => /noindex/.test(line)));
  const note = "<html lang=\"ja\"><head><title>x</title></head><body><h1>x</h1><p>preview sends noindex</p></body></html>";
  assert.equal(htmlDeclaresNoindex(note), false);
  assert.deepEqual(auditHtml(note).filter((line) => /noindex/.test(line)), []);
});

test("markdown keeps quotes inside attributes and drops active urls", () => {
  const injected = mdToHtml('[x](https://example.org/"onmouseover="window.pwned=1)');
  assert.equal(injected.includes("onmouseover"), false);
  assert.equal(injected.includes("href="), false);

  const encoded = mdToHtml("[x](java%73cript:alert(1))");
  assert.equal(/javascript/i.test(encoded), false);
  assert.equal(encoded.includes("href="), false);

  const entity = mdToHtml("[x](&#106;avascript:alert(1))");
  assert.equal(/javascript/i.test(entity), false);

  const mixed = mdToHtml("[x](JaVaScRiPt:alert(1))");
  assert.equal(mixed.includes("href="), false);

  const data = mdToHtml("[x](data:text/html,hi)");
  assert.equal(/data:/i.test(data), false);

  const img = mdToHtml("![alt](javascript:alert(1))");
  assert.equal(/src=/i.test(img), false);
  const imgData = mdToHtml("![alt](data:image/svg+xml,x)");
  assert.equal(/src=/i.test(imgData), false);
  const imgOk = mdToHtml("![alt](https://example.com/a.png)");
  assert.match(imgOk, /src="https:\/\/example\.com\/a\.png"/);
  assert.match(imgOk, /alt="alt"/);

  const ok = mdToHtml('[say "hi"](https://example.com/a)');
  assert.match(ok, /href="https:\/\/example\.com\/a"/);
  assert.equal(ok.includes("onmouseover"), false);
  const alt = mdToHtml('![say "hi"](https://example.com/a.png)');
  assert.match(alt, /alt="say &quot;hi&quot;"/);
  assert.match(mdToHtml("[Home](/sites)"), /href="\/sites"/);
  assert.match(mdToHtml("[Mail](mailto:security@example.com)"), /href="mailto:security@example.com"/);
});

test("markdown consumes empty headings and block boundaries", () => {
  const started = Date.now();
  const empty = mdToHtml(`${"# \n".repeat(200)}para\n\n#\n\n## \n`);
  assert.ok(Date.now() - started < 1000);
  assert.match(empty, /<p>para<\/p>/);
  assert.equal(/<h[1-6]>\s*<\/h[1-6]>/.test(empty), false);

  const blocks = mdToHtml("para one\n\n## Title\n\npara two\n\n- item\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n");
  assert.match(blocks, /<p>para one<\/p>/);
  assert.match(blocks, /<h2>Title<\/h2>/);
  assert.match(blocks, /<p>para two<\/p>/);
  assert.match(blocks, /<li>item<\/li>/);
  assert.match(blocks, /<td>1<\/td>/);
});

test("titles are unique per language and untranslated notes have one locale", () => {
  const colorPage = documentTitle("en", "/foundations/color", "Color", "page");
  const colorNote = documentTitle("en", "/knowledge/awesomeds/color", "Color", "knowledge");
  assert.notEqual(colorPage, colorNote);
  const report = documentTitle("ja", "/report", "HTMLレポート", "page");
  const reportNote = documentTitle("ja", "/knowledge/skills/html-report", "HTMLレポート", "knowledge");
  assert.notEqual(report, reportNote);
  const color = readFileSync(join(repoRoot, "AwesomeDS/foundations/color.md"), "utf8");
  const yomiyasu = readFileSync(join(repoRoot, "Knowledge/anti-slop/yomiyasu.md"), "utf8");
  assert.equal(contentLanguage(color), "en");
  assert.deepEqual(publishedLocales("knowledge", color), ["en"]);
  assert.equal(contentLanguage(yomiyasu), "ja");
  assert.deepEqual(publishedLocales("knowledge", yomiyasu), ["ja"]);
  assert.deepEqual(publishedLocales("page", ""), ["ja", "en"]);
});

test("export drops status urls and the artifact check catches leaks", () => {
  const dirty = "see https://x.com/foo/status/123 and https://twitter.com/bar/status/99 now";
  const clean = publishText(dirty);
  assert.equal(/status\/\d+/.test(clean), false);
  assert.match(clean, /see/);
  assert.ok(hygieneProblems(dirty, "note").some((line) => /status URL/.test(line)));
  assert.deepEqual(hygieneProblems(clean, "note"), []);
  assert.deepEqual(hygieneProblems("Pyramid / Funnel is a category", "note"), []);
  assert.ok(hygieneProblems("internal Jarvis name", "note").length > 0);
  assert.ok(hygieneProblems("bare Funnel", "note").some((line) => /Funnel/.test(line)));
  assert.ok(hygieneProblems("writer@gmail.com", "note").some((line) => /email/.test(line)));
  assert.deepEqual(hygieneProblems("sales@primeradiant.com", "note"), []);
  assert.deepEqual(hygieneProblems("name@example.com", "note"), []);
});

function catalogs(locale) {
  return {
    home: homeMessages[locale],
    report: reportMessages[locale],
    slides: slidesMessages[locale],
    antiSlop: antiSlopMessages[locale],
    about: aboutMessages[locale],
    character: characterMessages[locale],
    name: mascotName[locale],
  };
}

test("every public route renders its own catalog, not the shared boilerplate", () => {
  const source = readFileSync(join(webRoot, "src", "App.tsx"), "utf8");
  const { pages } = parseAppRoutes(source);
  const entries = loadEntries(repoRoot);
  for (const locale of ["ja", "en"]) {
    for (const path of pages) {
      const html = routeExtra({
        repo: repoRoot,
        webRoot,
        locale,
        path,
        entries,
        messages: catalogs(locale),
        systems: flagshipSystems,
      });
      const stats = contentStats(`<html>${html}</html>`);
      assert.ok(stats, `${locale} ${path} is boilerplate`);
      assert.ok(stats.items >= 3 || stats.chars >= 80, `${locale} ${path} has ${stats.items} entries`);
    }
  }
});

test("home export includes every string field, including fields added later", () => {
  const html = routeExtra({
    repo: repoRoot,
    webRoot,
    locale: "ja",
    path: "/",
    entries: [],
    messages: {
      ...catalogs("ja"),
      home: { ...homeMessages.ja, purpose: "Modern Web Guidance より広く、深く、新しい作法を持つ。" },
    },
    systems: flagshipSystems,
  });
  assert.match(html, /白地、黒文字、アクセント 1 色。AI が書く UI の既定値。/);
  assert.match(html, /Modern Web Guidance より広く、深く、新しい作法を持つ。/);
});

function homeHtml(locale) {
  return routeExtra({
    repo: repoRoot,
    webRoot,
    locale,
    path: "/",
    entries: [],
    messages: catalogs(locale),
    systems: flagshipSystems,
  });
}

test("home captions use each catalog count", () => {
  const counts = datasetCounts(webRoot);
  const fonts = JSON.parse(readFileSync(join(webRoot, "src/ds/data/fonts.json"), "utf8"));
  const palettes = JSON.parse(readFileSync(join(webRoot, "src/ds/data/palettes.json"), "utf8"));
  const stack = JSON.parse(readFileSync(join(webRoot, "src/ds/data/stack.json"), "utf8"));
  const repos = JSON.parse(readFileSync(join(webRoot, "src/ds/data/repos.json"), "utf8"));
  assert.equal(counts.fonts, fonts.fonts.length);
  assert.equal(counts.brands, palettes.meta.counts.brand);
  assert.equal(counts.stack, stack.layers.length);
  assert.equal(counts.repos, repos.repos.length);
  const ja = homeHtml("ja");
  const en = homeHtml("en");
  assert.match(ja, new RegExp(`${counts.fonts} 書体。使用数は ${counts.brands} 社から実測`));
  assert.match(ja, new RegExp(`${counts.brands} 社の実測配色`));
  assert.match(ja, new RegExp(`${counts.stack} 層`));
  assert.match(ja, new RegExp(`${counts.repos} の OSS`));
  assert.match(en, new RegExp(`${counts.fonts} typefaces\\. Usage measured across ${counts.brands} brands`));
  assert.match(en, new RegExp(`Measured colors from ${counts.brands} brands`));
  assert.match(en, new RegExp(`${counts.stack} layers`));
  assert.match(en, new RegExp(`${counts.repos} open source projects`));
});

test("character status lines are not filled with the font count", () => {
  const counts = datasetCounts(webRoot);
  const html = routeExtra({
    repo: repoRoot,
    webRoot,
    locale: "ja",
    path: "/character",
    entries: [],
    messages: catalogs("ja"),
    systems: flagshipSystems,
  });
  assert.equal(html.includes(`${counts.fonts}を再生中`), false);
  assert.match(html, /エースは AwesomeDS のアイコンから描いたマスコットです/);
});

test("removing the route section is boilerplate", () => {
  const section = routeExtra({
    repo: repoRoot,
    webRoot,
    locale: "ja",
    path: "/fonts",
    entries: [],
    messages: catalogs("ja"),
    systems: flagshipSystems,
  });
  const page = `<html><nav><a>Fonts</a></nav>${section}</html>`;
  assert.deepEqual(pageContentProblems(page, section), []);
  const stripped = page.replace(/<section data-route-content>[\s\S]*?<\/section>/, "");
  assert.deepEqual(pageContentProblems(stripped, section), ["boilerplate"]);
});

test("guard markers are the current catalog titles", () => {
  const repos = JSON.parse(readFileSync(join(repoRoot, "AwesomeDS/data/repos.json"), "utf8"));
  const html = routeExtra({
    repo: repoRoot,
    webRoot,
    locale: "ja",
    path: "/rankings",
    entries: [],
    messages: catalogs("ja"),
    systems: flagshipSystems,
  });
  const names = repos.repos.slice(0, 3).map((repo) => `${repo.owner}/${repo.name}`);
  const markers = contentMarkers(html);
  for (const name of names) assert.ok(markers.some((marker) => marker.includes(name)), name);
  const first = names[0];
  const stale = html.replaceAll(first, "removed-from-catalog");
  const problems = pageContentProblems(`<html>${stale}</html>`, html);
  assert.ok(problems.some((line) => line.includes(first)));
});

function sourceUrls(markdown) {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown)?.[1] ?? "";
  return [...front.matchAll(/^\s*- url:\s*(.+?)\s*$/gm)].map((match) => match[1].replace(/^["']|["']$/g, ""));
}

test("publishKnowledge keeps the eight non-status sources", () => {
  const file = join(repoRoot, "Knowledge/skills/neropursue-x-post.md");
  const raw = readFileSync(file, "utf8");
  const before = sourceUrls(raw);
  assert.equal(before.length, 10);
  assert.equal(before.filter((url) => /\/status\/\d+/.test(url)).length, 2);
  const published = publishKnowledge(raw);
  const kept = sourceUrls(published);
  assert.equal(kept.length, 8);
  assert.deepEqual(kept, before.filter((url) => !/\/status\/\d+/.test(url)));
  assert.equal(/https?:\/\/(?:www\.)?(?:(?:x|twitter)\.com|api\.fxtwitter\.com)\/\S*\/status\/\d+/.test(published), false);
  for (const heading of ["## 概要", "## 要点", "## 具体的な値・ルール（あれば）", "## AwesomeDS への反映", "## 出典"]) {
    assert.match(published, new RegExp(heading.replace(/[()]/g, "\\$&")));
  }
  assert.match(published, /https:\/\/www\.originkit\.dev\//);

  const between = `---
title: mixed
sources:
  - url: https://example.com/a
    title: A
  - url: https://x.com/foo/status/1
    title: Status between
  - url: https://example.com/b
    title: B
  - url: https://twitter.com/bar/status/2
    title: Second status
  - url: https://example.com/c
    title: C
---

See https://x.com/foo/status/99 and https://example.com/a.
`;
  const mixed = publishKnowledge(between);
  assert.deepEqual(sourceUrls(mixed), ["https://example.com/a", "https://example.com/b", "https://example.com/c"]);
  assert.match(mixed, /title: A/);
  assert.match(mixed, /title: B/);
  assert.match(mixed, /title: C/);
  assert.equal(mixed.includes("Status between"), false);
  assert.match(mixed, /See  and https:\/\/example.com\/a\./);
  assert.equal(/status\/\d+/.test(mixed), false);

  for (const name of ["component-libraries/magic-ui-and-aceternity.md", "skills/diagram-design.md"]) {
    const note = readFileSync(join(repoRoot, "Knowledge", name), "utf8");
    assert.deepEqual(sourceUrls(publishKnowledge(note)), sourceUrls(note));
  }
});

test("knowledge raw modules drop status urls and the repo file keeps them", () => {
  const file = join(repoRoot, "Knowledge/skills/neropursue-x-post.md");
  const raw = readFileSync(file, "utf8");
  assert.match(raw, /https:\/\/x\.com\/neropursue\/status\/2089263766428950683/);
  const published = publishKnowledge(raw);
  assert.equal(sourceUrls(published).length, 8);
  assert.equal(/https?:\/\/(?:www\.)?(?:(?:x|twitter)\.com|api\.fxtwitter\.com)\/\S*\/status\/\d+/.test(published), false);
  const loaded = sanitizeKnowledgeRaw().load(`${file}?raw`);
  assert.equal(loaded.includes("x.com/neropursue/status/"), false);
  assert.equal(loaded.includes("api.fxtwitter.com/neropursue/status/"), false);
  assert.equal(loaded.includes("https://www.originkit.dev/"), true);
  assert.equal(sanitizeKnowledgeRaw().load(`${file}?url`), null);
  const js = 'const src = "https://x.com/neropursue/status/2089263766428950683";';
  assert.ok(hygieneProblems(js, "assets/index.js").some((line) => /status URL/.test(line)));
  assert.deepEqual(hygieneProblems(published, "note"), []);
});
