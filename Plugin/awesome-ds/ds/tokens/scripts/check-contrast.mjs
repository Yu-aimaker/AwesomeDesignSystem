#!/usr/bin/env node
/* AwesomeDS contrast audit.
   Usage: node AwesomeDS/tokens/scripts/check-contrast.mjs [--json]
   Reads tokens/tokens.json, tokens/accents.css and the chart palette in tokens.css,
   computes WCAG 2.x contrast ratios and exits 1 when any text role is under 4.5:1,
   any control border or chart mark is under 3:1, or any accent fails 4.5:1 on canvas.
   Pure Node, no dependencies. */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(here, "..");

// ---------- color math ----------
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
// OKLCH -> sRGB (Björn Ottosson's OKLab), used to derive accents and chart ramps.
export function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const R = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const B = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const gam = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  return [R, G, B].map((v) => gam(v) * 255);
}
export function inGamut(rgb) { return rgb.every((v) => v >= -0.5 && v <= 255.5); }
/* Return the hex for OKLCH, lowering chroma until the color is inside sRGB. */
export function oklchHex(L, C, h) {
  let c = C;
  for (let i = 0; i < 60; i++) {
    const rgb = oklchToRgb(L, c, h);
    if (inGamut(rgb)) return rgbToHex(rgb);
    c -= C / 60;
  }
  return rgbToHex(oklchToRgb(L, 0, h));
}
export function rgbToOklab(hex) {
  const [r, g, b] = hexToRgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}
export const deltaE = (a, b) => { const [l1, a1, b1] = rgbToOklab(a), [l2, a2, b2] = rgbToOklab(b); return Math.hypot(l1 - l2, a1 - a2, b1 - b2); };

/* Color-vision-deficiency simulation, Machado et al. 2009 matrices at severity 1.0 (linear RGB). */
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
export function simulate(hex, kind) {
  const m = CVD[kind];
  const [r, g, b] = hexToRgb(hex).map(lin);
  const out = m.map((row) => row[0] * r + row[1] * g + row[2] * b);
  const gam = (x) => { x = Math.max(0, Math.min(1, x)); return (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055) * 255; };
  return rgbToHex(out.map(gam));
}

