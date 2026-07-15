import { describe, expect, test } from "vitest";
import { getHomeContent } from "../lib/home-content";
import { nav } from "../lib/navigation";

describe("redesigned docs information architecture", () => {
  test("keeps the bilingual landing structure aligned", () => {
    const en = getHomeContent("en");
    const ja = getHomeContent("ja");

    expect(ja.how.steps).toHaveLength(en.how.steps.length);
    expect(ja.motion.demos).toHaveLength(en.motion.demos.length);
    expect(ja.agents.steps).toHaveLength(en.agents.steps.length);
    expect(ja.calibrator.intents).toHaveLength(en.calibrator.intents.length);
    expect(ja.scale.metrics).toHaveLength(en.scale.metrics.length);
    expect(ja.brand.grammar).toHaveLength(en.brand.grammar.length);
    expect(ja.closing.quad).toHaveLength(en.closing.quad.length);
    expect(ja.foundations.tokenLabels).toHaveLength(en.foundations.tokenLabels.length);
    // The giant signature word stays constant across locales (one personality).
    expect(en.hero.titleWord).toBe("PROVE");
    expect(ja.hero.titleWord).toBe("PROVE");
    // Localized narrative copy actually differs.
    expect(en.hero.description).not.toBe(ja.hero.description);
    expect(en.calibrator.title).not.toBe(ja.calibrator.title);
  });

  test("groups every public route once, into a first-time-user path", () => {
    expect(new Set(nav.map((item) => item.href)).size).toBe(nav.length);
    expect(new Set(nav.map((item) => item.section))).toEqual(
      new Set(["start", "explore", "build", "verify"]),
    );
    for (const href of ["/canon", "/components", "/motion", "/references", "/ai-design", "/status"]) {
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
    // The description names EXPLORE as the cross-cutting reference layer.
    expect(en.how.description).toContain("Explore");
  });

  test("Proof Calibrator stage 03 is the Artifact, not a Component", () => {
    const en = getHomeContent("en");
    const ja = getHomeContent("ja");
    expect(en.calibrator.stageArtifact).toBe("Artifact");
    expect(ja.calibrator.stageArtifact).toBe("成果物");
    expect(en.calibrator.hint).toContain("artifact");
    expect(ja.calibrator.hint).toContain("成果物");
  });
});
