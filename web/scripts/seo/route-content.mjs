// Readable no-JS content from the same files the pages already read.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { contentLanguage } from "../../src/seo/titles.mjs";
import { esc, escAttr, mdToHtml, safeUrl } from "./markdown.mjs";
import { publishText } from "./hygiene.mjs";

function section(inner) {
  const value = String(inner ?? "").trim();
  if (!value) return "";
  return `<section data-route-content>${value}</section>`;
}

function list(items) {
  const rows = items.filter(Boolean);
  return rows.length ? `<ul>${rows.join("")}</ul>` : "";
}

/** Same arguments Home.tsx passes. Other functions are left uncalled. */
const CAPTION_ARGS = {
  fontsCaption: (counts) => [counts.fonts, counts.brands],
  palettesCaption: (counts) => [counts.brands],
  stackCaption: (counts) => [counts.stack],
  rankingsCaption: (counts) => [counts.repos],
};

/** Character.tsx calls these with the mascot name. */
const NAME_FIELDS = new Set(["lead", "mascotCaption", "namesLead"]);

function renderField(fn, key, counts, name) {
  try {
    const caption = CAPTION_ARGS[key];
    const value = caption ? fn(...caption(counts)) : NAME_FIELDS.has(key) && name ? fn(name) : undefined;
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}

/** Every string the catalog renders, including fields added after this file. */
export function catalogStrings(value, counts = {}, name = "") {
  const out = [];
  const seen = new Set();
  const visit = (node, key) => {
    if (typeof node === "string") {
      const text = node.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        out.push(text);
      }
      return;
    }
    if (typeof node === "function") {
      visit(renderField(node, key, counts, name));
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const [childKey, item] of Object.entries(node)) {
        if (/[/-]/.test(childKey)) visit(childKey);
        visit(item, childKey);
      }
    }
  };
  visit(value);
  return out;
}

export function stringsBlock(value, counts, name) {
  const items = catalogStrings(value, counts, name).map((text) => `<li>${esc(text)}</li>`);
  return section(list(items));
}

function readJson(repo, name) {
  return JSON.parse(readFileSync(join(repo, "AwesomeDS/data", name), "utf8"));
}

function readAppJson(webRoot, name) {
  return JSON.parse(readFileSync(join(webRoot, "src/ds/data", name), "utf8"));
}

/** Counts Home.tsx passes into the captions. brandCount prefers palettes meta. */
export function datasetCounts(webRoot) {
  const fonts = readAppJson(webRoot, "fonts.json");
  const palettes = readAppJson(webRoot, "palettes.json");
  const stack = readAppJson(webRoot, "stack.json");
  const repos = readAppJson(webRoot, "repos.json");
  return {
    fonts: fonts.fonts.length,
    brands: palettes.meta?.counts?.brand ?? palettes.brand.length,
    stack: stack.layers.length,
    repos: repos.repos.length,
  };
}

export function homeBlock(copy, counts = {}, name = "") {
  return stringsBlock(copy, counts, name);
}

export function sitesBlock(repo) {
  const data = readJson(repo, "sites.json");
  const items = data.sites.map((site) => {
    const url = safeUrl(site.url);
    const name = esc(site.name);
    const label = url ? `<a href="${escAttr(url)}">${name}</a>` : name;
    return `<li>${label}: ${esc(site.description ?? "")}</li>`;
  });
  return section(list(items));
}

export function componentsBlock(webRoot) {
  const source = readFileSync(join(webRoot, "src/ds/registry.tsx"), "utf8");
  const items = [...source.matchAll(/id: "([^"]+)",\n\s*name: "([^"]+)",\n\s*group: "([^"]+)",\n\s*maturity: "([^"]+)"/g)];
  if (items.length < 40) throw new Error(`component catalog parse found ${items.length}`);
  return section(list(items.map((match) => `<li>${esc(match[2])} (${esc(match[1])})</li>`)));
}

