import type { Localized } from "../locales";

/**
 * Copy for /anti-slop. Source of truth: Knowledge/skills/anti-ai-slop.md.
 * Only patterns that two or more independent sources call a generated default
 * are listed. Product-dependent choices go to `excluded`, with the reason.
 * Before/after sentences stay in their own language in every locale: they are
 * the specimen, not interface text.
 */

export interface Pattern {
  pattern: string;
  fix: string;
  /** Short names of the sources; the hack list and the Knowledge entry link them. */
  sources: string;
}

export interface CopyPair {
  pattern: string;
  before: string;
  after: string;
  sources: string;
}

export interface Hack {
  name: string;
  what: string;
  install: string;
  url: string;
}

type L = { ja: string; en: string };
const both = (ja: string, en: string): L => ({ ja, en });

const design: Array<{ p: L; f: L; s: string }> = [
  { p: both("紫から青のグラデーション", "Purple-to-blue gradient"), f: both("単色のアクセント 1 つ。ブリーフにない装飾グラデーションは使わない", "One solid accent. No decorative gradient unless the brief asks"), s: "web-artifacts-builder, cookbooks, impeccable, baseline-ui, hallmark" },
  { p: both("表示書体に Inter / Roboto / Arial / システム既定", "Inter, Roboto, Arial or the system font as the display face"), f: both("意図して選んだ表示書体。Inter は本文まで", "A deliberate display face. Inter for body text at most"), s: "cookbooks, web-artifacts-builder, impeccable, hallmark, taste-skill" },
  { p: both("「次の既定」の書体（Space Grotesk、Fraunces、Instrument Serif）", "The second defaults: Space Grotesk, Fraunces, Instrument Serif"), f: both("ブリーフとブランドから選ぶ", "Choose from the brief and the brand"), s: "cookbooks, taste-skill" },
  { p: both("クリーム背景＋セリフ＋テラコッタのキット", "Cream background, contrast serif, terracotta accent"), f: both("ブリーフが求めるときだけ", "Only when the brief calls for it"), s: "frontend-design, taste-skill" },
  { p: both("グラデーション文字", "Gradient text"), f: both("単色。強弱は大きさと太さで", "Solid color. Hierarchy from size and weight"), s: "impeccable, hallmark, taste-skill" },
  { p: both("飾りのガラス・ぼかし", "Decorative glass and blur"), f: both("理由があるときだけ。普段は不透明な面", "Only with a functional reason. Otherwise a solid surface"), s: "taste-skill, impeccable" },
  { p: both("ネオンの光・光るボタン", "Neon glows and glowing buttons"), f: both("枠線か控えめな影。状態は色と文字で", "A border or a quiet shadow. State through color and text"), s: "impeccable, baseline-ui, taste-skill" },
  { p: both("どこも同じ大きな角丸", "One large radius on everything"), f: both("役割で角丸を変える", "Radius by role"), s: "web-artifacts-builder, frontend-design, ux-skill" },
  { p: both("どこも同じ灰色の影、影＋枠＋色の重ね掛け", "The same grey shadow everywhere, or shadow plus border plus tint"), f: both("面の分け方は 1 つ", "One way to separate surfaces"), s: "frontend-design, ux-skill, taste-skill" },
  { p: both("カードの片側だけ太い色帯", "A thick colored stripe on one side of a card"), f: both("外す。状態はアイコンと文字で", "Remove it. Status as icon and text"), s: "impeccable, hallmark" },
  { p: both("絵文字のアイコン（✨🚀⚡🔥）", "Emoji as icons (✨🚀⚡🔥)"), f: both("1 つのアイコンセットを同じ大きさで", "One icon set at one size"), s: "hallmark, impeccable, taste-skill, ux-skill" },
  { p: both("純黒・純白・無彩色の灰色", "Pure black, pure white, untinted grey"), f: both("中立色をブランドの色相にわずかに寄せる", "Tint neutrals slightly toward the brand hue"), s: "impeccable, hallmark, taste-skill" },
  { p: both("飾りのメッシュ・ブロブ背景", "Decorative mesh and blob backgrounds"), f: both("無地か、意味のある画像 1 枚", "Plain, or one meaningful image"), s: "frontend-design, taste-skill, hallmark, ux-skill" },
  { p: both("全セクションのフェードイン、全カードのホバー、バウンス", "Fade-up on every section, hover on every card, bounce easing"), f: both("動きは操作への応答だけ", "Motion only as a response to the user"), s: "frontend-design, impeccable, hallmark, baseline-ui" },
  { p: both("字間を広げた大文字ラベル、飾りの等幅書体", "Tracked-out all-caps labels, monospace as decoration"), f: both("ラベルは普通の書き方。等幅はコードと数値だけ", "Sentence case. Monospace for code and data only"), s: "frontend-design, impeccable" },
];

