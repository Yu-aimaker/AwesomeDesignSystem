import type { Localized } from "../locales";

const ja = {
  title: "ランキング",
  lead: "デザインと AI フロントエンドの OSS を GitHub スターで。毎週月曜に自動更新。",
  statLabel: "リポジトリ",
  pendingTitle: "スター数は最初の自動取得を待っています",
  pendingBody: "GitHub Actions の「Update data」が毎週月曜 00:30 UTC に取得します。手動実行もできます。それまでは選定リストとして表示します。",
  all: "すべて",
  searchPlaceholder: "リポジトリ、topic",
  notFoundTitle: "見つかりません",
  notFoundBody: "別の語で検索するか、分類を外してください。",
  topicTop: "topic 上位 20",
  archived: "アーカイブ",
  notes: "解説",
  updatedDaysAgo: (d: number) => ` · ${d} 日前に更新`,
  stars: (n: string) => `${n} stars`,
  notFetched: "未取得",
  noteBefore: "選定リスト + GitHub 検索 topic:design-system の上位 20。取得は",
  noteAfter: (fetched: number) => `。${fetched > 0 ? `${fetched} 件取得済み。` : ""}`,
};

export type RankingsMessages = typeof ja;

const en: RankingsMessages = {
  title: "Rankings",
  lead: "Open source for design and AI front ends, ranked by GitHub stars. Updated every Monday.",
  statLabel: "repositories",
  pendingTitle: "Star counts are waiting for the first automatic fetch",
  pendingBody: "The GitHub Actions workflow \"Update data\" fetches them every Monday at 00:30 UTC, or when run by hand. Until then this is a curated list.",
  all: "All",
  searchPlaceholder: "Repository or topic",
  notFoundTitle: "No matches",
  notFoundBody: "Try another term, or clear the category filter.",
  topicTop: "topic top 20",
  archived: "Archived",
  notes: "Notes",
  updatedDaysAgo: (d) => ` · updated ${d} ${d === 1 ? "day" : "days"} ago`,
  stars: (n) => `${n} stars`,
  notFetched: "Not fetched",
  noteBefore: "Curated list plus the top 20 of the GitHub topic:design-system search. Fetched by",
  noteAfter: (fetched) => `.${fetched > 0 ? ` ${fetched} fetched.` : ""}`,
};

export const rankingsMessages: Localized<RankingsMessages> = { ja, en };
