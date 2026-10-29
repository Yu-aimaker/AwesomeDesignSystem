import type { Localized } from "../i18n/locales";
// Typed view over AwesomeDS/tokens/tokens.json (copied by scripts/sync-tokens.mjs).
import raw from "../ds/tokens/tokens.json";

type Token<T> = { $type: string; $value: T };
type ColorSet = Record<string, Token<string>>;

interface TokenFile {
  color: { light: ColorSet; dark: ColorSet };
  font: {
    family: { sans: Token<string[]>; mono: Token<string[]> };
    size: Record<string, Token<string>>;
    weight: Record<string, Token<number>>;
    lineHeight: Record<string, Token<number>>;
    letterSpacing: Record<string, Token<string>>;
  };
  space: Record<string, Token<string>>;
  radius: Record<string, Token<string>>;
  shadow: Record<string, Token<{ color: string; offsetX: string; offsetY: string; blur: string; spread: string }>>;
  duration: Record<string, Token<string>>;
  easing: Record<string, Token<number[]>>;
  spring: Record<string, Token<{ stiffness: number; damping: number }>>;
  control: Record<string, Token<string>>;
  layout: {
    container: Token<string>;
    "container-doc": Token<string>;
    measure: Token<string>;
    "measure-ja": Token<string>;
    breakpoint: Record<string, Token<string>>;
  };
}

export const tokens = raw as unknown as TokenFile;

export const colorRoles = Object.keys(tokens.color.light);

export function colorValue(mode: "light" | "dark", role: string): string {
  return tokens.color[mode][role]?.$value ?? tokens.color.light[role]?.$value ?? "";
}

/** Type roles as listed in DESIGN.md frontmatter. Values reference the token file. */
export interface TypeRole {
  name: string;
  size: string;
  weight: number;
  lineHeight: number;
  tracking: string;
  family: "sans" | "mono";
  use: Localized<string>;
}

const s = tokens.font.size;
const w = tokens.font.weight;
const lh = tokens.font.lineHeight;
const ls = tokens.font.letterSpacing;

export const typeRoles: TypeRole[] = [
  { name: "display", size: s["4xl"].$value, weight: w.semibold.$value, lineHeight: lh.tight.$value, tracking: ls.display.$value, family: "sans", use: { ja: "ランディングの見出し 1 か所だけ", en: "The one landing headline" } },
  { name: "h1", size: s["3xl"].$value, weight: w.semibold.$value, lineHeight: lh.heading.$value, tracking: ls.display.$value, family: "sans", use: { ja: "ページタイトル。1 ページに 1 つ", en: "Page title, one per page" } },
  { name: "h2", size: s["2xl"].$value, weight: w.semibold.$value, lineHeight: 1.25, tracking: ls.heading.$value, family: "sans", use: { ja: "セクション見出し", en: "Section heading" } },
  { name: "h3", size: s.xl.$value, weight: w.semibold.$value, lineHeight: lh.snug.$value, tracking: "-0.01em", family: "sans", use: { ja: "カードやサブセクションの見出し", en: "Card and subsection heading" } },
  { name: "h4", size: s.base.$value, weight: w.semibold.$value, lineHeight: 1.5, tracking: ls.normal.$value, family: "sans", use: { ja: "リスト内の小見出し", en: "Small heading inside lists" } },
  { name: "body-lg", size: s.lg.$value, weight: w.regular.$value, lineHeight: lh.body.$value, tracking: ls.normal.$value, family: "sans", use: { ja: "リード文", en: "Lead paragraph" } },
  { name: "body", size: s.base.$value, weight: w.regular.$value, lineHeight: lh.body.$value, tracking: ls.normal.$value, family: "sans", use: { ja: "本文の既定", en: "Default body text" } },
  { name: "body-sm", size: s.sm.$value, weight: w.regular.$value, lineHeight: 1.55, tracking: ls.normal.$value, family: "sans", use: { ja: "UI 内の説明、テーブルのセル", en: "UI descriptions, table cells" } },
  { name: "caption", size: s.xs.$value, weight: w.regular.$value, lineHeight: 1.5, tracking: "0.01em", family: "sans", use: { ja: "タイムスタンプ、注記。これより小さくしない", en: "Timestamps and notes. Never smaller" } },
  { name: "label", size: s.sm.$value, weight: w.medium.$value, lineHeight: lh.heading.$value, tracking: ls.normal.$value, family: "sans", use: { ja: "ボタン、フォームラベル、タブ", en: "Buttons, form labels, tabs" } },
  { name: "mono", size: "13px", weight: w.regular.$value, lineHeight: lh.body.$value, tracking: ls.normal.$value, family: "mono", use: { ja: "コード、トークン名、ID", en: "Code, token names, IDs" } },
];

export const spaceScale = Object.entries(tokens.space)
  .map(([k, v]) => ({ step: k, px: parseInt(v.$value, 10) }))
  .sort((a, b) => a.px - b.px);

export const radiusScale = Object.entries(tokens.radius).map(([k, v]) => ({ name: k, value: v.$value }));

export const durations = Object.entries(tokens.duration).map(([k, v]) => ({ name: k, value: v.$value }));

export const easings = Object.entries(tokens.easing).map(([k, v]) => ({
  name: k,
  css: `cubic-bezier(${v.$value.join(", ")})`,
}));

export const breakpoints = Object.entries(tokens.layout.breakpoint).map(([k, v]) => ({ name: k, value: v.$value }));
