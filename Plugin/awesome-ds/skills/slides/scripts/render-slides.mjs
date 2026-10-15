#!/usr/bin/env node
// Write one HTML slide deck from JSON. See docs/specs/sta-103-slides.md.
// node render-slides.mjs <deck.json> -o <deck.html>
import { readFileSync, writeFileSync } from "node:fs";

const BODY_JA = 40;
const BODY_EN_WORDS = 20;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

const CSS = `    :root { --canvas: #ffffff; --ink: #0a0a0a; --muted: #525252; --accent: #2f5bea; }
    html, body { margin: 0; background: #111; color: var(--ink); }
    .slide {
      display: none;
      width: min(100vw, calc(100vh * 16 / 9));
      aspect-ratio: 16 / 9;
      margin: 0 auto;
      background: var(--canvas);
      box-sizing: border-box;
      padding: 8%;
      font-family: "Noto Sans JP", "Hiragino Sans", sans-serif;
    }
    .slide.active { display: block; }
    h1 { font-size: 2.5rem; line-height: 1.2; font-weight: 600; margin: 0; }
    p, li { font-size: 1.25rem; line-height: 1.5; }
    .index { position: fixed; right: 1rem; bottom: 1rem; color: #fff; font-size: 0.875rem; }
    @media (prefers-reduced-motion: reduce) { .slide { transition: none; } }`;

const SCRIPT = `    const slides = [...document.querySelectorAll(".slide")];
    const index = document.querySelector(".index");
    let i = 0;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === i));
      index.textContent = (i + 1) + " / " + slides.length;
    }
    addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(i + 1);
      if (e.key === "ArrowLeft") show(i - 1);
    });`;

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function overLimit(text, lang) {
  const value = text.trim();
  if (EMOJI.test(value)) return "emoji";
  if (lang === "ja") return [...value].length > BODY_JA ? "ja" : "";
  const words = value.split(/\s+/).filter(Boolean).length;
  return words > BODY_EN_WORDS ? "en" : "";
}

export function validateDeckInput(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return ["input must be an object"];
  }
  if (input.lang !== "ja" && input.lang !== "en") errors.push("lang must be ja or en");
  if (!nonEmpty(input.title)) errors.push("title must be a non-empty string");
  if (!Array.isArray(input.slides) || input.slides.length === 0) {
    errors.push("slides must contain one or more slides");
    return errors;
  }
  const lang = input.lang === "en" ? "en" : "ja";
  input.slides.forEach((slide, index) => {
    const where = `slide ${index + 1}`;
    if (!slide || typeof slide !== "object" || Array.isArray(slide)) {
      errors.push(`${where} must be an object`);
      return;
    }
    if (!nonEmpty(slide.heading)) errors.push(`${where} heading must be a non-empty string`);
    const hasSentence = slide.sentence != null;
    const hasItems = slide.items != null;
    if (hasSentence === hasItems) errors.push(`${where} needs exactly one of sentence or items`);
    if (hasSentence && !nonEmpty(slide.sentence)) errors.push(`${where} sentence must be a non-empty string`);
    if (hasItems) {
      if (!Array.isArray(slide.items) || slide.items.length < 1 || slide.items.length > 4 || slide.items.some((item) => !nonEmpty(item))) {
        errors.push(`${where} items must be 1 to 4 non-empty strings`);
      }
    }
    if (nonEmpty(slide.heading)) {
      const heading = overLimit(slide.heading, lang);
      if (heading === "emoji") errors.push(`${where} heading must not use emoji`);
      if (heading === "ja") errors.push(`${where} heading is over ${BODY_JA} characters`);
      if (heading === "en") errors.push(`${where} heading is over ${BODY_EN_WORDS} words`);
    }
    const parts = Array.isArray(slide.items) ? slide.items.filter(nonEmpty).map((item) => item.trim()) : [];
    const body = hasSentence && nonEmpty(slide.sentence)
      ? slide.sentence
      : lang === "en"
        ? parts.join(" ")
        : parts.join("");
    if (body) {
      const limit = overLimit(body, lang);
      if (limit === "emoji") errors.push(`${where} body must not use emoji`);
      if (limit === "ja") errors.push(`${where} body is over ${BODY_JA} characters`);
      if (limit === "en") errors.push(`${where} body is over ${BODY_EN_WORDS} words`);
    }
  });
  return errors;
}

function slideHtml(slide, index) {
  const active = index === 0 ? " active" : "";
  const heading = `  <h1>${esc(slide.heading.trim())}</h1>`;
  const body = slide.sentence != null
    ? `  <p>${esc(slide.sentence.trim())}</p>`
    : `  <ul>\n${slide.items.map((item) => `    <li>${esc(item.trim())}</li>`).join("\n")}\n  </ul>`;
  return `<section class="slide${active}">\n${heading}\n${body}\n</section>`;
}

function assemble(input) {
  const sections = input.slides.map(slideHtml).join("\n");
  const count = input.slides.length;
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
${sections}
  <p class="index">1 / ${count}</p>
  <script>
${SCRIPT}
  </script>
</body>
</html>
`;
}

export function renderSlides(input) {
  const errors = validateDeckInput(input);
  if (errors.length) return { ok: false, errors, html: "" };
  return { ok: true, errors: [], html: assemble(input) };
}

function main() {
  const args = process.argv.slice(2);
  const file = args.find((arg) => !arg.startsWith("-"));
  const outFlag = args.indexOf("-o");
  const out = outFlag >= 0 ? args[outFlag + 1] : "";
  if (!file || !out) {
    console.error("usage: node render-slides.mjs <deck.json> -o <deck.html>");
    process.exit(1);
  }
  let input;
  try {
    input = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`invalid JSON: ${error.message}`);
    process.exit(1);
  }
  const result = renderSlides(input);
  if (!result.ok) {
    console.error(result.errors.join("\n"));
    process.exit(1);
  }
  writeFileSync(out, result.html);
  console.log(`render-slides: OK ${out}`);
}

if (process.argv[1] && process.argv[1].endsWith("render-slides.mjs")) main();
