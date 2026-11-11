import { ORIGIN, pages, type Locale } from "./pages.ts";

/** Canonical URL without a trailing slash, except the site root. Matches drop-trailing-slash. */
export function absoluteUrl(locale: Locale, path: string): string {
  const suffix = path === "/" ? (locale === "en" ? "/en" : "/") : `${locale === "en" ? "/en" : ""}${path}`;
  return new URL(suffix, `${ORIGIN}/`).href;
}

export function buildJsonLd(locale: Locale, path: string, title: string, description: string) {
  const graph: Record<string, unknown>[] = [];
  if (path === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      name: "AwesomeDS",
      url: `${ORIGIN}/`,
      description,
      inLanguage: ["ja", "en"],
    });
    graph.push({
      "@type": "SoftwareSourceCode",
      "@id": `${ORIGIN}/#code`,
      name: "AwesomeDS",
      description,
      url: `${ORIGIN}/`,
      codeRepository: "https://github.com/Yu-aimaker/AwesomeDesignSystem",
      programmingLanguage: "TypeScript",
    });
  }

  const home = locale === "ja" ? "ホーム" : "Home";
  const trail: { name: string; path: string }[] = [{ name: home, path: "/" }];
  if (path !== "/") {
    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "knowledge" && parts.length === 3) {
      trail.push({ name: pages["/knowledge"][locale].title, path: "/knowledge" });
      trail.push({ name: title, path });
    } else {
      let acc = "";
      for (const part of parts) {
        acc += `/${part}`;
        const name = acc === path ? title : (pages[acc]?.[locale].title ?? part);
        trail.push({ name, path: acc });
      }
    }
  }
  if (trail.length > 1) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: trail.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(locale, crumb.path),
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
