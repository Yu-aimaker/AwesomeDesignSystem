#!/usr/bin/env node
// Static audit for design-verifier. No dependencies.
// node static-audit.mjs <dir-or-file> [--json] [--ignore glob-ish,comma,list]
// Scans .css .scss .html .tsx .jsx .ts .js .vue .svelte .astro .mdx and reports findings with file:line.
// Token files (tokens.css, tailwind.css, base.tokens.css, *.tokens.css, DESIGN.md) are exempt from the raw-colour rule.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, basename, extname } from "node:path";

const argv = process.argv.slice(2);
const target = argv.find((a) => !a.startsWith("--"));
if (!target) { console.error("usage: node static-audit.mjs <dir-or-file> [--json]"); process.exit(2); }
const JSON_OUT = argv.includes("--json");
const ignoreIdx = argv.indexOf("--ignore");
const ignores = ignoreIdx > -1 ? argv[ignoreIdx + 1].split(",") : [];
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "out", "coverage", ".turbo", "design-review", "storybook-static"]);
const EXT = new Set([".css", ".scss", ".html", ".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte", ".astro", ".mdx"]);
const TOKEN_FILE = /(^|\/)(tokens|tailwind|base\.tokens|[a-z0-9-]+\.tokens)\.css$|DESIGN\.md$/;

function walk(p, acc = []) {
  const st = statSync(p);
  if (st.isDirectory()) {
    if (SKIP_DIRS.has(basename(p))) return acc;
    for (const f of readdirSync(p)) walk(join(p, f), acc);
  } else if (EXT.has(extname(p)) && !ignores.some((g) => p.includes(g))) acc.push(p);
  return acc;
}

const files = walk(resolve(target));
const findings = [];
const counts = { colorDecls: 0, tokenColorDecls: 0, eyebrows: 0, sections: 0 };
const add = (sev, rule, file, line, text, fix) => findings.push({ sev, rule, file, line, text: text.trim().slice(0, 140), fix });

const TITLE_SUFFIX = /(?:の推移|の変化|の比較|の内訳| over time| trend)$/i;
const FILLER = /\b(seamless(ly)?|unlock|empower(ing)?|elevate|next[- ]gen(eration)?|revolutioni[sz]e|supercharge|effortless(ly)?|cutting[- ]edge|robust|game[- ]chang(er|ing)|unleash|leverage)\b/i;
const JA_FILLER = /ことができます|シームレス|革新的|次世代|を実現/;
const COUNTEREXAMPLE_KEY = /(?:^|(?<=[^A-Za-z])|(?<=[a-z]))(?:bad|Bad|before|Before)[A-Za-z0-9]*\s*:/;
const PLACEHOLDER = /\b(lorem ipsum|acme|john doe|jane doe|sarah chan)\b/i;

