import { parseFrontmatter, type Frontmatter } from "./frontmatter";

export interface Source {
  url: string;
  title: string;
}

export interface Entry {
  /** Stable id: `${category}/${slug}` */
  id: string;
  category: string;
  categoryLabel: string;
  slug: string;
  title: string;
  type: string;
  tags: string[];
  updated: string;
  sources: Source[];
  body: string;
  /** "knowledge" for Knowledge/, "awesomeds" for AwesomeDS/foundations/ */
  origin: "knowledge" | "awesomeds";
  path: string;
}

// Vite resolves these at build time. Paths are relative to this file
// (web/src/lib), so ../../../ is the repository root.
const knowledgeFiles = import.meta.glob("../../../Knowledge/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const foundationFiles = import.meta.glob("../../../AwesomeDS/foundations/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const AWESOMEDS_CATEGORY = "awesomeds";
export const AWESOMEDS_LABEL = "AwesomeDS 解説";

const categoryLabels: Record<string, string> = {
  [AWESOMEDS_CATEGORY]: AWESOMEDS_LABEL,
  typography: "タイポグラフィ",
  color: "カラー",
  spacing: "スペーシング",
  layout: "レイアウト",
  radius: "角丸",
  elevation: "エレベーション",
  motion: "モーション",
  animation: "アニメーション",
  components: "コンポーネント",
  accessibility: "アクセシビリティ",
  "design-systems": "デザインシステム",
  tools: "ツール",
  research: "リサーチ",
  japanese: "日本語組版",
  ux: "UX",
  brand: "ブランド",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9぀-ヿ一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "") || "entry";
}

export function labelFor(category: string): string {
  return categoryLabels[category] ?? category;
}

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => asString(x)).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function asSources(v: unknown): Source[] {
  if (!Array.isArray(v)) return [];
  const out: Source[] = [];
  for (const item of v) {
    if (typeof item === "string") {
      if (/^https?:\/\//.test(item)) out.push({ url: item, title: item });
    } else if (item && typeof item === "object") {
      const rec = item as Record<string, unknown>;
      const url = asString(rec.url);
      if (url) out.push({ url, title: asString(rec.title, url) });
    }
  }
  return out;
}

function firstHeading(body: string): string | undefined {
  const m = /^#\s+(.+)$/m.exec(body);
  return m?.[1].trim();
}

function build(path: string, raw: string, origin: Entry["origin"]): Entry | null {
  let parsed: { data: Frontmatter; content: string };
  try {
    parsed = parseFrontmatter(raw);
  } catch {
    parsed = { data: {}, content: raw };
  }
  const { data, content } = parsed;
  const segments = path.split("/");
  const file = segments[segments.length - 1] ?? "";
  const fileSlug = file.replace(/\.md$/i, "");
  if (fileSlug.toLowerCase() === "readme" && origin === "knowledge") return null;

  const folder = origin === "awesomeds" ? AWESOMEDS_CATEGORY : segments[segments.length - 2];
  const category =
    origin === "awesomeds"
      ? AWESOMEDS_CATEGORY
      : slugify(asString(data.category, folder && folder !== "Knowledge" ? folder : "general"));
  const slug = slugify(fileSlug);
  const title = asString(data.title) || firstHeading(content) || fileSlug;

  return {
    id: `${category}/${slug}`,
    category,
    categoryLabel: labelFor(category),
    slug,
    title,
    type: asString(data.type, origin === "awesomeds" ? "foundation" : ""),
    tags: asStringArray(data.tags),
    updated: asString(data.updated),
    sources: asSources(data.sources),
    body: content.trim(),
    origin,
    path: path.replace(/^(\.\.\/)+/, ""),
  };
}

function collect(): Entry[] {
  const out: Entry[] = [];
  for (const [path, raw] of Object.entries(knowledgeFiles)) {
    const e = build(path, typeof raw === "string" ? raw : "", "knowledge");
    if (e) out.push(e);
  }
  for (const [path, raw] of Object.entries(foundationFiles)) {
    const e = build(path, typeof raw === "string" ? raw : "", "awesomeds");
    if (e) out.push(e);
  }
  // Deduplicate ids by appending a counter.
  const seen = new Map<string, number>();
  for (const e of out) {
    const n = seen.get(e.id) ?? 0;
    if (n > 0) {
      e.slug = `${e.slug}-${n + 1}`;
      e.id = `${e.category}/${e.slug}`;
    }
    seen.set(`${e.category}/${slugify(e.slug.replace(/-\d+$/, ""))}`, n + 1);
  }
  return out.sort((a, b) => a.title.localeCompare(b.title, "ja"));
}

export const entries: Entry[] = collect();

export interface CategoryGroup {
  category: string;
  label: string;
  entries: Entry[];
}

export function groupByCategory(list: Entry[]): CategoryGroup[] {
  const map = new Map<string, Entry[]>();
  for (const e of list) {
    const arr = map.get(e.category) ?? [];
    arr.push(e);
    map.set(e.category, arr);
  }
  const groups = [...map.entries()].map(([category, es]) => ({
    category,
    label: labelFor(category),
    entries: es,
  }));
  // AwesomeDS 解説 first, then alphabetical by label.
  return groups.sort((a, b) => {
    if (a.category === AWESOMEDS_CATEGORY) return -1;
    if (b.category === AWESOMEDS_CATEGORY) return 1;
    return a.label.localeCompare(b.label, "ja");
  });
}

export function findEntry(category: string, slug: string): Entry | undefined {
  return entries.find((e) => e.category === category && e.slug === slug);
}

export function allTags(list: Entry[]): string[] {
  const set = new Set<string>();
  for (const e of list) for (const t of e.tags) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b, "ja"));
}

export interface SourceGroup {
  domain: string;
  sources: { url: string; title: string; citedBy: Entry[] }[];
}

export function groupSourcesByDomain(list: Entry[]): SourceGroup[] {
  const byUrl = new Map<string, { url: string; title: string; citedBy: Entry[] }>();
  for (const e of list) {
    for (const s of e.sources) {
      const key = s.url.replace(/\/+$/, "");
      const existing = byUrl.get(key);
      if (existing) {
        if (!existing.citedBy.includes(e)) existing.citedBy.push(e);
        if (existing.title === existing.url && s.title !== s.url) existing.title = s.title;
      } else {
        byUrl.set(key, { url: s.url, title: s.title || s.url, citedBy: [e] });
      }
    }
  }
  const byDomain = new Map<string, SourceGroup["sources"]>();
  for (const s of byUrl.values()) {
    let domain = "その他";
    try {
      domain = new URL(s.url).hostname.replace(/^www\./, "");
    } catch {
      // keep fallback
    }
    const arr = byDomain.get(domain) ?? [];
    arr.push(s);
    byDomain.set(domain, arr);
  }
  return [...byDomain.entries()]
    .map(([domain, sources]) => ({
      domain,
      sources: sources.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => b.sources.length - a.sources.length || a.domain.localeCompare(b.domain));
}
