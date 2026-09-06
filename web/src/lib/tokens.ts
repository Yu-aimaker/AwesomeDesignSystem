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
    measure: Token<string>;
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
  use: string;
}

const s = tokens.font.size;
const w = tokens.font.weight;
const lh = tokens.font.lineHeight;
const ls = tokens.font.letterSpacing;

export const typeRoles: TypeRole[] = [
  { name: "display", size: s["4xl"].$value, weight: w.semibold.$value, lineHeight: lh.tight.$value, tracking: ls.display.$value, family: "sans", use: "ランディングの見出し 1 か所だけ" },
  { name: "h1", size: s["3xl"].$value, weight: w.semibold.$value, lineHeight: lh.heading.$value, tracking: ls.display.$value, family: "sans", use: "ページタイトル。1 ページに 1 つ" },
  { name: "h2", size: s["2xl"].$value, weight: w.semibold.$value, lineHeight: 1.25, tracking: ls.heading.$value, family: "sans", use: "セクション見出し" },
  { name: "h3", size: s.xl.$value, weight: w.semibold.$value, lineHeight: lh.snug.$value, tracking: "-0.01em", family: "sans", use: "カードやサブセクションの見出し" },
  { name: "h4", size: s.base.$value, weight: w.semibold.$value, lineHeight: 1.5, tracking: ls.normal.$value, family: "sans", use: "リスト内の小見出し" },
  { name: "body-lg", size: s.lg.$value, weight: w.regular.$value, lineHeight: lh.body.$value, tracking: ls.normal.$value, family: "sans", use: "リード文" },
  { name: "body", size: s.base.$value, weight: w.regular.$value, lineHeight: lh.body.$value, tracking: ls.normal.$value, family: "sans", use: "本文の既定" },
  { name: "body-sm", size: s.sm.$value, weight: w.regular.$value, lineHeight: 1.55, tracking: ls.normal.$value, family: "sans", use: "UI 内の説明、テーブルのセル" },
  { name: "caption", size: s.xs.$value, weight: w.regular.$value, lineHeight: 1.5, tracking: "0.01em", family: "sans", use: "タイムスタンプ、注記。これより小さくしない" },
  { name: "label", size: s.sm.$value, weight: w.medium.$value, lineHeight: lh.heading.$value, tracking: ls.normal.$value, family: "sans", use: "ボタン、フォームラベル、タブ" },
  { name: "mono", size: "13px", weight: w.regular.$value, lineHeight: lh.body.$value, tracking: ls.normal.$value, family: "mono", use: "コード、トークン名、ID" },
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
