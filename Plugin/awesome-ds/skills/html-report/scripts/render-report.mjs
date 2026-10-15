#!/usr/bin/env node
// Write one HTML report from JSON. See docs/specs/sta-102-html-report.md.
// node render-report.mjs <report.json> -o <report.html>
import { readFileSync, writeFileSync } from "node:fs";

const JA = /[぀-ヿ一-鿿]/;
const BODY_JA = 1500;
const BODY_EN_WORDS = 700;

const CSS = `:root {
      --canvas: #ffffff;
      --ink: #0a0a0a;
      --muted: #525252;
      --hairline: #e5e5e5;
      --accent: #2f5bea;
    }
    body {
      margin: 0;
      background: var(--canvas);
      color: var(--ink);
      font-family: "Noto Sans JP", "Hiragino Sans", sans-serif;
      font-size: 16px;
      line-height: 1.6;
    }
    main { max-width: 40rem; margin: 0 auto; padding: 3rem 1.25rem 4rem; }
    h1 { font-size: 1.75rem; line-height: 1.25; font-weight: 600; margin: 0 0 1rem; }
    .conclusion { margin: 0 0 2rem; }
    .conclusion p { margin: 0 0 0.5rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0; border-bottom: 1px solid var(--hairline); vertical-align: top; }
    a { color: var(--accent); }
    .meta { color: var(--muted); font-size: 0.875rem; }`;

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isHttps(value) {
  return typeof value === "string" && /^https:\/\/[^\s]+$/.test(value);
}

function isFigureSrc(value) {
  if (typeof value !== "string" || value.length === 0 || /\s/.test(value)) return false;
  if (/^[a-z]+:/i.test(value)) return isHttps(value);
  return !value.startsWith("/") && !value.startsWith("\\") && !value.includes("..");
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateReportInput(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return ["input must be an object"];
  }
  if (input.lang !== "ja" && input.lang !== "en") errors.push("lang must be ja or en");
  if (!nonEmpty(input.title)) errors.push("title must be a non-empty string");
  if (!Array.isArray(input.conclusion) || input.conclusion.length !== 3 || input.conclusion.some((line) => !nonEmpty(line))) {
    errors.push("conclusion must be 3 non-empty strings");
  }
  const hasTable = input.table != null;
  const hasFigure = input.figure != null;
  if (hasTable === hasFigure) errors.push("provide exactly one of table or figure");
  if (hasTable) {
    const headers = input.table?.headers;
    const rows = input.table?.rows;
    if (!Array.isArray(headers) || headers.length === 0 || headers.some((cell) => !nonEmpty(cell))) {
      errors.push("table.headers must be one or more non-empty strings");
    } else if (!Array.isArray(rows) || rows.length === 0) {
      errors.push("table.rows must have one or more rows");
    } else if (rows.some((row) => !Array.isArray(row) || row.length !== headers.length || row.some((cell) => !nonEmpty(cell)))) {
      errors.push("each table row must match the header count with non-empty cells");
    }
  }
  if (hasFigure) {
    if (!isFigureSrc(input.figure?.src)) errors.push("figure.src must be an https URL or a relative path");
    if (!nonEmpty(input.figure?.alt)) errors.push("figure.alt must be a non-empty string");
  }
  if (!Array.isArray(input.sources) || input.sources.length === 0 || input.sources.some((url) => !isHttps(url))) {
    errors.push("sources must be one or more https URLs");
  }
  return errors;
}

function decodeText(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function bodyParts(html) {
  const cells = [...html.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((match) =>
    decodeText(match[1]).replace(/\s+/g, " ").trim(),
  );
  const alts = [...html.matchAll(/\balt="([^"]*)"/gi)].map((match) => decodeText(match[1]).replace(/\s+/g, " ").trim());
  return [...cells, ...alts].filter(Boolean);
}

export function reportLimitErrors(html) {
  const errors = [];
  const parts = bodyParts(html);
  if (JA.test(html)) {
    const count = parts.reduce((sum, part) => sum + [...part].length, 0);
    if (count > BODY_JA) errors.push(`Japanese body is ${count} characters, limit ${BODY_JA}`);
  } else {
    const words = parts.reduce((sum, part) => sum + part.split(/\s+/).filter(Boolean).length, 0);
    if (words > BODY_EN_WORDS) errors.push(`English body is ${words} words, limit ${BODY_EN_WORDS}`);
  }
  return errors;
}

function assemble(input) {
  const conclusion = input.conclusion.map((line) => `      <p>${esc(line.trim())}</p>`).join("\n");
  let block;
  if (input.table) {
    const heads = input.table.headers.map((cell) => `<th>${esc(cell.trim())}</th>`).join("");
    const rows = input.table.rows
      .map((row) => `      <tr>${row.map((cell) => `<td>${esc(cell.trim())}</td>`).join("")}</tr>`)
      .join("\n");
    block = `    <table>\n      <tr>${heads}</tr>\n${rows}\n    </table>`;
  } else {
    block = `    <img src="${esc(input.figure.src)}" alt="${esc(input.figure.alt.trim())}">`;
  }
  const sources = input.sources.map((url) => esc(url)).join(" ");
  return `<!DOCTYPE html>
<html lang="${input.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(input.title.trim())}</title>
  <style>
    ${CSS}
  </style>
</head>
<body>
  <main>
    <h1>${esc(input.title.trim())}</h1>
    <section class="conclusion">
${conclusion}
    </section>
${block}
    <p class="meta">${sources}</p>
  </main>
</body>
</html>
`;
}

export function renderHtmlReport(input) {
  const errors = validateReportInput(input);
  if (errors.length) return { ok: false, errors, html: "" };
  const html = assemble(input);
  const limits = reportLimitErrors(html);
  if (limits.length) return { ok: false, errors: limits, html: "" };
  return { ok: true, errors: [], html };
}

function main() {
  const args = process.argv.slice(2);
  const file = args.find((arg) => !arg.startsWith("-"));
  const outFlag = args.indexOf("-o");
  const out = outFlag >= 0 ? args[outFlag + 1] : "";
  if (!file || !out) {
    console.error("usage: node render-report.mjs <report.json> -o <report.html>");
    process.exit(1);
  }
  let input;
  try {
    input = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`invalid JSON: ${error.message}`);
    process.exit(1);
  }
  const result = renderHtmlReport(input);
  if (!result.ok) {
    console.error(result.errors.join("\n"));
    process.exit(1);
  }
  writeFileSync(out, result.html);
  console.log(`render-report: OK ${out}`);
}

if (process.argv[1] && process.argv[1].endsWith("render-report.mjs")) main();
