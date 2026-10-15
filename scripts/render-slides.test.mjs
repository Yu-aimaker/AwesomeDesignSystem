import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderSlides } from "../Plugin/awesome-ds/skills/slides/scripts/render-slides.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const script = join(root, "Plugin/awesome-ds/skills/slides/scripts/render-slides.mjs");

function colorTokens(source) {
  const found = {};
  for (const name of ["canvas", "ink", "muted", "accent"]) {
    const match = source.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
    found[name] = match ? match[1].toLowerCase() : "";
  }
  return found;
}

const good = {
  lang: "ja",
  title: "請求の確認",
  slides: [
    { heading: "未入金は3件", sentence: "期限を1週間延ばす。" },
    { heading: "次の作業", items: ["請求書を送る", "入金を見る"] },
  ],
};

describe("render-slides", () => {
  it("writes the skill skeleton with one claim per slide", () => {
    const result = renderSlides(good);
    assert.deepEqual(result.errors, []);
    assert.match(result.html, /--canvas:\s*#ffffff/);
    assert.match(result.html, /--ink:\s*#0a0a0a/);
    assert.match(result.html, /--accent:\s*#2f5bea/);
    assert.equal((result.html.match(/<section class="slide/g) || []).length, 2);
    assert.equal((result.html.match(/class="slide active"/g) || []).length, 1);
    assert.match(result.html, /1 \/ 2/);
    assert.match(result.html, /ArrowRight/);
    assert.match(result.html, /ArrowLeft/);
    assert.match(result.html, /prefers-reduced-motion:\s*reduce/);
    assert.match(result.html, /aspect-ratio:\s*16 \/ 9/);
    assert.match(result.html, /p, li \{ font-size: 1\.25rem/);
    assert.doesNotMatch(result.html, /(linear|radial|conic)-gradient/i);
    assert.equal((result.html.match(/#2f5bea/g) || []).length, 1);
    assert.equal((result.html.match(/class="card"/g) || []).length, 0);
    const skill = readFileSync(join(root, "Plugin/awesome-ds/skills/slides/SKILL.md"), "utf8");
    assert.match(skill, /--canvas: #ffffff/);
    assert.match(skill, /render-slides\.mjs/);
    assert.deepEqual(colorTokens(result.html), colorTokens(skill));
  });

  it("rejects five items, both body kinds, and neither", () => {
    const five = renderSlides({
      ...good,
      slides: [{ heading: "項目", items: ["1", "2", "3", "4", "5"] }],
    });
    assert.equal(five.ok, false);
    assert.equal(five.html, "");
    const both = renderSlides({
      ...good,
      slides: [{ heading: "題", sentence: "文です。", items: ["1"] }],
    });
    assert.equal(both.ok, false);
    const neither = renderSlides({ ...good, slides: [{ heading: "題" }] });
    assert.equal(neither.ok, false);
    assert.equal(neither.html, "");
  });

  it("caps a Japanese heading and body at 40 characters", () => {
    const atLimit = renderSlides({
      lang: "ja",
      title: "あ".repeat(80),
      slides: [{ heading: "あ".repeat(40), sentence: "い".repeat(40) }],
    });
    assert.equal(atLimit.ok, true);
    const heading = renderSlides({
      ...good,
      slides: [{ heading: "あ".repeat(41), sentence: "短い。" }],
    });
    assert.equal(heading.ok, false);
    assert.equal(heading.html, "");
    const body = renderSlides({
      ...good,
      slides: [{ heading: "題", sentence: "あ".repeat(41) }],
    });
    assert.equal(body.ok, false);
    assert.ok(body.errors.some((error) => error.includes("40")));
    const items = renderSlides({
      ...good,
      slides: [{ heading: "題", items: ["あ".repeat(20), "い".repeat(21)] }],
    });
    assert.equal(items.ok, false);
    assert.equal(items.html, "");
  });

  it("caps an English body at 20 words and rejects emoji", () => {
    const words = (n) => Array.from({ length: n }, () => "word").join(" ");
    const atLimit = renderSlides({
      lang: "en",
      title: words(30),
      slides: [{ heading: words(20), sentence: words(20) }],
    });
    assert.equal(atLimit.ok, true);
    const over = renderSlides({
      lang: "en",
      title: "Deck",
      slides: [{ heading: "Claim", sentence: words(21) }],
    });
    assert.equal(over.ok, false);
    assert.ok(over.errors.some((error) => error.includes("20")));
    const emoji = renderSlides({
      ...good,
      slides: [{ heading: "未入金", sentence: "期限を延ばす✅" }],
    });
    assert.equal(emoji.ok, false);
    assert.equal(emoji.html, "");
  });

  it("escapes a heading so it cannot open a script tag", () => {
    const result = renderSlides({
      ...good,
      slides: [{ heading: "</h1><script>alert(1)</script>", sentence: "短い文。" }],
    });
    assert.equal(result.ok, true);
    assert.doesNotMatch(result.html, /<script>alert/);
    assert.match(result.html, /&lt;script&gt;/);
  });

  it("ignores a css field and does not emit it", () => {
    const result = renderSlides({ ...good, css: "body{background:red}", svg: "<svg></svg>" });
    assert.equal(result.ok, true);
    assert.doesNotMatch(result.html, /background:red|<svg/);
  });

  it("CLI writes a file only when the input is valid", () => {
    const dir = mkdtempSync(join(tmpdir(), "slides-"));
    try {
      const input = join(dir, "deck.json");
      const output = join(dir, "deck.html");
      writeFileSync(input, JSON.stringify(good));
      const ok = spawnSync(process.execPath, [script, input, "-o", output], { encoding: "utf8" });
      assert.equal(ok.status, 0);
      assert.match(ok.stdout, /render-slides: OK/);
      assert.match(readFileSync(output, "utf8"), /<h1>未入金は3件<\/h1>/);

      writeFileSync(input, JSON.stringify({ ...good, slides: [] }));
      const missing = join(dir, "missing.html");
      const bad = spawnSync(process.execPath, [script, input, "-o", missing], { encoding: "utf8" });
      assert.equal(bad.status, 1);
      assert.throws(() => readFileSync(missing, "utf8"));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("spec locks the generator and leaves the site page alone", () => {
    const spec = readFileSync(join(root, "docs/specs/slides.md"), "utf8");
    assert.match(spec, /render-slides\.mjs/);
    assert.match(spec, /40/);
    assert.match(spec, /このスクリプトでは変えない/);
    assert.match(spec, /\/slides/);
  });
});
