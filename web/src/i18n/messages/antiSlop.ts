import type { Localized } from "../locales";

/**
 * Copy for /anti-slop. The Japanese example sentences stay Japanese in every
 * locale: they are the specimen, not interface text. Only the labels and the
 * "what is wrong" lines are translated.
 * Source of truth for the content: Knowledge/skills/anti-ai-slop.md.
 */

export interface CopyPair {
  before: string;
  after: string;
  why: string;
}

export interface Hack {
  use: string;
  name: string;
  install: string;
  url: string;
}

const copyPairs: Array<{ before: string; after: string }> = [
  {
    before: "本サービスは、あらゆるシーンにおいて、革新的でシームレスな体験を実現することができます。",
    after: "請求書を 3 分で作り、そのまま送れます。",
  },
  { before: "体験をはじめる", after: "保存する" },
  { before: "正常に保存が完了しました", after: "保存しました" },
];

const hacks: Array<{ name: string; install: string; url: string }> = [
  { name: "no-ai-slop-ja", install: "npx skills add 53able/no-ai-slop-ja --skill no-ai-slop-ja --global --yes", url: "https://github.com/53able/no-ai-slop-ja" },
  { name: "taste-skill", install: "npx skills add https://github.com/Leonxlnx/taste-skill", url: "https://github.com/Leonxlnx/taste-skill" },
  { name: "ui-skills (baseline-ui)", install: "npx ui-skills", url: "https://github.com/ibelick/ui-skills" },
  { name: "Anthropic frontend-design", install: "/plugin marketplace add anthropics/skills", url: "https://github.com/anthropics/skills" },
  { name: "Pretty Mermaid", install: "npx skills add imxv/pretty-mermaid-skills@pretty-mermaid -g -y", url: "https://github.com/imxv/Pretty-mermaid-skills" },
  { name: "Frontend Slides", install: "/plugin marketplace add https://github.com/zarazhangrui/frontend-slides", url: "https://github.com/zarazhangrui/frontend-slides" },
  { name: "Anthropic pptx", install: "document-skills（pptxgenjs）", url: "https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md" },
];

const ja = {
  title: "脱AIスロップ",
  lead: "モデルの既定をそのまま出さない。ダメな例と直し方を並べる。",
  statLabel: "例",
  before: "Before",
  after: "After",
  whyWrong: "どこがダメか",
  where: "出典",
  readKnowledge: "ナレッジで全文を読む",
  design: {
    title: "デザイン",
    lead: "決めていない画面は、グラデーションと中央寄せになる。",
    heroBadLabel: "避ける: 紫のグラデーション、中央寄せ、中身のない見出し",
    heroGoodLabel: "採用: 左揃え、白地、具体的な見出し、主ボタン 1 つ",
    heroBadTitle: "革新的な体験を、シームレスに。",
    heroBadBody: "次世代の AI が、あなたのワークフローを変革します。",
    heroBadPrimary: "今すぐはじめる",
    heroBadSecondary: "詳しく見る",
    heroGoodTitle: "会社を条件で探して、3 社まで見比べる",
    heroGoodBody: "業種・地域・規模で絞り込み、保存した会社を横に並べます。",
    heroGoodPrimary: "条件を決める",
    cardsBadLabel: "避ける: 同じ形のカード 3 枚、どれも抽象語",
    cardsGoodLabel: "採用: 数字と条件で言い切る 1 列",
    cardsBad: ["高速", "安全", "簡単"],
    cardsBadBody: "あらゆるニーズに対応します。",
    cardsGood: [
      ["検索", "業種と地域で 2 秒以内に結果"],
      ["保存", "3 社まで。4 社目は入れ替えを聞く"],
      ["比較", "給与・残業・離職率を横に並べる"],
    ] as Array<[string, string]>,
  },
  components: {
    title: "コンポーネント",
    lead: "見た目だけの部品は、触ると意味が分からない。",
    formBadLabel: "避ける: プレースホルダーをラベル代わりにする",
    formGoodLabel: "採用: 入力欄の上にラベル",
    formLabel: "会社名",
    formPlaceholder: "会社名を入力",
    formExample: "例: 株式会社サンプル",
  },
  copy: {
    title: "文章（変な日本語）",
    lead: "1 文に用事は 1 つ。空の言い回しと禁止語を外す。",
    pairs: copyPairs.map((p, i) => ({
      ...p,
      why: [
        "「ことができます」は中身のない言い回し。「革新的」「シームレス」は禁止語。1 文に用事が 3 つある",
        "何が起きるか分からない。ボタンは動詞で、結果を言う",
        "「正常に」「完了しました」は冗長。結果だけを言う",
      ][i],
    })) as CopyPair[],
  },
  hacks: {
    title: "ハック",
    lead: "入れるだけで既定から離れる Skill。URL は 2026-10-11 に確認。",
    use: "用途",
    install: "入れ方",
    rows: hacks.map((h, i) => ({ ...h, use: ["日本語", "テイスト", "デザイン監査", "デザインの方向", "図（Mermaid）", "スライド（HTML）", "スライド（pptx）"][i] })) as Hack[],
  },
  dataNote: "数値と禁止項目の正本は AwesomeDS/foundations/anti-patterns.md と content-and-tone.md。原則 7「生成の既定を設計にしない」。",
};

