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

function invokeCopy(fn, counts, name) {
  const arity = fn.length;
  try {
    if (arity <= 0) {
      const value = fn();
      return typeof value === "string" ? value : "";
    }
    const src = Function.prototype.toString.call(fn);
    const wantsName = /\bname\b/.test(src);
    const nums = [counts.fonts, counts.brands, counts.stack, counts.repos];
    const args = wantsName ? Array.from({ length: arity }, () => name) : nums.slice(0, arity);
    const value = fn(...args);
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}

/** Every string the catalog renders, including fields added after this file. */
export function catalogStrings(value, counts = {}, name = "") {
  const out = [];
  const seen = new Set();
  const visit = (node) => {
    if (typeof node === "string") {
      const text = node.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        out.push(text);
      }
      return;
    }
    if (typeof node === "function") {
      visit(invokeCopy(node, counts, name));
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, item] of Object.entries(node)) {
        if (/[/-]/.test(key)) visit(key);
        visit(item);
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

export function datasetCounts(repo) {
  const fonts = readJson(repo, "fonts.json");
  const palettes = readJson(repo, "palettes.json");
  const stack = readJson(repo, "stack.json");
  const repos = readJson(repo, "repos.json");
  return {
    fonts: fonts.fonts.length,
    brands: palettes.brand.length,
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
  const counts = datasetCounts(repo);
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

/** Floors that mark a page as real catalog content rather than the shared nav. */
export function contentFloor(path) {
  const floors = {
    "/": { items: 12, phrase: { ja: "白地、黒文字、アクセント 1 色。AI が書く UI の既定値。", en: "White canvas, black ink, one accent. The defaults for UI that AI writes." } },
    "/fonts": { items: 30, phrase: { ja: "Geist", en: "Geist" } },
    "/palettes": { items: 20, phrase: { ja: "Airbnb", en: "Airbnb" } },
    "/motion": { items: 30, phrase: { ja: "SplitTextReveal", en: "SplitTextReveal" } },
    "/stack": { items: 20, phrase: { ja: "TypeScript", en: "TypeScript" } },
    "/rankings": { items: 40, phrase: { ja: "system-design-primer", en: "system-design-primer" } },
    "/sites": { items: 40, phrase: { ja: "shadcn/ui", en: "shadcn/ui" } },
    "/components": { items: 40, phrase: { ja: "Button (button)", en: "Button (button)" } },
    "/report": { items: 8, phrase: { ja: "/awesome-ds:html-report", en: "/awesome-ds:html-report" } },
    "/slides": { items: 8, phrase: { ja: "1枚に主張は1つ", en: "One claim per slide" } },
    "/anti-slop": { items: 15, phrase: { ja: "紫から青のグラデーション", en: "Purple-to-blue gradient" } },
    "/sources": { items: 15, phrase: { ja: "Material Design 3", en: "Material Design 3" } },
    "/about": { items: 8, phrase: { ja: "AwesomeDS/", en: "AwesomeDS/" } },
    "/character": { items: 10, phrase: { ja: "エース", en: "Ace" } },
    "/knowledge": { items: 20 },
    "/foundations": { items: 10 },
  };
  if (floors[path]) return floors[path];
  if (path.startsWith("/foundations/")) return { chars: 400, phrase: path === "/foundations/color" ? { ja: "Neutrals are true gray", en: "Neutrals are true gray" } : undefined };
  return { items: 3, chars: 80 };
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

export function routeContentProblems(dist, routes) {
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
      const stats = contentStats(html);
      const floor = contentFloor(path);
      if (!stats) {
        problems.push(`${rel} is boilerplate`);
        continue;
      }
      const enoughItems = floor.items == null || stats.items >= floor.items;
      const enoughText = floor.chars == null || stats.chars >= floor.chars;
      if (floor.items != null && floor.chars != null) {
        if (!enoughItems && !enoughText) problems.push(`${rel} has ${stats.items} entries`);
      } else if (!enoughItems || !enoughText) {
        problems.push(`${rel} has ${stats.items} entries / ${stats.chars} chars`);
      }
      const phrase = floor.phrase?.[locale];
      if (phrase && !stats.body.includes(phrase)) problems.push(`${rel} missing ${JSON.stringify(phrase)}`);
    }
  }
  return problems;
}
