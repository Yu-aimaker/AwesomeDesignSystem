import Link from "next/link";
import { getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(await getRequestLocale());
  return {
    title: dictionary.notFound.title,
    description: dictionary.notFound.description,
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const locale = await getRequestLocale();
  const d = getDictionary(locale).notFound;
  return (
    <div>
      <h1>{d.title}</h1>
      <p className="muted">{d.description}</p>
      <Link href={localizePathname("/", locale)}>{d.home}</Link>
    </div>
  );
}
