import type { Localized } from "../locales";

/**
 * Copy for /anti-slop (STA-105). The Japanese example sentences stay Japanese
 * in every locale: they are the specimen, not interface text. Only the labels
 * and the "what is wrong" lines are translated.
 * Source of truth for the content: Knowledge/skills/anti-ai-slop.md and the
 * Vault note on the research site (2026-10-12).
 */

export interface CopyPair {
  before: string;
  after: string;
  why: string;
}

export interface ResearchCase {
  /** One of the owner's four causes. */
  cause: string;
  before: string;
  after: string;
  why: string;
  /** file:line in Yu-aimaker/design-thinking-plugin, site/ on the v2 branch. */
  where: string;
}

export interface Hack {
  use: string;
  name: string;
  install: string;
  url: string;
}

const copyPairs: Array<{ before: string; after: string }> = [
  {
    before: "本プラグインは、デザイン思考のあらゆるフェーズにおいて、革新的でシームレスな体験を実現することができます。",
    after: "5 つの段階ごとに、決めたことを 1 枚の HTML で見ます。",
  },
  { before: "体験をはじめる", after: "保存する" },
  { before: "正常に保存が完了しました", after: "保存しました" },
];

const research: Array<{ before: string; after: string; where: string }> = [
  {
    before: "広げて、絞る。を 2 回。絞る前に人間が決める。",
    after: "広げる、絞る、を 2 回くり返します。絞る前に、人間が決めます。",
    where: "site/src/i18n/ja.json:56",
  },
  {
    before: "「プラグインは採点しない。」がホームの見出し、フッター、研究ページの 3 か所に出る",
    after: "研究ページに 1 回だけ置く",
    where: "site/src/i18n/ja.json:23, 84, 403",
  },
  {
    before: "丸は機能、四角は UI 表現。その凡例がサイトのどこにもない",
    after: "図の上に凡例を 1 行置く",
    where: "site/src/site.css:297",
  },
  {
    before: "サイトは「Node.js 20 以上」、手順書は「Node 18 以上」",
    after: "両方を 20 に揃える（package.json は >=20）",
    where: "site/src/i18n/ja.json:308, docs/setup-guide.md:3",
  },
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
    navBadLabel: "避ける: アイコンだけのナビ。タッチでは説明が出ない",
    navGoodLabel: "採用: 見える文字を添える",
    nav: ["ホーム", "検索", "保存", "設定"],
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
  research: {
    title: "研究サイトの実例",
    lead: "AwesomeDS を使っていても起きた 4 つ。どれも直せる。",
    cases: research.map((r, i) => ({
      ...r,
      cause: ["日本語が変", "文章が多い", "可視化が見にくい", "バグ・ミス"][i],
      why: [
        "「。」の直後に「を 2 回」が続き、文が壊れている。常体で素っ気ない",
        "見出しに使うほど重要ではない主張を、何度も言っている",
        "形だけで意味を持たせ、読み方をどこにも書いていない",
        "前提が文書ごとに違い、読者がどちらを信じるか迷う",
      ][i],
    })) as ResearchCase[],
    legendBadLabel: "Before: 凡例なし",
    legendGoodLabel: "After: 凡例 1 行",
    legendFeature: "機能",
    legendUi: "UI 表現",
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
    navBadLabel: "Avoid: icon-only navigation. Touch shows no tooltip",
    navGoodLabel: "Use: add visible labels",
    nav: ["Home", "Search", "Saved", "Settings"],
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
  research: {
    title: "Real cases from the research site",
    lead: "Four that happened even on top of AwesomeDS. Each one is fixable.",
    cases: research.map((r, i) => ({
      ...r,
      cause: ["Unnatural Japanese", "Too much text", "Hard-to-read visuals", "Bugs and mistakes"][i],
      why: [
        "A full stop splits the sentence in the middle. The plain form reads curt",
        "A claim too minor for a heading is repeated three times",
        "Shape carries meaning but nothing says how to read it",
        "Documents disagree on a prerequisite, so the reader has to guess",
      ][i],
    })),
    legendBadLabel: "Before: no legend",
    legendGoodLabel: "After: one-line legend",
    legendFeature: "Feature",
    legendUi: "UI expression",
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
