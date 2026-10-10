#!/usr/bin/env node
// Builds AwesomeDS/data/brands.json from two DESIGN.md collections:
//   https://github.com/voltagent/awesome-design-md      (global brands, YAML front matter or prose)
//   https://github.com/kzhrknt/awesome-design-md-jp     (Japanese brands, prose Markdown)
// Run: node scripts/extract-brands.mjs [--all-jp]
// Env: DESIGN_MD_CACHE=<dir>  where the two repos are (or will be) cloned with --depth 1.
// Re-runnable: clones only when a checkout is missing. Never writes a partial file.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "AwesomeDS/data/brands.json");
const ALL_JP = process.argv.includes("--all-jp");

const SOURCES = [
  {
    region: "global",
    dir: "awesome-design-md",
    clone: "https://github.com/voltagent/awesome-design-md",
    blob: "https://github.com/voltagent/awesome-design-md/blob/main/design-md",
  },
  {
    region: "jp",
    dir: "awesome-design-md-jp",
    clone: "https://github.com/kzhrknt/awesome-design-md-jp",
    blob: "https://github.com/kzhrknt/awesome-design-md-jp/blob/main/design-md",
  },
];

const DEFAULT_CACHE =
  "/tmp/claude-0/-home-user-AwesomeDesignSystem/aa1f8280-35dd-50a3-a5b5-6b4487ca321d/scratchpad";
const cache =
  process.env.DESIGN_MD_CACHE || (existsSync(DEFAULT_CACHE) ? DEFAULT_CACHE : join(tmpdir(), "awesomeds-design-md"));

// Site URLs and display names for global brands (the voltagent front matter has neither).
const GLOBAL = {
  airbnb: ["Airbnb", "https://www.airbnb.com"], airtable: ["Airtable", "https://www.airtable.com"],
  apple: ["Apple", "https://www.apple.com"], binance: ["Binance", "https://www.binance.com"],
  bmw: ["BMW", "https://www.bmw.com"], "bmw-m": ["BMW M", "https://www.bmw-m.com"],
  bugatti: ["Bugatti", "https://www.bugatti.com"], cal: ["Cal.com", "https://cal.com"],
  claude: ["Claude", "https://claude.ai"], clay: ["Clay", "https://www.clay.com"],
  clickhouse: ["ClickHouse", "https://clickhouse.com"], cohere: ["Cohere", "https://cohere.com"],
  coinbase: ["Coinbase", "https://www.coinbase.com"], composio: ["Composio", "https://composio.dev"],
  cursor: ["Cursor", "https://cursor.com"], "dell-1996": ["Dell (1996)", "https://www.dell.com"],
  elevenlabs: ["ElevenLabs", "https://elevenlabs.io"], expo: ["Expo", "https://expo.dev"],
  ferrari: ["Ferrari", "https://www.ferrari.com"], figma: ["Figma", "https://www.figma.com"],
  framer: ["Framer", "https://www.framer.com"], hashicorp: ["HashiCorp", "https://www.hashicorp.com"],
  hp: ["HP", "https://www.hp.com"], ibm: ["IBM", "https://www.ibm.com"],
  intercom: ["Intercom", "https://www.intercom.com"], kraken: ["Kraken", "https://www.kraken.com"],
  lamborghini: ["Lamborghini", "https://www.lamborghini.com"], "linear.app": ["Linear", "https://linear.app"],
  lovable: ["Lovable", "https://lovable.dev"], mastercard: ["Mastercard", "https://www.mastercard.com"],
  meta: ["Meta", "https://www.meta.com"], minimax: ["MiniMax", "https://www.minimax.io"],
  mintlify: ["Mintlify", "https://mintlify.com"], miro: ["Miro", "https://miro.com"],
  "mistral.ai": ["Mistral AI", "https://mistral.ai"], mongodb: ["MongoDB", "https://www.mongodb.com"],
  nike: ["Nike", "https://www.nike.com"], "nintendo-2001": ["Nintendo (2001)", "https://www.nintendo.com"],
  notion: ["Notion", "https://www.notion.com"], nvidia: ["NVIDIA", "https://www.nvidia.com"],
  ollama: ["Ollama", "https://ollama.com"], "opencode.ai": ["OpenCode", "https://opencode.ai"],
  pinterest: ["Pinterest", "https://www.pinterest.com"], playstation: ["PlayStation", "https://www.playstation.com"],
  posthog: ["PostHog", "https://posthog.com"], raycast: ["Raycast", "https://www.raycast.com"],
  renault: ["Renault", "https://www.renault.com"], replicate: ["Replicate", "https://replicate.com"],
  resend: ["Resend", "https://resend.com"], revolut: ["Revolut", "https://www.revolut.com"],
  runwayml: ["Runway", "https://runwayml.com"], sanity: ["Sanity", "https://www.sanity.io"],
  sentry: ["Sentry", "https://sentry.io"], shopify: ["Shopify", "https://www.shopify.com"],
  slack: ["Slack", "https://slack.com"], spacex: ["SpaceX", "https://www.spacex.com"],
  spotify: ["Spotify", "https://www.spotify.com"], starbucks: ["Starbucks", "https://www.starbucks.com"],
  stripe: ["Stripe", "https://stripe.com"], supabase: ["Supabase", "https://supabase.com"],
  superhuman: ["Superhuman", "https://superhuman.com"], tesla: ["Tesla", "https://www.tesla.com"],
  theverge: ["The Verge", "https://www.theverge.com"], "together.ai": ["Together AI", "https://www.together.ai"],
  uber: ["Uber", "https://www.uber.com"], vercel: ["Vercel", "https://vercel.com"],
  vodafone: ["Vodafone", "https://www.vodafone.com"], voltagent: ["VoltAgent", "https://voltagent.dev"],
  warp: ["Warp", "https://www.warp.dev"], webflow: ["Webflow", "https://webflow.com"],
  wired: ["WIRED", "https://www.wired.com"], wise: ["Wise", "https://wise.com"],
  "x.ai": ["xAI", "https://x.ai"], zapier: ["Zapier", "https://zapier.com"],
};

