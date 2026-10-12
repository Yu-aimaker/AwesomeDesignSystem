import type { Localized } from "../locales";

const ja = {
  title: "スライド",
  lead: "スライドは 16:9 の主張の列です。大きな面は白、文字は濃くします。",
  statLabel: "枚",
  readKnowledge: "ナレッジの全文",
  sample: {
    prev: "前へ",
    next: "次へ",
    slides: [
      { title: "1枚に主張は1つ", sentence: "16:9 の白地です。" },
      { title: "文字は濃く", sentence: "本文は 18px 以上にします。" },
      { title: "送り方", items: ["矢印キー", "前へと次へ", "枚数は文字"] },
    ],
  },
  examples: {
    title: "良い例と悪い例",
    lead: "良い面は白です。悪い面はグラデーションと、同じ大きさのカード3枚です。",
    goodLabel: "こう書く",
    badLabel: "こうは書かない",
    badTitle: "革新的な未来",
    badBody: "シームレスな体験を実現します。",
    badCards: ["速く", "安全", "新しい"],
  },
  how: {
    title: "使い方",
    lead: "スライドを頼むと slides が HTML 1枚を書きます。pptx は頼まれたときだけです。",
    invoke: "/awesome-ds:slides",
    steps: [
      { title: "先に読む", body: "文章の原則とトークンを読んでから書きます。" },
      { title: "1枚の中身", body: "見出しと、文1つか、項目4つまで。" },
      { title: "配布", body: "本体は HTML です。PowerPoint を指定されたときだけ pptx にします。" },
    ],
  },
  popular: {
    title: "他のスライド Skill",
    lead: "用途が違うものは、出典の URL つきで分けます。",
    rows: [
      {
        name: "slides",
        when: "AwesomeDS の白地。1枚に主張は1つ。",
        url: "https://github.com/Yu-aimaker/AwesomeDesignSystem/blob/main/Plugin/awesome-ds/skills/slides/SKILL.md",
      },
      {
        name: "Frontend Slides",
        when: "そのプラグインの見本か、pptx から HTML への変換。2026-10-11 に stars 30,450、MIT。",
        url: "https://github.com/zarazhangrui/frontend-slides",
      },
      {
        name: "Anthropic pptx",
        when: "実体の .pptx を作るとき。",
        url: "https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md",
      },
    ],
  },
  rules: {
    title: "守ること",
    lead: "値は AwesomeDS のトークンです。スライドの中に別の色を書きません。",
    rows: [
      { label: "比率", value: "16:9" },
      { label: "キャンバス", value: "canvas。大きな面は白" },
      { label: "文字", value: "ink。18px 以上" },
      { label: "アクセント", value: "accent。1枚に1回まで" },
      { label: "中身", value: "見出しと、文1つか、項目4つまで" },
      { label: "枚数", value: "1 / 3 のように文字で出す" },
    ],
  },
  sourcesTitle: "出典",
  sources: [
    {
      title: "Frontend Slides README",
      url: "https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md",
      note: "機能と、紫のグラデーションを避ける一文。2026-10-11",
    },
    {
      title: "zarazhangrui/frontend-slides",
      url: "https://github.com/zarazhangrui/frontend-slides",
      note: "stars 30,450、最終 push 2026-06-23、MIT。2026-10-11",
    },
    {
      title: "Anthropic pptx",
      url: "https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md",
      note: "16:9 は 10 x 5.625 インチ。色はハッシュなしの 6 桁",
    },
  ],
  dataNote: "正本は Knowledge の slides と Plugin の slides Skill です。",
};

export type SlidesMessages = typeof ja;

const en: SlidesMessages = {
  title: "Slides",
  lead: "A deck is a row of 16:9 claims. Large surfaces stay white and the text stays dark.",
  statLabel: "slides",
  readKnowledge: "Full knowledge note",
  sample: {
    prev: "Previous",
    next: "Next",
    slides: [
      { title: "One claim per slide", sentence: "A 16:9 white canvas." },
      { title: "Dark text", sentence: "Body text is at least 18px." },
      { title: "How to move", items: ["Arrow keys", "Previous and next", "The index is text"] },
    ],
  },
  examples: {
    title: "Good and bad",
    lead: "The good surface is white. The bad surface is a gradient and three equal cards.",
    goodLabel: "Write this",
    badLabel: "Do not write this",
    badTitle: "An innovative future",
    badBody: "We deliver a seamless experience.",
    badCards: ["Fast", "Safe", "New"],
  },
  how: {
    title: "How to use it",
    lead: "Ask for slides and slides writes one HTML file. pptx only when someone asks for it.",
    invoke: "/awesome-ds:slides",
    steps: [
      { title: "Read first", body: "Read the tone notes and the tokens before writing." },
      { title: "One slide", body: "A heading, plus one sentence or at most four items." },
      { title: "Hand-off", body: "The file is HTML. Use pptx only when someone names PowerPoint." },
    ],
  },
  popular: {
    title: "Other slide skills",
    lead: "Skills with a different job stay separate, each with a source URL.",
    rows: [
      {
        name: "slides",
        when: "An AwesomeDS deck. White slides, one claim each.",
        url: "https://github.com/Yu-aimaker/AwesomeDesignSystem/blob/main/Plugin/awesome-ds/skills/slides/SKILL.md",
      },
      {
        name: "Frontend Slides",
        when: "That plugin's previews, or a pptx to HTML conversion. 30,450 stars, MIT, as of 2026-10-11.",
        url: "https://github.com/zarazhangrui/frontend-slides",
      },
      {
        name: "Anthropic pptx",
        when: "When the file must be a real .pptx.",
        url: "https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md",
      },
    ],
  },
  rules: {
    title: "Rules",
    lead: "The values are AwesomeDS tokens. A slide does not invent another palette.",
    rows: [
      { label: "Ratio", value: "16:9" },
      { label: "Canvas", value: "canvas. Large surfaces stay white" },
      { label: "Text", value: "ink. At least 18px" },
      { label: "Accent", value: "accent. At most once per slide" },
      { label: "Contents", value: "A heading, plus one sentence or at most four items" },
      { label: "Index", value: "Text such as 1 / 3" },
    ],
  },
  sourcesTitle: "Sources",
  sources: [
    {
      title: "Frontend Slides README",
      url: "https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md",
      note: "Features, and the line about avoiding purple gradients. 2026-10-11",
    },
    {
      title: "zarazhangrui/frontend-slides",
      url: "https://github.com/zarazhangrui/frontend-slides",
      note: "30,450 stars, last push 2026-06-23, MIT. 2026-10-11",
    },
    {
      title: "Anthropic pptx",
      url: "https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md",
      note: "16:9 is 10 by 5.625 inches. Colors are 6 digits with no hash",
    },
  ],
  dataNote: "The source of truth is the slides knowledge note and the slides skill.",
};

export const slidesMessages: Localized<SlidesMessages> = { ja, en };
