export interface NavItem {
  label: string;
  to: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const foundations: NavItem[] = [
  { label: "文字", to: "/foundations/typography" },
  { label: "色", to: "/foundations/color" },
  { label: "余白とレイアウト", to: "/foundations/spacing" },
  { label: "角丸", to: "/foundations/radius" },
  { label: "奥行き", to: "/foundations/elevation" },
  { label: "モーション", to: "/foundations/motion" },
];

export const sidebar: NavGroup[] = [
  { label: "はじめに", items: [{ label: "概要", to: "/" }, { label: "このサイトについて", to: "/about" }] },
  { label: "基盤", items: foundations },
  {
    label: "実装",
    items: [
      { label: "コンポーネント", to: "/components" },
      { label: "アニメーション", to: "/animation" },
    ],
  },
  {
    label: "根拠",
    items: [
      { label: "ナレッジ", to: "/knowledge" },
      { label: "出典", to: "/sources" },
    ],
  },
];

export const topNav: NavItem[] = [
  { label: "基盤", to: "/foundations/typography" },
  { label: "コンポーネント", to: "/components" },
  { label: "アニメーション", to: "/animation" },
  { label: "ナレッジ", to: "/knowledge" },
];

export const repoUrl = "https://github.com/Yu-aimaker/Awesome-Design-Systems-Claude";