// Notable Japanese brands (product companies, platforms, well-known consumer brands).
// Pass --all-jp to include every folder of the jp collection instead.
const JP_NOTABLE = new Set([
  "goodpatch", "smarthr", "mercari", "cookpad", "line", "cyberagent", "dena", "freee", "sansan", "moneyforward",
  "nintendo", "sony", "uniqlo", "muji", "rakuten", "zozo", "note", "cybozu", "pixiv", "abema", "andpad", "base",
  "bandainamco", "canon", "capcom", "chatwork", "connpass", "cygames", "digital-go", "docomo", "fujifilm", "fujitsu",
  "hitachi", "honda", "kaminashi", "kyash", "layerx", "lifull", "loglass", "lexus", "mazda", "mixi", "nikkei", "nikon",
  "nissan", "nissin", "notion", "nulab", "panasonic", "paypay", "plaid", "preferred-networks", "qiita", "raksul",
  "recruit", "sega", "shiseido", "smartbank", "smartnews", "softbank", "square-enix", "stores", "subaru", "suntory",
  "tabelog", "takram", "teamlab", "timee", "toyota", "ubie", "wantedly", "yamaha", "yamap", "zenn", "kurashiru",
  "kinto", "jins", "jal", "ana", "ghibli", "hobonichi", "kokuyo", "morisawa", "fontworks", "sanrio", "seiko", "casio",
  "au", "ntt", "toshiba", "sharp", "kyocera", "omron", "keyence", "wacom", "roland", "epson", "brother",
  "asahibeer", "kirin", "meiji", "calbee", "kewpie", "kikkoman", "ajinomoto", "lawson", "askul",
  "snowpeak", "montbell", "beams", "united-arrows", "gu", "nitori", "daiso", "loft", "hands",
  "daikanyama-tsite", "hoshinoresorts", "tokyometro", "jreast", "yakult", "pola", "kao", "kose", "orbis", "fancl",
  "suzuki", "bridgestone", "shimano", "mizuno", "yonex", "onitsukatiger", "descente", "goldwin", "nanamica",
  "isseymiyake", "yohjiyamamoto", "sacai", "visvim", "kapital", "mt", "hario", "balmuda",
  "amadana", "cado", "tential", "mybest", "lowya", "tabechoku", "oisix", "basefood", "nosh", "newt", "ikyu",
  "tablecheck", "hacomono", "mosh", "suzuri", "creema", "campfire", "readyfor", "schoo", "kumon", "benesse",
  "studio", "whatever", "rhizomatiks", "nendo", "kigi", "groovisions", "ndc", "draft", "concent", "mimiguri",
  "loftwork", "sixinc", "dentsu", "hakuhodo", "toppan", "dnp", "kadokawa-museum", "mori-art-museum",
  "kanazawa21", "nact", "2121designsight", "g-mark", "good-design-company",
]);