export function fontsBlock(repo) {
  const data = readJson(repo, "fonts.json");
  const items = data.fonts.map((font) => {
    const url = safeUrl(font.url);
    const name = esc(font.name);
    const label = url ? `<a href="${escAttr(url)}">${name}</a>` : name;
    return `<li>${label}: ${esc(font.category)}</li>`;
  });
  return section(list(items));
}

export function palettesBlock(repo) {
  const data = readJson(repo, "palettes.json");
  const curated = data.curated.map((palette) => `<li>${esc(palette.name)}: ${esc(palette.use ?? "")}</li>`);
  const brands = data.brand.map((palette) => `<li>${esc(palette.name)}</li>`);
  return section(list([...curated, ...brands]));
}

export function motionBlock(webRoot) {
  const source = readFileSync(join(webRoot, "src/demos/registry.tsx"), "utf8");
  const items = [...source.matchAll(/id: "([^"]+)",\n\s*name: "([^"]+)",\n\s*group: "([^"]+)",\n\s*library: "([^"]+)"/g)];
  if (items.length < 30) throw new Error(`motion catalog parse found ${items.length}`);
  return section(list(items.map((match) => `<li>${esc(match[2])} (${esc(match[4])})</li>`)));
}

export function stackBlock(repo) {
  const data = readJson(repo, "stack.json");
  const items = data.layers.map((layer) => {
    const url = safeUrl(layer.pick?.url);
    const name = esc(layer.pick?.name ?? "");
    const label = url ? `<a href="${escAttr(url)}">${name}</a>` : name;
    const alts = (layer.alternatives ?? []).map((alt) => esc(alt.name)).join(", ");
    return `<li>${esc(layer.layer)}: ${label}. ${esc(layer.pick?.why ?? "")} ${alts}</li>`;
  });
  return section(list(items));
}

export function rankingsBlock(repo) {
  const data = readJson(repo, "repos.json");
  const items = data.repos.map((repoEntry) => {
    const url = safeUrl(repoEntry.url);
    const name = esc(`${repoEntry.owner}/${repoEntry.name}`);
    const label = url ? `<a href="${escAttr(url)}">${name}</a>` : name;
    return `<li>${label}</li>`;
  });
  return section(list(items));
}

export function sourcesBlock(systems, locale) {
  const items = systems.map((system) => {
    const name = locale === "ja" ? system.nameJa || system.name : system.name;
    const description = locale === "ja" ? system.descriptionJa : system.description;
    const takeaway = system.absorption?.takeaway?.[locale] ?? "";
    const url = safeUrl(system.url);
    const label = url ? `<a href="${escAttr(url)}">${esc(name)}</a>` : esc(name);
    return `<li>${label}: ${esc(description)} ${esc(takeaway)}</li>`;
  });
  return section(list(items));
}

function foundationBody(repo, slug) {
  const file = join(repo, "AwesomeDS/foundations", `${slug}.md`);
  if (!existsSync(file)) return "";
  const raw = readFileSync(file, "utf8").replace(/^---[\s\S]*?---\n/, "");
  return publishText(raw.replace(/^#\s+[^\n]*\n/, ""));
}

export function foundationBlock(repo, path) {
  if (path === "/foundations") {
    const dir = join(repo, "AwesomeDS/foundations");
    const items = readdirSync(dir)
      .filter((name) => name.endsWith(".md"))
      .sort()
      .map((name) => {
        const raw = readFileSync(join(dir, name), "utf8");
        const title = /^#\s+(.+)$/m.exec(raw)?.[1] ?? name.replace(/\.md$/, "");
        return `<li>${esc(title)}</li>`;
      });
    return section(`<div lang="en">${list(items)}</div>`);
  }
  const slug = path.startsWith("/foundations/") ? path.slice("/foundations/".length) : "";
  if (!slug || slug.includes("/")) return "";
  const body = foundationBody(repo, slug);
  return body ? section(`<div lang="en">${mdToHtml(body)}</div>`) : "";
}

function knowledgeList(entries, locale) {
  const items = entries
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, locale === "en" ? "en" : "ja"))
    .map((item) => `<li><a href="${escAttr(`${locale === "en" ? "/en" : ""}/knowledge/${item.category}/${item.slug}`)}">${esc(item.title)}</a></li>`);
  return section(list(items));
}

