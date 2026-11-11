import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { auditHtml, robotsPolicyProblems } from "./check.mjs";
import { loadEntries, parseAppRoutes } from "./collect.mjs";
import { CSP, renderHeaders } from "./headers.mjs";
import { mdToHtml } from "./markdown.mjs";
import { SEARCH, TRAINING, parseGroups, renderRobots, rootRules, starDisallowsAll } from "./robots.mjs";

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

test("html audit rejects noindex", () => {
  const problems = auditHtml('<html lang="ja"><head><title>x</title><meta name="robots" content="noindex"></head><body><h1>x</h1></body></html>');
  assert.ok(problems.some((line) => /noindex/.test(line)));
});
