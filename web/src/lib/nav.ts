export interface NavItem {
  label: string;
  to: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const foundations: NavItem[] = [
  { label: "タイポグラフィ", to: "/foundations/typography" },
  { label: "カラー", to: "/foundations/color" },
  { label: "スペーシング", to: "/foundations/spacing" },
  { label: "角丸", to: "/foundations/radius" },
  { label: "エレベーション", to: "/foundations/elevation" },
  { label: "モーション", to: "/foundations/motion" },
];

export const sidebar: NavGroup[] = [
  { label: "はじめに", items: [{ label: "概要", to: "/" }, { label: "このリポジトリについて", to: "/about" }] },
  { label: "ファウンデーション", items: foundations },
  {
    label: "実装",
    items: [
      { label: "コンポーネント", to: "/components" },
      { label: "アニメーション", to: "/animation" },
    ],
  },
  {
    label: "調査",
    items: [
      { label: "ナレッジ", to: "/knowledge" },
      { label: "ソース一覧", to: "/sources" },
    ],
  },
];

export const topNav: NavItem[] = [
  { label: "システム", to: "/foundations/typography" },
  { label: "コンポーネント", to: "/components" },
  { label: "アニメーション", to: "/animation" },
  { label: "ナレッジ", to: "/knowledge" },
];

export const repoUrl = "https://github.com/Yu-aimaker/Awesome-Design-Systems-Claude";
