import { vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("../lib/i18n-server", () => ({
  getRequestLocale: vi.fn().mockResolvedValue("en"),
}));

import { describe, expect, test, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, getContentRoot, getDesignSystemRoot, getReportsRoot } from "../lib/path-resolver";
import { getSiteUrl } from "../lib/metadata";
import robots from "../app/robots";

describe("production correctness and paths", () => {
  const originalEnv = process.env.AWESOME_DS_SITE_URL;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.AWESOME_DS_SITE_URL;
    } else {
      process.env.AWESOME_DS_SITE_URL = originalEnv;
    }
    vi.restoreAllMocks();
  });

  test("resolves paths robustly", () => {
    const root = findRepoRoot();
    expect(fs.existsSync(root)).toBe(true);
    expect(fs.existsSync(path.join(root, "package.json"))).toBe(true);

    const content = getContentRoot();
    expect(content).toContain("content");
    expect(fs.existsSync(content)).toBe(true);

    const ds = getDesignSystemRoot();
    expect(ds).toContain("design-system");
    expect(fs.existsSync(ds)).toBe(true);

    const reports = getReportsRoot();
    expect(reports).toContain("reports");
    expect(fs.existsSync(reports)).toBe(true);
  });

  test("fails loudly on missing required directories", () => {
    const tempDir = path.resolve("/");
    const spyCwd = vi.spyOn(process, "cwd").mockReturnValue(tempDir);

    expect(() => findRepoRoot()).toThrow(/Failed to resolve repository root/);
    spyCwd.mockRestore();
  });

  test("production URL behavior", () => {
    delete process.env.AWESOME_DS_SITE_URL;
    expect(getSiteUrl().href).toBe("https://awesome-design-system.yumaker.studio/");

    process.env.AWESOME_DS_SITE_URL = "https://custom.yumaker.studio";
    expect(getSiteUrl().href).toBe("https://custom.yumaker.studio/");

    process.env.AWESOME_DS_SITE_URL = "ftp://custom.yumaker.studio";
    expect(() => getSiteUrl()).toThrow(/must use http or https/);
  });

  test("robots route matches spec", () => {
    delete process.env.AWESOME_DS_SITE_URL;
    const res = robots();
    expect(res).toBeDefined();
    expect(res.rules).toEqual({
      userAgent: "*",
      allow: "/",
    });
    expect(res.sitemap).toBe("https://awesome-design-system.yumaker.studio/sitemap.xml");
  });
});
