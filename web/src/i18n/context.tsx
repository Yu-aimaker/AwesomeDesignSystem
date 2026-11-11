import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router";
import { findEntry } from "../lib/knowledge";
import { publishedLocales } from "../seo/titles.mjs";
import { localeFromPath, localeMeta, localizePath, locales, stripLocale, type Locale, type Localized } from "./locales";

interface LocaleValue {
  locale: Locale;
  /** Current path without the locale prefix, e.g. `/sources`. */
  path: string;
}

export const LocaleContext = createContext<LocaleValue>({ locale: "ja", path: "/" });

/**
 * Derives the locale from the URL so a link is enough to switch language:
 * no stored state, back/forward and shared links always agree with the page.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const path = stripLocale(pathname);
  const value = useMemo(() => ({ locale, path }), [locale, path]);

  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].tag;
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>
      <LocaleAlternates path={path} />
      {children}
    </LocaleContext.Provider>
  );
}

/** `<link rel="alternate" hreflang>` for languages that exist. React 19 hoists these into <head>. */
function LocaleAlternates({ path }: { path: string }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const match = /^\/knowledge\/([^/]+)\/([^/]+)$/.exec(path);
  const entry = match ? findEntry(match[1], match[2]) : undefined;
  const langs = entry ? publishedLocales("knowledge", entry.body) : locales;
  const href = (l: Locale) => `${origin}${base}${localizePath(path, l)}`;
  const xDefault = langs.includes("ja") ? "ja" : langs[0];
  return (
    <>
      {langs.map((l) => (
        <link key={l} rel="alternate" hrefLang={localeMeta[l].tag} href={href(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={href(xDefault)} />
    </>
  );
}

export function useLocale(): LocaleValue {
  return useContext(LocaleContext);
}

/** Pick the current locale's entry from a catalog or a translated value. */
export function useT<T>(catalog: Localized<T>): T {
  return catalog[useLocale().locale];
}

/** Prefix an absolute in-site path with the current locale. */
export function useLocalePath(): (path: string) => string {
  const { locale } = useLocale();
  return (path: string) => localizePath(path, locale);
}
