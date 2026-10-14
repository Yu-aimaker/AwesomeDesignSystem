import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderHtmlReport } from "../Plugin/awesome-ds/skills/html-report/scripts/render-report.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const script = join(root, "Plugin/awesome-ds/skills/html-report/scripts/render-report.mjs");

function colorTokens(source) {
  const found = {};
  for (const name of ["canvas", "ink", "muted", "hairline", "accent"]) {
    const match = source.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
    found[name] = match ? match[1].toLowerCase() : "";
  }
  return found;
}

const good = {
  lang: "ja",
  title: "請求の確認",
  conclusion: ["未入金は3件です。", "期限を1週間延ばします。", "次は請求書を送ります。"],
  table: { headers: ["項目", "値"], rows: [["未入金", "3件"]] },
  sources: ["https://example.com/invoices"],
};

describe("render-report", () => {
  it("writes the skill skeleton with three conclusion lines and one table", () => {
    const result = renderHtmlReport(good);
    assert.deepEqual(result.errors, []);
    assert.match(result.html, /--canvas:\s*#ffffff/);
    assert.match(result.html, /--ink:\s*#0a0a0a/);
    assert.match(result.html, /--accent:\s*#2f5bea/);
    assert.equal((result.html.match(/<section\b[^>]*conclusion[\s\S]*?<\/section>/i)[0].match(/<p\b/g) || []).length, 3);
    assert.equal((result.html.match(/<table\b/gi) || []).length, 1);
    assert.equal((result.html.match(/<(figure|img|svg)\b/gi) || []).length, 0);
    assert.doesNotMatch(result.html, /(linear|radial|conic)-gradient/i);
    const skill = readFileSync(join(root, "Plugin/awesome-ds/skills/html-report/SKILL.md"), "utf8");
    assert.match(skill, /--canvas: #ffffff/);
    assert.match(skill, /render-report\.mjs/);
    assert.deepEqual(colorTokens(result.html), colorTokens(skill));
  });

  it("writes one img and no table", () => {
    const result = renderHtmlReport({
      ...good,
      lang: "en",
      title: "Invoice check",
      conclusion: ["Three invoices are unpaid.", "The due date moves by one week.", "Send the invoices next."],
      table: undefined,
      figure: { src: "invoices.png", alt: "Three unpaid invoices" },
    });
    assert.equal(result.ok, true);
    assert.equal((result.html.match(/<img\b/gi) || []).length, 1);
    assert.equal((result.html.match(/<table\b/gi) || []).length, 0);
    assert.equal((result.html.match(/<figure\b/gi) || []).length, 0);
  });

  it("rejects both a table and a figure, neither, and a short conclusion", () => {
    const both = renderHtmlReport({ ...good, figure: { src: "a.png", alt: "chart" } });
    assert.equal(both.ok, false);
    assert.equal(both.html, "");
    assert.ok(both.errors.some((error) => error.includes("exactly one")));
    const neither = renderHtmlReport({ ...good, table: undefined });
    assert.equal(neither.ok, false);
    assert.equal(neither.html, "");
    const short = renderHtmlReport({ ...good, conclusion: ["1つだけです。"] });
    assert.equal(short.ok, false);
    assert.ok(short.errors.some((error) => error.includes("3")));
  });

  it("counts table cells and figure alt, and ignores the title, conclusion, and sources", () => {
    const atLimit = renderHtmlReport({
      ...good,
      title: "あ".repeat(2000),
      conclusion: ["あ".repeat(2000), "い".repeat(2000), "う".repeat(2000)],
      table: { headers: ["あ"], rows: [["あ".repeat(1499)]] },
      sources: ["https://example.com/" + "a".repeat(2000)],
    });
    assert.equal(atLimit.ok, true);
    const over = renderHtmlReport({
      ...good,
      table: { headers: ["項目"], rows: [["あ".repeat(1501)]] },
    });
    assert.equal(over.ok, false);
    assert.equal(over.html, "");
    assert.ok(over.errors.some((error) => error.includes("1500")));
    const altOver = renderHtmlReport({
      ...good,
      table: undefined,
      figure: { src: "chart.png", alt: "あ".repeat(1501) },
    });
    assert.equal(altOver.ok, false);
    assert.equal(altOver.html, "");
  });

  it("rejects an English body over 700 words and a javascript figure src", () => {
    const words = Array.from({ length: 701 }, () => "word").join(" ");
    const long = renderHtmlReport({
      lang: "en",
      title: "Invoice check",
      conclusion: ["Three invoices are unpaid.", "The due date moves by one week.", "Send the invoices next."],
      table: { headers: ["Note"], rows: [[words]] },
      sources: ["https://example.com/invoices"],
    });
    assert.equal(long.ok, false);
    assert.ok(long.errors.some((error) => error.includes("700")));
    const scriptSrc = renderHtmlReport({
      ...good,
      table: undefined,
      figure: { src: "javascript:alert(1)", alt: "chart" },
    });
    assert.equal(scriptSrc.ok, false);
    assert.equal(scriptSrc.html, "");
    const atLimit = renderHtmlReport({
      lang: "en",
      title: "Invoice check " + Array.from({ length: 800 }, () => "title").join(" "),
      conclusion: [
        Array.from({ length: 800 }, () => "true").join(" "),
        Array.from({ length: 800 }, () => "change").join(" "),
        Array.from({ length: 800 }, () => "next").join(" "),
      ],
      table: { headers: ["Note"], rows: [[Array.from({ length: 699 }, () => "word").join(" ")]] },
      sources: ["https://example.com/" + Array.from({ length: 50 }, () => "src").join("")],
    });
    assert.equal(atLimit.ok, true);
  });

  it("escapes a title so it cannot open a script tag", () => {
    const result = renderHtmlReport({ ...good, title: "</h1><script>alert(1)</script>" });
    assert.equal(result.ok, true);
    assert.doesNotMatch(result.html, /<script>/);
    assert.match(result.html, /&lt;script&gt;/);
  });

  it("CLI writes a file only when the input is valid", () => {
    const dir = mkdtempSync(join(tmpdir(), "html-report-"));
    try {
      const input = join(dir, "report.json");
      const output = join(dir, "report.html");
      writeFileSync(input, JSON.stringify(good));
      const ok = spawnSync(process.execPath, [script, input, "-o", output], { encoding: "utf8" });
      assert.equal(ok.status, 0);
      assert.match(ok.stdout, /render-report: OK/);
      assert.match(readFileSync(output, "utf8"), /<h1>請求の確認<\/h1>/);

      writeFileSync(input, JSON.stringify({ ...good, conclusion: [] }));
      const missing = join(dir, "missing.html");
      const bad = spawnSync(process.execPath, [script, input, "-o", missing], { encoding: "utf8" });
      assert.equal(bad.status, 1);
      assert.throws(() => readFileSync(missing, "utf8"));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("spec locks the generator and leaves the site page alone", () => {
    const spec = readFileSync(join(root, "docs/specs/sta-102-html-report.md"), "utf8");
    assert.match(spec, /render-report\.mjs/);
    assert.match(spec, /1,500/);
    assert.match(spec, /STA-152/);
    assert.match(spec, /\/report/);
  });
});
