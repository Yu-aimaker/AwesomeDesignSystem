import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "../components/site-shell";
import { ThemeControls } from "../components/theme-controls";

import { getDictionary, localeConfig } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { cookies } from "next/headers";
import type { DocsTheme } from "../components/theme-controls";
import { getSiteUrl } from "../lib/metadata";
import { localizePathname } from "../lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const title = dictionary.metadata.title;
  const description = dictionary.metadata.description;
  const canonical = localizePathname("/", locale);
  return {
    metadataBase: getSiteUrl(),
    title: { default: title, template: "%s · AwesomeDS" },
    description,
    alternates: {
      canonical,
      languages: {
        en: "/en",
        ja: "/ja",
        "x-default": "/en",
      },
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      type: "website",
      siteName: "AwesomeDS",
      title,
      description,
      url: canonical,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: [locale === "ja" ? "en_US" : "ja_JP"],
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "AwesomeDS — evidence-backed design intelligence",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const storedTheme = (await cookies()).get("awesome-theme")?.value;
  const theme: DocsTheme =
    storedTheme === "dark" || storedTheme === "high-contrast"
      ? storedTheme
      : "light";
  const siteUrl = getSiteUrl().origin;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "AwesomeDS",
        description: dictionary.metadata.description,
        inLanguage: ["en", "ja"],
      },
      {
        "@type": "Dataset",
        "@id": `${siteUrl}/#reference-atlas`,
        name: "AwesomeDS Reference Atlas",
        description:
          "A structured, freshness-tracked Atlas of first-party design-system evidence.",
        url: `${siteUrl}/${locale}/references`,
        isAccessibleForFree: true,
        inLanguage: ["en", "ja"],
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${siteUrl}/api/v1/references`,
          },
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${siteUrl}/api/v1/rules`,
          },
        ],
      },
    ],
  };
  return (
    <html lang={locale} dir={localeConfig[locale].dir} data-theme={theme}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <SiteShell
          controls={
            <ThemeControls labels={dictionary.theme} initialTheme={theme} />
          }
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
