import { describe, expect, test } from "vitest";
import { docsForDomain, loadAllCanonDocs, loadCanonDoc, renderCanonMarkdown } from "../lib/markdown";
import { componentCatalog } from "../lib/components-catalog";
import * as ReactComponents from "@awesome-ds/react";
import ts from "typescript";
import { validateComponentContracts } from "@awesome-ds/core/contracts";
import { readFile } from "node:fs/promises";
import path from "node:path";

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

  test("sanitizes contributed HTML while preserving safe Markdown", async () => {
    const html = renderCanonMarkdown(`| Safe | Table |\n| --- | --- |\n| \`code\` | [link](https://example.com) |\n\n<script>unsafe()</script><img src="x" onerror="unsafe()"><a href="javascript:unsafe()" onclick="unsafe()">unsafe</a><svg><script>unsafe()</script></svg>`);
    expect(html).toContain("<table>");
    expect(html).toContain("<code>");
    expect(html).toContain('href="https://example.com"');
    expect(html).not.toMatch(/<script|onerror|onclick|javascript:|<svg/i);
  });

  test("keeps frontmatter out of the rendered body", async () => {
    const doc = await loadCanonDoc("design-system/brand/voice-tone-matrix.md");
    expect(doc?.title).toBeTruthy();
    expect(doc?.html).not.toMatch(/title:|updated:|status:/i);
    expect(doc?.metadata.title).toBeTruthy();
  });

  test("rejects malformed Canon frontmatter instead of rendering it", () => {
    expect(() => renderCanonMarkdown("---\ntitle: Good\nnot valid yaml\n---\n# Body")).toThrow(/Invalid Canon frontmatter/);
  });

  test("rewrites internal Markdown links to locale-preserving web links", () => {
    const html = renderCanonMarkdown("[Tokens](../foundations/tokens.md) [Section](guide.md#part) [External](https://example.com/readme.md) ![Image](diagram.md)", { relPath: "design-system/components/index.md", locale: "ja" });
    expect(html).toContain('href="/ja/canon/foundations/tokens"');
    expect(html).toContain('href="/ja/canon/components/guide#part"');
    expect(html).toContain('href="https://example.com/readme.md"');
    expect(html).toContain('src="diagram.md"');
  });

  test("rejects Markdown traversal outside the canon root", () => {
    expect(() => renderCanonMarkdown("[Secrets](../../secrets.md)", { relPath: "design-system/components/index.md" })).toThrow(/escapes design-system/);
  });

  test("all rendered internal canon links resolve to a known document", async () => {
    const docs = await loadAllCanonDocs("ja");
    const known = new Set(docs.map((doc) => `/ja/canon/${doc.slug}`));
    for (const doc of docs) {
      for (const href of doc.html.matchAll(/href="(\/ja\/canon\/[^"#?]+)(?:[#?][^"]*)?"/g)) {
        expect(known.has(href[1] ?? ""), `${doc.path} -> ${href[1]}`).toBe(true);
      }
    }
  });

  test("component catalog covers planned baseline count with resolvable test evidence", async () => {
    expect(componentCatalog).toHaveLength(32);
    expect(componentCatalog.map((c) => c.slug)).toContain("button");
    expect(componentCatalog.map((c) => c.slug)).toContain("empty-state");
    expect(new Set(componentCatalog.map((c) => c.slug)).size).toBe(32);
    expect(validateComponentContracts(componentCatalog)).toEqual([]);
    for (const item of componentCatalog) {
      expect(item.anatomy.length, item.slug).toBeGreaterThan(0);
      expect(item.keyboard, item.slug).toBeTruthy();
      expect(item.screenReader, item.slug).toBeTruthy();
      expect(item.contentRules.length, item.slug).toBeGreaterThan(0);
      expect(item.rtl, item.slug).toBeTruthy();
      expect(item.highContrast, item.slug).toBeTruthy();
      expect(item.reducedMotion, item.slug).toBeTruthy();
      expect(item.testIds.length, item.slug).toBeGreaterThan(0);
      for (const evidence of item.testEvidence) {
        const source = await readFile(path.resolve(process.cwd(), evidence.file), "utf8");
        expect(source, `${item.slug} test evidence must resolve`).toContain(evidence.caseName);
      }
      expect(ReactComponents, `${item.importName} must be a public export`).toHaveProperty(item.importName);
      const compiled = ts.transpileModule(item.example, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
        reportDiagnostics: true,
        fileName: `${item.slug}.tsx`,
      });
      expect(compiled.diagnostics ?? [], `${item.slug} copyable example must be syntactically valid`).toHaveLength(0);
    }
  });
});
