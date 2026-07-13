import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "../components/site-shell";
import { ThemeControls } from "../components/theme-controls";

import { getDictionary, localeConfig } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { cookies } from "next/headers";
import type { DocsTheme } from "../components/theme-controls";
import { getSiteUrl } from "../lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(await getRequestLocale());
  return { metadataBase: getSiteUrl(), title: { default: dictionary.metadata.title, template: "%s · AwesomeDS" }, description: dictionary.metadata.description };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const storedTheme = (await cookies()).get("awesome-theme")?.value;
  const theme: DocsTheme = storedTheme === "dark" || storedTheme === "high-contrast" ? storedTheme : "light";
  return (
    <html lang={locale} dir={localeConfig[locale].dir} data-theme={theme}>
      <body>
        <SiteShell>
          <ThemeControls labels={dictionary.theme} initialTheme={theme} />
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
