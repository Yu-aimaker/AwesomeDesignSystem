import Link from "next/link";
import { getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(await getRequestLocale());
  const { title, description } = dictionary.notFound;
  return {
    title,
    description,
    alternates: {
      canonical: null,
      languages: {
        en: null,
        ja: null,
        "x-default": null,
      },
    },
    openGraph: {
      type: "website",
      siteName: "AwesomeDS",
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
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
