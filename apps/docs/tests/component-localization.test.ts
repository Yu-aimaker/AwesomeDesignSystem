import { describe, expect, test } from "vitest";
import { componentCatalog } from "@awesome-ds/core/contracts";
import { localizeComponentContract } from "../lib/component-localization";

const japaneseText = /[ぁ-んァ-ヶ一-龠]/;

describe("component contract localization", () => {
  test("provides reviewed Japanese semantics and API guidance for every component", () => {
    for (const source of componentCatalog) {
      const localized = localizeComponentContract(source, "ja");
      expect(localized.description, `${source.slug}: description`).toMatch(japaneseText);
      expect(localized.screenReader, `${source.slug}: screenReader`).toMatch(japaneseText);
      expect(localized.screenReader, `${source.slug}: screenReader must be component-specific`).not.toBe(source.screenReader);
      for (const rule of localized.contentRules) expect(rule, `${source.slug}: content rule`).toMatch(japaneseText);
      for (const api of localized.publicApi) expect(api.description, `${source.slug}.${api.name}`).toMatch(japaneseText);
    }
  });

  test("layout components explicitly avoid inventing interaction semantics", () => {
    for (const slug of ["stack", "cluster", "grid", "container"]) {
      const source = componentCatalog.find((item) => item.slug === slug)!;
      expect(localizeComponentContract(source, "ja").screenReader).toContain("役割を追加せず");
    }
  });
});
