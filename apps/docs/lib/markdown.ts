import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { cache } from "react";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const canonRoot = path.join(repoRoot, "design-system");

function resolveCanonFile(relPath: string): string {
  const full = path.resolve(repoRoot, relPath);
  const relative = path.relative(canonRoot, full);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Canon path escapes design-system: ${relPath}`);
  }
  return full;
}

const markdownSanitizer: sanitizeHtml.IOptions = {
  allowedTags: [
    "a", "blockquote", "br", "code", "del", "details", "div", "em",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "kbd", "li",
    "ol", "p", "pre", "s", "span", "strong", "summary", "table", "tbody",
    "td", "th", "thead", "tr", "ul",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    code: ["class"],
    div: ["class"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    span: ["class"],
    td: ["align"],
    th: ["align"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
};

function splitFrontmatter(markdown: string): { body: string; metadata: Record<string, string> } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { metadata: {}, body: markdown };
  const metadata: Record<string, string> = {};
  for (const [index, line] of (match[1] ?? "").split(/\r?\n/).entries()) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*?)\s*$/);
    if (!field?.[1]) throw new Error(`Invalid Canon frontmatter at line ${index + 2}`);
    if (["__proto__", "constructor", "prototype"].includes(field[1])) throw new Error(`Unsafe Canon frontmatter key: ${field[1]}`);
    metadata[field[1]] = (field[2] ?? "").replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
  }
  return { metadata, body: markdown.slice(match[0].length) };
}

type RenderCanonOptions = { relPath?: string; locale?: "en" | "ja" };

function resolveCanonHref(href: string, relPath: string, locale: "en" | "ja"): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(href)) return href;
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] ?? href;
  const suffix = match?.[2] ?? "";
  if (!pathname.toLowerCase().endsWith(".md")) return href;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(relPath), pathname));
  if (!resolved.startsWith("design-system/") || resolved.includes("../")) {
    throw new Error(`Canon link escapes design-system: ${href} from ${relPath}`);
  }
  const slug = resolved.slice("design-system/".length).replace(/\.md$/i, "");
  return `/${locale}/canon/${slug}${suffix}`;
}

export function renderCanonMarkdown(markdown: string, options: RenderCanonOptions = {}): string {
  const { body } = splitFrontmatter(markdown);
  const relPath = options.relPath ?? "design-system/index.md";
  const locale = options.locale ?? "en";
  const parser = new Marked({
    gfm: true,
    breaks: false,
    walkTokens(token) {
      if (token.type === "link") token.href = resolveCanonHref(token.href, relPath, locale);
    },
  });
  const rendered = parser.parse(body);
  if (typeof rendered !== "string") {
    throw new TypeError("Canon Markdown must render synchronously");
  }
  return sanitizeHtml(rendered, markdownSanitizer);
}

export function getRepoRoot() {
  return repoRoot;
}

export type CanonDoc = {
  slug: string;
  title: string;
  path: string;
  domain: string;
  html: string;
  excerpt: string;
  metadata: Record<string, string>;
};

function titleFromMarkdown(md: string, fallback: string): string {
  const h1 = md.match(/^#\s+(.+)$/m);
  if (h1?.[1]) return h1[1].replace(/["`]/g, "").trim();
  const fm = md.match(/^title:\s*["']?([^"'\n]+)/m);
  if (fm?.[1]) return fm[1].trim();
  return fallback;
}

export async function listMarkdownFiles(
  relDir = "design-system",
): Promise<string[]> {
  const base = path.join(repoRoot, relDir);
  const out: string[] = [];
  async function walk(dir: string) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith(".md")) out.push(full);
    }
  }
  await walk(base);
  return out.sort();
}

export async function loadCanonDoc(relPath: string, locale: "en" | "ja" = "en"): Promise<CanonDoc | null> {
  const full = resolveCanonFile(relPath);
  try {
    const md = await readFile(full, "utf8");
    const slug = relPath
      .replace(/^design-system\//, "")
      .replace(/\.md$/, "")
      .replace(/\\/g, "/");
    const domain = slug.split("/")[0] ?? "general";
    const { body, metadata } = splitFrontmatter(md);
    const title = metadata.title || titleFromMarkdown(body, slug);
    const html = renderCanonMarkdown(body, { relPath, locale });
    const excerpt = body
      .replace(/^#.+$/m, "")
      .replace(/[*_`>#\[\]]/g, "")
      .trim()
      .slice(0, 220);
    return { slug, title, path: relPath, domain, html, excerpt, metadata };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}

export const loadAllCanonDocs = cache(async function loadAllCanonDocs(locale: "en" | "ja" = "en"): Promise<CanonDoc[]> {
  const files = await listMarkdownFiles("design-system");
  const docs: CanonDoc[] = [];
  for (const file of files) {
    const rel = path.relative(repoRoot, file).replace(/\\/g, "/");
    const doc = await loadCanonDoc(rel, locale);
    if (doc) docs.push(doc);
  }
  if (docs.length !== files.length) {
    throw new Error(`Canon loader returned ${docs.length} documents for ${files.length} Markdown files`);
  }
  return docs;
});

type DomainRoute = {
  title: string;
  match: (slug: string, path: string) => boolean;
};

export const domainRoutes = {
  principles: {
    title: "Principles",
    match: (slug, p) =>
      slug.startsWith("00-philosophy/") || p.endsWith("best-practice-design-for-ai.md"),
  },
  foundations: {
    title: "Foundations",
    match: (slug) => slug.startsWith("foundations/"),
  },
  brand: {
    title: "Brand",
    match: (slug) => slug.startsWith("brand/"),
  },
  interaction: {
    title: "Interaction",
    match: (slug) => slug.startsWith("interaction/"),
  },
  patterns: {
    title: "Patterns",
    match: (slug) => slug.startsWith("patterns/"),
  },
  "ai-design": {
    title: "AI Design",
    match: (slug) => slug.startsWith("ai-driven/"),
  },
  review: {
    title: "Review",
    match: (slug) => slug.startsWith("review/"),
  },
  motion: {
    title: "Motion (canon)",
    match: (slug) => slug.startsWith("motion/"),
  },
  accessibility: {
    title: "Accessibility",
    match: (slug) => slug.startsWith("accessibility/"),
  },
  "case-studies": {
    title: "Case studies",
    match: (slug) => slug.startsWith("case-studies/"),
  },
} as const satisfies Record<string, DomainRoute>;

export async function docsForDomain(
  domain: keyof typeof domainRoutes,
  locale: "en" | "ja" = "en",
): Promise<CanonDoc[]> {
  const cfg = domainRoutes[domain];
  if (!cfg) return [];
  const all = await loadAllCanonDocs(locale);
  return all.filter((d) => cfg.match(d.slug, d.path));
}
