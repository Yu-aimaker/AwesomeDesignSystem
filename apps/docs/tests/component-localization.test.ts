import { describe, expect, test } from "vitest";
import { componentCatalog } from "@awesome-ds/core/contracts";
import { componentSlugs, localizeComponentContract } from "../lib/component-localization";

const japaneseText = /[ぁ-んァ-ヶ一-龠]/;

describe("component contract localization", () => {
  test("provides reviewed Japanese semantics and API guidance for every component", () => {
    expect([...componentSlugs].sort()).toEqual(componentCatalog.map((item) => item.slug).sort());
    for (const source of componentCatalog) {
      const localized = localizeComponentContract(source, "ja");
      expect(localized.description, `${source.slug}: description`).toMatch(japaneseText);
      for (const state of localized.states) expect(state, `${source.slug}: state`).toMatch(japaneseText);
      expect(localized.anatomy.join(" "), `${source.slug}: anatomy`).toMatch(japaneseText);
      expect(localized.anatomy, `${source.slug}: anatomy must be localized`).not.toEqual(source.anatomy);
      expect(localized.keyboard, `${source.slug}: keyboard`).toMatch(japaneseText);
      expect(localized.keyboard, `${source.slug}: keyboard must be component-specific`).not.toBe(source.keyboard);
      expect(localized.screenReader, `${source.slug}: screenReader`).toMatch(japaneseText);
      expect(localized.screenReader, `${source.slug}: screenReader must be component-specific`).not.toBe(source.screenReader);
      for (const rule of localized.contentRules) expect(rule, `${source.slug}: content rule`).toMatch(japaneseText);
      for (const api of localized.publicApi) expect(api.description, `${source.slug}.${api.name}`).toMatch(japaneseText);
      expect(localized.rtl, `${source.slug}: rtl`).toMatch(japaneseText);
      expect(localized.highContrast, `${source.slug}: highContrast`).toMatch(japaneseText);
      expect(localized.reducedMotion, `${source.slug}: reducedMotion`).toMatch(japaneseText);
    }
  });

  test("layout components explicitly avoid inventing interaction semantics", () => {
    for (const slug of ["stack", "cluster", "grid", "container"]) {
      const source = componentCatalog.find((item) => item.slug === slug)!;
      expect(localizeComponentContract(source, "ja").screenReader).toContain("役割を追加せず");
    }
  });
});