const components: Array<{ p: L; f: L; s: string }> = [
  { p: both("中央寄せヒーロー → 同じカード 3 枚 → CTA → フッター", "Centered hero, three equal cards, CTA, footer"), f: both("内容の順に並べる。ページごとに型を変える", "Order by the content. Vary the layout family"), s: "hallmark, taste-skill, ux-skill, web-artifacts-builder" },
  { p: both("角丸アイコンタイル＋見出し＋本文のカード 3 枚", "Three cards of icon tile, heading and body"), f: both("主役に面積を割く。並列なら一覧か表", "Give the main item room. Parallel items as a list or table"), s: "impeccable, hallmark, taste-skill, ux-skill" },
  { p: both("何でもカードで囲む、カードの入れ子", "Cards around everything, cards inside cards"), f: both("余白と区切り線。カードは 1 段まで", "Whitespace and dividers. One level of card"), s: "impeccable, hallmark" },
  { p: both("見出しの上のアイブロウ・ピル（NEW、✨ Introducing）", "Eyebrow or pill above the heading (NEW, ✨ Introducing)"), f: both("消す。文脈は見出しか導入文に", "Delete it. Put the context in the heading or lede"), s: "impeccable, frontend-design, hallmark" },
  { p: both("意味のない 01 / 02 / 03", "Section numbers that carry no order"), f: both("番号は本当に順番があるときだけ", "Number only real sequences"), s: "frontend-design, impeccable, taste-skill, hallmark" },
  { p: both("大きな数字＋小さなラベルのヒーロー", "Big number with a small label as the hero"), f: both("本物で出典のある数字が主題のときだけ", "Only when the number is real, sourced and the point"), s: "frontend-design, impeccable, hallmark" },
  { p: both("div で描いた偽の画面、偽のブラウザ枠", "Fake dashboards and browser frames drawn in divs"), f: both("本物のスクリーンショットか、載せない", "A real screenshot, or nothing"), s: "hallmark, taste-skill, impeccable" },
  { p: both("作った社会的証明（ロゴの壁、推薦文、Trusted by 50,000+）", "Invented social proof: logo walls, quotes, Trusted by 50,000+"), f: both("許可を得た本物か、明示した仮置き。なければ外す", "Real with permission, a labeled placeholder, or remove"), s: "hallmark, taste-skill, ux-skill" },
  { p: both("すべてのボタンとリンクの末尾に →", "An arrow appended to every button and link"), f: both("動詞で結果を言う。矢印は本当の移動だけ", "A verb that names the result. Arrows only for real direction"), s: "frontend-design, ux-skill, taste-skill" },
  { p: both("同じ高さ・余白・見出しのセクションの繰り返し", "Identical sections stamped out N times"), f: both("主役の 1〜2 セクションを大きく", "Make one or two anchor sections dominant"), s: "ux-skill, hallmark, taste-skill" },
  { p: both("空・読み込み中・エラー・無効の状態がない", "No empty, loading, error or disabled state"), f: both("全状態を作る。空の状態には次の操作を 1 つ", "Design every state. One next action when empty"), s: "ux-skill, baseline-ui, hallmark" },
];

