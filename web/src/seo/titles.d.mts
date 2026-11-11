export type SeoLocale = "ja" | "en";
export type TitleKind = "page" | "knowledge";

export function contentLanguage(text: string): SeoLocale;
export function publishedLocales(kind: TitleKind, body: string): SeoLocale[];
export function documentTitle(locale: SeoLocale, path: string, shortTitle: string, kind: TitleKind): string;
