// Typed access to the data sets synced from AwesomeDS/data (see scripts/sync-tokens.mjs).
import fontsJson from "../ds/data/fonts.json";
import palettesJson from "../ds/data/palettes.json";
import stackJson from "../ds/data/stack.json";
import reposJson from "../ds/data/repos.json";

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
/** brands.json is 450 kB; the site only needs its size. */
export const brandCount = (palettesJson.meta as { counts?: { brand?: number } }).counts?.brand ?? brandPalettes.length;

export const repoCategoryLabel: Record<string, string> = {
  "component-library": "コンポーネント",
  headless: "ヘッドレス",
  animation: "アニメーション",
  "animated-components": "動く部品集",
  "3d": "3D",
  icons: "アイコン",
  dataviz: "データ可視化",
  styling: "スタイリング",
  "design-tokens": "デザイントークン",
  fonts: "フォント",
  "agent-skills": "エージェント用スキル",
  "ai-ui": "AI UI",
  "design-tools": "デザインツール",
  framework: "フレームワーク",
  tooling: "ツール",
  "topic:design-system": "topic:design-system",
};

export const fontCategoryLabel: Record<FontCategory, string> = {
  sans: "サンセリフ",
  serif: "セリフ",
  mono: "等幅",
  "jp-sans": "日本語 ゴシック",
  "jp-serif": "日本語 明朝",
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
