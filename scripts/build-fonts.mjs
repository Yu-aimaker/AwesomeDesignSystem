#!/usr/bin/env node
// Builds AwesomeDS/data/fonts.json: typefaces used by well-designed products.
//   curated: metadata (foundry, license, where to get it) maintained here
//   usedBy:  measured from AwesomeDS/data/brands.json (fonts declared in each brand's DESIGN.md)
// Run: node scripts/build-fonts.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRANDS = join(root, "AwesomeDS/data/brands.json");
const OUT = join(root, "AwesomeDS/data/fonts.json");

// match: lowercase substrings that identify the family inside a CSS font stack.
// cssFamily: the family name the site renders with (null when the site does not ship the font).
// fontsource: npm package the site loads (variable where available).
const CURATED = [
  // ---- Latin sans
  { id: "geist", name: "Geist", category: "sans", designer: "Vercel, basement.studio", foundry: "Vercel", year: 2023, license: "OFL", url: "https://vercel.com/font", fontsource: "@fontsource-variable/geist", cssFamily: "Geist Variable", match: ["geist"], pairs: ["noto-sans-jp", "geist-mono"], note: "AwesomeDS の既定。幾何学的だが冷たくない" },
  { id: "inter", name: "Inter", category: "sans", designer: "Rasmus Andersson", foundry: "rsms", year: 2017, license: "OFL", url: "https://rsms.me/inter/", fontsource: "@fontsource-variable/inter", cssFamily: "Inter Variable", match: ["inter"], pairs: ["noto-sans-jp", "jetbrains-mono"], note: "最も使われる OSS 書体。UI の安全な選択" },
  { id: "sf-pro", name: "SF Pro", category: "sans", designer: "Apple", foundry: "Apple", year: 2015, license: "system", url: "https://developer.apple.com/fonts/", fontsource: null, cssFamily: null, match: ["sf pro", "-apple-system", "sf display"], pairs: ["hiragino-sans", "sf-mono"], note: "Apple 端末の標準。system-ui で参照する" },
  { id: "roboto", name: "Roboto", category: "sans", designer: "Christian Robertson", foundry: "Google", year: 2011, license: "OFL", url: "https://fonts.google.com/specimen/Roboto", fontsource: null, cssFamily: null, match: ["roboto"], pairs: ["noto-sans-jp"], note: "Android の標準。Material の既定" },
  { id: "helvetica-neue", name: "Helvetica Neue", category: "sans", designer: "Max Miedinger, Linotype", foundry: "Monotype", year: 1983, license: "proprietary", url: "https://www.myfonts.com/collections/neue-helvetica-font-linotype", fontsource: null, cssFamily: "Helvetica Neue", match: ["helvetica"], pairs: ["hiragino-sans"], note: "スポーツ、ファッションの定番。macOS には同梱" },
  { id: "sohne", name: "Söhne", category: "sans", designer: "Kris Sowersby", foundry: "Klim Type Foundry", year: 2019, license: "proprietary", url: "https://klim.co.nz/retail-fonts/soehne/", fontsource: null, cssFamily: null, match: ["söhne", "sohne", "soehne"], pairs: ["noto-sans-jp"], note: "OpenAI が採用。Akzidenz 系の現代解釈" },
  { id: "circular", name: "Circular", category: "sans", designer: "Laurenz Brunner", foundry: "Lineto", year: 2013, license: "proprietary", url: "https://lineto.com/typefaces/circular", fontsource: null, cssFamily: null, match: ["circular"], pairs: ["noto-sans-jp"], note: "幾何学サンズの代表。丸みが親しみを作る" },
  { id: "manrope", name: "Manrope", category: "sans", designer: "Mikhail Sharanda", foundry: "Independent", year: 2018, license: "OFL", url: "https://manropefont.com/", fontsource: "@fontsource-variable/manrope", cssFamily: "Manrope Variable", match: ["manrope"], pairs: ["noto-sans-jp"], note: "見出し向きの幾何学サンズ。数字が読みやすい" },
  { id: "dm-sans", name: "DM Sans", category: "sans", designer: "Colophon Foundry", foundry: "Google Fonts", year: 2019, license: "OFL", url: "https://fonts.google.com/specimen/DM+Sans", fontsource: "@fontsource-variable/dm-sans", cssFamily: "DM Sans Variable", match: ["dm sans"], pairs: ["noto-sans-jp"], note: "低コントラストで小さくても読める。SaaS で増加中" },
  { id: "space-grotesk", name: "Space Grotesk", category: "sans", designer: "Florian Karsten", foundry: "Independent", year: 2018, license: "OFL", url: "https://fonts.google.com/specimen/Space+Grotesk", fontsource: "@fontsource-variable/space-grotesk", cssFamily: "Space Grotesk Variable", match: ["space grotesk"], pairs: ["noto-sans-jp", "jetbrains-mono"], note: "技術系の見出しに。個性は強いので本文には使わない" },
  { id: "plus-jakarta-sans", name: "Plus Jakarta Sans", category: "sans", designer: "Gumpita Rahayu", foundry: "Tokotype", year: 2020, license: "OFL", url: "https://fonts.google.com/specimen/Plus+Jakarta+Sans", fontsource: "@fontsource-variable/plus-jakarta-sans", cssFamily: "Plus Jakarta Sans Variable", match: ["plus jakarta"], pairs: ["noto-sans-jp"], note: "柔らかい幾何学サンズ。スタートアップの LP に多い" },
  { id: "outfit", name: "Outfit", category: "sans", designer: "Rodrigo Fuenzalida", foundry: "On Brand Investments", year: 2021, license: "OFL", url: "https://fonts.google.com/specimen/Outfit", fontsource: "@fontsource-variable/outfit", cssFamily: "Outfit Variable", match: ["outfit"], pairs: ["noto-sans-jp"], note: "ブランド寄りの見出し書体。太いウェイトが映える" },
  { id: "figtree", name: "Figtree", category: "sans", designer: "Erik Kennedy", foundry: "Independent", year: 2022, license: "OFL", url: "https://fonts.google.com/specimen/Figtree", fontsource: "@fontsource-variable/figtree", cssFamily: "Figtree Variable", match: ["figtree"], pairs: ["noto-sans-jp"], note: "UI デザイナーが UI のために作った。Inter より温かい" },
  { id: "ibm-plex-sans", name: "IBM Plex Sans", category: "sans", designer: "Mike Abbink, Bold Monday", foundry: "IBM", year: 2017, license: "OFL", url: "https://www.ibm.com/plex/", fontsource: "@fontsource-variable/ibm-plex-sans", cssFamily: "IBM Plex Sans Variable", match: ["ibm plex sans", "plex sans"], pairs: ["ibm-plex-sans-jp"], note: "企業書体を OSS に。Mono、Serif、JP まで揃う" },
  { id: "public-sans", name: "Public Sans", category: "sans", designer: "Dan Williams, USWDS", foundry: "U.S. General Services Administration", year: 2019, license: "OFL", url: "https://public-sans.digital.gov/", fontsource: "@fontsource-variable/public-sans", cssFamily: "Public Sans Variable", match: ["public sans"], pairs: ["noto-sans-jp"], note: "米国政府のデザインシステム用。中立で実務的" },
  { id: "open-sans", name: "Open Sans", category: "sans", designer: "Steve Matteson", foundry: "Google", year: 2011, license: "OFL", url: "https://fonts.google.com/specimen/Open+Sans", fontsource: null, cssFamily: null, match: ["open sans"], pairs: ["noto-sans-jp"], note: "長く使われるヒューマニスト・サンズ。無難で読みやすい" },
  { id: "montserrat", name: "Montserrat", category: "sans", designer: "Julieta Ulanovsky", foundry: "Independent", year: 2011, license: "OFL", url: "https://fonts.google.com/specimen/Montserrat", fontsource: null, cssFamily: null, match: ["montserrat"], pairs: ["noto-sans-jp"], note: "ブエノスアイレスの看板から。見出し向き" },
  { id: "lato", name: "Lato", category: "sans", designer: "Łukasz Dziedzic", foundry: "tyPoland", year: 2010, license: "OFL", url: "https://fonts.google.com/specimen/Lato", fontsource: null, cssFamily: null, match: ["lato"], pairs: ["noto-sans-jp"], note: "半丸ゴシック的な温かさ。企業サイトに多い" },
  // ---- Latin serif
  { id: "source-serif-4", name: "Source Serif 4", category: "serif", designer: "Frank Grießhammer", foundry: "Adobe", year: 2014, license: "OFL", url: "https://fonts.google.com/specimen/Source+Serif+4", fontsource: "@fontsource-variable/source-serif-4", cssFamily: "Source Serif 4 Variable", match: ["source serif"], pairs: ["noto-serif-jp", "geist"], note: "光学サイズ軸を持つ本文セリフ。長文に" },
  { id: "fraunces", name: "Fraunces", category: "serif", designer: "Undercase Type", foundry: "Google Fonts", year: 2020, license: "OFL", url: "https://fonts.google.com/specimen/Fraunces", fontsource: "@fontsource-variable/fraunces", cssFamily: "Fraunces Variable", match: ["fraunces"], pairs: ["dm-sans"], note: "SOFT / WONK 軸で表情が変わる見出しセリフ" },
  { id: "tiempos", name: "Tiempos", category: "serif", designer: "Kris Sowersby", foundry: "Klim Type Foundry", year: 2010, license: "proprietary", url: "https://klim.co.nz/retail-fonts/tiempos-text/", fontsource: null, cssFamily: null, match: ["tiempos"], pairs: ["sohne"], note: "Anthropic、多くのメディアが本文に。Times の現代版" },
  // ---- mono
  { id: "geist-mono", name: "Geist Mono", category: "mono", designer: "Vercel, basement.studio", foundry: "Vercel", year: 2023, license: "OFL", url: "https://vercel.com/font", fontsource: "@fontsource-variable/geist-mono", cssFamily: "Geist Mono Variable", match: ["geist mono"], pairs: ["geist"], note: "AwesomeDS の等幅。コードと数値に" },
  { id: "jetbrains-mono", name: "JetBrains Mono", category: "mono", designer: "Philipp Nurullin, Konstantin Bulenkov", foundry: "JetBrains", year: 2020, license: "OFL", url: "https://www.jetbrains.com/lp/mono/", fontsource: "@fontsource-variable/jetbrains-mono", cssFamily: "JetBrains Mono Variable", match: ["jetbrains"], pairs: ["inter"], note: "開発者向けプロダクトの等幅で最多。字高が高く読みやすい" },
  { id: "berkeley-mono", name: "Berkeley Mono", category: "mono", designer: "Neil Panchal", foundry: "U.S. Graphics", year: 2022, license: "proprietary", url: "https://usgraphics.com/products/berkeley-mono", fontsource: null, cssFamily: null, match: ["berkeley"], pairs: ["inter"], note: "ターミナル美学。AI ツールの UI で増えている" },
  { id: "sf-mono", name: "SF Mono", category: "mono", designer: "Apple", foundry: "Apple", year: 2016, license: "system", url: "https://developer.apple.com/fonts/", fontsource: null, cssFamily: null, match: ["sf mono", "menlo"], pairs: ["sf-pro"], note: "Apple 端末の等幅。ui-monospace で参照する" },
  // ---- Japanese
  { id: "noto-sans-jp", name: "Noto Sans JP", category: "jp-sans", designer: "Adobe, Google (源ノ角ゴシック)", foundry: "Google", year: 2014, license: "OFL", url: "https://fonts.google.com/noto/specimen/Noto+Sans+JP", fontsource: "@fontsource-variable/noto-sans-jp", cssFamily: "Noto Sans JP Variable", match: ["noto sans jp", "noto sans japanese", "noto sans cjk", "source han sans", "源ノ角"], pairs: ["geist", "inter"], note: "日本の企業サイトで圧倒的。可変フォントで太さを合わせる" },
  { id: "hiragino-sans", name: "ヒラギノ角ゴシック", category: "jp-sans", designer: "字游工房", foundry: "SCREEN グラフィックソリューションズ", year: 1993, license: "system", url: "https://www.screen-hiragino.jp/", fontsource: null, cssFamily: "Hiragino Sans", match: ["hiragino", "ヒラギノ"], pairs: ["sf-pro", "helvetica-neue"], note: "macOS / iOS の標準日本語書体。端正で現代的" },
  { id: "yu-gothic", name: "游ゴシック", category: "jp-sans", designer: "字游工房", foundry: "字游工房", year: 2008, license: "system", url: "https://www.jiyu-kobo.co.jp/", fontsource: null, cssFamily: "Yu Gothic", match: ["yu gothic", "yugothic", "游ゴシック"], pairs: ["helvetica-neue"], note: "Windows / macOS 両方に同梱。Medium 以上を指定する" },
  { id: "biz-udpgothic", name: "BIZ UDPゴシック", category: "jp-sans", designer: "モリサワ", foundry: "Morisawa", year: 2018, license: "OFL", url: "https://fonts.google.com/specimen/BIZ+UDPGothic", fontsource: "@fontsource/biz-udpgothic", cssFamily: "BIZ UDPGothic", match: ["biz ud"], pairs: ["public-sans"], note: "ユニバーサルデザイン書体。Windows 同梱、Google Fonts にも" },
  { id: "zen-kaku-gothic-new", name: "Zen角ゴシック New", category: "jp-sans", designer: "Yoshimichi Ohira", foundry: "Zen Font Kobo", year: 2021, license: "OFL", url: "https://fonts.google.com/specimen/Zen+Kaku+Gothic+New", fontsource: "@fontsource/zen-kaku-gothic-new", cssFamily: "Zen Kaku Gothic New", match: ["zen kaku"], pairs: ["dm-sans"], note: "Noto より柔らかい。ブランド寄りのサイトに" },
  { id: "m-plus-1p", name: "M PLUS 1p", category: "jp-sans", designer: "森下浩司", foundry: "M+ FONTS", year: 2011, license: "OFL", url: "https://fonts.google.com/specimen/M+PLUS+1p", fontsource: "@fontsource/m-plus-1p", cssFamily: "M PLUS 1p", match: ["m plus", "m+"], pairs: ["space-grotesk"], note: "幾何学的な日本語書体。数字と欧文も揃う" },
  { id: "line-seed-jp", name: "LINE Seed JP", category: "jp-sans", designer: "LINE", foundry: "LINE", year: 2022, license: "OFL", url: "https://seed.line.me/index_jp.html", fontsource: null, cssFamily: null, match: ["line seed"], pairs: ["plus-jakarta-sans"], note: "コーポレート書体を OFL で公開。丸みが親しみを作る" },
  { id: "ibm-plex-sans-jp", name: "IBM Plex Sans JP", category: "jp-sans", designer: "Sandoll, IBM", foundry: "IBM", year: 2021, license: "OFL", url: "https://fonts.google.com/specimen/IBM+Plex+Sans+JP", fontsource: null, cssFamily: null, match: ["plex sans jp"], pairs: ["ibm-plex-sans"], note: "Plex と骨格を揃えた日本語。多言語サイトに" },
  { id: "noto-serif-jp", name: "Noto Serif JP", category: "jp-serif", designer: "Adobe, Google (源ノ明朝)", foundry: "Google", year: 2017, license: "OFL", url: "https://fonts.google.com/noto/specimen/Noto+Serif+JP", fontsource: "@fontsource/noto-serif-jp", cssFamily: "Noto Serif JP", match: ["noto serif jp", "source han serif", "源ノ明朝"], pairs: ["source-serif-4"], note: "文章と写真が主役のサイトに。太さは 2 つまで" },
];