function quotedJaFiller(line) {
  const hit = JA_FILLER.exec(line);
  if (!hit) return false;
  if (COUNTEREXAMPLE_KEY.test(line)) return false;
  const open = line.lastIndexOf("「", hit.index);
  const close = line.lastIndexOf("」", hit.index);
  if (open > close && line.indexOf("」", hit.index + hit[0].length) !== -1) return false;
  const end = hit.index + hit[0].length;
  if (line.slice(hit.index - 2, hit.index) === '\\"' && line.slice(end, end + 2) === '\\"') return false;
  return true;
}
const ATTENTION = /注目されています|ご注目ください|注目を集めて/;
const JA = /[぀-ヿ一-鿿]/;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const isToken = TOKEN_FILE.test(file);
  const isStyle = /\.(css|scss)$/.test(file) || /<style/.test(src);
  const hasFocusVisible = /:focus-visible/.test(src);
  const hasJa = JA.test(src);
  let eyebrowsHere = 0;

  lines.forEach((raw, i) => {
    const n = i + 1;
    const line = raw;
    // 1. raw colours
    const colorMatches = line.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/g) || [];
    if (colorMatches.length && !/^\s*(\/\/|\/\*|\*)/.test(line) && !/(url\(|['"]#[a-z-]+['"]|href=|id=)/.test(line)) {
      if (!isToken) { counts.colorDecls += colorMatches.length; add(2, "raw-color", file, n, line, "Replace with var(--ds-*) or a token class"); }
    }
    if (!isToken && /var\(--ds-|\b(bg|text|border|ring)-(canvas|surface|ink|hairline|accent|primary|success|warning|danger)/.test(line)) { counts.colorDecls++; counts.tokenColorDecls++; }
    if (/\b(bg|text|border|ring|from|to|via|fill|stroke)-\[#|\[(rgb|hsl|oklch)\(/.test(line)) add(2, "tailwind-arbitrary-color", file, n, line, "Add a token and use its class");
    // 2. decoration
    if (/(linear|radial|conic)-gradient|bg-gradient-/.test(line) && !isToken) add(3, "gradient", file, n, line, "Remove decorative gradient; use canvas-soft for section contrast");
    if (/backdrop-filter|backdrop-blur|\bblur-(sm|md|lg|xl|\d)|\bblur\(/.test(line)) add(3, "glass-or-blur", file, n, line, "Remove glass/blur; use surface + hairline");
    if (/drop-shadow|0 0 \d+px .*(rgba?|#)/.test(line) && !isToken) add(3, "glow", file, n, line, "Remove glow; elevation is border or shadow-2/3");
    // 3. AI defaults
    if (/font-family[^;]*\bInter\b|["']Inter["']|fontFamily:\s*["']Inter/.test(line)) add(3, "inter-default", file, n, line, "Use var(--ds-font-sans) (Geist + Noto Sans JP)");
    if (/\b(bg|text|border|from|to|via|ring)-(slate|violet|purple|indigo|fuchsia)-\d{2,3}\b/.test(line)) add(3, "ai-palette", file, n, line, "Use ink/hairline/accent roles; no slate or purple");
    // 4. focus
    if (/outline:\s*["']?(none|0)\b|outline-none/.test(line) && !hasFocusVisible) add(1, "focus-removed", file, n, line, "Add :focus-visible { outline: 2px solid var(--ds-focus-ring); outline-offset: 2px }");
    // 5. size and weight
    const fs = line.match(/font-size:\s*(\d+(?:\.\d+)?)px/) || line.match(/\btext-\[(\d+)px\]/);
    if (fs && Number(fs[1]) < 12) add(1, "text-under-12", file, n, line, "Minimum 12px; 14px for UI text, 16px body");
    if (/\bfont-(bold|extrabold|black)\b|font-weight:\s*(7|8|9)00/.test(line) && !/display/i.test(line)) add(3, "weight-700", file, n, line, "Use 600 for headings, 500 for labels");
    if (/line-height:\s*1\.[0-4]\b|\bleading-(none|tight)\b/.test(line) && /\b(p|body|text-base|paragraph)\b/.test(line)) add(2, "tight-body-leading", file, n, line, "Body line-height 1.6 (ja 1.8)");
    // 6. viewport and scroll
    if (/\b100vh\b|\bh-screen\b|min-h-screen/.test(line)) add(2, "100vh", file, n, line, "Use 100dvh / min-h-[100dvh]");
    if (/addEventListener\(\s*['"]scroll['"]/.test(line)) add(2, "scroll-listener", file, n, line, "Use IntersectionObserver, Motion useScroll or CSS scroll-driven animations");
    if (/animation:[^;]*infinite|animate-(pulse|bounce|spin|marquee)/.test(line) && !/progress|loading|spinner|skeleton/i.test(line)) add(2, "infinite-motion", file, n, line, "Nothing loops except progress indicators");
    // 7. copy
    if (/—/.test(line) && !/^\s*(\/\/|\/\*|\*|#)/.test(line)) add(3, "em-dash", file, n, line, "Replace with period or comma");
    if (FILLER.test(line) && !/^\s*(import|\/\/|\/\*|\*)/.test(line)) add(3, "filler-word", file, n, line, "Say the concrete thing instead");
    if (quotedJaFiller(line) && !/^\s*(import|\/\/|\/\*|\*|ads-audit-ignore)/.test(line) && !/ads-audit-ignore/.test(line)) add(3, "ja-filler", file, n, line, "Replace ことができます / シームレス / 革新的 / 次世代 / を実現 with a concrete action");
    if (PLACEHOLDER.test(line)) add(2, "placeholder-content", file, n, line, "Replace with real, locale-appropriate content");
    // 7c. hidden agent. no-ai-slop-ja pattern 9: name who acts, or delete the shell.
    if (hiddenAgent(line)) add(3, "hidden-agent", file, n, line, "Name who does the action. Drop させていただく and 形となっております");
    // 7b. unsupported crowd claims. no-ai-slop-ja pattern 15: name the source or delete.
    if (unsupportedAttention(line) && !sourceNearby(lines, i)) {
      add(3, "unsupported-attention", file, n, line, "Name the source on this line or the next two, or delete the sentence");
    }
    // 8. eyebrows and sections
    if (/uppercase[^"'`]*tracking|text-transform:\s*uppercase|letter-spacing:\s*0\.(0[5-9]|[1-9])em/.test(line)) { counts.eyebrows++; eyebrowsHere++; }
    if (/<section\b|<Section\b/.test(line)) counts.sections++;
    // 9. shadows at rest
    if (/\b(Card|\.card|card)\b/.test(line) && /shadow-(sm|md|lg|xl|2xl)|box-shadow:\s*(?!none)/.test(line) && !/dialog|popover|menu|tooltip|dropdown/i.test(line)) add(2, "shadow-at-rest", file, n, line, "Cards are level 1: border only");
    // 10. lang
    if (/<html\b/.test(line)) {
      if (!/\blang=/.test(line)) add(1, "missing-lang", file, n, line, "Set lang on <html>");
      else if (/lang=["']en/.test(line) && hasJa) add(1, "wrong-lang", file, n, line, 'Japanese content with lang="en": set lang="ja"');
    }
    // 11. japanese letter spacing
    if (hasJa && /letter-spacing:\s*-|tracking-tight(er)?/.test(line)) add(2, "ja-negative-tracking", file, n, line, "Japanese text: letter-spacing 0 to 0.02em, never negative");
    // 12. accent as fill
    if (/\bbg-accent\b(?!-soft)|background(-color)?:\s*var\(--ds-accent\)\s*;/.test(line)) add(2, "accent-as-fill", file, n, line, "Primary buttons are ink on canvas; accent is for links, focus, selection");
    // 13. placeholder as label
    if (/<input\b[^>]*placeholder=/.test(line) && !/aria-label|<label|id=/.test(line)) add(1, "placeholder-as-label", file, n, line, "Add a visible <label> above the input");
    if (/<(button|a)\b[^>]*>\s*<(svg|[A-Z][A-Za-z]*Icon)\b[^>]*\/?>\s*<\/(button|a)>/.test(line) && !/aria-label/.test(line)) add(1, "icon-button-no-label", file, n, line, "Add aria-label to icon-only buttons");
    // 14. hand-rolled numeric dates. content-and-tone.md: ja prose is 年月日, tables are ISO.
    if (!/ads-audit-ignore/.test(line) && /get(?:Month|Date|FullYear)\(/.test(line) && /\$\{[^}]*\}\s*\/\s*\$\{/.test(line)) {
      add(2, "hand-rolled-date", file, n, line, "Do not join month, day and year with slashes", "Japanese prose: Intl dateStyle long. Tables and code: ISO 8601");
    }
  });

  // 14. Bar length must match the amount. Wilke, Fundamentals of Data Visualization, ch. 6
  // (https://clauswilke.com/dataviz/visualizing-amounts.html, opened 2026-10-14):
  // bars need to start at zero. Line charts may use a different baseline.
  if (/<BarChart\b|<Bar\b/.test(src)) {
    const tagRe = /<YAxis\b[\s\S]*?\/>/g;
    let tag;
    while ((tag = tagRe.exec(src))) {
      const lineNo = src.slice(0, tag.index).split("\n").length;
      const throughLine = src.split("\n").slice(lineNo - 1, lineNo - 1 + tag[0].split("\n").length).join("\n");
      if (/ads-audit-ignore/.test(throughLine)) continue;
      const domain = tag[0].match(/\bdomain=\{\s*\[\s*([^,\]]+)/);
      if (!domain) continue;
      const min = domain[1].trim().replace(/^['"]|['"]$/g, "");
      const numeric = /^-?\d+(?:\.\d+)?$/.test(min);
      const truncated = numeric ? Number(min) !== 0 : /^(dataMin|auto)$/.test(min);
      if (!truncated) continue;
      add(2, "bar-baseline", file, lineNo, "Bar chart Y axis does not start at 0", "Start the bar axis at 0 so length matches the amount");
      break;
    }
  }
  // 14. Chart title that only repeats column names.
  // Datawrapper Academy, Annotate tab, "Title" (page last updated 2024-04-08):
  // the title is the one statement to remember, not a description of the columns.
  // https://www.datawrapper.de/academy/annotate-tab (opened 2026-10-14).
  // A title in the 8 lines above the chart, or title/aria-label on the chart tag,
  // that equals a dataKey or name (optional suffix の推移 / の変化 / の比較 / の内訳 / over time / trend).
  // ads-audit-ignore on the opening tag skips that chart.
  // 14. Chart without a source name and URL in the footer.
  // Datawrapper Academy, Annotate tab, "Data source & link to data source"
  // (page last updated 2024-04-08): https://www.datawrapper.de/academy/annotate-tab
  // Opened 2026-10-14. The footer is the 12 lines after the chart.
  const chartOpen = /<(BarChart|LineChart|AreaChart|PieChart|ComposedChart)\b/g;
  let opened;
  while ((opened = chartOpen.exec(src))) {
    const name = opened[1];
    const rest = src.slice(opened.index);
    const selfClose = /^<[^>]*\/>/.exec(rest);
    const closeTag = `</${name}>`;
    const closeAt = src.indexOf(closeTag, opened.index);
    const end = selfClose ? opened.index + selfClose[0].length : closeAt === -1 ? src.length : closeAt + closeTag.length;
    const openLineNo = src.slice(0, opened.index).split("\n").length;
    const openLine = lines[openLineNo - 1] || "";
    if (/ads-audit-ignore/.test(openLine)) {
      chartOpen.lastIndex = end;
      continue;
    }
    const gt = src.indexOf(">", opened.index);
    const openTag = gt === -1 ? "" : src.slice(opened.index, Math.min(gt + 1, end));
    const body = src.slice(opened.index, end);
    const keys = [
      ...attrValues(body, "dataKey"),
      ...attrValues(body, "name"),
      ...fieldNames(body),
    ];
    const preamble = lines.slice(Math.max(0, openLineNo - 9), openLineNo - 1);
    const title = chartTitle(openTag, preamble);
    if (title && columnOnlyTitle(title, keys)) {
      add(2, "column-title", file, openLineNo, `${name} title only names the columns`, "Write the one statement the reader should remember");
    }
    chartOpen.lastIndex = end;
  }
}

function attrValues(chunk, attr) {
  const re = new RegExp(`\\b${attr}=\\{?["']([^"']+)["']\\}?`, "g");
  return [...chunk.matchAll(re)].map((m) => m[1]);
}

function fieldNames(chunk) {
  return [...chunk.matchAll(/\bname:\s*["']([^"']+)["']/g)].map((m) => m[1]);
}

function chartTitle(openTag, preamble) {
  const onTag = [...attrValues(openTag, "title"), ...attrValues(openTag, "aria-label")];
  if (onTag.length) return onTag[onTag.length - 1];
  const text = preamble.join("\n");
  const found = [];
  for (const m of text.matchAll(/<h[1-6]\b[^>]*>([^<]{1,120})<\/h[1-6]>/gi)) found.push(m[1]);
  for (const m of text.matchAll(/\b(?:title|aria-label)=\{?["']([^"']+)["']\}?/g)) found.push(m[1]);
  return found.length ? found[found.length - 1].trim() : "";
}

function columnOnlyTitle(title, keys) {
  const t = title.trim().replace(/\s+/g, " ");
  const bare = t.replace(TITLE_SUFFIX, "").trim();
  const norm = (s) => s.trim().toLowerCase();
  const list = [...new Set(keys.map((k) => k.trim()).filter(Boolean))];
  if (!list.length || !bare) return false;
  if (list.some((k) => norm(k) === norm(t) || norm(k) === norm(bare))) return true;
  if (list.length < 2) return false;
  const joins = [list.join("と"), list.join("、"), list.join(" and "), list.join(" vs "), list.join("/")];
  return joins.some((j) => norm(j) === norm(t) || norm(j) === norm(bare));
    const footer = src.slice(end).split("\n").slice(0, 13);
    const footerText = [];
    for (const ln of footer) {
      if (footerText.length && /<(BarChart|LineChart|AreaChart|PieChart|ComposedChart)\b/.test(ln)) break;
      footerText.push(ln);
    }
    const lineNo = src.slice(0, opened.index).split("\n").length;
    const openLines = src.split("\n").slice(lineNo - 1, lineNo + 1).join("\n");
    if (/ads-audit-ignore/.test(openLines)) {
      chartOpen.lastIndex = end;
      continue;
    }
    const under = footerText.join("\n");
    const hasName = /出典|\bsource\b/i.test(under);
    const hasUrl = /https?:\/\//.test(under);
    if (!(hasName && hasUrl)) {
      add(2, "chart-source", file, lineNo, "Chart has no source name and URL under it", "Put the source name and a URL in the 12 lines under the chart");
    }
    chartOpen.lastIndex = end;
  // 14. Color key on a line, area, or pie chart.
  // Datawrapper (Lisa Charlotte Muth, 2022-09-28), "Label directly":
  // https://www.datawrapper.de/blog/text-in-data-visualizations (opened 2026-10-14).
  // Those chart types label the series on the mark. A separate color key makes the reader
  // look back and forth. Column and bar charts keep a Legend. ads-audit-ignore skips one key.
  const chartOpen = /<(LineChart|AreaChart|PieChart)\b/g;
  let opened;
  while ((opened = chartOpen.exec(src))) {
    const name = opened[1];
    const closeAt = src.indexOf(`</${name}>`, opened.index);
    if (closeAt === -1) continue;
    const block = src.slice(opened.index, closeAt);
    const legendRe = /<Legend\b[\s\S]*?(?:\/>|<\/Legend>)/g;
    let legend;
    while ((legend = legendRe.exec(block))) {
      const abs = opened.index + legend.index;
      const lineNo = src.slice(0, abs).split("\n").length;
      const span = legend[0].split("\n").length;
      const through = src.split("\n").slice(lineNo - 1, lineNo - 1 + span).join("\n");
      if (/ads-audit-ignore/.test(through)) continue;
      add(2, "color-key", file, lineNo, "Chart uses a color key instead of a label on the mark", "Label the series on the line, area, or slice. Keep Legend only where the label does not fit, and mark that Legend ads-audit-ignore");
    }
    chartOpen.lastIndex = closeAt + name.length + 3;
  }
  // 14. two Y axes in one chart file. Datawrapper (2018-05-08, intro revised 2026-07):
  // a general audience misreads dual-axis charts. https://www.datawrapper.de/blog/dualaxis
  const yAxis = /<YAxis\b/g;
  let yHit = 0;
  let yMatch;
  while ((yMatch = yAxis.exec(src))) {
    yHit += 1;
    if (yHit === 2) {
      const lineNo = src.slice(0, yMatch.index).split("\n").length;
      add(2, "dual-axis", file, lineNo, "<YAxis> appears twice in one file", "Keep one Y axis. Draw the second series in its own chart.");
      break;
    }
  }
}

// Share metadata: an .html file with <head> needs og:image and twitter:card
for (const file of files) {
  if (extname(file) !== ".html") continue;
  const src = readFileSync(file, "utf8");
  if (!/<head\b/i.test(src)) continue;
  const headLine = src.slice(0, src.search(/<head\b/i)).split("\n").length;
  if (!/<meta\b[^>]*(property|name)=["']og:image["']/i.test(src)) add(2, "missing-og-image", file, headLine, "<head> without og:image", 'Add <meta property="og:image" content="https://.../ogp.png"> (absolute URL, 1200x630)');
  if (!/<meta\b[^>]*name=["']twitter:card["']/i.test(src)) add(2, "missing-twitter-card", file, headLine, "<head> without twitter:card", 'Add <meta name="twitter:card" content="summary_large_image">');
}

// Eyebrow budget: ceil(sections / 3), minimum 1
if (counts.sections > 0) {
  const budget = Math.max(1, Math.ceil(counts.sections / 3));
  if (counts.eyebrows > budget) add(3, "eyebrow-overuse", target, 0, `${counts.eyebrows} uppercase eyebrow labels for ${counts.sections} sections (budget ${budget})`, "Remove eyebrows; let the heading carry the section");
}

function hiddenAgent(line) {
  if (/ads-audit-ignore/.test(line)) return false;
  if (/^\s*(\/\/|\/\*|\*)/.test(line)) return false;
  if (/(^|[^A-Za-z])(bad|before)\s*:/.test(line)) return false;
  const re = /させて(?:いただ|頂)(?:く|きます|きました)|形となっております/g;
  let match;
  while ((match = re.exec(line))) {
    const before = line.slice(0, match.index);
    const open = (before.match(/「/g) || []).length;
    const close = (before.match(/」/g) || []).length;
    if (open <= close) return true;
  }
  return false;
function unsupportedAttention(line) {
  if (/^\s*(\/\/|\/\*|\*|import )/.test(line) || /ads-audit-ignore/.test(line)) return false;
  if (/\b(bad|before)\s*:/.test(line)) return false;
  const match = line.match(ATTENTION);
  if (!match) return false;
  const at = match.index;
  const open = line.lastIndexOf("「", at);
  const close = line.indexOf("」", at);
  if (open !== -1 && close > at) return false;
  return true;
}

function sourceNearby(lines, index) {
  return /https?:\/\/|出典/.test(lines.slice(index, index + 3).join("\n"));
}

const tokenShare = counts.colorDecls ? Math.round((counts.tokenColorDecls / counts.colorDecls) * 100) : 100;
findings.sort((a, b) => a.sev - b.sev || a.file.localeCompare(b.file) || a.line - b.line);
const summary = { files: files.length, findings: findings.length, s1: findings.filter((f) => f.sev === 1).length, s2: findings.filter((f) => f.sev === 2).length, s3: findings.filter((f) => f.sev === 3).length, tokenColorShare: tokenShare, eyebrows: counts.eyebrows, sections: counts.sections };

if (JSON_OUT) {
  console.log(JSON.stringify({ target, summary, findings }, null, 2));
} else {
  console.log(`Static audit of ${target}: ${summary.files} files, ${summary.findings} findings (S1 ${summary.s1}, S2 ${summary.s2}, S3 ${summary.s3}). Token colour share ${tokenShare}% (need 95+). Eyebrows ${counts.eyebrows} / sections ${counts.sections}.\n`);
  for (const f of findings) console.log(`S${f.sev}  ${f.rule.padEnd(24)} ${f.file}:${f.line}  ${f.text}\n    fix: ${f.fix}`);
}
process.exit(summary.s1 ? 1 : 0);
