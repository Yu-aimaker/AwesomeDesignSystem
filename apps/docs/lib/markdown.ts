import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

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

export async function loadCanonDoc(relPath: string): Promise<CanonDoc | null> {
  const full = path.join(repoRoot, relPath);
  try {
    const md = await readFile(full, "utf8");
    const slug = relPath
      .replace(/^design-system\//, "")
      .replace(/\.md$/, "")
      .replace(/\\/g, "/");
    const domain = slug.split("/")[0] ?? "general";
    const title = titleFromMarkdown(md, slug);
    const html = await marked.parse(md, { gfm: true, breaks: false });
    const excerpt = md
      .replace(/^---[\s\S]*?---/, "")
      .replace(/^#.+$/m, "")
      .replace(/[*_`>#\[\]]/g, "")
      .trim()
      .slice(0, 220);
    return { slug, title, path: relPath, domain, html, excerpt };
  } catch {
    return null;
  }
}

export async function loadAllCanonDocs(): Promise<CanonDoc[]> {
  const files = await listMarkdownFiles("design-system");
  const docs: CanonDoc[] = [];
  for (const file of files) {
    const rel = path.relative(repoRoot, file).replace(/\\/g, "/");
    const doc = await loadCanonDoc(rel);
    if (doc) docs.push(doc);
  }
  return docs;
}

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
): Promise<CanonDoc[]> {
  const cfg = domainRoutes[domain];
  if (!cfg) return [];
  const all = await loadAllCanonDocs();
  return all.filter((d) => cfg.match(d.slug, d.path));
}