const copyEn: Array<{ p: L; b: string; a: string; s: string }> = [
  { p: both("誇大な動詞（Unlock、Elevate、Seamless）", "Hype verbs (Unlock, Elevate, Seamless)"), b: "Unlock seamless productivity", a: "Approve invoices from email in one click", s: "taste-skill, hallmark, ux-skill" },
  { p: both("「X ではなく Y だ」", "\"It's not X, it's Y\""), b: "It's not just a tool, it's a partner.", a: "It drafts replies; you approve them.", s: "humanizer, Wikipedia" },
  { p: both("無理な 3 つ並べ", "Forced rule of three"), b: "Fast, secure, and scalable.", a: "Deploys in 40 s.", s: "humanizer, Wikipedia" },
  { p: both("AI 語彙（delve、landscape、pivotal）", "AI vocabulary (delve, landscape, pivotal)"), b: "Delve into the evolving landscape", a: "See what changed in v3", s: "humanizer" },
  { p: both("大げさな意義づけ", "Inflated significance"), b: "This marks a pivotal shift.", a: "Exports now include tax IDs.", s: "humanizer, Wikipedia" },
  { p: both("仮の名前（John Doe、Acme）", "Placeholder names (John Doe, Acme)"), b: "John Doe, CEO at Acme", a: "Mika Sato, Ops lead", s: "taste-skill, hallmark, ux-skill" },
  { p: both("作った数字", "Invented stats"), b: "Trusted by 50,000+ teams", a: "(remove until the number is real)", s: "hallmark, ux-skill, taste-skill" },
  { p: both("飾りの太字・絵文字の見出し", "Decorative bold and emoji headings"), b: "🚀 **Fast** setup", a: "Setup takes 5 minutes", s: "humanizer, textlint ai-writing" },
  { p: both("チャットの残り", "Chatbot leftovers"), b: "Great question! Here's a quick overview.", a: "(delete)", s: "humanizer, Wikipedia" },
  { p: both("前置き", "Filler signposting"), b: "It's important to note that exports are limited.", a: "Exports are limited to 10k rows.", s: "humanizer" },
];

const copyJa: Array<{ p: L; b: string; a: string; s: string }> = [
  { p: both("「〜することができます」", "\"〜することができます\" (can-do shell)"), b: "設定を変更することができます。", a: "設定を変更できます。", s: "no-ai-slop-ja, textlint ai-writing, japanese-humanizer" },
  { p: both("責任を隠す過剰な敬語", "Over-polite phrasing that hides who acts"), b: "こちらで確認させていただく形となっております。", a: "担当者が確認します。", s: "no-ai-slop-ja, natural-japanese" },
  { p: both("誇大語", "Hype words"), b: "業務をスーパーチャージします。", a: "月次の照合作業を 2 日短縮します。", s: "textlint ai-writing, no-ai-slop-ja" },
  { p: both("カタカナ抽象語の重なり", "Stacked katakana abstractions"), b: "アセットを活用し、シナジーのあるソリューションを提供します。", a: "既存の顧客データで請求書を自動で作ります。", s: "no-ai-slop-ja, textlint ai-writing" },
  { p: both("「単なる〜ではありません」", "\"Not just X\" in Japanese"), b: "これは単なるツールではありません。未来を変えるパートナーです。", a: "返信の下書きを作り、承認後に送ります。", s: "no-ai-slop-ja, humanizer" },
  { p: both("漢語＋「を行う」", "Nominalized verbs with を行う"), b: "課題の把握および改善の実施を行います。", a: "課題を把握して改善します。", s: "no-ai-slop-ja, japanese-humanizer" },
  { p: both("「の」の連鎖", "Chains of の"), b: "チームの開発の速度の改善の方法", a: "チームの開発速度を上げる方法", s: "no-ai-slop-ja, japanese-humanizer" },
  { p: both("根拠のない権威", "Authority without a source"), b: "近年注目されています。", a: "（出典を添えるか、消す）", s: "no-ai-slop-ja, japanese-humanizer" },
  { p: both("絵文字の箇条書き", "Emoji bullets"), b: "✅ 完了した項目", a: "完了した項目", s: "textlint ai-writing, no-ai-slop-ja" },
  { p: both("英語式のコロンでつなぐ", "English-style colon before content"), b: "実行します:", a: "実行方法は次のとおりです。", s: "textlint ai-writing" },
  { p: both("同じ文末の繰り返し", "The same sentence ending repeated"), b: "確認することが重要です。共有することが重要です。", a: "確認と共有が重要です。", s: "no-ai-slop-ja, japanese-humanizer" },
  { p: both("助走と劇的な断片", "Build-ups and dramatic fragments"), b: "答えは？ シンプルです。自動化。", a: "答えは自動化です。", s: "no-ai-slop-ja, textlint ai-writing, humanizer" },
];

