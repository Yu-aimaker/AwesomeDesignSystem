import { useEffect } from "react";
import { useLocale } from "../i18n/context";
import { findEntry } from "../lib/knowledge";
import { publishText } from "../../scripts/seo/hygiene.mjs";
import { excerpt } from "./excerpt";
import { OG_IMAGE, ogAlt, pages, type PageCopy } from "./pages";
import { absoluteUrl, buildJsonLd } from "./structured";
import { contentLanguage, documentTitle } from "./titles.mjs";

function normalize(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${CSS.escape(key)}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const missing: Record<"ja" | "en", PageCopy> = {
  ja: { title: "ページが見つかりません", description: "URL が変わったか、削除された可能性があります。" },
  en: { title: "Page not found", description: "The URL may have changed, or the page was removed." },
};

/** Keeps title, description, canonical and social tags aligned after a client navigation. */
export function DocumentHead() {
  const { locale, path } = useLocale();

  useEffect(() => {
    const bare = normalize(path);
    const match = /^\/knowledge\/([^/]+)\/([^/]+)$/.exec(bare);
    const entry = match ? findEntry(match[1], match[2]) : undefined;
    const copy: PageCopy | undefined = entry
      ? { title: entry.title, description: excerpt(publishText(entry.body)) || entry.title }
      : pages[bare]?.[locale];
    const resolved = copy ?? missing[locale];
    const content = entry ? contentLanguage(entry.body) : locale;
    const title = documentTitle(entry ? content : locale, bare, resolved.title, entry ? "knowledge" : "page");
    document.title = title;
    upsertMeta("name", "description", resolved.description);
    const url = copy ? absoluteUrl(entry ? content : locale, bare) : absoluteUrl(locale, "/");
    upsertLink("canonical", url);
    document.querySelectorAll('link[rel="alternate"][data-prerender]').forEach((el) => el.remove());
    const localeTag = content === "en" ? "en_US" : "ja_JP";
    const altLocale = content === "en" ? "ja_JP" : "en_US";
    const alternate = document.head.querySelector('meta[property="og:locale:alternate"]');
    if (entry) alternate?.remove();
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", resolved.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("property", "og:image:alt", ogAlt[content === "en" ? "en" : "ja"]);
    upsertMeta("property", "og:locale", localeTag);
    if (!entry) upsertMeta("property", "og:locale:alternate", altLocale);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "AwesomeDS");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", resolved.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);
    const existing = document.getElementById("seo-jsonld");
    if (!copy) {
      existing?.remove();
      return;
    }
    const script = existing ?? document.createElement("script");
    script.id = "seo-jsonld";
    script.setAttribute("type", "application/ld+json");
    const ldLocale = entry ? (content === "en" ? "en" : "ja") : locale;
    script.textContent = JSON.stringify(buildJsonLd(ldLocale, bare, resolved.title, resolved.description)).replace(/</g, "\\u003c");
    if (!existing) document.head.appendChild(script);
  }, [locale, path]);

  return null;
}
