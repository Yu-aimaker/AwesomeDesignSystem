#!/usr/bin/env node
// Check one HTML report against the html-report skill.
// node check-report.mjs <file.html>
import { readFileSync } from "node:fs";

const JA = /[぀-ヿ一-鿿]/;
const BODY_JA = 1500;
const BODY_EN_WORDS = 700;

export function checkHtmlReport(html) {
  const errors = [];
  if (!/<html\b[^>]*\blang=["'][a-z]{2}/i.test(html)) {
    errors.push("html element needs a lang attribute");
  }
  if (!/--canvas:\s*#ffffff\b/i.test(html)) {
    errors.push("style needs --canvas: #ffffff");
  }
  if (!/--ink:\s*#0a0a0a\b/i.test(html)) {
    errors.push("style needs --ink: #0a0a0a");
  }
  if (/(linear|radial|conic)-gradient/i.test(html)) {
    errors.push("report must not use a gradient");
  }

  const conclusion = html.match(/<section\b[^>]*class=["'][^"']*\bconclusion\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/i);
  if (!conclusion) {
    errors.push("missing section.conclusion");
  } else {
    const paragraphs = conclusion[1].match(/<p\b/gi) || [];
    if (paragraphs.length !== 3) {
      errors.push(`section.conclusion needs 3 paragraphs, found ${paragraphs.length}`);
    }
  }

  const tables = (html.match(/<table\b/gi) || []).length;
  const figures = (html.match(/<(figure|img|svg)\b/gi) || []).length;
  if (tables === 1 && figures === 0) {
    // one table
  } else if (tables === 0 && figures === 1) {
    // one figure
  } else {
    errors.push(`need exactly one table or one figure, found tables=${tables} figures=${figures}`);
  }

  const body = bodyText(html);
  if (JA.test(html)) {
    if ([...body].length > BODY_JA) {
      errors.push(`Japanese body is ${[...body].length} characters, limit ${BODY_JA}`);
    }
  } else {
    const words = body.split(/\s+/).filter(Boolean).length;
    if (words > BODY_EN_WORDS) {
      errors.push(`English body is ${words} words, limit ${BODY_EN_WORDS}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

function bodyText(html) {
  let src = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<head\b[\s\S]*?<\/head>/gi, " ")
    .replace(/<section\b[^>]*class=["'][^"']*\bconclusion\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, " ")
    .replace(/<h1\b[\s\S]*?<\/h1>/gi, " ")
    .replace(/<p\b[^>]*class=["'][^"']*\bmeta\b[^"']*["'][^>]*>[\s\S]*?<\/p>/gi, " ");
  src = src.replace(/<[^>]+>/g, " ");
  return src.replace(/\s+/g, " ").trim();
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node check-report.mjs <file.html>");
    process.exit(2);
  }
  const html = readFileSync(file, "utf8");
  const result = checkHtmlReport(html);
  if (!result.ok) {
    console.error(result.errors.join("\n"));
    process.exit(1);
  }
  console.log(`check-report: OK ${file}`);
}

if (process.argv[1] && process.argv[1].endsWith("check-report.mjs")) main();
