import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { findRepoRoot } from "../lib/path-resolver";
import { CMY, CMY_MARK, CMY_MARK_UNIT, computeCmyMark } from "../lib/cmy-mark";

const getRepoRoot = findRepoRoot;

/**
 * Structural lock: header mark, OG image, and static banner share one CMY
 * geometry contract so the brand signature cannot silently drift.
 */
describe("CMY mark geometry contract", () => {
  test("ratios produce three circles within the unit square", () => {
    const g = computeCmyMark(CMY_MARK_UNIT);
    expect(g.circles).toHaveLength(3);
    expect(g.radius).toBeCloseTo(CMY_MARK_UNIT * CMY_MARK.radiusRatio, 5);
    for (const circle of g.circles) {
      expect(circle.cx - circle.r).toBeGreaterThanOrEqual(-1);
      expect(circle.cy - circle.r).toBeGreaterThanOrEqual(-1);
      expect(circle.cx + circle.r).toBeLessThanOrEqual(CMY_MARK_UNIT + 1);
      expect(circle.cy + circle.r).toBeLessThanOrEqual(CMY_MARK_UNIT + 1);
    }
  });

  test("assets/banner.svg carries the CMY mark and spectrum signature", () => {
    const svg = readFileSync(path.resolve(getRepoRoot(), "assets/banner.svg"), "utf8");
    expect(svg).toContain("cmy-mark");
    expect(svg).toContain(CMY.cyan);
    expect(svg).toContain(CMY.magenta);
    expect(svg).toContain(CMY.yellow);
    expect(svg).toContain('id="spectrum"');
    expect(svg).toContain("mix-blend-mode:multiply");
    // No retired ember identity.
    expect(svg).not.toContain("#C0472A");
  });

  test("opengraph-image.tsx imports the shared CMY geometry", () => {
    const og = readFileSync(
      path.resolve(getRepoRoot(), "apps/docs/app/opengraph-image.tsx"),
      "utf8",
    );
    expect(og).toContain('from "../lib/cmy-mark"');
    expect(og).toContain("computeCmyMark");
    expect(og).toContain("CMY.spectrum");
  });

  test("site brand mark component uses computeCmyMark", () => {
    const component = readFileSync(
      path.resolve(getRepoRoot(), "apps/docs/components/cmy-mark.tsx"),
      "utf8",
    );
    expect(component).toContain("computeCmyMark");
    expect(component).toContain("cmy-mark__orb");
  });
});