const excluded: Array<{ p: L; why: L }> = [
  { p: both("ダークモード", "Dark mode"), why: both("多くの製品で正当な選択", "A legitimate choice for many products") },
  { p: both("アイコンだけのナビ", "Icon-only navigation"), why: both("ラベルとツールチップがあれば密なアプリの標準", "Standard in dense apps when tooltips and labels exist") },
  { p: both("中央寄せのヒーロー単体", "A centered hero on its own"), why: both("問題は定型の組み合わせのほう", "The template combination is the tell, not this alone") },
  { p: both("ベントーグリッド", "Bento grids"), why: both("推奨する出典もあり、AI の既定と呼ぶ出典がそろわない", "Some sources recommend it; no agreement that it is a default") },
  { p: both("セリフの見出し", "Serif headings"), why: both("ブリーフしだいで正当", "Valid when the brief calls for it") },
  { p: both("AI 機能の目印の ✨", "✨ as the mark for an AI feature"), why: both("文字ラベルと組めば製品の判断", "A product decision when paired with a text label") },
  { p: both("体言止めの見出し", "Noun-ending Japanese headings"), why: both("日本語の見出しとラベルでは普通", "Normal in Japanese headings and labels") },
  { p: both("「！」の多用", "Frequent exclamation marks"), why: both("ブランドの声による", "Depends on the brand voice") },
];

const hacks: Array<{ name: string; what: L; install: string; url: string }> = [
  { name: "Anthropic frontend-design", what: both("AI に寄りがちな特徴を挙げ、設計で避けさせる", "Lists convergent AI traits and steers away from them"), install: "/plugin marketplace add anthropics/skills", url: "https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md" },
  { name: "taste-skill", what: both("既定の書体・配色・カード・仮の名前を禁止", "Bans default fonts, colors, cards and placeholder names"), install: "npx skills add https://github.com/Leonxlnx/taste-skill", url: "https://github.com/Leonxlnx/taste-skill" },
  { name: "impeccable", what: both("59 規則の検出器とデザインの床", "A 59-rule detector and a design floor"), install: "npx impeccable install", url: "https://github.com/pbakaus/impeccable" },
  { name: "humanizer", what: both("英語の AI 文 26 パターンを直す", "Fixes 26 English AI-writing patterns"), install: "/plugin marketplace add blader/humanizer", url: "https://github.com/blader/humanizer" },
  { name: "No AI Slop", what: both("英語の文章から定型 10 型を外す。検出だけもできる", "Strips 10 named English templates; can detect only"), install: "npx skills add petergyang/no-ai-slop --skill no-ai-slop --global --yes", url: "https://github.com/petergyang/no-ai-slop" },
  { name: "anti-slop", what: both("画面・文章・コードのコメントの既定を 38 規則で落とす", "38 rules for UI, copy and code comments"), install: "npx antislop-ai", url: "https://github.com/miqdadbadjuber/anti-slop" },
  { name: "hallmark", what: both("58 項目のスロップテスト", "A 58-gate slop test"), install: "npx skills add nutlope/hallmark", url: "https://github.com/Nutlope/hallmark" },
  { name: "vercel-labs/agent-skills", what: both("UI の規則 100 以上", "100+ UI rules"), install: "npx skills add vercel-labs/agent-skills", url: "https://github.com/vercel-labs/agent-skills" },
  { name: "ui-skills (baseline-ui)", what: both("頼まれない限りグラデーション・光・動きを足さない", "No gradients, glows or motion unless asked"), install: "npx ui-skills get baseline-ui", url: "https://github.com/ibelick/ui-skills" },
  { name: "natural-japanese", what: both("日本語のビジネス文の規則と lint", "Japanese business-writing rules and lint"), install: "npx skills add coji/natural-japanese", url: "https://github.com/coji/natural-japanese" },
  { name: "textlint ai-writing", what: both("AI らしい日本語を lint で検出", "Lints AI-like Japanese"), install: "npm i -D @textlint-ja/textlint-rule-preset-ai-writing", url: "https://github.com/textlint-ja/textlint-rule-preset-ai-writing" },
  { name: "no-ai-slop-ja", what: both("日本語の 21 パターン、悪い例と良い例つき", "21 Japanese patterns with bad and good examples"), install: "npx skills add 53able/no-ai-slop-ja --skill no-ai-slop-ja --global --yes", url: "https://github.com/53able/no-ai-slop-ja" },
  { name: "japanese-humanizer", what: both("翻訳調と冗長な言い回しを直す", "Fixes translationese and redundancy"), install: "npx skills add geonwoo-jeong/japanese-humanizer", url: "https://github.com/geonwoo-jeong/japanese-humanizer" },
];

