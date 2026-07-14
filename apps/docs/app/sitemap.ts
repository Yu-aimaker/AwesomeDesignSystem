import type { MetadataRoute } from "next";
import { loadAllCanonDocs } from "../lib/markdown";
import { componentCatalog } from "../lib/components-catalog";
import { motionRecipes } from "@awesome-ds/motion";
import { loadArtifactClaims, loadCanonRules, loadReferenceRecords } from "@awesome-ds/content";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { locales, localizePathname } from "../lib/i18n";
import { getSiteUrl } from "../lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().origin;
  const localizedEntries = (route: string) => locales.map((locale) => ({
    url: base + localizePathname(route, locale),
    alternates: { languages: {
      ...Object.fromEntries(locales.map((language) => [language, base + localizePathname(route, language)])),
      "x-default": base + localizePathname(route, "en"),
    } },
  }));
  const paths = ["/", "/principles", "/foundations", "/brand", "/brand/workbench", "/interaction", "/patterns", "/ai-design", "/review", "/components", "/motion", "/references", "/playground", "/status", "/canon"];
  const staticRoutes = paths.flatMap(localizedEntries);
  const canon = await loadAllCanonDocs();
  const contentRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../content");
  const [refs, rules, artifacts] = await Promise.all([loadReferenceRecords(contentRoot), loadCanonRules(contentRoot), loadArtifactClaims(contentRoot)]);
  return [
    ...staticRoutes,
    ...canon.flatMap((document) => localizedEntries("/canon/" + document.slug)),
    ...componentCatalog.flatMap((component) => localizedEntries("/components/" + component.slug)),
    ...motionRecipes.flatMap((recipe) => localizedEntries("/motion/" + recipe.intent)),
    ...refs.flatMap((reference) => localizedEntries("/references/" + encodeURIComponent(reference.id))),
    ...rules.flatMap((rule) => localizedEntries("/rules/" + encodeURIComponent(rule.id))),
    ...artifacts.flatMap((artifact) => localizedEntries("/artifacts/" + encodeURIComponent(artifact.id))),
  ];
}
