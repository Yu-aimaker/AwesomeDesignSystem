import { describe, expect, test } from "vitest";
import {
  DEFAULT_LOCALE,
  getDictionary,
  getLocaleFromPathname,
  localizePathname,
  negotiateLocale,
  stripLocaleFromPathname,
} from "../lib/i18n";

describe("locale routing", () => {
  test("recognizes only complete supported locale segments", () => {
    expect(getLocaleFromPathname("/ja/components/button")).toBe("ja");
    expect(getLocaleFromPathname("/en")).toBe("en");
    expect(getLocaleFromPathname("/jargon")).toBeNull();
    expect(getLocaleFromPathname("/fr/references")).toBeNull();
  });

  test("strips locale without losing the route or query string", () => {
    expect(stripLocaleFromPathname("/ja/references?q=motion")).toBe("/references?q=motion");
    expect(stripLocaleFromPathname("/en")).toBe("/");
  });

  test("switches locale while preserving route, query, and hash", () => {
    expect(localizePathname("/ja/references?q=motion#results", "en"))
      .toBe("/en/references?q=motion#results");
    expect(localizePathname("/components/button", "ja"))
      .toBe("/ja/components/button");
  });

  test("has an explicit stable default locale", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });

  test("prefers a saved locale, then Japanese browser preference", () => {
    expect(negotiateLocale("ja", "en-US,en;q=0.9")).toBe("ja");
    expect(negotiateLocale(undefined, "ja-JP,ja;q=0.9,en;q=0.8")).toBe("ja");
    expect(negotiateLocale(undefined, "fr-FR,fr;q=0.9")).toBe("en");
  });
});

describe("translation fallback", () => {
  test("labels canon content that is not yet translated", () => {
    const ja = getDictionary("ja");
    expect(ja.canon.fallbackNotice).toContain("原文");
    expect(ja.canon.fallbackLanguage).toBe("英語");
  });

  test("provides localized shell and theme labels", () => {
    expect(getDictionary("ja").shell.skipToContent).toBe("本文へ移動");
    expect(getDictionary("ja").theme.dark).toBe("ダーク");
    expect(getDictionary("en").theme.dark).toBe("Dark");
  });
});
