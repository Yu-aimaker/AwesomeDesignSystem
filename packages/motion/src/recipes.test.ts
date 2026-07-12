import { describe, expect, test } from "vitest";

import { getMotionPreference, motionRecipes } from "./recipes";

describe("motion recipes", () => {
  test("covers required intents with rule IDs", () => {
    const intents = new Set(motionRecipes.map((r) => r.intent));
    for (const intent of [
      "enter",
      "exit",
      "reveal",
      "expand",
      "shared-layout",
      "list-change",
      "feedback",
      "drag",
      "scroll",
      "page-transition",
    ]) {
      expect(intents.has(intent as never)).toBe(true);
    }
    for (const recipe of motionRecipes) {
      expect(recipe.ruleIds.length).toBeGreaterThan(0);
      expect(recipe.reducedMotionAlternative.length).toBeGreaterThan(0);
    }
  });

  test("detects reduced-motion preference", () => {
    expect(getMotionPreference({ matches: true })).toBe("reduce");
    expect(getMotionPreference({ matches: false })).toBe("no-preference");
  });
});
