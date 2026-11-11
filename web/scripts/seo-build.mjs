// Build-time files for crawlers that do not run JavaScript.
// The app stays a Vite SPA. Each public URL also gets a static index.html
// (meta, JSON-LD, and readable text). Cloudflare html_handling
// auto-trailing-slash serves folder/index.html at the slash URL.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { aboutMessages } from "../src/i18n/messages/about.ts";
import { antiSlopMessages } from "../src/i18n/messages/antiSlop.ts";
import { characterMessages } from "../src/i18n/messages/character.ts";
import { homeMessages } from "../src/i18n/messages/home.ts";
import { reportMessages } from "../src/i18n/messages/report.ts";
import { slidesMessages } from "../src/i18n/messages/slides.ts";
import { flagshipSystems } from "../src/lib/design-systems.ts";
import { mascotName } from "../src/mascot/name.ts";
import { OG_IMAGE, ORIGIN, ogAlt, pages } from "../src/seo/pages.ts";
import { excerpt } from "../src/seo/excerpt.ts";
import { absoluteUrl, buildJsonLd } from "../src/seo/structured.ts";
import { contentLanguage, documentTitle, publishedLocales } from "../src/seo/titles.mjs";
import { productionIndexProblems } from "./seo/check.mjs";
import { loadEntries, parseAppRoutes } from "./seo/collect.mjs";
import { publishText } from "./seo/hygiene.mjs";
import { bootstrapScriptHashes, renderHeaders } from "./seo/headers.mjs";
import { renderRobots } from "./seo/robots.mjs";
import { routeContentProblems, routeExtra } from "./seo/route-content.mjs";

