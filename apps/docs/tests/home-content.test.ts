import { describe, expect, test } from "vitest";
import { getHomeContent } from "../lib/home-content";
import { nav } from "../lib/navigation";

describe("redesigned docs information architecture", () => {
  test("keeps the bilingual landing structure aligned", () => {
    const en = getHomeContent("en");
    const ja = getHomeContent("ja");

    expect(ja.paths.items).toHaveLength(en.paths.items.length);
    expect(ja.motion.demos).toHaveLength(en.motion.demos.length);
    expect(ja.agents.steps).toHaveLength(en.agents.steps.length);
    expect(ja.foundations.tokenLabels).toHaveLength(en.foundations.tokenLabels.length);
    expect(en.hero.title).not.toBe(ja.hero.title);
  });

  test("groups every public route once without losing required destinations", () => {
    expect(new Set(nav.map((item) => item.href)).size).toBe(nav.length);
    expect(new Set(nav.map((item) => item.section))).toEqual(
      new Set(["explore", "build", "practice", "assure"]),
    );
    for (const href of ["/canon", "/components", "/motion", "/references", "/ai-design", "/status"]) {
      expect(nav.some((item) => item.href === href)).toBe(true);
    }
  });
});