// ---------- audit ----------
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const json = JSON.parse(readFileSync(join(tokensDir, "tokens.json"), "utf8"));
  const val = (node) => node.$value;
  const light = Object.fromEntries(Object.entries(json.color.light).map(([k, v]) => [k, val(v)]));
  const dark = Object.fromEntries(Object.entries(json.color.dark).map(([k, v]) => [k, val(v)]));
  const chartL = Object.fromEntries(Object.entries(json.chart.light).map(([k, v]) => [k, val(v)]));
  const chartD = Object.fromEntries(Object.entries(json.chart.dark).map(([k, v]) => [k, val(v)]));

  const failures = [];
  const rows = [];
  const check = (mode, fg, bg, fgHex, bgHex, min, kind) => {
    const r = contrast(fgHex, bgHex);
    const ok = r >= min;
    rows.push({ mode, kind, fg, bg, fgHex, bgHex, ratio: +r.toFixed(2), min, ok });
    if (!ok) failures.push(`${mode} ${kind} ${fg} ${fgHex} on ${bg} ${bgHex}: ${r.toFixed(2)} < ${min}`);
  };

  // Text roles on canvas and surface. ink-muted is allowed on surface-sunken as well.
  const textRoles = ["ink", "ink-secondary", "ink-muted", "accent", "accent-hover", "success", "warning", "danger"];
  for (const [mode, t] of [["light", light], ["dark", dark]]) {
    for (const role of textRoles) {
      for (const bg of ["canvas", "canvas-soft", "surface", "surface-raised"]) check(mode, role, bg, t[role], t[bg], 4.5, "text");
    }
    check(mode, "ink-muted", "surface-sunken", t["ink-muted"], t["surface-sunken"], 4.5, "text");
    check(mode, "ink-secondary", "surface-sunken", t["ink-secondary"], t["surface-sunken"], 4.5, "text");
    check(mode, "on-accent", "accent", t["on-accent"], t["accent"], 4.5, "text");
    check(mode, "on-primary", "primary", t["on-primary"], t["primary"], 4.5, "text");
    check(mode, "accent", "accent-soft", t["accent"], t["accent-soft"], 4.5, "text");
    check(mode, "danger", "danger-soft", t["danger"], t["danger-soft"], 4.5, "text");
    // Border roles: hairline-strong is the control boundary; focus ring on canvas and surface.
    for (const bg of ["canvas", "surface", "surface-sunken"]) check(mode, "hairline-strong", bg, t["hairline-strong"], t[bg], 3, "border");
    check(mode, "focus-ring", "canvas", t["focus-ring"], t["canvas"], 3, "border");
    check(mode, "focus-ring", "surface", t["focus-ring"], t["surface"], 3, "border");
  }
  // Chart marks: 3:1 on canvas and surface (WCAG 1.4.11 graphical objects).
  for (const [mode, t, c] of [["light", light, chartL], ["dark", dark, chartD]]) {
    for (const [k, hex] of Object.entries(c)) {
      if (k === "grid") { check(mode, "chart-grid", "canvas", hex, t.canvas, 1.2, "grid (decorative, informational only)"); continue; }
      check(mode, `chart-${k}`, "canvas", hex, t.canvas, 3, "mark");
      check(mode, `chart-${k}`, "surface", hex, t.surface, 3, "mark");
    }
    // Pairwise distinctness in OKLab, normal vision and three CVD types.
    const keys = Object.keys(c).filter((k) => k !== "grid");
    // Minimum OKLab distance between any two marks. Tritanopia is rarer than protan and deutan by two orders of magnitude, so its bar is lower.
    const minDe = { normal: 0.10, protanopia: 0.06, deuteranopia: 0.06, tritanopia: 0.045 };
    for (const kind of ["normal", ...Object.keys(CVD)]) {
      for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
        const a = kind === "normal" ? c[keys[i]] : simulate(c[keys[i]], kind);
        const b = kind === "normal" ? c[keys[j]] : simulate(c[keys[j]], kind);
        const d = deltaE(a, b);
        if (d < minDe[kind]) failures.push(`${mode} chart ${keys[i]} vs ${keys[j]} too close under ${kind}: dE ${d.toFixed(3)} < ${minDe[kind]}`);
      }
    }
  }
  // Accents from accents.css: every [data-accent] value of --ds-accent must be 4.5:1 on canvas.
  let accents = [];
  try {
    const css = readFileSync(join(tokensDir, "accents.css"), "utf8");
    const re = /\[data-accent="([a-z-]+)"\](?:\s*,\s*:root\[data-accent="[a-z-]+"\])?(\[data-theme="dark"\])?\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(css))) {
      const [, name, darkSel, body] = m;
      const get = (k) => (body.match(new RegExp(`--ds-${k}:\\s*([^;]+);`)) || [])[1]?.trim();
      const mode = darkSel ? "dark" : "light";
      const t = darkSel ? dark : light;
      const accent = get("accent"), hover = get("accent-hover"), soft = get("accent-soft"), on = get("on-accent");
      if (!accent) continue;
      accents.push({ name, mode, accent, hover, soft });
      check(`${mode} accent=${name}`, "accent", "canvas", accent, t.canvas, 4.5, "text");
      check(`${mode} accent=${name}`, "accent", "surface", accent, t.surface, 4.5, "text");
      if (hover) check(`${mode} accent=${name}`, "accent-hover", "canvas", hover, t.canvas, 4.5, "text");
      if (soft) check(`${mode} accent=${name}`, "accent", "accent-soft", accent, soft, 4.5, "text");
      if (on) check(`${mode} accent=${name}`, "on-accent", "accent", on, accent, 4.5, "text");
    }
  } catch (e) { rows.push({ note: "accents.css not found, skipped" }); }

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ rows, failures }, null, 2));
  } else {
    const pad = (s, n) => String(s).padEnd(n);
    console.log(pad("mode", 22) + pad("kind", 8) + pad("foreground", 16) + pad("background", 16) + pad("ratio", 8) + "min  result");
    for (const r of rows) {
      if (r.note) { console.log(r.note); continue; }
      console.log(pad(r.mode, 22) + pad(r.kind.split(" ")[0], 8) + pad(`${r.fg} ${r.fgHex}`, 16 + 8) + pad(`${r.bg} ${r.bgHex}`, 16 + 8) + pad(r.ratio.toFixed(2), 8) + pad(r.min, 5) + (r.ok ? "pass" : "FAIL"));
    }
    console.log(`\n${rows.filter((r) => r.ok).length} pass, ${failures.length} fail`);
    for (const f of failures) console.log("FAIL " + f);
  }
  process.exit(failures.length ? 1 : 0);
}
