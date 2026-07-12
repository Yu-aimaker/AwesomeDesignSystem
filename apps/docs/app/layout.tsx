import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "../components/site-shell";
import { ThemeControls } from "../components/theme-controls";

import { getDictionary } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(await getRequestLocale());
  return { title: { default: dictionary.metadata.title, template: "%s · AwesomeDS" }, description: dictionary.metadata.description };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  return (
    <html lang={locale} data-theme="light">
      <body>
        <SiteShell>
          <ThemeControls labels={dictionary.theme} />
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
