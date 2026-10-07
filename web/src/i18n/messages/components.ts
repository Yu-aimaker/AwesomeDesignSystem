import type { Localized } from "../locales";

const ja = {
  title: "コンポーネント",
  lead: "props を触る。コードはその状態のまま出る。実装も読める。",
  statLabel: "部品",
  all: "すべて",
  searchPlaceholder: "部品を検索",
  notFoundTitle: "見つかりません",
  notFoundBody: "別の語で検索するか、絞り込みを外してください。",
  noteBefore: "全部品はこのサイトの実装そのもの。ソースは",
  noteAfter: "。規則は AwesomeDS/components/checklist.md。",
};

export type ComponentsMessages = typeof ja;

const en: ComponentsMessages = {
  title: "Components",
  lead: "Change the props. The code updates to match, and the implementation is one tab away.",
  statLabel: "components",
  all: "All",
  searchPlaceholder: "Search components",
  notFoundTitle: "No matches",
  notFoundBody: "Try another term, or clear the filter.",
  noteBefore: "Every component is the code this site runs on. Source:",
  noteAfter: ". Rules: AwesomeDS/components/checklist.md.",
};

export const componentsMessages: Localized<ComponentsMessages> = { ja, en };
