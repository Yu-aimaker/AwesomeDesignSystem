import type { Metadata } from "next";
import {
  getDictionary,
  localizePathname,
  locales,
  type Dictionary,
} from "./i18n";
import { getRequestLocale } from "./i18n-server";

export function getSiteUrl(): URL {
  const configured =
    process.env.AWESOME_DS_SITE_URL ??
    "https://awesome-design-system.yumaker.studio";
  const url = new URL(configured);
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new Error("AWESOME_DS_SITE_URL must use http or https");
  return url;
}

export async function createLocalizedMetadata(
  pathname: string,
  title: string | ((dictionary: Dictionary) => string),
  description?: string | ((dictionary: Dictionary) => string),
): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const resolve = (
    value: string | ((dictionary: Dictionary) => string) | undefined,
  ) => (typeof value === "function" ? value(dictionary) : value);
  const resolvedTitle = resolve(title);
  const resolvedDescription =
    resolve(description) ?? dictionary.metadata.description;
  const canonical = localizePathname(pathname, locale);
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          locales.map((language) => [
            language,
            localizePathname(pathname, language),
          ]),
        ),
        "x-default": localizePathname(pathname, "en"),
      },
    },
    openGraph: {
      type: "website",
      siteName: "AwesomeDS",
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: [locale === "ja" ? "en_US" : "ja_JP"],
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: ["/opengraph-image"],
    },
  };
}
