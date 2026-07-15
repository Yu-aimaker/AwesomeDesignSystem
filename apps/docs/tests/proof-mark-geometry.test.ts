import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { getRepoRoot } from "../lib/markdown";
import { computeProofMark, PROOF_MARK, PROOF_MARK_UNIT } from "../lib/proof-mark";

/**
 * The proof mark is the brand's primary signature. It must render from ONE
 * geometry across three surfaces: the site header (React ProofMark), the Open
 * Graph image (Satori), and the static `assets/banner.svg`. These structural
 * checks fail the moment an artifact drifts from the shared contract.
 */
describe("proof-mark geometry contract", () => {
  const g = computeProofMark(PROOF_MARK_UNIT);

  test("the canonical unit yields the documented integer geometry", () => {
    expect(PROOF_MARK).toEqual({ gapRatio: 0.25, strokeRatio: 1 / 12, knockoutRatio: 0.5 });
    expect(g).toEqual({
      side: 36,
      gap: 9,
      stroke: 3,
      knockout: 18,
      knockoutInset: 9,
      emberX: 0,
      registrationX: 45,
      width: 81,
    });
  });

  test("assets/banner.svg proof mark conforms to the spec", () => {
    const svg = readFileSync(path.resolve(getRepoRoot(), "assets/banner.svg"), "utf8");
    // Isolate the proof-mark group so we don't match unrelated rects.
    const group = svg.match(/Proof mark[\s\S]*?<g class="pulse"[^>]*>([\s\S]*?)<\/g>/);
    expect(group, "proof-mark group present in banner").toBeTruthy();
    const rects = [...(group?.[1] ?? "").matchAll(/<rect\b([^>]*)\/>/g)].map((m) => m[1] ?? "");
    expect(rects).toHaveLength(3);

    const attr = (raw: string | undefined, name: string) => {
      const m = (raw ?? "").match(new RegExp(`${name}="([^"]+)"`));
      return m ? Number(m[1]) : undefined;
    };

    const [ember, registration, knockout] = rects;
    // Ember square.
    expect(attr(ember, "x")).toBe(g.emberX);
    expect(attr(ember, "width")).toBe(g.side);
    expect(attr(ember, "height")).toBe(g.side);
    // Registration outline: side + gap origin, matching stroke width.
    expect(attr(registration, "x")).toBe(g.registrationX);
    expect(attr(registration, "width")).toBe(g.side);
    expect(attr(registration, "stroke-width")).toBe(g.stroke);
    // Knocked-out center: centered inside the registration square.
    expect(attr(knockout, "x")).toBe(g.registrationX + g.knockoutInset);
    expect(attr(knockout, "y")).toBe(g.knockoutInset);
    expect(attr(knockout, "width")).toBe(g.knockout);
    expect(attr(knockout, "height")).toBe(g.knockout);
  });

  test("the OG image derives its proof mark from the shared spec (not hardcoded)", () => {
    const og = readFileSync(
      path.resolve(getRepoRoot(), "apps/docs/app/opengraph-image.tsx"),
      "utf8",
    );
    expect(og).toContain('from "../lib/proof-mark"');
    expect(og).toContain("computeProofMark(PROOF_MARK_UNIT)");
    // The mark dimensions must be spec-driven, never magic numbers.
    expect(og).toContain("width: mark.side");
    expect(og).toContain("marginLeft: mark.gap");
    expect(og).toContain("border: `${mark.stroke}px solid");
    expect(og).toContain("width: mark.knockout");
    // Satori-safe blueprint plane present in the OG surface.
    expect(og).toContain('id="blueprint-dots"');
    expect(og).toContain('fill="url(#blueprint-dots)"');
  });

  test("the favicon and reusable diagrams preserve the canonical ratios", () => {
    const root = getRepoRoot();
    const icon = readFileSync(path.resolve(root, "apps/docs/app/icon.svg"), "utf8");
    const evidenceLoop = readFileSync(
      path.resolve(root, "assets/diagram-evidence-loop.svg"),
      "utf8",
    );
    const buildPath = readFileSync(
      path.resolve(root, "assets/diagram-canon-to-verify.svg"),
      "utf8",
    );

    for (const artifact of [icon, evidenceLoop, buildPath]) {
      expect(artifact).toContain('width="24" height="24" fill="#C0472A"');
      expect(artifact).toMatch(
        /width="24" height="24"[^>]*stroke="#18181B"[^>]*stroke-width="2"/,
      );
      expect(artifact).toContain('width="12" height="12" fill="#18181B"');
    }
  });
});
