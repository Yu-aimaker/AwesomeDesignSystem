import type { Localized } from "../locales";

const ja = {
  title: "文字",
  lead: "Geist と Noto Sans JP、8 段階のサイズ、3 つの太さ。階層は文字だけで作ります。",
  rolesTitle: "タイプロール",
  rolesLead: "tokens.json に定義された 11 のロール。日本語と欧文の実寸を並べています。",
  stackTitle: "フォントスタック",
  stackLead: "欧文は Geist、日本語は Noto Sans JP。両方とも可変フォントで、x ハイトが近いので混植しても段差が出ません。",
  stackNote:
    "このサイトでは fontsource パッケージから自前配信しています。Noto Sans JP は 120 個の unicode-range サブセットに分割され、ページに現れた文字の分だけ読み込まれます。",
  japaneseTitle: "日本語組版の規則",
  japaneseLead: "同じ文章を行間 1.5 と 1.8 で並べています。右のほうが行の切れ目を追いやすいはずです。",
  leading15: "line-height: 1.5（欧文向けの値）",
  leading18: "line-height: 1.8（--ds-leading-body-ja）",
  paltTitle: "見出しのみ palt（プロポーショナル詰め）",
  paltCaption: "上が palt あり、下がなし。本文で詰めると行のリズムが崩れるので見出しだけに使います。",
  tabularTitle: "tabular-nums で数字を揃える",
  amounts: ["1,111,111 円", "9,999,999 円"],
  rules: [
    ["line-break: strict", " で行頭の句読点を禁止する。"],
    ["overflow-wrap: anywhere", " で長い URL やトークン名をはみ出させない。"],
    ["", "字間は 0 から 0.02em。日本語に負の字間は使わない。"],
    ["", "見出しの行間は 1.4 から 1.5。欧文の 1.2 では詰まりすぎる。"],
  ] as Array<[string, string]>,
  whyTitle: "なぜこの選択か",
  why: [
    "Geist はスクリーン表示のために設計され、OFL で配布されています。可変フォントなので 400、500、600 の 3 ウェイトを 1 ファイルで賄えます。タブラー数字を持つため、表や価格の桁が揃います。",
    "Noto Sans JP は日本語フォントの中で最も収録字数が多く、こちらも可変です。Geist と x ハイトが近く、混植したときに欧文が浮いたり沈んだりしません。DESIGN.md §3 はこう書いています。「Latin と Japanese は 2 つのサブセットとして読み込む。5 MB のファイルを 1 つで配ってはいけない」。",
    "サイズは 12、14、16、18、20、28、36、56 の 8 段階に絞っています。段階が多いと、似た大きさの文字が同じ画面に並び、階層が読めなくなります。12px 未満は使いません。太さは本文 400、ラベル 500、見出し 600 に固定し、700 以上は display 以外で使いません。",
    "行間は欧文 1.6、日本語 1.8。日本語は文字の上下いっぱいまで字面があるため、同じ行間だと行がくっついて見えます。行長の上限は欧文 65ch、日本語は全角 40 字です。長すぎる行は視線が戻る位置を見失います。",
  ],
  sourceNotes: {
    geist: "Vercel。OFL ライセンス、可変フォント、タブラー数字",
    noto: "Google Fonts。可変、JIS 第 1 から第 4 水準まで収録",
    jlreq: "W3C。禁則、行間、字間の基礎",
    wcag: "行間 1.5 倍、段落間 2 倍まで壊れないこと",
    lineLength: "1 行 45 から 90 文字",
    numeric: "tabular-nums",
  },
};

export type TypographyMessages = typeof ja;

const en: TypographyMessages = {
  title: "Typography",
  lead: "Geist and Noto Sans JP, eight sizes, three weights. Hierarchy comes from type alone.",
  rolesTitle: "Type roles",
  rolesLead: "The 11 roles defined in tokens.json, shown at real size in Japanese and English.",
  stackTitle: "Font stack",
  stackLead: "Geist for Latin, Noto Sans JP for Japanese. Both are variable fonts with close x-heights, so mixed text stays level.",
  stackNote:
    "This site self-hosts both from fontsource packages. Noto Sans JP is split into 120 unicode-range subsets, and only the subsets for characters on the page are loaded.",
  japaneseTitle: "Japanese typesetting rules",
  japaneseLead: "The same Japanese paragraph at line height 1.5 and 1.8. Line breaks are easier to follow on the right.",
  leading15: "line-height: 1.5 (a Latin value)",
  leading18: "line-height: 1.8 (--ds-leading-body-ja)",
  paltTitle: "palt (proportional spacing) on headings only",
  paltCaption: "Top with palt, bottom without. In body text it breaks the rhythm of the line, so use it on headings only.",
  tabularTitle: "Align figures with tabular-nums",
  amounts: ["¥1,111,111", "¥9,999,999"],
  rules: [
    ["line-break: strict", " keeps punctuation from starting a line."],
    ["overflow-wrap: anywhere", " keeps long URLs and token names from overflowing."],
    ["", "Letter spacing 0 to 0.02em. No negative tracking in Japanese."],
    ["", "Heading line height 1.4 to 1.5. The Latin 1.2 is too tight for Japanese."],
  ],
  whyTitle: "Why these choices",
  why: [
    "Geist is designed for screens and released under the OFL. As a variable font, one file covers the three weights 400, 500 and 600. Its tabular figures keep digits aligned in tables and prices.",
    "Noto Sans JP has the largest character set among Japanese fonts and is also variable. Its x-height is close to Geist, so Latin words do not float or sink in mixed text. DESIGN.md §3 says: \"Load Latin and Japanese as two subsets. Never ship one 5 MB file.\"",
    "Sizes are limited to eight steps: 12, 14, 16, 18, 20, 28, 36, 56. With more steps, similar sizes end up on one screen and the hierarchy stops reading. Nothing goes below 12px. Weights are fixed at 400 for body, 500 for labels, 600 for headings; 700 and above only for display.",
    "Line height is 1.6 for Latin and 1.8 for Japanese. Japanese glyphs fill the full em box, so at the same line height the lines look stuck together. Line length is capped at 65ch for Latin and 40 full-width characters for Japanese. In longer lines the eye loses where the next line starts.",
  ],
  sourceNotes: {
    geist: "Vercel. OFL license, variable font, tabular figures",
    noto: "Google Fonts. Variable, covers JIS levels 1 to 4",
    jlreq: "W3C. Basics of line breaking, line spacing and letter spacing",
    wcag: "Must not break at 1.5x line height and 2x paragraph spacing",
    lineLength: "45 to 90 characters per line",
    numeric: "tabular-nums",
  },
};

export const typographyMessages: Localized<TypographyMessages> = { ja, en };