export type AntiSlopMessages = typeof ja;

const en: AntiSlopMessages = {
  title: "Beyond AI slop",
  lead: "Do not ship the model's defaults. Bad examples next to their fixes.",
  statLabel: "examples",
  before: "Before",
  after: "After",
  whyWrong: "What is wrong",
  where: "Source",
  readKnowledge: "Read the full Knowledge entry",
  design: {
    title: "Design",
    lead: "A screen nobody decided on ends up gradient and centered.",
    heroBadLabel: "Avoid: purple gradient, centered, empty headline",
    heroGoodLabel: "Use: left aligned, white canvas, concrete headline, one primary button",
    heroBadTitle: "Innovative experiences, seamlessly.",
    heroBadBody: "Next-gen AI that transforms your workflow.",
    heroBadPrimary: "Get started",
    heroBadSecondary: "Learn more",
    heroGoodTitle: "Search companies by criteria and compare up to 3",
    heroGoodBody: "Filter by industry, region and size, then line the saved ones up.",
    heroGoodPrimary: "Set criteria",
    cardsBadLabel: "Avoid: three identical cards of abstract words",
    cardsGoodLabel: "Use: one list that commits to numbers and conditions",
    cardsBad: ["Fast", "Secure", "Simple"],
    cardsBadBody: "Built for every need.",
    cardsGood: [
      ["Search", "Results by industry and region within 2 s"],
      ["Save", "Up to 3. A fourth asks which to replace"],
      ["Compare", "Salary, overtime and turnover side by side"],
    ],
  },
  components: {
    title: "Components",
    lead: "A part that only looks right means nothing once touched.",
    formBadLabel: "Avoid: placeholder as the label",
    formGoodLabel: "Use: a label above the field",
    formLabel: "Company name",
    formPlaceholder: "Enter company name",
    formExample: "e.g. Sample Inc.",
  },
  copy: {
    title: "Copy (unnatural Japanese)",
    lead: "One job per sentence. Remove empty phrasing and banned words.",
    pairs: copyPairs.map((p, i) => ({
      ...p,
      why: [
        "\"ことができます\" is empty phrasing. \"Innovative\" and \"seamless\" are banned words. Three jobs in one sentence",
        "Says nothing about what happens. Buttons are verbs that name the result",
        "\"Successfully\" and \"completed\" are padding. State the result",
      ][i],
    })),
  },
  hacks: {
    title: "Hacks",
    lead: "Skills that move output away from the defaults. URLs checked on 2026-10-11.",
    use: "Use",
    install: "Install",
    rows: hacks.map((h, i) => ({ ...h, use: ["Japanese copy", "Taste", "Design audit", "Design direction", "Diagrams (Mermaid)", "Slides (HTML)", "Slides (pptx)"][i] })),
  },
  dataNote: "Numbers and banned items live in AwesomeDS/foundations/anti-patterns.md and content-and-tone.md. Principle 7: generation defaults are not design decisions.",
};

export const antiSlopMessages: Localized<AntiSlopMessages> = { ja, en };
