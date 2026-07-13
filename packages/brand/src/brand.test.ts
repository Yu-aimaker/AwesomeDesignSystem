import { describe, expect, test } from "vitest";
import { BrandManifestSchema, lintProductCopy, type ProductLexicon } from "./index";

const validManifest = {
  id: "brand.example",
  name: "Example",
  version: "1.0.0",
  owner: { name: "Brand team", contact: "brand@example.com" },
  personality: { traits: ["clear", "warm", "curious"], antiTraits: ["vague", "patronizing"] },
  marks: [{ id: "primary", role: "primary", assetPath: "assets/mark.svg", minPx: 24, safeArea: 0.25, allowedBackgrounds: ["light", "dark"] }],
  typography: [{ id: "body", role: "body", family: "Example Sans", fallback: "system-ui", scripts: ["Latn", "Jpan"], license: "OFL-1.1" }],
  imagery: { defaultMode: "illustration", syntheticMediaDisclosure: "required", requireRights: true, requireAltText: true },
  lexicon: [{ term: "workspace", definition: "A shared project area", status: "preferred", locales: ["en", "ja"], owner: "Content design" }],
  assets: [{ id: "mark-primary", path: "assets/mark.svg", license: "Owned", checksum: "sha256:abc", owner: "Brand team", status: "active" }]
};

describe("BrandManifestSchema", () => {
  test("accepts an operational cross-medium manifest", () => {
    expect(BrandManifestSchema.parse(validManifest).id).toBe("brand.example");
  });

  test("rejects marks without production constraints", () => {
    const invalid = structuredClone(validManifest);
    delete (invalid.marks[0] as Partial<(typeof invalid.marks)[number]>).minPx;
    expect(() => BrandManifestSchema.parse(invalid)).toThrow(/minPx/);
  });
});

describe("lintProductCopy", () => {
  const lexicon: ProductLexicon = [
    { term: "workspace", definition: "A shared project area", status: "preferred", locales: ["en"], owner: "Content" },
    { term: "work zone", definition: "Legacy name", status: "deprecated", replacement: "workspace", locales: ["en"], owner: "Content" },
    { term: "guaranteed", definition: "Unsupported promise", status: "forbidden", locales: ["en"], owner: "Legal" }
  ];

  test("reports deprecated and forbidden terms with actionable replacements", () => {
    const issues = lintProductCopy("A guaranteed result in every work zone.", lexicon, "en");
    expect(issues).toEqual([
      expect.objectContaining({ term: "work zone", severity: "warning", replacement: "workspace" }),
      expect.objectContaining({ term: "guaranteed", severity: "error" })
    ]);
  });

  test("respects locale ownership", () => {
    expect(lintProductCopy("guaranteed", lexicon, "ja")).toEqual([]);
  });

  test("finds Japanese and CJK terms without whitespace boundaries", () => {
    const japaneseLexicon: ProductLexicon = [
      { term: "作業場", definition: "旧プロダクト名", status: "deprecated", replacement: "ワークスペース", locales: ["ja"], owner: "コンテンツ" },
      { term: "必ず", definition: "根拠のない絶対表現", status: "forbidden", locales: ["ja"], owner: "法務" },
    ];
    expect(lintProductCopy("すべての作業場で必ず成果が出ます。", japaneseLexicon, "ja")).toEqual([
      expect.objectContaining({ term: "作業場", severity: "warning", replacement: "ワークスペース" }),
      expect.objectContaining({ term: "必ず", severity: "error" }),
    ]);
  });
});
