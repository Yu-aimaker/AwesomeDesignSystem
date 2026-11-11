export const ORIGIN = "https://awesomeds.yumaker.studio";

export type Locale = "ja" | "en";

export interface PageCopy {
  title: string;
  description: string;
}

export const OG_IMAGE = `${ORIGIN}/og-image.png`;

export const ogAlt: Record<Locale, string> = {
  ja: "AwesomeDS のロゴと、canvas、ink、hairline、accent の色見本、余白の刻み、ボタンの例",
  en: "AwesomeDS logo, color swatches, spacing steps, and a button example",
};

export const pages: Record<string, Record<Locale, PageCopy>> = {
  "/": {
    ja: {
      title: "AwesomeDS",
      description: "白地、黒文字、アクセント 1 色。AI コーディングエージェント向けデザインシステムの仕様と実例。",
    },
    en: {
      title: "AwesomeDS",
      description: "White canvas, black ink, one accent. The spec and examples of a design system for AI coding agents.",
    },
  },
  "/foundations": {
    ja: { title: "基盤", description: "文字、色、余白、角丸、奥行き、モーション、レスポンシブ。見て、触って、比べる。" },
    en: { title: "Foundations", description: "Type, color, spacing, radius, elevation, motion, and responsive rules to see, try, and compare." },
  },
  "/foundations/typography": {
    ja: { title: "文字", description: "Geist と Noto Sans JP。8 段階のサイズ、3 つの太さ。階層は文字だけで作る。" },
    en: { title: "Typography", description: "Geist and Noto Sans JP, eight sizes, three weights. Hierarchy comes from type alone." },
  },
  "/foundations/color": {
    ja: { title: "色", description: "色は色相ではなくロールで指定する。部品から hex を直接参照しない。" },
    en: { title: "Color", description: "Colors are named by role, not by hue. Components do not reference a hex value directly." },
  },
  "/foundations/spacing": {
    ja: { title: "余白とレイアウト", description: "4px を単位にし、距離の意味を 4 段階に固定する。" },
    en: { title: "Spacing and layout", description: "A 4px unit, with the meaning of distance fixed at four steps." },
  },
  "/foundations/radius": {
    ja: { title: "角丸", description: "操作部品 8px、カード 12px、ダイアログ 16px、バッジとアバターはピル。" },
    en: { title: "Radius", description: "Controls 8px, cards 12px, dialogs 16px, badges and avatars pill." },
  },
  "/foundations/elevation": {
    ja: { title: "奥行き", description: "面は 1px の線で区切る。影は浮いているものだけ、段階は 3 つ。" },
    en: { title: "Elevation", description: "Surfaces are separated by a 1px line. Shadows are only for things that float, in three levels." },
  },
  "/foundations/motion": {
    ja: { title: "モーションの規則", description: "動きは操作への応答。短く、ease-out で、移動は数ピクセル。いつでも止められる。" },
    en: { title: "Motion rules", description: "Motion is a response to input. Short, ease-out, a few pixels of travel, and always possible to turn off." },
  },
  "/foundations/responsive": {
    ja: { title: "レスポンシブ", description: "端末ではなく幅で決める。320 から 1440 まで同じ機能で、変えるのは列とナビと余白。" },
    en: { title: "Responsive", description: "Decide by width, not by device. Every width from 320 to 1440 keeps the same functions." },
  },
  "/fonts": {
    ja: { title: "フォント", description: "製品で使われる書体を、その書体で示す見本。使用数は各社の DESIGN.md から数える。" },
    en: { title: "Fonts", description: "Typefaces used by leading products, set in each typeface. Counts come from each DESIGN.md." },
  },
  "/palettes": {
    ja: { title: "パレット", description: "白地、黒文字、アクセント 1 色。選ぶと、このサイト全体がその色になる。" },
    en: { title: "Palettes", description: "White canvas, black ink, one accent. Choose a palette and this site wears that color." },
  },
  "/components": {
    ja: { title: "コンポーネント", description: "props を変えると、表示とコードが一緒に変わる UI 部品。" },
    en: { title: "Components", description: "Change the props and the preview and the code change together." },
  },
  "/motion": {
    ja: { title: "モーションギャラリー", description: "duration と easing を動かして目で決める。Motion、GSAP、three.js、Lottie。" },
    en: { title: "Motion gallery", description: "Adjust duration and easing and judge by eye. Motion, GSAP, three.js, and Lottie." },
  },
  "/stack": {
    ja: { title: "スタック", description: "1 層に 1 つ。代替は、いつ勝つかを 1 行で持つ。" },
    en: { title: "Stack", description: "One pick per layer. Each alternative has one line on when it wins." },
  },
  "/rankings": {
    ja: { title: "ランキング", description: "デザインと AI フロントエンドの OSS を GitHub スターで並べた一覧。" },
    en: { title: "Rankings", description: "Open source for design and AI front ends, ranked by GitHub stars." },
  },
  "/sites": {
    ja: { title: "おすすめサイト", description: "部品、動き、読み込み表示、見本帳、道具と資料、スキル。取り込み基準を通ったものだけ。" },
    en: { title: "Sites", description: "Components, motion, loading, galleries, tools, references, and skills that pass the intake check." },
  },
  "/report": {
    ja: { title: "HTMLレポート", description: "報告は HTML 1 枚。結論を 3 文で先に置き、表か図を 1 つ添える。" },
    en: { title: "HTML report", description: "A report is one HTML file. Three sentences come first, then one table or one figure." },
  },
  "/slides": {
    ja: { title: "スライド", description: "スライドは 16:9 の主張の列。大きな面は白、文字は濃くする。" },
    en: { title: "Slides", description: "A deck is a row of 16:9 claims. Large surfaces stay white and the text stays dark." },
  },
  "/anti-slop": {
    ja: { title: "脱AIスロップ", description: "生成 AI が既定で出す見た目と言葉。複数の出典がそろって挙げる典型と、直し方。" },
    en: { title: "Beyond AI slop", description: "What generative AI produces by default, limited to patterns several sources agree on, and how to fix them." },
  },
  "/knowledge": {
    ja: { title: "ナレッジ", description: "出典付きの要約。各項目に、AwesomeDS へ何を反映したかを書く。" },
    en: { title: "Knowledge", description: "Summaries with sources. Each note says what AwesomeDS took from it." },
  },
  "/sources": {
    ja: { title: "出典・ガイドライン", description: "デザインシステムの公式ガイドラインと、ナレッジが参照する外部リンク。" },
    en: { title: "Sources and guidelines", description: "Official design system guidelines, and the external links cited by the knowledge notes." },
  },
  "/about": {
    ja: { title: "このサイトについて", description: "リポジトリの構成、プラグインの入れ方、更新の流れ。" },
    en: { title: "About this site", description: "Repository layout, how to install the plugin, and how updates happen." },
  },
  "/character": {
    ja: { title: "キャラクター", description: "エースは AwesomeDS のアイコンから描いたマスコット。モーションの見本と設計の記録。" },
    en: { title: "Character", description: "Ace is a mascot drawn from the AwesomeDS icon. A motion sample and a record of the design." },
  },
};
