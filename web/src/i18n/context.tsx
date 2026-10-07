import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router";
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

/** `<link rel="alternate" hreflang>` for every locale. React 19 hoists these into <head>. */
function LocaleAlternates({ path }: { path: string }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const href = (l: Locale) => `${origin}${base}${localizePath(path, l)}`;
  return (
    <>
      {locales.map((l) => (
        <link key={l} rel="alternate" hrefLang={localeMeta[l].tag} href={href(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={href("ja")} />
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
