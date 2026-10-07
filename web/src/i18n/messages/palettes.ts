import type { Localized } from "../locales";

const ja = {
  temp: { warm: "暖色", cool: "寒色", neutral: "無彩色" },
  title: "パレット",
  lead: "白地、黒文字、アクセント 1 色。クリックすると、このサイト全体がその色を着ます。",
  statLabel: "配色",
  currentRoles: "いまの 3 色",
  canvas: "地",
  ink: "文字",
  accent: "アクセント",
  curatedTitle: "選定",
  curatedLead: "OKLCH で明度を固定。どの色相でも文字として 4.5:1 を満たす。ライトとダークの 2 値を持つ。",
  brandsTitle: "ブランド",
  brandsLead: (n: number) => `${n} 社の DESIGN.md から地、文字、アクセントを抽出。数字は白地でのアクセントのコントラスト。`,
  all: "すべて",
  japan: "日本",
  global: "海外",
  allHues: "全色相",
  darkFirst: "ダーク基調",
  searchPlaceholder: "ブランド、hex",
  notFoundTitle: "見つかりません",
  notFoundBody: "絞り込みを外すか、別の語で検索してください。",
  tryAccent: (name: string, hex: string) => `${name} のアクセント ${hex} を試す`,
  lowContrast: "文字色としては不足。試着時は暗くします",
  dataNote: "出典は voltagent/awesome-design-md と kzhrknt/awesome-design-md-jp の DESIGN.md。色は各社の権利物で、参照と学習のために掲載しています。選定 24 色は MIT。",
};

export type PalettesMessages = typeof ja;

const en: PalettesMessages = {
  temp: { warm: "Warm", cool: "Cool", neutral: "Neutral" },
  title: "Palettes",
  lead: "White canvas, black ink, one accent. Click a palette and this whole site wears that color.",
  statLabel: "palettes",
  currentRoles: "Current three colors",
  canvas: "Canvas",
  ink: "Ink",
  accent: "Accent",
  curatedTitle: "Curated",
  curatedLead: "Lightness fixed in OKLCH, so every hue reaches 4.5:1 as text. Each has a light and a dark value.",
  brandsTitle: "Brands",
  brandsLead: (n) => `Canvas, ink and accent extracted from the DESIGN.md files of ${n} companies. The number is the accent's contrast on white.`,
  all: "All",
  japan: "Japan",
  global: "Global",
  allHues: "All hues",
  darkFirst: "Dark first",
  searchPlaceholder: "Brand or hex",
  notFoundTitle: "No matches",
  notFoundBody: "Clear a filter or try another term.",
  tryAccent: (name, hex) => `Try the ${name} accent ${hex}`,
  lowContrast: "Too low for text. Darkened when applied",
  dataNote: "Sources: the DESIGN.md files in voltagent/awesome-design-md and kzhrknt/awesome-design-md-jp. Colors belong to each company and are shown for reference and learning. The 24 curated palettes are MIT.",
};

export const palettesMessages: Localized<PalettesMessages> = { ja, en };
