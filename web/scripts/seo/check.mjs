import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { hygieneProblems } from "./hygiene.mjs";
import { agentRule, parseGroups, starDisallowsAll, TRAINING, SEARCH } from "./robots.mjs";

const TEXT_EXT = new Set([".html", ".txt", ".xml"]);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, acc);
    else acc.push(path);
  }
  return acc;
}

/** A robots meta tag. Prose that mentions noindex is not a directive. */
export function htmlDeclaresNoindex(html) {
  const tags = String(html).match(/<meta\b[^>]*>/gi) ?? [];
  return tags.some((tag) => /\b(?:name|http-equiv)\s*=\s*["']robots["']/i.test(tag) && /noindex/i.test(tag));
}

export function headersDeclareNoindex(text) {
  return /(?:^|\n)[^\n]*x-robots-tag:[^\n]*noindex/i.test(text);
}

export function auditHtml(html) {
  const problems = [];
  if (htmlDeclaresNoindex(html)) problems.push("contains noindex");
  const lang = /<html\s+lang="([^"]+)"/i.exec(html)?.[1];
  if (lang !== "ja" && lang !== "en") problems.push(`html lang is ${JSON.stringify(lang ?? null)}`);
  const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
  if (!title) problems.push("missing title");
  const description = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(html)?.[1];
  if (!description) problems.push("missing description");
  const canonical = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(html)?.[1];
  if (!canonical || !canonical.startsWith("https://awesomeds.yumaker.studio")) {
    problems.push(`canonical ${JSON.stringify(canonical ?? null)}`);
  }
  for (const key of ["og:title", "og:description", "og:url", "og:image", "og:type"]) {
    const value = new RegExp(`<meta\\s+property="${key}"\\s+content="([^"]*)"`, "i").exec(html)?.[1];
    if (!value) problems.push(`missing ${key}`);
  }
  const card = /<meta\s+name="twitter:card"\s+content="([^"]*)"/i.exec(html)?.[1];
  if (card !== "summary_large_image") problems.push(`twitter:card ${JSON.stringify(card ?? null)}`);
  for (const key of ["twitter:title", "twitter:description", "twitter:image"]) {
    const value = new RegExp(`<meta\\s+name="${key}"\\s+content="([^"]*)"`, "i").exec(html)?.[1];
    if (!value) problems.push(`missing ${key}`);
  }
  if (!/<meta\s+name="theme-color"/i.test(html)) problems.push("missing theme-color");
  if (!/<h1>/.test(html)) problems.push("missing readable h1");
  const blocks = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!blocks.length) problems.push("missing JSON-LD");
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1]);
      if (data["@context"] !== "https://schema.org") problems.push("JSON-LD @context");
      const nodes = data["@graph"] ?? [data];
      if (!Array.isArray(nodes) || !nodes.some((node) => node && node["@type"])) problems.push("JSON-LD @type");
    } catch (error) {
      problems.push(`JSON-LD parse: ${error.message}`);
    }
  }
  const image = /<meta\s+property="og:image"\s+content="([^"]*)"/i.exec(html)?.[1];
  if (image && !image.startsWith("https://awesomeds.yumaker.studio/")) problems.push(`og:image ${image}`);
  return problems;
}

export function robotsPolicyProblems(text) {
  const problems = [];
  if (/noindex/i.test(text)) problems.push("robots.txt contains noindex");
  if (starDisallowsAll(text)) problems.push("robots.txt Disallow: / applies to User-agent: *");
  if (parseGroups(text).some((group) => group.agents.includes("*"))) {
    problems.push("robots.txt must not add a User-agent: * group");
  }
  for (const bot of TRAINING) {
    const rule = agentRule(text, bot.agent);
    if (rule !== "disallow") problems.push(`${bot.agent} should be Disallow: / (got ${rule})`);
  }
  for (const bot of SEARCH) {
    const rule = agentRule(text, bot.agent);
    if (rule !== "allow") problems.push(`${bot.agent} should be Allow: / (got ${rule})`);
  }
  if (!/^Sitemap:\s+https:\/\/awesomeds\.yumaker\.studio\/sitemap\.xml\s*$/m.test(text)) {
    problems.push("robots.txt missing Sitemap");
  }
  return problems;
}

/**
 * Fail the build when production output asks crawlers to stay away,
 * or when a page is missing the tags a no-JS crawler needs.
 * @param {string} dist
 * @param {string[]} [routeFiles] paths relative to dist that must exist
 */
export function productionIndexProblems(dist, routeFiles = []) {
  const problems = [];
  let headers = "";
  let robots = "";
  try {
    headers = readFileSync(join(dist, "_headers"), "utf8");
  } catch {
    problems.push("dist/_headers is missing");
  }
  if (headersDeclareNoindex(headers)) problems.push("dist/_headers contains noindex");
  try {
    robots = readFileSync(join(dist, "robots.txt"), "utf8");
  } catch {
    problems.push("dist/robots.txt is missing");
  }
  if (robots) problems.push(...robotsPolicyProblems(robots));
  for (const name of ["sitemap.xml", "llms.txt", "llms-full.txt"]) {
    try {
      const text = readFileSync(join(dist, name), "utf8");
      if (!text.trim()) problems.push(`dist/${name} is empty`);
    } catch {
      problems.push(`dist/${name} is missing`);
    }
  }
  const seen = new Set();
  let files = [];
  try {
    files = walk(dist);
  } catch {
    problems.push("dist/ is missing");
  }
  for (const file of files) {
    const rel = relative(dist, file);
    const base = rel.split(/[/\\]/).pop() ?? "";
    const ext = base.includes(".") ? base.slice(base.lastIndexOf(".")) : "";
    const interesting = TEXT_EXT.has(ext) || base === "_headers" || base === "_redirects";
    if (!interesting) continue;
    const text = readFileSync(file, "utf8");
    if (base === "_headers" && headersDeclareNoindex(text)) problems.push(`${rel} contains noindex`);
    if (ext === ".html" && htmlDeclaresNoindex(text)) problems.push(`${rel} contains noindex`);
    if (ext === ".html" || base === "llms.txt" || base === "llms-full.txt") {
      problems.push(...hygieneProblems(text, rel));
    }
    if (ext === ".html") {
      seen.add(rel.split(/[/\\]/).join("/"));
      for (const item of auditHtml(text)) problems.push(`${rel}: ${item}`);
    }
  }
  for (const rel of routeFiles) {
    if (!seen.has(rel)) problems.push(`missing built HTML ${rel}`);
  }
  return problems;
}
