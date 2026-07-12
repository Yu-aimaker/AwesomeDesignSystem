import "server-only";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n";

export async function getRequestLocale(): Promise<Locale> {
  const value = (await headers()).get("x-awesome-locale");
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
