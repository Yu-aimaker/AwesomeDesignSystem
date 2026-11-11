/** Title and language rules shared by the static build and DocumentHead. */

export function contentLanguage(text) {
  const kana = (String(text).match(/[ぁ-んァ-ヶ]/g) ?? []).length;
  return kana >= 12 ? "ja" : "en";
}

/**
 * Locales that have a real translation. A knowledge note is one language:
 * the other URL stays reachable, but it is not an English (or Japanese) alternate.
 */
export function publishedLocales(kind, body) {
  if (kind !== "knowledge") return ["ja", "en"];
  return [contentLanguage(body ?? "")];
}

export function documentTitle(locale, path, shortTitle, kind) {
  if (kind === "page" && path === "/") return shortTitle;
  if (kind === "knowledge") {
    const section = locale === "ja" ? "ナレッジ" : "Knowledge";
    const slug = path.replace(/^\/knowledge\//, "");
    return `${shortTitle} (${slug}) | ${section} | AwesomeDS`;
  }
  return `${shortTitle} | AwesomeDS`;
}
