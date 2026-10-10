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
  maturityLegend: "成熟度の凡例",
  maturity: {
    stable: { label: "安定", note: "API 固定。仕様とアクセシビリティ確認が済み、トークンのみで描く。" },
    beta: { label: "ベータ", note: "使える。仕様の文書化か確認が途中で、軽微な API 変更がありうる。" },
    alpha: { label: "アルファ", note: "試作。API は予告なく変わる。本番では使わない。" },
    deprecated: { label: "非推奨", note: "置き換え先あり。新規に使わない。" },
  },
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
  maturityLegend: "Maturity legend",
  maturity: {
    stable: { label: "Stable", note: "API frozen. Spec and accessibility review done; drawn with tokens only." },
    beta: { label: "Beta", note: "Usable. Spec docs or review still in progress; minor API changes possible." },
    alpha: { label: "Alpha", note: "Prototype. The API can change without notice. Not for production." },
    deprecated: { label: "Deprecated", note: "A replacement exists. Do not use in new work." },
  },
};

export const componentsMessages: Localized<ComponentsMessages> = { ja, en };