const LOCALES = ["ja", "en"];
const PLUGIN = "https://github.com/Yu-aimaker/AwesomeDesignSystem/tree/main/Plugin/awesome-ds";

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escAttr(text) {
  return esc(text).replace(/"/g, "&quot;");
}

function gitDate(repo, file) {
  try {
    const args = ["log", "-1", "--format=%cs"];
    if (file) args.push("--", file);
    const out = execFileSync("git", args, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : "";
  } catch {
    return "";
  }
}

function relHref(locale, path) {
  if (path === "/") return locale === "en" ? "/en" : "/";
  return `${locale === "en" ? "/en" : ""}${path}`;
}

function fileFor(locale, path) {
  const urlPath = path === "/" ? (locale === "en" ? "/en" : "/") : `${locale === "en" ? "/en" : ""}${path}`;
  if (urlPath === "/") return "index.html";
  return `${urlPath.slice(1)}/index.html`;
}

function stripSeo(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<meta\s+name="description"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="robots"[^>]*>/gi, "")
    .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="theme-color"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="alternate"[^>]*>/gi, "")
    .replace(/\s*<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");
}

function themeColors(repo) {
  const css = readFileSync(join(repo, "AwesomeDS", "tokens", "tokens.css"), "utf8");
  const colors = [...css.matchAll(/--ds-canvas:\s*(#[0-9a-fA-F]{3,8})/g)].map((match) => match[1]);
  return { light: colors[0] ?? "#ffffff", dark: colors[1] ?? "#0a0a0a" };
}

function renderPage(template, page) {
  const alternates = [
    ...page.alternates.map((item) => `<link rel="alternate" hreflang="${item.hreflang}" href="${escAttr(item.href)}" data-prerender="true" />`),
    `<link rel="alternate" hreflang="x-default" href="${escAttr(page.xDefault)}" data-prerender="true" />`,
  ].join("\n    ");
  const localeTag = page.htmlLang === "en" ? "en_US" : "ja_JP";
  const altLocale = page.alternates.find((item) => item.hreflang !== page.htmlLang);
  const json = JSON.stringify(page.jsonLd).replace(/</g, "\\u003c");
  const block = [
    `<title>${esc(page.docTitle)}</title>`,
    `<meta name="description" content="${escAttr(page.description)}" />`,
    `<link rel="canonical" href="${escAttr(page.canonical)}" />`,
    alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="AwesomeDS" />`,
    `<meta property="og:locale" content="${localeTag}" />`,
    ...(altLocale ? [`<meta property="og:locale:alternate" content="${altLocale.hreflang === "en" ? "en_US" : "ja_JP"}" />`] : []),
    `<meta property="og:title" content="${escAttr(page.docTitle)}" />`,
    `<meta property="og:description" content="${escAttr(page.description)}" />`,
    `<meta property="og:url" content="${escAttr(page.canonical)}" />`,
    `<meta property="og:image" content="${escAttr(OG_IMAGE)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escAttr(page.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escAttr(page.docTitle)}" />`,
    `<meta name="twitter:description" content="${escAttr(page.description)}" />`,
    `<meta name="twitter:image" content="${escAttr(OG_IMAGE)}" />`,
    `<meta name="theme-color" content="${page.theme.light}" media="(prefers-color-scheme: light)" />`,
    `<meta name="theme-color" content="${page.theme.dark}" media="(prefers-color-scheme: dark)" />`,
    `<script type="application/ld+json" id="seo-jsonld">${json}</script>`,
  ].join("\n    ");
  let html = stripSeo(template).replace(/<html\b[^>]*>/, `<html lang="${page.locale}">`);
  if (!html.includes("</head>")) throw new Error("built index.html has no </head>");
  html = html.replace("</head>", `    ${block}\n  </head>`);
  if (!html.includes('<div id="root"></div>')) throw new Error('built index.html has no <div id="root"></div>');
  html = html.replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
  return html;
}

function catalogsFor(locale) {
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

function pageBody(repo, webRoot, locale, path, copy, entry, entries) {
  const nav = Object.keys(pages)
    .map((key) => `<li><a href="${relHref(locale, key)}">${esc(pages[key][locale].title)}</a></li>`)
    .join("");
  const extra = routeExtra({
    repo,
    webRoot,
    locale,
    path,
    entry,
    entries,
    messages: catalogsFor(locale),
    systems: flagshipSystems,
  });
  const plugin =
    locale === "ja"
      ? `<p><a href="${PLUGIN}">awesome-ds プラグイン</a></p>`
      : `<p><a href="${PLUGIN}">awesome-ds plugin</a></p>`;
  return `<main style="max-width:42rem;margin:2rem auto;padding:0 1.25rem;font-family:sans-serif;line-height:1.6"><h1>${esc(copy.title)}</h1><p>${esc(copy.description)}</p><nav><ul>${nav}</ul></nav>${plugin}${extra}</main>`;
}

function securityTxt() {
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  return [
    "Contact: https://github.com/Yu-aimaker/AwesomeDesignSystem/security/advisories/new",
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: ja, en",
    `Canonical: ${ORIGIN}/.well-known/security.txt`,
    "",
  ].join("\n");
}

function llmsText(records) {
  const lines = [
    "# AwesomeDS",
    "",
    "> 白地、黒文字、アクセント 1 色。AI コーディングエージェント向けデザインシステム。",
    "",
    "AwesomeDS は仕様、実例、出典付きの知見を公開している。正本は GitHub のリポジトリで、このサイトはその内容を読める形で示す。",
    "",
    "検索クローラーと、利用者が起動した取得は許可する。学習専用のクローラーは robots.txt で拒否する。",
    "",
    "## Pages",
    "",
  ];
  for (const record of records.filter((item) => item.locale === "ja" && !item.entry)) {
    lines.push(`- [${record.copy.title}](${record.url}): ${record.description}`);
  }
  lines.push("", "## Plugin", "");
  lines.push(`- [awesome-ds](${PLUGIN}): Claude Code 向けプラグイン。スキル、トークン、監査スクリプト。`);
  lines.push("", "## Optional", "");
  lines.push(`- [English](${absoluteUrl("en", "/")}): The same pages in English.`);
  lines.push(`- [Full text](${ORIGIN}/llms-full.txt): Page descriptions and the knowledge note bodies.`);
  lines.push("");
  return lines.join("\n");
}

function llmsFull(records, entries) {
  const lines = [
    "# AwesomeDS",
    "",
    "Page descriptions for both languages, then the knowledge note bodies.",
    "",
  ];
  for (const record of records.filter((item) => !item.entry)) {
    lines.push(`## ${record.url}`, "", record.docTitle, "", record.description, "");
  }
  lines.push("# Knowledge", "");
  for (const entry of entries) {
    const path = `/knowledge/${entry.category}/${entry.slug}`;
    const lang = contentLanguage(entry.body);
    lines.push(`## ${entry.title}`, "", absoluteUrl(lang, path), "", publishText(entry.body), "");
  }
  return lines.join("\n");
}

function sitemap(records) {
  const byPath = new Map();
  for (const record of records) {
    if (record.canonical !== record.url) continue;
    const group = byPath.get(record.path) ?? [];
    group.push(record);
    byPath.set(record.path, group);
  }
  const urls = [];
  for (const group of byPath.values()) {
    const xDefault = group.find((record) => record.htmlLang === "ja") ?? group[0];
    const links = group
      .map((record) => `    <xhtml:link rel="alternate" hreflang="${record.htmlLang}" href="${xml(record.url)}"/>`)
      .join("\n");
    for (const record of group) {
      urls.push(`  <url>
    <loc>${xml(record.url)}</loc>
    <lastmod>${record.lastmod}</lastmod>
${links}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(xDefault.url)}"/>
  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

function xml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildSeo(webRoot) {
  const repo = resolve(webRoot, "..");
  const dist = join(webRoot, "dist");
  const template = readFileSync(join(dist, "index.html"), "utf8");
  const builtHashes = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (match) => `'sha256-${createHash("sha256").update(match[1]).digest("base64")}'`,
  );
  const sourceHashes = bootstrapScriptHashes();
  if (builtHashes.join(" ") !== sourceHashes.join(" ")) {
    throw new Error("built bootstrap script does not match the CSP hash from web/index.html");
  }
  const theme = themeColors(repo);
  const headDate = gitDate(repo) || "2026-11-11";
  const app = parseAppRoutes(readFileSync(join(webRoot, "src", "App.tsx"), "utf8"));
  const entries = loadEntries(repo);
  const staticPaths = app.pages;
  for (const path of staticPaths) {
    if (!pages[path]) console.warn(`seo: ${path} has no hand-written title; the path is used`);
  }
  const paths = [
    ...staticPaths.map((path) => ({ path, entry: null })),
    ...entries.map((entry) => ({ path: `/knowledge/${entry.category}/${entry.slug}`, entry })),
  ];
  const used = new Map();
  const records = [];
  for (const item of paths) {
    for (const locale of LOCALES) {
      const base = item.entry
        ? { title: item.entry.title, description: excerpt(publishText(item.entry.body)) || item.entry.title }
        : (pages[item.path]?.[locale] ?? {
            title: item.path,
            description: locale === "ja" ? `${item.path}。AwesomeDS のページ。` : `${item.path}. A page on AwesomeDS.`,
          });
      let description = base.description;
      const key = `${locale}:${description}`;
      if (used.has(key)) description = `${description} (${base.title})`;
      else used.set(key, item.path);
      const lastmod = item.entry
        ? /^(\d{4}-\d{2}-\d{2})/.exec(item.entry.updated)?.[1] || gitDate(repo, item.entry.file) || headDate
        : headDate;
      const kind = item.entry ? "knowledge" : "page";
      const langs = publishedLocales(kind, item.entry?.body ?? "");
      const htmlLang = item.entry ? langs[0] : locale;
      const canonical = absoluteUrl(item.entry ? langs[0] : locale, item.path);
      const url = absoluteUrl(locale, item.path);
      records.push({
        locale,
        htmlLang,
        path: item.path,
        entry: item.entry,
        copy: base,
        description,
        docTitle: documentTitle(htmlLang, item.path, base.title, kind),
        url,
        canonical,
        alternates: langs.map((itemLocale) => ({ hreflang: itemLocale, href: absoluteUrl(itemLocale, item.path) })),
        xDefault: absoluteUrl(langs.includes("ja") ? "ja" : langs[0], item.path),
        alt: ogAlt[htmlLang] ?? ogAlt[locale],
        theme,
        lastmod,
        jsonLd: buildJsonLd(htmlLang, item.path, base.title, description),
        body: pageBody(repo, webRoot, locale, item.path, { ...base, description }, item.entry, entries),
      });
    }
  }

  const routeFiles = [];
  const titleOwners = new Map();
  for (const record of records) {
    if (record.canonical !== record.url) continue;
    const key = `${record.htmlLang}\0${record.docTitle}`;
    if (titleOwners.has(key)) {
      throw new Error(`duplicate ${record.htmlLang} title ${JSON.stringify(record.docTitle)} on ${record.url} and ${titleOwners.get(key)}`);
    }
    titleOwners.set(key, record.url);
  }

  for (const record of records) {
    const rel = fileFor(record.locale, record.path);
    const html = renderPage(template, record);
    const target = join(dist, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, html);
    routeFiles.push(rel);
  }

  writeFileSync(join(dist, "robots.txt"), renderRobots());
  writeFileSync(join(dist, "_headers"), renderHeaders());
  writeFileSync(join(dist, "sitemap.xml"), sitemap(records));
  writeFileSync(join(dist, "llms.txt"), llmsText(records));
  writeFileSync(join(dist, "llms-full.txt"), llmsFull(records, entries));
  mkdirSync(join(dist, ".well-known"), { recursive: true });
  writeFileSync(join(dist, ".well-known", "security.txt"), securityTxt());
  const redirects = app.redirects
    .flatMap((rule) => [`${rule.from} ${relHref("ja", rule.to)} 301`, `/en${rule.from} ${relHref("en", rule.to)} 301`])
    .join("\n");
  writeFileSync(join(dist, "_redirects"), `${redirects}\n`);

  const problems = [
    ...routeContentProblems(dist, staticPaths, {
      repo,
      webRoot,
      entries,
      systems: flagshipSystems,
      messages: catalogsFor,
    }),
    ...productionIndexProblems(dist, routeFiles),
  ];
  if (problems.length) {
    console.error(problems.map((line) => `seo: ${line}`).join("\n"));
    process.exit(1);
  }
  console.log(`seo: ${records.length} pages, sitemap, robots.txt, llms.txt, llms-full.txt`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) buildSeo(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
