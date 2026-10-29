#!/usr/bin/env node
// Builds AwesomeDS/data/palettes.json.
//   brand:   one entry per brand in AwesomeDS/data/brands.json (canvas / ink / accent + contrast, temperature)
//   curated: 24 accent-on-neutral patterns generated in OKLCH with fixed L and C so that every accent
//            passes WCAG 4.5:1 as text on its canvas in light AND dark mode. The script fails if any does not.
// Run: node scripts/build-palettes.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRANDS = join(root, "AwesomeDS/data/brands.json");
const OUT = join(root, "AwesomeDS/data/palettes.json");

/* ---------- sRGB <-> OKLCH (Björn Ottosson's reference matrices) ---------- */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0")).join("");
}
function oklabToLinearRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
function inGamut(lin) {
  return lin.every((v) => v >= -0.0005 && v <= 1.0005);
}
// Convert OKLCH to hex, reducing chroma until the color is inside sRGB.
export function oklch(L, C, H) {
  const h = (H * Math.PI) / 180;
  let c = C;
  for (let i = 0; i < 40; i++) {
    const lin = oklabToLinearRgb(L, c * Math.cos(h), c * Math.sin(h));
    if (inGamut(lin)) return rgbToHex(lin.map(clamp01).map(linearToSrgb));
    c *= 0.94;
  }
  return rgbToHex(oklabToLinearRgb(L, 0, 0).map(clamp01).map(linearToSrgb));
}

/* ---------- WCAG ---------- */
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}
function temperature(hex) {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max - min < 0.08) return "neutral";
  let h;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  h = ((h * 60) + 360) % 360;
  return h < 70 || h >= 330 ? "warm" : h < 180 && h >= 70 ? (h < 150 ? "warm" : "cool") : "cool";
}

/* ---------- brand palettes ---------- */
const brandsFile = JSON.parse(readFileSync(BRANDS, "utf8"));
const brand = brandsFile.brands.map((b) => ({
  id: b.id,
  name: b.name,
  region: b.region,
  canvas: b.colors.canvas,
  ink: b.colors.ink,
  accent: b.colors.accent,
  contrastInkOnCanvas: contrast(b.colors.ink, b.colors.canvas),
  contrastAccentOnCanvas: contrast(b.colors.accent, b.colors.canvas),
  temperature: temperature(b.colors.accent),
  darkFirst: luminance(b.colors.canvas) < 0.18,
}));

/* ---------- curated palettes ----------
 * Light: canvas #ffffff, ink #0a0a0a, accent at L=0.47 (dark enough for 4.5:1 on white at any hue).
 * Dark:  canvas #0a0a0a, ink #fafafa, accent at L=0.78 (light enough for 4.5:1 on near-black at any hue).
 * Chroma is fixed and clipped to the sRGB gamut per hue. The first entry is the AwesomeDS default (#2f5bea).
 */
const LIGHT = { canvas: "#ffffff", ink: "#0a0a0a", L: 0.47, C: 0.17, hoverL: 0.41, softL: 0.95, softC: 0.035 };
const DARK = { canvas: "#0a0a0a", ink: "#fafafa", L: 0.78, C: 0.13 };

const HUES = [
  // [id, name(JP), hue, use(JP)]
  ["awesomeds-blue", "AwesomeDS ブルー", null, "既定のアクセント。リンク、フォーカス、選択状態に 1 色だけ使う"],
  ["ink", "インク", -1, "アクセントを持たない。黒が唯一の強調。文章と写真が主役のサイトに"],
  ["cobalt", "コバルト", 262, "SaaS の標準。信頼と落ち着き。ダッシュボードに"],
  ["indigo", "インディゴ", 275, "開発者向けプロダクト。技術的だが冷たすぎない"],
  ["violet", "バイオレット", 295, "クリエイティブツール。AI 既定色と誤解されやすいので慎重に"],
  ["magenta", "マゼンタ", 335, "エンタメ、音楽。白背景で強く発色する"],
  ["rose", "ローズ", 10, "ライフスタイル、ヘルスケア。温かく人間的"],
  ["crimson", "クリムゾン", 25, "小売、食品。注意色と役割が被るので状態色を別に取る"],
  ["orange", "オレンジ", 50, "エネルギー、コミュニティ。暗いモードでは彩度を落とす"],
  ["amber", "アンバー", 70, "金融、保険の暖色系。数字が多い画面と相性が良い"],
  ["olive", "オリーブ", 110, "オーガニック、アウトドア。落ち着いた自然の色"],
  ["green", "グリーン", 145, "成功色と被るため、状態色をティールに寄せて区別する"],
  ["emerald", "エメラルド", 160, "フィンテック、環境。鮮やかで清潔"],
  ["teal", "ティール", 185, "医療、教育。青の信頼と緑の安心の中間"],
  ["cyan", "シアン", 210, "データ、分析。青との差を作るには彩度で分ける"],
  ["sky", "スカイ", 235, "コンシューマー向け。軽く明るい印象"],
  ["azure", "アジュール", 250, "コーポレート。最も無難な青"],
  ["slate-blue", "スレートブルー", 265, "低彩度の青。アクセントを目立たせたくない業務ツールに"],
  ["plum", "プラム", 320, "高級感、ビューティ。ローズより落ち着く"],
  ["brick", "ブリック", 35, "建築、クラフト。土の色"],
  ["moss", "モス", 130, "低彩度の緑。文章中心のサイトに"],
  ["ocean", "オーシャン", 225, "低彩度の青。長時間見る画面に"],
  ["graphite", "グラファイト", 260, "ほぼ無彩色の青。インクに寄せた控えめなアクセント"],
  ["copper", "カッパー", 45, "低彩度の橙。エディトリアル、工芸"],
];
const LOW_CHROMA = new Set(["slate-blue", "moss", "ocean", "graphite", "copper"]);

