/**
 * Locales the site ships. Adding one: append it here, then `pnpm typecheck`
 * lists every catalog and data field that still needs a translation.
 */
export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja";

/** A value written once per locale. Catalogs and translated data use this shape. */
export type Localized<T> = Record<Locale, T>;

interface LocaleMeta {
  /** BCP 47 tag for `<html lang>`, `hreflang` and `Intl`. */
  tag: string;
  /** Name of the language in that language, shown in the switch. */
  autonym: string;
  /** URL prefix. The default locale has none, so existing Japanese URLs do not change. */
  prefix: string;
}

export const localeMeta: Localized<LocaleMeta> = {
  ja: { tag: "ja", autonym: "日本語", prefix: "" },
  en: { tag: "en", autonym: "English", prefix: "/en" },
};

function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Locale named by the first path segment, or the default. `pathname` excludes the router basename. */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1] ?? "";
  return isLocale(seg) && seg !== defaultLocale ? seg : defaultLocale;
}

/** `/en/sources` -> `/sources`. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  const { prefix } = localeMeta[locale];
  if (!prefix) return pathname || "/";
  const rest = pathname.slice(prefix.length);
  return rest === "" ? "/" : rest;
}

/** `/sources` + en -> `/en/sources`. Leaves relative paths, hashes and external URLs alone. */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/")) return path;
  const { prefix } = localeMeta[locale];
  if (!prefix) return path;
  return path === "/" ? prefix : `${prefix}${path}`;
}
