#!/usr/bin/env node
// Contrast checker for AwesomeDS-style token files.
// Usage: node contrast.mjs <tokens.css | DESIGN.md> [--aaa] [--json] [--pair fg:bg[:min] ...]
// Resolves --ds-* variables in :root (light) and [data-theme="dark"] (dark), follows @import "./x.css"
// relative to the file, then prints every text-on-background pair with its WCAG ratio.
// Exit code 1 when any pair fails. No dependencies.

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("usage: node contrast.mjs <tokens.css|DESIGN.md> [--aaa] [--json] [--pair fg:bg[:min]]");
  process.exit(2);
}
const AAA = args.includes("--aaa");
const JSON_OUT = args.includes("--json");
const extraPairs = [];
for (let i = 0; i < args.length; i++) if (args[i] === "--pair" && args[i + 1]) extraPairs.push(args[++i]);

const BODY = AAA ? 7 : 4.5;
const LARGE = AAA ? 4.5 : 3;
const UI = 3;

// [foreground, background, minimum, label]
const PAIRS = [
  ["ink", "canvas", BODY, "body text"],
  ["ink", "surface", BODY, "text on cards"],
  ["ink", "surface-sunken", BODY, "text in wells"],
  ["ink-secondary", "canvas", BODY, "supporting text"],
  ["ink-secondary", "surface-sunken", BODY, "badge text"],
  ["ink-muted", "canvas", BODY, "placeholder, timestamp"],
  ["ink-muted", "surface", BODY, "placeholder in input"],
  ["ink-disabled", "canvas", 0, "disabled (informational, no minimum)"],
  ["accent", "canvas", BODY, "link text"],
  ["accent", "surface", BODY, "link on card"],
  ["accent", "accent-soft", BODY, "selected chip text"],
  ["on-accent", "accent", BODY, "text on accent fill"],
  ["on-primary", "primary", BODY, "primary button label"],
  ["success", "canvas", BODY, "status text"],
  ["success", "success-soft", BODY, "status badge"],
  ["warning", "canvas", BODY, "status text"],
  ["warning", "warning-soft", BODY, "status badge"],
  ["danger", "canvas", BODY, "error text"],
  ["danger", "danger-soft", BODY, "error badge"],
  ["hairline-strong", "canvas", UI, "input border (UI 3:1)"],
  ["hairline-strong", "surface", UI, "input border on card"],
  ["hairline", "canvas", 0, "divider (informational)"],
  ["focus-ring", "canvas", UI, "focus ring"],
  ["focus-ring", "surface", UI, "focus ring on card"],
];
for (const p of extraPairs) {
  const [fg, bg, min] = p.split(":");
  PAIRS.push([fg, bg, min ? Number(min) : BODY, "custom"]);
}

function readWithImports(path, seen = new Set()) {
  const abs = resolve(path);
  if (seen.has(abs) || !existsSync(abs)) return "";
  seen.add(abs);
  let css = readFileSync(abs, "utf8");
  css = css.replace(/@import\s+(?:url\()?["']([^"']+)["']\)?\s*;/g, (_, rel) => {
    if (/^https?:/.test(rel) || rel === "tailwindcss") return "";
    return readWithImports(resolve(dirname(abs), rel), seen);
  });
  return css;
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

// Collect declarations for a selector group. Later declarations override earlier ones.
function collectVars(css, selectorTest) {
  const vars = {};
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selector = m[1].trim();
    if (!selectorTest(selector)) continue;
    for (const decl of m[2].split(";")) {
      const idx = decl.indexOf(":");
      if (idx < 0) continue;
      const name = decl.slice(0, idx).trim();
      const value = decl.slice(idx + 1).trim();
      if (name.startsWith("--ds-")) vars[name.slice(5)] = value;
    }
  }
  return vars;
}

