import type { Localized } from "../locales";
import type { SiteCategory } from "../../lib/data";

export type SiteSort = "stars" | "updated" | "name";
/** Entries whose license limits use beyond MIT or Apache-2.0. Keyed by `id` in sites.json; each note follows that entry's own license text. */
export type RestrictedSite = "react-bits" | "animate-ui" | "gsap";

const ja = {
  title: "おすすめサイト",
  lead: "部品、動き、読み込み表示、見本帳、道具と資料、スキル。取り込み基準の検査を通ったものだけ。",
  statLabel: "件",
  all: "すべて",
  categoryGroup: "分類で絞り込む",
  searchPlaceholder: "名前、説明、提供元",
  sortLabel: "並び順",
  sort: { stars: "スター", updated: "更新日", name: "名前" } satisfies Record<SiteSort, string>,
  categoryDescription: {
    "component-library": "コードに取り込むReact中心のUI部品集",
    animation: "動きを作るライブラリと動く部品集",
    loading: "スピナーやスケルトンなどの待ち時間の表示",
    gallery: "実在の画面、パターン、部品の作例集",
    resource: "アイコンとSVG、DESIGN.md、制作ツール、設計の読み物",
    skill: "AIコーディングエージェント向けのスキルとプロンプト集",
  } satisfies Record<SiteCategory, string>,
  resultCount: (n: number) => `${n}件`,
  notFoundTitle: "見つかりません",
  notFoundBody: "別の語で検索するか、分類を外してください。",
  clearFilters: "絞り込みを外す",
  newTab: "（新しいタブ）",
  by: (p: string) => `提供${p}`,
  updated: (d: string) => `更新${d}`,
  repoLabel: (r: string) => `GitHubリポジトリ${r}`,
  license: "ライセンス",
  licenseLabel: (name: string, license: string) => `${name}のライセンス、${license}`,
  noLicense: "記載なし（Webサイト）",
  noLicenseRepo: "記載なし",
  licenseNote: {
    "react-bits": "アプリやサイトに組み込む商用利用はできる。部品、付属ツール、音声そのものの販売、再許諾、再配布と、ツールのホスト提供はできない。他の環境への移植版も同じ。ツールの書き出しは組み込んで使えるが、それだけを素材集として販売、配布することはできない。",
    "animate-ui": "商用利用はできる。部品そのものを元の形で販売、再配布することはできない。",
    gsap: "商用も含め無料。Webflowの動き作成と競合する、コードなしのツールには組み込めない。AIが書いたGSAPのコードは使える。",
  } satisfies Record<RestrictedSite, string>,
  noteBefore: "基準と検査は",
  noteAfter: "。スターと更新日はGitHubから取得。ライセンスの記載がないWebサイトは、使う前に各サイトの利用規約を確認。",
  stars: (n: string) => `スター${n}`,
};

export type SitesMessages = typeof ja;

const en: SitesMessages = {
  title: "Sites",
  lead: "Components, motion, loading states, galleries, tools and references, and skills. Only entries that pass the intake check.",
  statLabel: "sites",
  all: "All",
  categoryGroup: "Filter by category",
  searchPlaceholder: "Name, description, publisher",
  sortLabel: "Sort",
  sort: { stars: "Stars", updated: "Updated", name: "Name" },
  categoryDescription: {
    "component-library": "UI component sets for your code, mostly React",
    animation: "Animation libraries and animated components",
    loading: "Spinners, skeletons and other waiting states",
    gallery: "Real screens, patterns and component examples",
    resource: "Icons and SVG, DESIGN.md, design tools and interface reading",
    skill: "Skills and prompts for AI coding agents",
  },
  resultCount: (n) => `${n} ${n === 1 ? "site" : "sites"}`,
  notFoundTitle: "No matches",
  notFoundBody: "Try another term, or clear the category filter.",
  clearFilters: "Clear filters",
  newTab: " (opens in a new tab)",
  by: (p) => `by ${p}`,
  updated: (d) => `Updated ${d}`,
  repoLabel: (r) => `GitHub repository ${r}`,
  license: "License",
  licenseLabel: (name, license) => `${name} license: ${license}`,
  noLicense: "None listed (website)",
  noLicenseRepo: "None listed",
  licenseNote: {
    "react-bits": "Commercial use inside an app or site is allowed. You may not sell, sublicense or redistribute the components, tools or sounds themselves, or host the tools as a service, and ported versions count the same. Tool exports can go into your product, but not be sold or redistributed on their own, such as a texture or template pack.",
    "animate-ui": "Commercial use is allowed. You may not sell or redistribute the components themselves in their original form.",
    gsap: "Free, including commercial use. Not for no-code animation tools that compete with Webflow. AI-generated GSAP code is fine.",
  },
  noteBefore: "Criteria and checker:",
  noteAfter: ". Stars and update dates come from GitHub. For websites with no license listed, check each site's terms before use.",
  stars: (n) => `${n} stars`,
};

export const sitesMessages: Localized<SitesMessages> = { ja, en };
