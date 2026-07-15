import { describe, expect, test } from "vitest";

import {
  lightTheme,
  darkTheme,
  highContrastTheme,
  motionTokens,
  space,
  tokens,
} from "./tokens";
import { generate } from "./build";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

describe("semantic tokens", () => {
  test("color roles are unique and OKLCH-based in light theme", () => {
    const values = Object.values(lightTheme);
    expect(new Set(Object.keys(lightTheme)).size).toBe(
      Object.keys(lightTheme).length,
    );
    for (const value of values) {
      expect(value.startsWith("oklch(") || value.startsWith("oklch(")).toBe(
        true,
      );
    }
  });

  test("framework accent default is brand-neutral, not the AwesomeDS ember", () => {
    // The portable package must not ship AwesomeDS's warm ember (hue ~43-48) as
    // its default identity; the docs brand layer applies the ember by overriding
    // the same semantic role. The neutral placeholder is a blue (hue 255).
    for (const theme of [lightTheme, darkTheme, highContrastTheme]) {
      expect(theme["color-accent"]).toContain("255");
    }
    expect(lightTheme["color-accent"]).not.toContain(" 43)");
    expect(darkTheme["color-accent"]).not.toContain(" 48)");
    expect(highContrastTheme["color-accent"]).not.toContain(" 42)");
  });

  test("themes share the same role keys", () => {
    const keys = Object.keys(lightTheme).sort();
    expect(Object.keys(darkTheme).sort()).toEqual(keys);
    expect(Object.keys(highContrastTheme).sort()).toEqual(keys);
  });

  test("spacing follows 4/8pt rhythm (rem steps of 0.25)", () => {
    for (const value of Object.values(space)) {
      const rem = Number(value.replace("rem", ""));
      expect(rem * 4).toBeCloseTo(Math.round(rem * 4));
    }
  });

  test("reduced-motion durations are zero", () => {
    expect(motionTokens["dur-fast-reduced"]).toBe("0ms");
    expect(motionTokens["dur-base-reduced"]).toBe("0ms");
    expect(motionTokens["dur-slow-reduced"]).toBe("0ms");
  });

  test("generation is deterministic", async () => {
    const dir1 = await mkdtemp(path.join(tmpdir(), "ads-tokens-1-"));
    const dir2 = await mkdtemp(path.join(tmpdir(), "ads-tokens-2-"));
    await generate(dir1);
    await generate(dir2);
    for (const file of ["tokens.css", "tailwind-theme.css", "tokens.json"]) {
      const a = await readFile(path.join(dir1, file), "utf8");
      const b = await readFile(path.join(dir2, file), "utf8");
      expect(a).toBe(b);
    }
    for (const file of ["tokens.css", "tailwind-theme.css"]) {
      const css = await readFile(path.join(dir1, file), "utf8");
      expect(css).toContain("AUTO-GENERATED");
    }
    expect(tokens.themes.light["color-bg"]).toBeTruthy();
  });

  test("Tailwind aliases never create circular custom properties", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "ads-tailwind-"));
    await generate(dir);
    const css = await readFile(path.join(dir, "tailwind-theme.css"), "utf8");
    expect(css).not.toMatch(/--([a-z0-9-]+):\s*var\(--\1\)/i);
    expect(css).toContain("--color-ads-bg: var(--color-bg)");
    expect(css).toContain("--font-ads-display:");
  });
});
