import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { auditHtml, htmlDeclaresNoindex, robotsPolicyProblems } from "./check.mjs";
import { loadEntries, parseAppRoutes } from "./collect.mjs";
import { CSP, renderHeaders } from "./headers.mjs";
import { hygieneProblems, publishText } from "./hygiene.mjs";
import { mdToHtml } from "./markdown.mjs";
import { componentsBlock, foundationBlock, sitesBlock } from "./route-content.mjs";
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

test("no-js fragments include sites, components, and color guidance", () => {
  assert.match(sitesBlock(repoRoot), /shadcn\/ui/);
  assert.match(componentsBlock(webRoot), /Button \(button\)/);
  assert.match(foundationBlock(repoRoot, "/foundations/color"), /Neutrals are true gray/);
});