/* ---------- tiny YAML (front matter subset used by the voltagent files) ---------- */
function parseYaml(text) {
  const lines = text.split(/\r?\n/);
  const rootObj = {};
  const stack = [{ indent: -1, obj: rootObj }];
  let block = null; // folded/literal scalar being collected
  const unquote = (s) => {
    s = s.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
    return s;
  };
  for (const raw of lines) {
    if (block) {
      if (raw.trim() === "" || raw.search(/\S/) > block.indent) {
        block.lines.push(raw.trim());
        continue;
      }
      block.obj[block.key] = block.lines.join(" ").replace(/\s+/g, " ").trim();
      block = null;
    }
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const indent = raw.search(/\S/);
    const m = raw.trim().match(/^("?[^":]+"?)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = unquote(m[1]);
    const val = m[2];
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (val === "") {
      const child = {};
      parent[key] = child;
      stack.push({ indent, obj: child });
    } else if (/^[>|]-?$/.test(val)) {
      block = { key, obj: parent, indent, lines: [] };
    } else {
      parent[key] = unquote(val.replace(/\s+#[^"']*$/, ""));
    }
  }
  if (block) block.obj[block.key] = block.lines.join(" ").trim();
  return rootObj;
}

/* ---------- color helpers ---------- */
const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const COLOR_TOKEN = /#[0-9a-fA-F]{3,6}\b|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[0-9.]+\s*)?\)/;
function normHex(h) {
  if (typeof h !== "string") return null;
  let s = h.trim().toLowerCase();
  const rgba = s.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([0-9.]+)\s*)?\)$/);
  if (rgba) {
    let [r, g, b] = [rgba[1], rgba[2], rgba[3]].map((v) => Math.min(255, Number(v)));
    const a = rgba[4] === undefined ? 1 : Math.max(0, Math.min(1, Number(rgba[4])));
    if (a < 1) {
      // composite a translucent dark color on white, a translucent light color on black
      const bg = (r + g + b) / 3 < 128 ? 255 : 0;
      [r, g, b] = [r, g, b].map((v) => Math.round(v * a + bg * (1 - a)));
    }
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  if (!HEX_RE.test(s)) return null;
  if (s.length === 4) s = "#" + [...s.slice(1)].map((c) => c + c).join("");
  return s;
}
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
function luminance(hex) {
  const ch = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function saturation(hex) {
  const [r, g, b] = rgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}
const slug = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9぀-ヿ一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "") || "color";

/* Role derivation. `entries` = [{name, hex, ctx}] in source order; ctx is the heading the color sat under. */
const ROLE = {
  canvas: {
    exact: /^(canvas|background|bg|page|page-bg|page-background|surface|surface-0|base|white|background-default|bg-default|背景|ベース|canvas-light|background-primary|bg-primary|background-page|body-bg)$/,
    name: /canvas|background|\bbg\b|^bg-|-bg$|page|surface-0|surface|paper|背景/,
    ctx: /background|surface|canvas|neutral|背景|ニュートラル/,
    exclude: /on-|inverse|hover|press|active|dark|night|black|button|cta|brand|accent|primary|secondary|overlay|gradient|footer|header|nav|selected|disabled|shadow|border|input|card|elevated|raised|sunken|soft|alt|muted|tint|glass|scrim/,
  },
  ink: {
    exact: /^(ink|text|foreground|text-primary|heading|body|text-color|text-default|text-main|fg|black|copy|primary-text|text-heading|文字|テキスト|見出し|本文)$/,
    name: /\bink\b|^ink|text|foreground|heading|headline|body|copy|\bfg\b|文字|テキスト|見出し|本文/,
    ctx: /^text|typography|ink|foreground|文字|テキスト/,
    exclude: /on-|inverse|muted|secondary|tertiary|sub|disabled|placeholder|link|hover|press|caption|faint|light|soft|bg$|background|white|footer|button|selection|highlight|error|danger|success|warning|accent|brand/,
  },
  accent: {
    exact: /^(primary|accent|brand|brand-color|primary-color|link|accent-default|brand-primary|primary-default|accent-color|main|key|key-color|ブランド|プライマリ|アクセント)$/,
    name: /primary|accent|brand|link|cta|key-color|ブランド|プライマリ|アクセント|highlight/,
    ctx: /primary|accent|brand|ブランド|プライマリ|アクセント/,
    exclude: /on-|soft|hover|press|deep|dark|light|text|bg|background|gradient|foreground|border|ring|shadow|muted|surface|-2$|inverse|disabled|secondary|tertiary|container|tint|selection|active|end|start|mid|faint|pale|glow/,
  },
};
function candidates(entries, role) {
  const r = ROLE[role];
  const scored = [];
  entries.forEach((e, i) => {
    let score = 0;
    if (r.exact.test(e.name)) score = 4;
    else if (r.name.test(e.name) && !r.exclude.test(e.name)) score = 3;
    else if (r.ctx.test(e.ctx) && !r.exclude.test(e.name)) score = 2;
    else if (r.name.test(e.name)) score = 1;
    if (score) scored.push({ ...e, score, i });
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i);
}
function deriveRoles(entries, hint = "") {
  const dark = /\bdark\b|ダーク|near-black|黒背景|black canvas/i.test(hint);
  const canvasCands = candidates(entries, "canvas");
  let canvas = canvasCands[0]?.hex ?? null;
  if (canvas) {
    // If several canvas candidates exist and the description says dark, prefer a dark one; otherwise a light one.
    const pref = canvasCands.filter((c) => c.score >= 3 && (dark ? luminance(c.hex) < 0.2 : luminance(c.hex) > 0.5));
    if (pref.length) canvas = pref[0].hex;
  }
  let inferred = [];
  if (!canvas) {
    const neutral = entries.filter((e) => saturation(e.hex) < 0.12).sort((a, b) => (dark ? luminance(a.hex) - luminance(b.hex) : luminance(b.hex) - luminance(a.hex)));
    canvas = neutral[0]?.hex ?? (dark ? "#0a0a0a" : "#ffffff");
    inferred.push("canvas");
  }
  const inkCand = candidates(entries, "ink").find((c) => contrast(c.hex, canvas) >= 3);
  let ink = inkCand?.hex ?? null;
  if (!ink) {
    const best = entries.filter((e) => saturation(e.hex) < 0.25 && contrast(e.hex, canvas) >= 4.5).sort((a, b) => contrast(b.hex, canvas) - contrast(a.hex, canvas))[0];
    ink = best?.hex ?? (luminance(canvas) > 0.4 ? "#1a1a1a" : "#f5f5f5");
    inferred.push("ink");
  }
  const accCands = candidates(entries, "accent");
  let accent = accCands.find((c) => c.hex !== ink && c.hex !== canvas && contrast(c.hex, canvas) >= 1.3)?.hex ?? accCands.find((c) => contrast(c.hex, canvas) >= 1.3)?.hex ?? null;
  if (!accent) {
    accent = ink;
    inferred.push("accent");
  }
  return { canvas, ink, accent, inferred };
}

/* ---------- font helpers ---------- */
const GENERIC = new Set(["sans-serif", "serif", "monospace", "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace", "-apple-system", "blinkmacsystemfont", "inherit", "cursive", "fantasy", "emoji", "math", "ui-rounded", "initial", "unset"]);
const OS_FALLBACKS = /^(segoe ui|helvetica neue|helvetica|arial|roboto|sfmono-regular|menlo|monaco|consolas|courier new|liberation mono|meiryo|ms pgothic|ms gothic|yu gothic ui|yugothic|yu gothic|hiragino kaku gothic pron|hiragino sans|hiragino kaku gothic pro|ヒラギノ角ゴ pron w3|ヒラギノ角ゴ pro w3|ヒラギノ角ゴシック|游ゴシック|游ゴシック体|游明朝|メイリオ|ms ゴシック|ms pゴシック|apple color emoji|segoe ui emoji|segoe ui symbol|noto color emoji|yakuhanjp|yakuhanjps|yakuhanmp|yakuhanmps|sf pro text|sf pro display|sf pro icons|-apple-system|blinkmacsystemfont|hiragino mincho pron|ms pmincho|ms mincho|verdana|tahoma|times new roman|georgia)$/i;
const JP_FONT = /jp\b|japanese|gothic|ゴシック|明朝|mincho|hiragino|ヒラギノ|yu ?gothic|游|meiryo|メイリオ|noto sans cjk|noto serif cjk|biz ud|zen |m plus|line seed|murecho|kosugi|sawarabi|shippori|klee|kaisei|dela gothic|rocknroll|tsukushi|筑紫|a\+eqpb|ud新ゴ|新ゴ|リュウミン|ryumin|midashi|見出|a-otf|fot-|dnp |秀英|kozuka|小塚|toppan|凸版|源ノ|源柔|tazugane|tbudgothic|udshingo|yakuhan|ncomjp|sstjapanese|adjustedyugothic|ud角ゴ|ud丸ゴ|丸ゴ|maru|kinto|ryo |はんなり|こぶり|貂明朝|平成|heisei|ta-|ab-|ヒラギノ|游教科書|教科書|kyokasho/i;

function splitFamilies(stack) {
  return stack
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, "").replace(/\\/g, "").replace(/\s*!important$/, "").trim())
    .filter((s) => s && !GENERIC.has(s.toLowerCase()) && !/^var\(|^\$|^\{|^[0-9.]+(px|em|rem|%)?$|^\d/.test(s) && s.length < 48);
}
function firstReal(families, { allowOs = false, jp = null } = {}) {
  for (const f of families) {
    if (!allowOs && OS_FALLBACKS.test(f)) continue;
    if (jp === true && !JP_FONT.test(f)) continue;
    if (jp === false && JP_FONT.test(f)) continue;
    return f;
  }
  return null;
}
function cleanFamily(f) {
  if (!f) return null;
  return f.replace(/\s*(Custom|Variable|VF|Web|Webfont)$/i, "").replace(/^A\+EqpB-/, "").replace(/-var$/i, "").trim() || null;
}
const FONT_NAME_OK = /^[A-Z][A-Za-z0-9.+']*(?: [A-Za-z0-9.+']+){0,4}$/; // "SF Pro", "My Galano Grotesque", "Söhne"
const NOT_A_FONT = /^(Do|Don't|Note|Font|Fonts|Weight|Size|Body|Heading|Display|Title|Label|Caption|Bold|Regular|Medium|Light|Black|Thin|Normal|Italic|Latin|Japanese|CJK|Mobile|Desktop|Tablet|Primary|Secondary|Brand|Accent|Hero|Nav|Header|Footer|Button|Card|Input|Grid|Container|Spacing|Radius|Shadow|Border|Color|Colors|Text|Link|Hover|Focus|Active|Disabled|OpenType|Kerning|Tracking|Leading|Measure|Scale|Ratio|Base|Small|Large|Medium|Micro|Line|Letter|Word|Vertical|Horizontal|Wrap|Break|Strict|Loose|Auto|Fallback|Stack|Palt|Pkna|Liga|Kern|Tnum|Pnum|Onum|Lnum)$/i;

/* ---------- description / mood ---------- */
function firstSentence(text, max = 160) {
  if (!text) return null;
  let s = text.replace(/\s+/g, " ").trim();
  const m = s.match(/^(.+?[.。!?！？])(\s|$)/);
  s = m ? m[1] : s;
  if (s.length > max) s = s.slice(0, max - 1).replace(/[\s,、;:—-]+$/, "") + "…";
  return s;
}
const MOOD_WORDS = [
  "minimal", "dark", "playful", "bold", "editorial", "technical", "warm", "luxurious", "premium", "friendly",
  "calm", "quiet", "confident", "corporate", "vibrant", "geometric", "monochrome", "immersive", "clean", "dense",
  "airy", "utilitarian", "elegant", "sporty", "retro", "brutalist", "neutral", "colorful", "serious", "energetic",
  "cinematic", "photographic", "developer", "financial", "industrial", "organic", "futuristic", "restrained",
];
function deriveMood(description, colors, roles) {
  const found = [];
  const text = (description || "").toLowerCase();
  for (const w of MOOD_WORDS) if (text.includes(w) && !found.includes(w)) found.push(w);
  if (roles.canvas && luminance(roles.canvas) < 0.2 && !found.includes("dark")) found.push("dark");
  if (roles.canvas && roles.ink && contrast(roles.canvas, roles.ink) > 15 && !found.includes("high-contrast")) found.push("high-contrast");
  if (Object.keys(colors).length <= 8 && !found.includes("minimal")) found.push("minimal");
  if (found.length < 3 && roles.accent && saturation(roles.accent) > 0.7) found.push("vivid-accent");
  return found.slice(0, 3);
}
function moodFromJp(body) {
  const m = body.match(/\*\*キーワード\*\*\s*[:：]\s*(.+)/);
  if (!m) return [];
  return m[1]
    .split(/[、,／/・]/)
    .map((s) => s.replace(/[*`]/g, "").trim())
    .filter((s) => s && s.length <= 16)
    .slice(0, 3);
}

/* ---------- prose parsing (jp collection + non-front-matter global files) ---------- */
function section(body, startRe, endRe) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => startRe.test(l));
  if (start < 0) return "";
  let end = lines.findIndex((l, i) => i > start && endRe.test(l));
  if (end < 0) end = lines.length;
  return lines.slice(start + 1, end).join("\n");
}
// Returns [{name, hex, ctx}] in order of appearance, deduped by name.
function collectColors(text) {
  const entries = [];
  const seen = new Map();
  let ctx = "";
  const add = (name, raw) => {
    const hex = normHex(raw);
    if (!hex) return;
    let key = slug(name.replace(/\(.*?\)|（.*?）/g, "")).slice(0, 40);
    if (!key || /^(hex|rgb|value|token|color|colors|role|役割|名前|用途)$/.test(key)) return;
    if (seen.has(key) && seen.get(key) !== hex) {
      let i = 2;
      while (seen.has(`${key}-${i}`) && seen.get(`${key}-${i}`) !== hex) i++;
      key = `${key}-${i}`;
    }
    if (seen.has(key)) return;
    seen.set(key, hex);
    entries.push({ name: key, hex, ctx: slug(ctx) });
  };
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^#{2,4}\s+(.+)$/);
    if (h) { ctx = h[1]; continue; }
    let m;
    // - **Name** (`#hex`)   /  **Name**: `#hex`  / **Name** (`#e00` = `#ee0000`)
    for (m of line.matchAll(new RegExp(`\\*\\*([^*]{1,60})\\*\\*\\s*[(（:：]?\\s*\`?(${COLOR_TOKEN.source})`, "g"))) add(m[1], m[2]);
    // | Name | `#hex` |     or    | Name | rgb | `#hex` |
    if ((m = line.match(new RegExp(`^\\|\\s*([^|]{1,60}?)\\s*\\|[^|]*?\`?(${COLOR_TOKEN.source})`)))) add(m[1], m[2]);
    // --css-var: #hex
    for (m of line.matchAll(new RegExp(`--([A-Za-z0-9_-]{2,60}):\\s*(${COLOR_TOKEN.source})`, "g"))) add(m[1].replace(/^(color|c|clr|ncom-color|ds-color)-/, ""), m[2]);
    // Key: #hex   (quick reference blocks, plain lists)
    if ((m = line.match(new RegExp(`^\\s*[-*]?\\s*([A-Za-z\\u3040-\\u30ff\\u4e00-\\u9fff][A-Za-z0-9 /()_\\u3040-\\u30ff\\u4e00-\\u9fff-]{1,40}?)\\s*[:：]\\s*\`?(${COLOR_TOKEN.source})`)))) add(m[1], m[2]);
  }
  return entries;
}
function parseProse(body, region) {
  const title = (body.match(/^#\s+(.+)$/m) || [])[1] || "";
  const name = title
    .replace(/^DESIGN\.md\s*[—–-]\s*/i, "")
    .replace(/^Design System Inspired by\s+/i, "")
    .replace(/\s*[（(].*$/, "")
    .replace(/\s+(Inspired )?Design System.*$/i, "")
    .trim();
  const intro = body.split(/^## /m)[0];
  let url = (intro.match(/https?:\/\/[^\s)）>」]+/) || [])[0] || null;
  if (!url) {
    const dom = title.match(/[（(]\s*((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s)）]*)?)\s*[）)]/i);
    if (dom) url = `https://${dom[1]}`;
  }
  const introDesc = intro
    .split(/\r?\n/)
    .filter((l) => l.startsWith(">"))
    .map((l) => l.replace(/^>\s?/, "").trim())
    .filter((l) => l && !/^このファイルは|^セクションヘッダー|^実サイトの|computed style|に基づく。$/.test(l) && !/のデザイン仕様書。$/.test(l));
  const policy = (body.match(/\*\*デザイン方針\*\*\s*[:：]\s*(.+)/) || [])[1];
  const description = firstSentence(introDesc[0] || policy || section(body, /^## 1\./, /^## /).replace(/[#*`>-]/g, " ")) || null;

  const colorSec = section(body, /^## 2\./, /^## 3\./) + "\n" + section(body, /^## 9\.|^## 10\./, /^## 99/);
  let entries = collectColors(colorSec);
  if (entries.length === 0) entries = collectColors(body);

  const typoSec = section(body, /^## 3\./, /^## 4\./) + "\n" + section(body, /クイックリファレンス|Quick Color Reference|Quick Reference/, /^### プロンプト|^## /);
  const stacks = [...typoSec.matchAll(/font-family\s*:\s*([^;\n`]+)/gi)].map((m) => m[1]);
  const quickFont = [...typoSec.matchAll(/^\s*(?:Font|Body Font|JP Font|Heading Font|Latin-only|Body Stack|Font Family|Display Font)\s*:\s*([^\n]+)$/gim)].map((m) => m[1]);
  const codeStacks = [...typoSec.matchAll(/`([^`\n]*(?:Mono|Code|Courier|Menlo)[^`\n]*)`/g)].map((m) => m[1]);
  const monoLines = typoSec.split(/\r?\n/).filter((l) => /mono|code|コード|等幅/i.test(l));
  const boldFonts = [...typoSec.matchAll(/\*\*([^*\n]{2,40})\*\*/g)].map((m) => m[1].replace(/[:：]$/, "").trim()).filter((f) => JP_FONT.test(f) || (FONT_NAME_OK.test(f) && !NOT_A_FONT.test(f)));

  const allFamilies = [...stacks, ...quickFont].flatMap(splitFamilies);
  const latinFromStacks = firstReal(allFamilies, { jp: false });
  const jpFromStacks = firstReal(allFamilies, { jp: true }) || firstReal(allFamilies, { jp: true, allowOs: true });
  const headingLine = typoSec.split(/\r?\n/).find((l) => /(見出し|heading|display|title|ヒーロー).*font-family|font-family.*(heading|display|title)/i.test(l));
  const headingStack = headingLine ? splitFamilies((headingLine.match(/font-family\s*:\s*([^;`]+)/i) || [])[1] || "") : [];
  const boldLatin = boldFonts.filter((f) => !JP_FONT.test(f));
  const boldJp = boldFonts.filter((f) => JP_FONT.test(f));
  const bodyLatin = cleanFamily(latinFromStacks) || cleanFamily(firstReal(boldLatin)) || null;
  const display = cleanFamily(firstReal(headingStack, { jp: false })) || cleanFamily(firstReal(boldLatin)) || bodyLatin;
  const bodyJp = cleanFamily(jpFromStacks) || cleanFamily(firstReal(boldJp, { allowOs: true })) || null;
  const monoCandidates = [...codeStacks, ...monoLines.flatMap((l) => [...l.matchAll(/font-family\s*:\s*([^;`]+)/gi)].map((m) => m[1]))].flatMap(splitFamilies);
  const mono = cleanFamily(firstReal(monoCandidates.filter((f) => /mono|code|courier|menlo|consolas|fira|jetbrains|source code|roboto mono|sf mono/i.test(f)), { allowOs: true })) || null;

  return {
    name,
    url,
    description,
    entries,
    fonts: { display: display || bodyJp, body: region === "jp" ? bodyJp || bodyLatin : bodyLatin || bodyJp, mono, japanese: bodyJp },
    radius: radiusFromProse(body),
    mood: region === "jp" ? moodFromJp(body) : [],
  };
}
const RADIUS_KEYS = ["xs", "sm", "md", "lg", "xl", "xxl"];
function radiusFromProse(body) {
  // Only lines that talk about radius; ignore 1px (border widths) and anything above 64px (treated as pill).
  const lines = body.split(/\r?\n/).filter((l) => /radius|角丸|rounded/i.test(l) && !/^\s*#/.test(l));
  const values = new Set();
  let pill = false;
  for (const l of lines) {
    for (const m of l.matchAll(/(\d{1,4})px/g)) {
      const n = Number(m[1]);
      if (n >= 100) pill = true;
      else if (n !== 1 && n <= 64) values.add(n);
    }
    if (/9999|50%|pill|ピル|full|完全な丸|円形/i.test(l)) pill = true;
  }
  const uniq = [...values].sort((a, b) => a - b);
  if (uniq.length < 2 && !pill) return null;
  const out = {};
  uniq.slice(0, 6).forEach((v, i) => (out[RADIUS_KEYS[i]] = v));
  if (pill) out.pill = 9999;
  return Object.keys(out).length ? out : null;
}
function radiusFromYaml(rounded) {
  if (!rounded || typeof rounded !== "object") return null;
  const out = {};
  for (const [k, v] of Object.entries(rounded)) {
    const key = k.toLowerCase().replace("2xl", "xxl").replace("full", "pill");
    if (![...RADIUS_KEYS, "pill"].includes(key)) continue;
    const n = String(v).match(/^(\d+(?:\.\d+)?)px$/);
    if (n) out[key] = Number(n[1]);
    else if (/9999|full|50%/.test(String(v))) out[key] = 9999;
  }
  return Object.keys(out).length ? out : null;
}

/* ---------- front matter (voltagent) ---------- */
function parseFrontMatter(body) {
  const m = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = parseYaml(m[1]);
  if (!fm.colors) return null;
  const entries = [];
  for (const [k, v] of Object.entries(fm.colors)) {
    const hex = normHex(v);
    if (hex) entries.push({ name: slug(k), hex, ctx: "" });
  }
  const typo = fm.typography || {};
  const stacksOf = (pred) => Object.entries(typo).filter(([k]) => pred(k)).map(([, v]) => v?.fontFamily).filter(Boolean);
  const pick = (stacks) => cleanFamily(firstReal(stacks.flatMap(splitFamilies))) || cleanFamily(firstReal(stacks.flatMap(splitFamilies), { allowOs: true }));
  const display = pick(stacksOf((k) => /display|h1|hero|title|heading/i.test(k))) || pick(stacksOf(() => true));
  const bodyF = pick(stacksOf((k) => /^body|paragraph|text/i.test(k))) || display;
  const mono = pick(stacksOf((k) => /mono|code/i.test(k)));
  return {
    name: String(fm.name || "").replace(/[\s-]*(inspired)?[\s-]*design[\s-]*(analysis|system)$/i, "").replace(/-/g, " ").trim(),
    description: firstSentence(fm.description),
    entries,
    fonts: { display, body: bodyF, mono, japanese: null },
    radius: radiusFromYaml(fm.rounded),
    rawDescription: fm.description,
    mood: [],
  };
}

/* ---------- main ---------- */
function ensureClone(src) {
  const dir = join(cache, src.dir);
  if (existsSync(join(dir, "design-md"))) return dir;
  mkdirSync(cache, { recursive: true });
  console.log(`extract-brands: cloning ${src.clone} -> ${dir}`);
  execFileSync("git", ["clone", "--depth", "1", "--quiet", src.clone, dir], { stdio: "inherit" });
  return dir;
}

const brands = [];
const skipped = [];
for (const src of SOURCES) {
  const dir = ensureClone(src);
  const base = join(dir, "design-md");
  const folders = readdirSync(base, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  const wanted = src.region === "jp" && !ALL_JP ? folders.filter((f) => JP_NOTABLE.has(f)) : folders;
  for (const folder of wanted) {
    const file = join(base, folder, "DESIGN.md");
    if (!existsSync(file)) { skipped.push(`${src.region}/${folder}: no DESIGN.md`); continue; }
    const body = readFileSync(file, "utf8");
    const parsed = parseFrontMatter(body) || parseProse(body, src.region);
    if (!parsed || parsed.entries.length < 3) { skipped.push(`${src.region}/${folder}: fewer than 3 colors found`); continue; }
    const roles = deriveRoles(parsed.entries, `${parsed.rawDescription || parsed.description || ""} ${folder}`);
    const id = src.region === "jp" ? `jp-${slug(folder)}` : slug(folder);
    const name = src.region === "global" ? GLOBAL[folder]?.[0] || parsed.name || folder : parsed.name || folder;
    const mood = parsed.mood?.length ? parsed.mood : deriveMood(parsed.rawDescription || parsed.description, parsed.entries, roles);
    const named = {};
    for (const e of parsed.entries) named[e.name] = e.hex;
    brands.push({
      id,
      name,
      region: src.region,
      url: src.region === "global" ? GLOBAL[folder]?.[1] || null : parsed.url || null,
      source: `${src.blob}/${folder}/DESIGN.md`,
      description: parsed.description || null,
      colors: { canvas: roles.canvas, ink: roles.ink, accent: roles.accent, ...named },
      fonts: { display: parsed.fonts.display || null, body: parsed.fonts.body || null, mono: parsed.fonts.mono || null, japanese: parsed.fonts.japanese || null },
      radius: parsed.radius || null,
      mood,
      accentContrastOnCanvas: contrast(roles.accent, roles.canvas),
      inkContrastOnCanvas: contrast(roles.ink, roles.canvas),
      darkFirst: luminance(roles.canvas) < 0.18,
      inferred: roles.inferred,
    });
  }
}

const counts = { global: brands.filter((b) => b.region === "global").length, jp: brands.filter((b) => b.region === "jp").length };
if (counts.global < 60 || counts.jp < 60) {
  console.error(`extract-brands: too few brands (${JSON.stringify(counts)}); refusing to overwrite ${OUT}`);
  console.error(skipped.join("\n"));
  process.exit(1);
}
const out = {
  meta: {
    description: "Measured brand design tokens (canvas / ink / accent, every named color, fonts, radii) extracted from two public DESIGN.md collections. Values are as published there; AwesomeDS only normalises names, derives the three roles and computes WCAG contrast. `inferred` lists roles that had no explicit token and were derived from neutrals.",
    updated: new Date().toISOString().slice(0, 10),
    sources: SOURCES.map((s) => s.clone),
    license: "Source collections are MIT licensed (see each repository's LICENSE). Brand names and colors belong to their respective owners and are listed for reference and study only.",
    generator: "scripts/extract-brands.mjs",
    counts,
    skipped,
  },
  brands,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`extract-brands: wrote ${brands.length} brands (${counts.global} global, ${counts.jp} jp) -> ${OUT}`);
if (skipped.length) console.log(`extract-brands: skipped ${skipped.length}:\n  ${skipped.join("\n  ")}`);
