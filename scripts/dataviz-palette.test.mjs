// The data-visualization foundation printed six dark chart colors that were not the tokens.
// This keeps the palette table in the foundation, tokens.json and tokens.css in step.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const doc = readFileSync(join(root, "AwesomeDS/foundations/data-visualization.md"), "utf8");
const tokens = JSON.parse(readFileSync(join(root, "AwesomeDS/tokens/tokens.json"), "utf8"));
const css = readFileSync(join(root, "AwesomeDS/tokens/tokens.css"), "utf8");
const canvas = { light: tokens.color.light.canvas.$value, dark: tokens.color.dark.canvas.$value };

// | chart-1 | `#356ddc` | `#689cfe` | 262 (blue) | 4.80 | 7.33 | use |
const rows = Object.fromEntries(
  [...doc.matchAll(/^\| chart-(\w+) \| `(#[0-9a-f]{6})` \| `(#[0-9a-f]{6})` \|[^|]*\| ([\d.]+) \| ([\d.]+) \|/gm)].map(
    ([, key, light, dark, cl, cd]) => [key, { light, dark, contrast: { light: Number(cl), dark: Number(cd) } }],
  ),
);

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("the palette table lists every chart token and nothing else", () => {
  assert.deepEqual(Object.keys(rows).sort(), Object.keys(tokens.chart.light).sort());
  assert.deepEqual(Object.keys(tokens.chart.dark).sort(), Object.keys(tokens.chart.light).sort());
});

for (const mode of ["light", "dark"]) {
  test(`${mode} values in the table equal tokens.json`, () => {
    for (const [key, { $value }] of Object.entries(tokens.chart[mode])) {
      assert.equal(rows[key][mode], $value.toLowerCase(), `chart-${key} ${mode}`);
    }
  });

  test(`${mode} contrast in the table is measured on canvas`, () => {
    for (const [key, row] of Object.entries(rows)) {
      const measured = contrast(row[mode], canvas[mode]);
      assert.ok(Math.abs(measured - row.contrast[mode]) < 0.01, `chart-${key} ${mode}: table ${row.contrast[mode]}, measured ${measured.toFixed(2)}`);
    }
  });
}

test("every theme block in tokens.css uses the tokens.json chart values", () => {
  const blocks = [...css.matchAll(/--ds-chart-1:[\s\S]*?--ds-chart-grid: (#[0-9a-f]{6});/g)].map((m) => m[0]);
  assert.ok(blocks.length >= 3, "light, [data-theme=dark] and prefers-color-scheme dark");
  for (const block of blocks) {
    const values = Object.fromEntries([...block.matchAll(/--ds-chart-(\w+): (#[0-9a-f]{6});/g)].map(([, k, v]) => [k, v]));
    const mode = values["1"] === tokens.chart.light["1"].$value ? "light" : "dark";
    for (const [key, { $value }] of Object.entries(tokens.chart[mode])) {
      assert.equal(values[key], $value.toLowerCase(), `tokens.css ${mode} chart-${key}`);
    }
  }
});