function build(l: "ja" | "en") {
  return {
    patterns: (rows: Array<{ p: L; f: L; s: string }>): Pattern[] => rows.map((r) => ({ pattern: r.p[l], fix: r.f[l], sources: r.s })),
    copy: (rows: Array<{ p: L; b: string; a: string; s: string }>): CopyPair[] => rows.map((r) => ({ pattern: r.p[l], before: r.b, after: r.a, sources: r.s })),
    excluded: excluded.map((e) => ({ pattern: e.p[l], why: e.why[l] })),
    hacks: hacks.map((h) => ({ name: h.name, what: h.what[l], install: h.install, url: h.url })) as Hack[],
  };
}

const J = build("ja");
const E = build("en");

const ja = {
  title: "脱AIスロップ",
  lead: "生成 AI が既定で出す見た目と言葉。複数の出典がそろって挙げる典型だけ。",
  statLabel: "パターン",
  readKnowledge: "ナレッジで出典を読む",
  avoid: "避ける",
  use: "採用",
  fix: "直し方",
  sourcesLabel: "出典",
  before: "Before",
  after: "After",
  design: {
    title: "デザイン",
    lead: "決めていない画面は、同じ色・同じ書体・同じ飾りに寄る。",
    heroBad: "AI の力で、あなたの体験を次のレベルへ。",
    heroBadSub: "シームレスで革新的なワークフローを。",
    heroBadCta: "今すぐはじめる",
    heroGood: "請求書を 3 分で作って送る",
    heroGoodSub: "取引先と金額を入れると、PDF とメールの下書きができます。",
    heroGoodCta: "請求書を作る",
    heroBadLabel: "紫から青のグラデーション、光るボタン、中身のない見出し",
    heroGoodLabel: "単色の面、結果を言う見出し、動詞のボタン",
    cardsBadLabel: "角丸アイコンタイル＋見出しのカード 3 枚、片側の色帯、絵文字",
    cardsGoodLabel: "並列の項目は一覧で。数字と条件で言い切る",
    cardsBad: [
      ["⚡", "高速", "圧倒的なスピードを実現。"],
      ["🔒", "安全", "あらゆる脅威から保護。"],
      ["✨", "簡単", "誰でもすぐに使える。"],
    ] as Array<[string, string, string]>,
    cardsGood: [
      ["作成", "取引先を選ぶと、前回の明細を引き継ぐ"],
      ["送信", "PDF を添付したメールを下書きで開く"],
      ["入金", "振込を照合し、未入金だけを並べる"],
    ] as Array<[string, string]>,
    rows: J.patterns(design),
  },
  components: {
    title: "コンポーネントとレイアウト",
    lead: "部品の並べ方にも定型がある。組み合わさると AI の既定に見える。",
    headBadLabel: "アイブロウのピル、意味のない番号、作った数字、末尾の →",
    headGoodLabel: "見出しと導入文だけ。数字は本物のときだけ",
    headBadPill: "✨ NEW",
    headBadNum: "01",
    headBadTitle: "次世代の請求体験",
    headBadStat: "10x",
    headBadStatLabel: "高速化",
    headBadLink: "詳しく見る →",
    headGoodTitle: "請求書",
    headGoodLead: "作成から入金の確認まで、1 つの画面で進めます。",
    headGoodLink: "請求書の作り方",
    rows: J.patterns(components),
  },
  copyEn: { title: "文章（英語）", lead: "中身のない言い回しを外し、具体的な結果を言う。", rows: J.copy(copyEn) },
  copyJa: { title: "文章（日本語）", lead: "直訳調と抽象語を外し、主体と動詞で言い切る。", rows: J.copy(copyJa) },
  excluded: { title: "載せないもの", lead: "製品や利用者で正解が変わるので、AI スロップとは呼ばない。", rows: J.excluded },
  hacks: { title: "ハック", lead: "入れるだけで既定から離れる Skill と lint。2026-10-13 と 14 に確認。", install: "入れ方", rows: J.hacks },
  dataNote: "数値と禁止項目の正本は AwesomeDS/foundations/anti-patterns.md と content-and-tone.md。原則 7「生成の既定を設計にしない」。",
};

