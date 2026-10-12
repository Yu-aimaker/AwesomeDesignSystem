import type { Localized } from "../i18n/locales";

export interface NavItem {
  label: Localized<string>;
  to: string;
  /** One line shown in the command palette. */
  hint?: Localized<string>;
}
export interface NavGroup {
  label: Localized<string>;
  items: NavItem[];
}

export const foundations: NavItem[] = [
  { label: { ja: "文字", en: "Typography" }, to: "/foundations/typography", hint: { ja: "Geist + Noto Sans JP、8 段階", en: "Geist + Noto Sans JP, 8 steps" } },
  { label: { ja: "色", en: "Color" }, to: "/foundations/color", hint: { ja: "白地、黒文字、アクセント 1 色", en: "White canvas, black ink, one accent" } },
  { label: { ja: "余白とレイアウト", en: "Spacing and layout" }, to: "/foundations/spacing", hint: { ja: "4px 単位、4 つの距離", en: "4px unit, four distances" } },
  { label: { ja: "角丸", en: "Radius" }, to: "/foundations/radius", hint: { ja: "8 / 12 / 16 / ピル", en: "8 / 12 / 16 / pill" } },
  { label: { ja: "奥行き", en: "Elevation" }, to: "/foundations/elevation", hint: { ja: "線が先、影は浮くものだけ", en: "Borders first, shadows only for floating layers" } },
  { label: { ja: "モーション", en: "Motion" }, to: "/foundations/motion", hint: { ja: "200ms、ease-out、4〜8px", en: "200ms, ease-out, 4 to 8px" } },
];

/** Top bar. Short nouns only. */
export const topNav: NavItem[] = [
  { label: { ja: "基盤", en: "Foundations" }, to: "/foundations", hint: { ja: "デザインシステムの観点一覧", en: "Every perspective of the system" } },
  { label: { ja: "フォント", en: "Fonts" }, to: "/fonts", hint: { ja: "一流企業のフォント見本", en: "Typefaces used by leading products" } },
  { label: { ja: "パレット", en: "Palettes" }, to: "/palettes", hint: { ja: "配色パターン", en: "Color patterns" } },
  { label: { ja: "コンポーネント", en: "Components" }, to: "/components", hint: { ja: "触れる部品", en: "Live, interactive parts" } },
  { label: { ja: "モーション", en: "Motion" }, to: "/motion", hint: { ja: "アニメーションのギャラリー", en: "Animation gallery" } },
  { label: { ja: "スタック", en: "Stack" }, to: "/stack", hint: { ja: "2026 年の技術スタック", en: "The 2026 tech stack" } },
  { label: { ja: "ランキング", en: "Rankings" }, to: "/rankings", hint: { ja: "人気 OSS", en: "Popular open source" } },
  { label: { ja: "ナレッジ", en: "Knowledge" }, to: "/knowledge", hint: { ja: "出典付きの知見", en: "Notes with sources" } },
  { label: { ja: "ガイドライン", en: "Guidelines" }, to: "/sources", hint: { ja: "デザインシステム公式ガイドと出典", en: "Official design system guides and sources" } },
];

/** Mobile sheet and command palette. */
export const sidebar: NavGroup[] = [
  {
    label: { ja: "はじめに", en: "Start" },
    items: [
      { label: { ja: "ホーム", en: "Home" }, to: "/" },
      { label: { ja: "このサイトについて", en: "About this site" }, to: "/about" },
    ],
  },
  { label: { ja: "基盤", en: "Foundations" }, items: [{ label: { ja: "一覧", en: "Overview" }, to: "/foundations" }, ...foundations] },
  {
    label: { ja: "ギャラリー", en: "Gallery" },
    items: [
      { label: { ja: "フォント", en: "Fonts" }, to: "/fonts" },
      { label: { ja: "パレット", en: "Palettes" }, to: "/palettes" },
      { label: { ja: "コンポーネント", en: "Components" }, to: "/components" },
      { label: { ja: "モーション", en: "Motion" }, to: "/motion" },
      { label: { ja: "スタック", en: "Stack" }, to: "/stack" },
      { label: { ja: "ランキング", en: "Rankings" }, to: "/rankings" },
    ],
  },
  {
    label: { ja: "資料", en: "Documents" },
    items: [{ label: { ja: "HTMLレポート", en: "HTML report" }, to: "/report", hint: { ja: "報告を HTML 1枚で書く", en: "Write a report as one HTML file" } }],
  },
  {
    label: { ja: "根拠", en: "Evidence" },
    items: [
      { label: { ja: "ナレッジ", en: "Knowledge" }, to: "/knowledge" },
      { label: { ja: "ガイドライン・出典", en: "Guidelines and sources" }, to: "/sources" },
    ],
  },
];

export const repoUrl = "https://github.com/Yu-aimaker/AwesomeDesignSystem";
