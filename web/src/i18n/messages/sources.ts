import type { Localized } from "../locales";

const ja = {
  title: "出典・ガイドライン",
  lead: (total: number, domains: number) => `デザインシステムの公式ガイドラインと、ナレッジ・AwesomeDS 解説が参照する外部リンクの一覧です。${total} 件、${domains} ドメイン。`,
  flagship: "注目のデザインシステム",
  flagshipLead: "AwesomeDS が値と規則の出典にしたデザインシステムとガイドライン。カードを開くと、何を採り何を採らなかったかの記録に移ります。公式サイトへは各カード下のリンクから。",
  levels: [
    ["採用", "値や規則をそのまま使う"],
    ["翻案", "考え方を取り、値は変える"],
    ["参照のみ", "指名されたときに公式を使う"],
  ] as Array<readonly [string, string]>,
  treatment: "AwesomeDS での扱い",
  readRecord: "記録を読む",
  recordLabel: (name: string) => `${name} の採用・不採用の記録`,
  officialSite: (domain: string) => `公式サイト: ${domain}`,
  officialSiteLabel: (name: string) => `${name} の公式サイト（新しいタブ）`,
  ogpOk: (ok: number, total: number) => `${ok}/${total} 件が公式 og:image（取得 2026-10-07）。`,
  ogpMissing: (names: string[]) => ` 幾何マーク: ${names.join("、")}。`,
  allSources: "全出典リンク",
  emptyTitle: "出典はまだありません",
  emptyBody: "frontmatter の sources に URL が書かれると、ここに集計されます。",
  search: "検索",
  searchPlaceholder: "ドメイン、タイトル、URL、引用元",
  closeAll: "すべて閉じる",
  openAll: "すべて開く",
  noMatchTitle: "一致する出典がありません",
  noMatchBody: "別の語で検索してください。",
  citedBy: "引用:",
};

export type SourcesMessages = typeof ja;

const en: SourcesMessages = {
  title: "Sources and guidelines",
  lead: (total, domains) => `Official design system guidelines, and every external link cited by Knowledge and the AwesomeDS notes. ${total} links across ${domains} domains.`,
  flagship: "Featured design systems",
  flagshipLead: "The design systems and guidelines AwesomeDS took values and rules from. Open a card to read what was adopted and what was not. The official site is linked under each card.",
  levels: [
    ["Adopted", "Values or rules used as they are"],
    ["Adapted", "The idea is kept, the values change"],
    ["Reference only", "The official package is used when a brief names it"],
  ],
  treatment: "In AwesomeDS",
  readRecord: "Read the record",
  recordLabel: (name) => `What AwesomeDS adopted and rejected from ${name}`,
  officialSite: (domain) => `Official site: ${domain}`,
  officialSiteLabel: (name) => `${name} official site (opens in a new tab)`,
  ogpOk: (ok, total) => `${ok}/${total} use the official og:image (fetched 2026-10-07).`,
  ogpMissing: (names) => ` Geometric marks: ${names.join(", ")}.`,
  allSources: "All source links",
  emptyTitle: "No sources yet",
  emptyBody: "URLs listed under sources in the frontmatter are collected here.",
  search: "Search",
  searchPlaceholder: "Domain, title, URL, cited by",
  closeAll: "Close all",
  openAll: "Open all",
  noMatchTitle: "No matching sources",
  noMatchBody: "Try a different word.",
  citedBy: "Cited by:",
};

export const sourcesMessages: Localized<SourcesMessages> = { ja, en };