function parseDesignMd(md) {
  // Reads the `colors:` block of the frontmatter. dark-* keys form the dark theme.
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error("DESIGN.md has no frontmatter");
  const block = fm[1].match(/\ncolors:\n([\s\S]*?)(?:\n\w|$)/);
  if (!block) throw new Error("frontmatter has no colors: block");
  const light = {}, dark = {};
  for (const line of block[1].split("\n")) {
    const m = line.match(/^\s+([a-z0-9-]+):\s*"?(#[0-9a-fA-F]{3,8})"?/);
    if (!m) continue;
    if (m[1].startsWith("dark-")) dark[m[1].slice(5)] = m[2];
    else light[m[1]] = m[2];
  }
  return { light, dark: { ...light, ...dark } };
}

function resolveVar(vars, name, depth = 0) {
  let v = vars[name];
  if (v === undefined || depth > 10) return undefined;
  v = v.trim();
  const ref = v.match(/^var\(--ds-([a-z0-9-]+)\)$/);
  if (ref) return resolveVar(vars, ref[1], depth + 1);
  return v;
}

function parseColor(str) {
  if (!str) return null;
  str = str.trim().toLowerCase();
  let m = str.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  m = str.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  m = str.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/);
  if (m) return oklchToRgb(m[1].endsWith("%") ? Number(m[1].slice(0, -1)) / 100 : Number(m[1]), Number(m[2]), Number(m[3]));
  return null;
}

function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const gam = (x) => { x = Math.min(1, Math.max(0, x)); return Math.round(255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055)); };
  return [gam(r), gam(g), gam(bb)];
}

function luminance([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function ratio(fg, bg) {
  const l1 = luminance(fg), l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

let themes;
if (file.endsWith(".md")) {
  themes = parseDesignMd(readFileSync(file, "utf8"));
} else {
  const css = stripComments(readWithImports(file));
  const light = collectVars(css, (s) => s === ":root" || s.split(",").map((x) => x.trim()).includes(":root"));
  const darkOverrides = collectVars(css, (s) => /data-theme="dark"\]/.test(s) || /:root:not\(\[data-theme="light"\]\)/.test(s));
  themes = { light, dark: { ...light, ...darkOverrides } };
}

const results = [];
let failures = 0;
for (const [themeName, vars] of Object.entries(themes)) {
  for (const [fg, bg, min, label] of PAIRS) {
    const fgv = file.endsWith(".md") ? vars[fg] : resolveVar(vars, fg);
    const bgv = file.endsWith(".md") ? vars[bg] : resolveVar(vars, bg);
    const fgc = parseColor(fgv), bgc = parseColor(bgv);
    if (!fgc || !bgc) {
      results.push({ theme: themeName, fg, bg, fgv, bgv, ratio: null, min, label, status: "MISSING" });
      if (min > 0) failures++;
      continue;
    }
    const r = ratio(fgc, bgc);
    const status = min === 0 ? "info" : r >= min ? "pass" : "FAIL";
    if (status === "FAIL") failures++;
    results.push({ theme: themeName, fg, bg, fgv, bgv, ratio: Number(r.toFixed(2)), min, label, status });
  }
}

if (JSON_OUT) {
  console.log(JSON.stringify({ file, aaa: AAA, failures, results }, null, 2));
} else {
  console.log(`Contrast report for ${file} (${AAA ? "AAA" : "AA"} thresholds: body ${BODY}, large/UI ${LARGE}/${UI})\n`);
  console.log("| theme | foreground | background | ratio | min | status | use |");
  console.log("|---|---|---|---|---|---|---|");
  for (const r of results) {
    console.log(`| ${r.theme} | ${r.fg} ${r.fgv ?? "?"} | ${r.bg} ${r.bgv ?? "?"} | ${r.ratio ?? "n/a"} | ${r.min || "-"} | ${r.status} | ${r.label} |`);
  }
  console.log(`\n${results.length} pairs, ${results.filter((r) => r.status === "pass").length} pass, ${failures} fail or missing.`);
}
process.exit(failures ? 1 : 0);
