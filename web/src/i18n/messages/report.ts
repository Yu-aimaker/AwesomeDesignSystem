import type { Localized } from "../locales";

const ja = {
  title: "HTMLレポート",
  lead: "報告は HTML 1枚です。結論を3文で先に置き、表か図を1つだけ添えます。",
  statLabel: "枚",
  readKnowledge: "ナレッジの全文",
  how: {
    title: "使い方",
    lead: "レポートや計画を頼むと、html-report が HTML 1枚を書きます。",
    invoke: "/awesome-ds:html-report",
    steps: [
      { title: "先に読む", body: "文章の原則とトークンを読んでから書きます。色を別に作りません。" },
      { title: "順番は固定", body: "題、結論3文、表か図を1つ、短い本文、出典。" },
      { title: "大きな面", body: "白地に濃い文字です。アクセントはリンクだけに使います。" },
    ],
  },
  examples: {
    title: "良い例と悪い例",
    lead: "悪い例は暗い面と長い一文です。良い例は白地の3文と表1つです。",
    goodLabel: "こう書く",
    badLabel: "こうは書かない",
    goodTitle: "直す範囲",
    goodLines: ["直すのは 3 件です。", "次はプレビューを開きます。", "HTML をブラウザで読みます。"],
    tableCaption: "報告の内訳",
    rows: [
      { item: "件数", value: "3" },
      { item: "次", value: "プレビュー" },
    ],
    badTitle: "次世代の報告",
    badBody: "革新的でシームレスな体験を実現することができます。",
    badCards: ["革新", "統一", "未来"],
  },
  rules: {
    title: "守ること",
    lead: "値は AwesomeDS のトークンです。報告の中に別の色を書きません。",
    rows: [
      { label: "入れ物", value: "HTML 1枚。React のバンドルは使わない" },
      { label: "キャンバス", value: "canvas。大きな面は白" },
      { label: "文字", value: "ink。濃い色" },
      { label: "アクセント", value: "accent。リンクだけ" },
      { label: "結論", value: "3文。先に置く" },
      { label: "本文", value: "日本語 1,500 字未満を目安" },
      { label: "幅", value: "最大 40rem。390px で横にスクロールしない" },
    ],
  },
  sourcesTitle: "出典",
  sources: [
    {
      title: "anthropics/skills README",
      url: "https://raw.githubusercontent.com/anthropics/skills/main/README.md",
      note: "文書スキルの位置づけ。2026-10-11 に取得",
    },
    {
      title: "web-artifacts-builder",
      url: "https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md",
      note: "React を 1枚にまとめる別経路。単純な報告には使わない",
    },
    {
      title: "anthropics/skills",
      url: "https://github.com/anthropics/skills",
      note: "2026-10-11 時点で stars 180,427、最終 push 2026-10-09",
    },
    {
      title: "Claude can now create and edit files",
      url: "https://www.anthropic.com/news/create-files",
      note: "README が文書スキルの出典としてリンクしている",
    },
  ],
  dataNote: "正本は Knowledge の html-report と Plugin の html-report Skill です。",
};

export type ReportMessages = typeof ja;

const en: ReportMessages = {
  title: "HTML report",
  lead: "A report is one HTML file. Three sentences come first, then one table or one figure.",
  statLabel: "file",
  readKnowledge: "Full knowledge note",
  how: {
    title: "How to use it",
    lead: "Ask for a report or a plan and html-report writes one HTML file.",
    invoke: "/awesome-ds:html-report",
    steps: [
      { title: "Read first", body: "Read the tone notes and the tokens before writing. Do not invent a second palette." },
      { title: "Fixed order", body: "Title, three sentences, one table or figure, a short body, sources." },
      { title: "Large surfaces", body: "White canvas, dark text. The accent is for links only." },
    ],
  },
  examples: {
    title: "Good and bad",
    lead: "The bad example is a dark surface and one long sentence. The good example is three sentences and one table on white.",
    goodLabel: "Write this",
    badLabel: "Do not write this",
    goodTitle: "What to fix",
    goodLines: ["Three items need a fix.", "Next, open the preview.", "Read the HTML in a browser."],
    tableCaption: "What the report contains",
    rows: [
      { item: "Items", value: "3" },
      { item: "Next", value: "Preview" },
    ],
    badTitle: "A next-generation report",
    badBody: "We can realize an innovative and seamless experience.",
    badCards: ["New", "One", "Future"],
  },
  rules: {
    title: "Rules",
    lead: "The values are AwesomeDS tokens. The report does not invent another palette.",
    rows: [
      { label: "Container", value: "One HTML file. No React bundle" },
      { label: "Canvas", value: "canvas. Large surfaces stay white" },
      { label: "Text", value: "ink. Dark text" },
      { label: "Accent", value: "accent. Links only" },
      { label: "Conclusion", value: "Three sentences, first" },
      { label: "Body", value: "Under 1,500 Japanese characters as a guide" },
      { label: "Width", value: "40rem max. No sideways scroll at 390px" },
    ],
  },
  sourcesTitle: "Sources",
  sources: [
    {
      title: "anthropics/skills README",
      url: "https://raw.githubusercontent.com/anthropics/skills/main/README.md",
      note: "Where the document skills sit. Fetched 2026-10-11",
    },
    {
      title: "web-artifacts-builder",
      url: "https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md",
      note: "A React bundle path. Not for a simple report",
    },
    {
      title: "anthropics/skills",
      url: "https://github.com/anthropics/skills",
      note: "180,427 stars and last push 2026-10-09, as of 2026-10-11",
    },
    {
      title: "Claude can now create and edit files",
      url: "https://www.anthropic.com/news/create-files",
      note: "The README links this as the source for the document skills",
    },
  ],
  dataNote: "The source of truth is the html-report knowledge note and the html-report skill.",
};

export const reportMessages: Localized<ReportMessages> = { ja, en };