export type AntiSlopMessages = typeof ja;

const en: AntiSlopMessages = {
  title: "Beyond AI slop",
  lead: "What generative AI produces by default. Only patterns that several sources agree on.",
  statLabel: "patterns",
  readKnowledge: "Read the sources in Knowledge",
  avoid: "Avoid",
  use: "Use",
  fix: "Fix",
  sourcesLabel: "Sources",
  before: "Before",
  after: "After",
  design: {
    ...ja.design,
    title: "Design",
    lead: "A screen nobody decided on drifts to the same colors, fonts and decoration.",
    heroBadLabel: "Purple-to-blue gradient, glowing button, empty headline",
    heroGoodLabel: "Solid surface, a headline that names the result, a verb button",
    cardsBadLabel: "Three icon-tile cards, a side stripe, emoji",
    cardsGoodLabel: "Parallel items as a list. Commit to numbers and conditions",
    rows: E.patterns(design),
  },
  components: {
    ...ja.components,
    title: "Components and layout",
    lead: "Arrangement has defaults too. Combined, they read as generated.",
    headBadLabel: "Eyebrow pill, meaningless number, invented stat, trailing arrow",
    headGoodLabel: "Heading and lede only. Numbers only when real",
    rows: E.patterns(components),
  },
  copyEn: { title: "Copy (English)", lead: "Drop the empty phrasing and say the concrete result.", rows: E.copy(copyEn) },
  copyJa: { title: "Copy (Japanese)", lead: "Drop translationese and abstractions. Name who acts, with a verb.", rows: E.copy(copyJa) },
  excluded: { title: "Not listed", lead: "The right answer depends on the product or audience, so these are not slop.", rows: E.excluded },
  hacks: { title: "Hacks", lead: "Skills and lint that move output away from the defaults. Checked on 2026-10-13.", install: "Install", rows: E.hacks },
  dataNote: "Numbers and banned items live in AwesomeDS/foundations/anti-patterns.md and content-and-tone.md. Principle 7: generation defaults are not design decisions.",
};

export const antiSlopMessages: Localized<AntiSlopMessages> = { ja, en };
