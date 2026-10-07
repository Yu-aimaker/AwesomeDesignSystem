export interface NavItem {
  label: string;
  to: string;
  /** One line shown in the command palette. */
  hint?: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const foundations: NavItem[] = [
  { label: "文字", to: "/foundations/typography", hint: "Geist + Noto Sans JP、8 段階" },
  { label: "色", to: "/foundations/color", hint: "白地、黒文字、アクセント 1 色" },
  { label: "余白とレイアウト", to: "/foundations/spacing", hint: "4px 単位、4 つの距離" },
  { label: "角丸", to: "/foundations/radius", hint: "8 / 12 / 16 / ピル" },
  { label: "奥行き", to: "/foundations/elevation", hint: "線が先、影は浮くものだけ" },
  { label: "モーション", to: "/foundations/motion", hint: "200ms、ease-out、4〜8px" },
];

/** Top bar. Short nouns only. */
export const topNav: NavItem[] = [
  { label: "基盤", to: "/foundations", hint: "デザインシステムの観点一覧" },
  { label: "フォント", to: "/fonts", hint: "一流企業のフォント見本" },
  { label: "パレット", to: "/palettes", hint: "配色パターン" },
  { label: "コンポーネント", to: "/components", hint: "触れる部品" },
  { label: "モーション", to: "/motion", hint: "アニメーションのギャラリー" },
  { label: "スタック", to: "/stack", hint: "2026 年の技術スタック" },
  { label: "ランキング", to: "/rankings", hint: "人気 OSS" },
  { label: "ナレッジ", to: "/knowledge", hint: "出典付きの知見" },
  { label: "ガイドライン", to: "/sources", hint: "デザインシステム公式ガイドと出典" },
];

/** Mobile sheet and command palette. */
export const sidebar: NavGroup[] = [
  { label: "はじめに", items: [{ label: "ホーム", to: "/" }, { label: "このサイトについて", to: "/about" }] },
  { label: "基盤", items: [{ label: "一覧", to: "/foundations" }, ...foundations] },
  {
    label: "ギャラリー",
    items: [
      { label: "フォント", to: "/fonts" },
      { label: "パレット", to: "/palettes" },
      { label: "コンポーネント", to: "/components" },
      { label: "モーション", to: "/motion" },
      { label: "スタック", to: "/stack" },
      { label: "ランキング", to: "/rankings" },
    ],
  },
  {
    label: "根拠",
    items: [
      { label: "ナレッジ", to: "/knowledge" },
      { label: "ガイドライン・出典", to: "/sources" },
    ],
  },
];

export const repoUrl = "https://github.com/Yu-aimaker/Awesome-Design-Systems-Claude";
