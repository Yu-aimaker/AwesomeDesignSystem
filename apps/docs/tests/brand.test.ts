import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getBrandPersonality } from "../lib/brand-content";
import { getBrandDiagram } from "../lib/brand-diagrams";
import { getDictionary } from "../lib/i18n";
import manifest from "../app/manifest";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
// Hiragana, katakana, or CJK ideographs — used to assert real Japanese content.
const JAPANESE = /[぀-ヿ㐀-鿿]/;

describe("brand surface is bilingual, readable, and honest", () => {
  test("personality reads natively in each locale (not a caption)", () => {
    const en = getBrandPersonality("en");
    const ja = getBrandPersonality("ja");
    expect(en.traits.length).toBe(ja.traits.length);
    expect(en.voice.length).toBe(ja.voice.length);
    expect(en.anti.length).toBe(ja.anti.length);
    expect(en.title).not.toBe(ja.title);
    expect(ja.lede).toMatch(JAPANESE);
    expect(ja.traits.join("")).toMatch(JAPANESE);
    expect(en.traits.every((trait) => trait.length > 0)).toBe(true);
  });

  test("proof diagrams expose a localized, stacked representation for mobile", () => {
    for (const id of ["evidence-loop", "canon-to-verify"] as const) {
      const en = getBrandDiagram(id, "en");
      const ja = getBrandDiagram(id, "ja");
      expect(en.stations.length).toBeGreaterThanOrEqual(3);
      expect(ja.stations.length).toBe(en.stations.length);
      expect(ja.flow).toMatch(JAPANESE);
      expect(ja.stations.some((station) => JAPANESE.test(station.note))).toBe(true);
      // The wide SVG is still authored once and reusable by the README, and it
      // holds the §3 grammar contract: one ember signal, a white/paper plane, and
      // an accessible name + long description.
      const filename = `diagram-${id}.svg`;
      const svg = readFileSync(path.join(repoRoot, "assets", filename), "utf8");
      const publicSvg = readFileSync(
        path.join(repoRoot, "apps/docs/public", filename),
        "utf8",
      );
      expect(publicSvg).toBe(svg);
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).toContain("viewBox");
      expect(svg).toContain("#C0472A"); // the single ember signal
      expect(svg).toContain("#FAFAF9"); // white/paper reading plane
      expect(svg).toContain("<title");
      expect(svg).toContain("<desc");
    }
  });

  test("OG alt is locale-aware and the manifest entry is locale-neutral", () => {
    const en = getDictionary("en").metadata.ogAlt;
    const ja = getDictionary("ja").metadata.ogAlt;
    expect(en).not.toBe(ja);
    expect(ja).toMatch(JAPANESE);
    const generated = manifest();
    expect(generated.start_url).toBe("/");
    expect(generated.id).toBe("/");
    expect(generated.lang).toBeUndefined();
  });

  test("the ember hue is applied in the docs brand layer, not baked into tokens", () => {
    const globals = readFileSync(path.resolve(here, "../app/globals.css"), "utf8");
    expect(globals).toContain("--color-accent: oklch(0.522 0.166 43)");
    expect(globals.toLowerCase()).toContain("docs brand layer");
  });
});
