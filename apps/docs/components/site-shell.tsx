import Link from "next/link";
import { getDictionary } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { LocaleSwitcher } from "./locale-switcher";
import { SiteNav } from "./site-nav";

export async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  return (
    <>
      <a className="skip-link" href="#main">{dictionary.shell.skipToContent}</a>
      <div className="shell">
        <aside className="sidebar" aria-label={dictionary.shell.primary}>
          <div className="brand">
            <Link href={`/${locale}`} className="brand-lockup" aria-label={dictionary.shell.home}><span className="brand-mark" aria-hidden="true">A</span><strong>AwesomeDS</strong></Link>
            <span className="meta">{dictionary.shell.tagline}</span>
          </div>
          <SiteNav locale={locale} labels={dictionary.nav} ariaLabel={dictionary.shell.site} />
          <LocaleSwitcher locale={locale} label={dictionary.shell.language} />
        </aside>
        <main id="main" className="main">
          {children}
        </main>
      </div>
    </>
  );
}
