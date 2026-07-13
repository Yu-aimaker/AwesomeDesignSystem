import { describe, expect, test } from "vitest";
import { getReducedMotionSnapshot, subscribeReducedMotion } from "./react";

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

describe("reduced-motion store", () => {
  test("is safe when public helpers are called during server rendering", () => {
    expect(getReducedMotionSnapshot()).toBe("no-preference");
    const unsubscribe = subscribeReducedMotion(() => undefined);
    expect(() => unsubscribe()).not.toThrow();
  });

  test("subscribes to live preference changes and removes the listener", () => {
    let listener: (() => void) | undefined;
    let removed: (() => void) | undefined;
    let matches = false;
    const matchMedia = () => ({
      get matches() { return matches; },
      addEventListener: (_type: "change", next: EventListenerOrEventListenerObject) => { listener = next as () => void; },
      removeEventListener: (_type: "change", next: EventListenerOrEventListenerObject) => { removed = next as () => void; },
    });
    expect(getReducedMotionSnapshot(matchMedia)).toBe("no-preference");
    const callback = () => undefined;
    const unsubscribe = subscribeReducedMotion(callback, matchMedia);
    expect(listener).toBe(callback);
    matches = true;
    expect(getReducedMotionSnapshot(matchMedia)).toBe("reduce");
    unsubscribe();
    expect(removed).toBe(callback);
  });
});
