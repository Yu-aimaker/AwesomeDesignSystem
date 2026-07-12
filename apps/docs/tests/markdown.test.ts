import { describe, expect, test } from "vitest";
import { docsForDomain, loadAllCanonDocs, loadCanonDoc } from "../lib/markdown";
import { componentCatalog } from "../lib/components-catalog";

describe("canon markdown loading", () => {
  test("loads design-system modules", async () => {
    const docs = await loadAllCanonDocs();
    expect(docs.length).toBeGreaterThan(20);
    const index = await loadCanonDoc("design-system/INDEX.md");
    expect(index?.title).toBeTruthy();
    expect(index?.html).toContain("<");
  });

  test("domain filters return modules", async () => {
    const brand = await docsForDomain("brand");
    expect(brand.some((d) => d.slug.includes("cross-medium"))).toBe(true);
    const principles = await docsForDomain("principles");
    expect(principles.length).toBeGreaterThan(0);
  });

  test("component catalog covers planned baseline count", () => {
    expect(componentCatalog.length).toBeGreaterThanOrEqual(30);
    expect(componentCatalog.map((c) => c.slug)).toContain("button");
    expect(componentCatalog.map((c) => c.slug)).toContain("empty-state");
  });
});
