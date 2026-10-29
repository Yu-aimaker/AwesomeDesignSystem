import type { Localized } from "../locales";

const ja = {
  title: "ナレッジ",
  lead: (n: number) => `${n} 件の要約。すべて出典と「AwesomeDS への反映」付き。`,
  search: "検索",
  searchPlaceholder: "タイトル、本文、タグ",
  filterByCategory: "カテゴリで絞り込む",
  all: "すべて",
  emptyTitle: "ナレッジはまだありません",
  emptyBody: "Knowledge/ フォルダに Markdown が追加されると、ここに一覧が表示されます。",
  noMatchTitle: "一致する項目がありません",
  noMatchBody: "検索語やカテゴリを変えてみてください。",
  awesomedsNote: "AwesomeDS の各値の理由と出典。リポジトリの AwesomeDS/foundations にある Markdown をそのまま表示しています。",
  bodyLanguageNote: "",
  types: {
    repo: "リポジトリ",
    library: "ライブラリ",
    skill: "スキル",
    article: "記事",
    product: "プロダクト",
    guideline: "ガイドライン",
    "design-system": "デザインシステム",
    foundation: "解説",
  } as Record<string, string>,
  // Entry page
  backToList: "ナレッジ一覧",
  updated: (d: string) => ` ・ 更新 ${d}`,
  tags: "タグ",
  entrySources: "この記事の出典",
  sourceFile: "元ファイル: ",
};

export type KnowledgeMessages = typeof ja;

const en: KnowledgeMessages = {
  title: "Knowledge",
  lead: (n) => `${n} summaries. Each has sources and a section on what AwesomeDS took from it.`,
  search: "Search",
  searchPlaceholder: "Title, body, tags",
  filterByCategory: "Filter by category",
  all: "All",
  emptyTitle: "No knowledge entries yet",
  emptyBody: "Markdown files added to the Knowledge/ folder are listed here.",
  noMatchTitle: "No matches",
  noMatchBody: "Try a different word or category.",
  awesomedsNote: "The reasons and sources behind each AwesomeDS value. This is the Markdown in AwesomeDS/foundations, shown as is.",
  bodyLanguageNote: "This note is written in Japanese. The page navigation and source links are in English.",
  types: {
    repo: "Repository",
    library: "Library",
    skill: "Skill",
    article: "Article",
    product: "Product",
    guideline: "Guideline",
    "design-system": "Design system",
    foundation: "Note",
  },
  backToList: "All knowledge",
  updated: (d) => ` · Updated ${d}`,
  tags: "Tags",
  entrySources: "Sources for this note",
  sourceFile: "Source file: ",
};

export const knowledgeMessages: Localized<KnowledgeMessages> = { ja, en };

const japanese = /[぀-ヿ一-鿿]/;

/** `lang="ja"` for text that is still Japanese while the page is in another locale. */
export function langFor(text: string, locale: string): "ja" | undefined {
  return locale !== "ja" && japanese.test(text) ? "ja" : undefined;
}