/**
 * Real body for one public route. An empty string means the route is still boilerplate.
 * `messages` is the locale catalog the page component reads.
 */
export function routeExtra({ repo, webRoot, locale, path, entry, entries, messages, systems }) {
  if (entry) {
    return section(`<article lang="${contentLanguage(entry.body)}">${mdToHtml(publishText(entry.body))}</article>`);
  }
  const counts = datasetCounts(webRoot);
  const name = messages.name ?? "";
  if (path === "/") return homeBlock(messages.home, counts, name);
  if (path === "/fonts") return fontsBlock(repo);
  if (path === "/palettes") return palettesBlock(repo);
  if (path === "/motion") return motionBlock(webRoot);
  if (path === "/stack") return stackBlock(repo);
  if (path === "/rankings") return rankingsBlock(repo);
  if (path === "/sites") return sitesBlock(repo);
  if (path === "/components") return componentsBlock(webRoot);
  if (path === "/report") return stringsBlock(messages.report, counts, name);
  if (path === "/slides") return stringsBlock(messages.slides, counts, name);
  if (path === "/anti-slop") return stringsBlock(messages.antiSlop, counts, name);
  if (path === "/sources") return sourcesBlock(systems, locale);
  if (path === "/about") return stringsBlock(messages.about, counts, name);
  if (path === "/character") return stringsBlock(messages.character, counts, name);
  if (path === "/foundations" || path.startsWith("/foundations/")) return foundationBlock(repo, path);
  if (path === "/knowledge") return knowledgeList(entries, locale);
  return "";
}

export function htmlPath(locale, path) {
  const urlPath = path === "/" ? (locale === "en" ? "/en" : "/") : `${locale === "en" ? "/en" : ""}${path}`;
  if (urlPath === "/") return "index.html";
  return `${urlPath.slice(1)}/index.html`;
}

export function visibleText(html) {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** The first catalog lines a built page must contain. Taken from the section just generated. */
export function contentMarkers(sectionHtml, limit = 3) {
  const stats = contentStats(sectionHtml.includes("<section") ? sectionHtml : `<section data-route-content>${sectionHtml}</section>`);
  if (!stats) return [];
  const items = [...stats.body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)]
    .map((match) => visibleText(match[1]))
    .filter((text) => text.length >= 2);
  if (items.length) return items.slice(0, limit);
  const text = visibleText(stats.body);
  return text ? [text.slice(0, 80)] : [];
}

export function pageContentProblems(html, expectedSection) {
  const stats = contentStats(html);
  if (!stats) return ["boilerplate"];
  const seen = visibleText(stats.body);
  return contentMarkers(expectedSection).flatMap((marker) => (seen.includes(marker) ? [] : [`missing ${JSON.stringify(marker)}`]));
}

export function contentStats(html) {
  const section = /<section data-route-content>([\s\S]*?)<\/section>/.exec(html);
  if (!section) return null;
  const body = section[1];
  return {
    body,
    items: (body.match(/<li\b/g) ?? []).length,
    chars: body.replace(/<[^>]+>/g, "").trim().length,
  };
}

export function routeContentProblems(dist, routes, env) {
  const problems = [];
  for (const path of routes) {
    for (const locale of ["ja", "en"]) {
      const rel = htmlPath(locale, path);
      let html = "";
      try {
        html = readFileSync(join(dist, rel), "utf8");
      } catch {
        problems.push(`${rel} is missing`);
        continue;
      }
      const expected = routeExtra({
        repo: env.repo,
        webRoot: env.webRoot,
        locale,
        path,
        entries: env.entries,
        messages: env.messages(locale),
        systems: env.systems,
      });
      if (!expected) {
        problems.push(`${rel} has no catalog`);
        continue;
      }
      for (const item of pageContentProblems(html, expected)) {
        problems.push(item === "boilerplate" ? `${rel} is boilerplate` : `${rel} ${item}`);
      }
    }
  }
  return problems;
}
