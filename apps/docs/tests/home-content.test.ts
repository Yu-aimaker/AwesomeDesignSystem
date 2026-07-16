import { describe, expect, test } from "vitest";
import { getHomeContent } from "../lib/home-content";
import { nav } from "../lib/navigation";

describe("redesigned docs information architecture", () => {
  test("keeps the bilingual landing structure aligned", () => {
    const en = getHomeContent("en");
    const ja = getHomeContent("ja");

    expect(ja.how.steps).toHaveLength(en.how.steps.length);
    expect(ja.motion.demos).toHaveLength(en.motion.demos.length);
    expect(ja.promise.cards).toHaveLength(en.promise.cards.length);
    expect(ja.character.moods).toHaveLength(en.character.moods.length);
    expect(ja.scale.metrics).toHaveLength(en.scale.metrics.length);
    expect(ja.install.skills).toHaveLength(en.install.skills.length);
    expect(ja.closing.quad).toHaveLength(en.closing.quad.length);
    // Localized narrative copy actually differs.
    expect(en.hero.description).not.toBe(ja.hero.description);
    expect(en.hero.titleAccent).not.toBe(ja.hero.titleAccent);
    expect(en.install.title).not.toBe(ja.install.title);
  });

  test("groups every public route once, into a first-time-user path", () => {
    expect(new Set(nav.map((item) => item.href)).size).toBe(nav.length);
    expect(new Set(nav.map((item) => item.section))).toEqual(
      new Set(["start", "explore", "build", "verify"]),
    );
    for (const href of ["/canon", "/components", "/motion", "/references", "/ai-design", "/reports", "/status"]) {
      expect(nav.some((item) => item.href === href)).toBe(true);
    }
  });

  test("the four navigation verbs place Canon in START and Playground in VERIFY", () => {
    const section = (href: string) => nav.find((item) => item.href === href)?.section;
    expect(section("/canon")).toBe("start");
    expect(section("/principles")).toBe("start");
    expect(section("/playground")).toBe("verify");
    expect(section("/status")).toBe("verify");
    expect(section("/review")).toBe("verify");
    // EXPLORE is exactly Atlas / AI / brand.
    const explore = nav.filter((item) => item.section === "explore").map((item) => item.href).sort();
    expect(explore).toEqual(["/ai-design", "/brand", "/references"]);
  });

  test("the three-step production loop maps onto START → BUILD → VERIFY surfaces", () => {
    const en = getHomeContent("en");
    expect(en.how.steps.map((step) => step.tag)).toEqual(["START", "BUILD", "VERIFY"]);
    expect(en.how.steps.map((step) => step.href)).toEqual(["/canon", "/components", "/status"]);
  });

  test("CMY identity and install path are first-class on the LP", () => {
    const en = getHomeContent("en");
    const ja = getHomeContent("ja");
    expect(en.spectrum.title.toLowerCase()).toContain("spectrum");
    expect(ja.spectrum.body).toMatch(/シアン|CMY|3原色/);
    expect(en.install.skills).toHaveLength(5);
    expect(en.install.code).toContain("install.sh");
    expect(en.character.moods.map((m) => m.mood)).toEqual(["wave", "think", "cheer"]);
  });
});
