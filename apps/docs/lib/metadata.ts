import type { Metadata } from "next";
import { getDictionary, localizePathname, locales, type Dictionary } from "./i18n";
import { getRequestLocale } from "./i18n-server";

export function getSiteUrl(): URL {
  const configured = process.env.AWESOME_DS_SITE_URL ?? "http://127.0.0.1:3000";
  const url = new URL(configured);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("AWESOME_DS_SITE_URL must use http or https");
  return url;
}

export async function createLocalizedMetadata(
  pathname: string,
  title: string | ((dictionary: Dictionary) => string),
  description?: string | ((dictionary: Dictionary) => string),
): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const resolve = (value: string | ((dictionary: Dictionary) => string) | undefined) =>
    typeof value === "function" ? value(dictionary) : value;
  return {
    title: resolve(title),
    description: resolve(description) ?? dictionary.metadata.description,
    alternates: {
      canonical: localizePathname(pathname, locale),
      languages: {
        ...Object.fromEntries(locales.map((language) => [language, localizePathname(pathname, language)])),
        "x-default": localizePathname(pathname, "en"),
      },
    },
  };
}