const curated = HUES.map(([id, name, hue, use]) => {
  let accent, accentHover, accentSoft, darkAccent;
  if (id === "awesomeds-blue") {
    accent = "#2f5bea"; accentHover = "#264dd0"; accentSoft = "#e8eefc"; darkAccent = "#7a9cff";
  } else if (hue === -1) {
    accent = "#0a0a0a"; accentHover = "#262626"; accentSoft = "#f5f5f5"; darkAccent = "#fafafa";
  } else {
    const c = LOW_CHROMA.has(id) ? 0.07 : LIGHT.C;
    const dc = LOW_CHROMA.has(id) ? 0.06 : DARK.C;
    accent = oklch(LIGHT.L, c, hue);
    accentHover = oklch(LIGHT.hoverL, c, hue);
    accentSoft = oklch(LIGHT.softL, LIGHT.softC, hue);
    darkAccent = oklch(DARK.L, dc, hue);
  }
  const entry = {
    id,
    name,
    hue: hue === null ? 262 : hue === -1 ? null : hue,
    canvas: LIGHT.canvas,
    ink: LIGHT.ink,
    accent,
    accentHover,
    accentSoft,
    dark: { canvas: DARK.canvas, ink: DARK.ink, accent: darkAccent },
    use,
    contrast: {
      inkOnCanvas: contrast(LIGHT.ink, LIGHT.canvas),
      accentOnCanvas: contrast(accent, LIGHT.canvas),
      accentHoverOnCanvas: contrast(accentHover, LIGHT.canvas),
      accentOnSoft: contrast(accent, accentSoft),
      darkInkOnCanvas: contrast(DARK.ink, DARK.canvas),
      darkAccentOnCanvas: contrast(darkAccent, DARK.canvas),
    },
  };
  return entry;
});

const failures = curated.filter((p) => p.contrast.accentOnCanvas < 4.5 || p.contrast.darkAccentOnCanvas < 4.5 || p.contrast.accentHoverOnCanvas < 4.5);
if (failures.length) {
  console.error("build-palettes: curated palettes below 4.5:1:\n" + failures.map((p) => `  ${p.id} light ${p.contrast.accentOnCanvas} dark ${p.contrast.darkAccentOnCanvas}`).join("\n"));
  process.exit(1);
}
if (curated.length !== 24) {
  console.error(`build-palettes: expected 24 curated palettes, got ${curated.length}`);
  process.exit(1);
}

const out = {
  meta: {
    description: "Color combination patterns. `brand` is measured (canvas / ink / accent of each brand in brands.json with WCAG contrast); `curated` is 24 accent-on-neutral patterns AwesomeDS endorses, generated in OKLCH with fixed lightness so every accent passes 4.5:1 as text on its canvas in light and dark mode.",
    updated: new Date().toISOString().slice(0, 10),
    sources: ["AwesomeDS/data/brands.json", "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio", "https://bottosson.github.io/posts/oklab/"],
    license: "Curated palettes: MIT (this repository). Brand values: see brands.json meta.license.",
    generator: "scripts/build-palettes.mjs",
    method: { light: { canvas: LIGHT.canvas, ink: LIGHT.ink, accentL: LIGHT.L, accentC: LIGHT.C }, dark: { canvas: DARK.canvas, ink: DARK.ink, accentL: DARK.L, accentC: DARK.C }, minContrast: 4.5 },
    counts: { brand: brand.length, curated: curated.length },
  },
  brand,
  curated,
};
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`build-palettes: wrote ${brand.length} brand + ${curated.length} curated palettes -> ${OUT}`);
