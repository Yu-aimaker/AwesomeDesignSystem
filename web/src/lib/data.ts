import type { Localized } from "../i18n/locales";
// Typed access to the data sets synced from AwesomeDS/data (see scripts/sync-tokens.mjs).
import fontsJson from "../ds/data/fonts.json";
import palettesJson from "../ds/data/palettes.json";
import stackJson from "../ds/data/stack.json";
import reposJson from "../ds/data/repos.json";
import sitesJson from "../ds/data/sites.json";

export interface DataMeta {
  description: string;
  updated: string;
  sources: string[];
  license: string;
}

export type FontCategory = "sans" | "serif" | "mono" | "jp-sans" | "jp-serif";
export interface FontEntry {
  id: string;
  name: string;
  category: FontCategory;
  designer: string;
  foundry: string;
  year: number;
  license: "OFL" | "system" | "proprietary";
  url: string;
  fontsource: string | null;
  cssFamily: string | null;
  pairs: string[];
  note: string;
  loaded: boolean;
  usedBy: Array<{ id: string; name: string; region: "global" | "jp"; source: string }>;
  usedByCount: number;
}

export interface CuratedPalette {
  id: string;
  name: string;
  hue: number | null;
  canvas: string;
  ink: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  dark: { canvas: string; ink: string; accent: string };
  use: string;
  contrast: { inkOnCanvas: number; accentOnCanvas: number; accentHoverOnCanvas: number; accentOnSoft: number; darkInkOnCanvas: number; darkAccentOnCanvas: number };
}
export interface BrandPalette {
  id: string;
  name: string;
  region: "global" | "jp";
  canvas: string;
  ink: string;
  accent: string;
  contrastInkOnCanvas: number;
  contrastAccentOnCanvas: number;
  temperature: "warm" | "cool" | "neutral";
  darkFirst: boolean;
}

export interface StackLayer {
  id: string;
  layer: string;
  pick: { name: string; url: string; why: string };
  alternatives: Array<{ name: string; url: string; when: string }>;
}

export interface RepoEntry {
  owner: string;
  name: string;
  url: string;
  description: string | null;
  stars: number | null;
  forks: number | null;
  language: string | null;
  topics: string[];
  pushedAt: string | null;
  license: string | null;
  archived: boolean;
  category: string;
  fetchedAt: string | null;
  inTopicTop?: boolean;
  note?: string;
}

export type SiteCategory = "component-library" | "animation" | "loading" | "gallery" | "resource" | "skill";
/** One row of AwesomeDS/data/sites.json. Rules: Knowledge/research/recommended-sites.md */
export interface SiteEntry {
  id: string;
  name: string;
  url: string;
  category: SiteCategory;
  /** One line, Japanese. */
  description: string;
  repo: string | null;
  license: string | null;
  licenseUrl?: string;
  publisher?: string;
  stars: number | null;
  /** GitHub pushed_at (YYYY-MM-DD), null for sites without a repo. */
  lastUpdated: string | null;
  source: string;
  addedAt: string;
}

const asArray = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export const fontsMeta = fontsJson.meta as DataMeta;
export const fonts = asArray<FontEntry>(fontsJson.fonts);
export const palettesMeta = palettesJson.meta as DataMeta;
export const curatedPalettes = asArray<CuratedPalette>(palettesJson.curated);
export const brandPalettes = asArray<BrandPalette>(palettesJson.brand);
export const stackMeta = stackJson.meta as DataMeta;
export const stackLayers = asArray<StackLayer>(stackJson.layers);
export const reposMeta = reposJson.meta as DataMeta & { counts?: { total: number; missing: number }; fetchErrors?: string[] };
export const repos = asArray<RepoEntry>(reposJson.repos);
export const sitesMeta = sitesJson.meta as DataMeta & { criteria: string; categories: SiteCategory[]; counts: Record<SiteCategory, number> };
export const sites = asArray<SiteEntry>(sitesJson.sites);
/** brands.json is 450 kB; the site only needs its size. */
export const brandCount = (palettesJson.meta as { counts?: { brand?: number } }).counts?.brand ?? brandPalettes.length;

export const repoCategoryLabel: Record<string, Localized<string>> = {
  "component-library": { ja: "コンポーネント", en: "Components" },
  headless: { ja: "ヘッドレス", en: "Headless" },
  animation: { ja: "アニメーション", en: "Animation" },
  "animated-components": { ja: "動く部品集", en: "Animated components" },
  "3d": { ja: "3D", en: "3D" },
  icons: { ja: "アイコン", en: "Icons" },
  dataviz: { ja: "データ可視化", en: "Data viz" },
  styling: { ja: "スタイリング", en: "Styling" },
  "design-tokens": { ja: "デザイントークン", en: "Design tokens" },
  fonts: { ja: "フォント", en: "Fonts" },
  "agent-skills": { ja: "エージェント用スキル", en: "Agent skills" },
  "ai-ui": { ja: "AI UI", en: "AI UI" },
  "design-tools": { ja: "デザインツール", en: "Design tools" },
  framework: { ja: "フレームワーク", en: "Frameworks" },
  tooling: { ja: "ツール", en: "Tooling" },
  "topic:design-system": { ja: "topic:design-system", en: "topic:design-system" },
};

export const siteCategoryLabel: Record<SiteCategory, Localized<string>> = {
  "component-library": { ja: "コンポーネントライブラリ", en: "Component libraries" },
  animation: { ja: "アニメーション", en: "Animation" },
  loading: { ja: "ローディング", en: "Loading" },
  gallery: { ja: "見本帳", en: "Galleries" },
  resource: { ja: "道具と資料", en: "Tools and references" },
  skill: { ja: "スキル", en: "Agent skills" },
};

export const fontCategoryLabel: Record<FontCategory, Localized<string>> = {
  sans: { ja: "サンセリフ", en: "Sans serif" },
  serif: { ja: "セリフ", en: "Serif" },
  mono: { ja: "等幅", en: "Monospace" },
  "jp-sans": { ja: "日本語 ゴシック", en: "Japanese gothic" },
  "jp-serif": { ja: "日本語 明朝", en: "Japanese mincho" },
};

/** Formats 12480 as "12.5k". */
export function compact(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** Days since an ISO date, or null. */
export function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : Math.floor((Date.now() - t) / 86400000);
}

const dayFormats = new Map<string, Intl.DateTimeFormat>();

/** Formats a YYYY-MM-DD day for prose: 2026年10月27日 / October 27, 2026. One formatter per locale tag. */
export function formatDay(iso: string, tag: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  let f = dayFormats.get(tag);
  if (!f) dayFormats.set(tag, (f = new Intl.DateTimeFormat(tag, { dateStyle: "long", timeZone: "UTC" })));
  return f.format(t);
}
