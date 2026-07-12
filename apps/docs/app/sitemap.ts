import type { MetadataRoute } from "next";
import { loadAllCanonDocs } from "../lib/markdown";
import { componentCatalog } from "../lib/components-catalog";
import { motionRecipes } from "@awesome-ds/motion";
import { loadReferenceRecords } from "@awesome-ds/content";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { locales, localizePathname } from "../lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "http://127.0.0.1:3000";
  const paths = ["/", "/principles", "/foundations", "/brand", "/brand/workbench", "/interaction", "/patterns", "/ai-design", "/review", "/components", "/motion", "/references", "/playground", "/status", "/canon"];
  const staticRoutes = locales.flatMap((locale) => paths.map((route) => ({
    url: base + localizePathname(route, locale),
    alternates: { languages: Object.fromEntries(locales.map((lang) => [lang, base + localizePathname(route, lang)])) },
  })));
  const canon = await loadAllCanonDocs();
  const refs = await loadReferenceRecords(path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../content"));
  return [
    ...staticRoutes,
    ...locales.flatMap((locale) => canon.map((d) => ({ url: base + localizePathname("/canon/" + d.slug, locale) }))),
    ...locales.flatMap((locale) => componentCatalog.map((c) => ({ url: base + localizePathname("/components/" + c.slug, locale) }))),
    ...locales.flatMap((locale) => motionRecipes.map((m) => ({ url: base + localizePathname("/motion/" + m.intent, locale) }))),
    ...locales.flatMap((locale) => refs.map((r) => ({ url: base + localizePathname("/references/" + encodeURIComponent(r.id), locale) }))),
  ];
}