const brands = JSON.parse(readFileSync(BRANDS, "utf8")).brands;
const fonts = CURATED.map(({ match, ...f }) => {
  const usedBy = [];
  for (const b of brands) {
    const stack = [b.fonts?.display, b.fonts?.body, b.fonts?.mono, b.fonts?.japanese].filter(Boolean).join(" , ").toLowerCase();
    if (match.some((m) => stack.includes(m))) usedBy.push({ id: b.id, name: b.name, region: b.region, source: b.source });
  }
  usedBy.sort((a, b) => a.name.localeCompare(b.name, "ja"));
  return { ...f, loaded: Boolean(f.cssFamily && f.fontsource), usedBy, usedByCount: usedBy.length };
});

const ids = new Set(fonts.map((f) => f.id));
for (const f of fonts) for (const p of f.pairs) if (!ids.has(p)) throw new Error(`${f.id}: unknown pair ${p}`);

const out = {
  meta: {
    description: "Typefaces used by well-designed products. Metadata is curated in scripts/build-fonts.mjs; `usedBy` is measured: the brands in brands.json whose DESIGN.md declares the family. `loaded` marks fonts the site ships via fontsource; system and proprietary fonts render with the viewer's local copy or the fallback.",
    updated: new Date().toISOString().slice(0, 10),
    sources: ["AwesomeDS/data/brands.json", "https://fonts.google.com", "https://fontsource.org"],
    license: "This list: MIT (this repository). Each typeface keeps its own license (see `license`: OFL, system, proprietary).",
    generator: "scripts/build-fonts.mjs",
    counts: { fonts: fonts.length, loaded: fonts.filter((f) => f.loaded).length, brandsScanned: brands.length },
    categories: ["sans", "serif", "mono", "jp-sans", "jp-serif"],
  },
  fonts,
};
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`build-fonts: wrote ${fonts.length} fonts (${out.meta.counts.loaded} loaded on the site) -> ${OUT}`);
