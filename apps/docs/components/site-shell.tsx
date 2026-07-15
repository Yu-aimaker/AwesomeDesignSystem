import Link from "next/link";
import { getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { LocaleSwitcher } from "./locale-switcher";
import { SiteNav } from "./site-nav";

export async function SiteShell({
  children,
  controls,
}: {
  children: React.ReactNode;
  controls: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  return (
    <>
      <a className="skip-link" href="#main">{dictionary.shell.skipToContent}</a>
      <div className="shell">
        <aside className="sidebar" aria-label={dictionary.shell.primary}>
          <div className="rail-heading">
            <div className="brand">
              <Link href={`/${locale}`} className="brand-lockup" aria-label={dictionary.shell.home}>
                <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
                <span><strong translate="no">AwesomeDS</strong><small>{dictionary.shell.tagline}</small></span>
              </Link>
            </div>
            <details className="nav-disclosure">
              <summary aria-label={locale === "ja" ? "ナビゲーションメニュー" : "Navigation menu"}><span /><span /></summary>
              <div className="nav-panel">
                <SiteNav locale={locale} labels={dictionary.nav} ariaLabel={dictionary.shell.site} />
              </div>
            </details>
          </div>
          <div className="desktop-navigation"><SiteNav locale={locale} labels={dictionary.nav} ariaLabel={dictionary.shell.site} /></div>
          <div className="rail-utilities">
            {controls}
            <LocaleSwitcher locale={locale} label={dictionary.shell.language} />
          </div>
        </aside>
        <div className="main-column">
          <main id="main" className="main">{children}</main>
          <footer className="site-footer">
            <div>
              <Link href={`/${locale}`} className="footer-brand" translate="no">AwesomeDS</Link>
              <p>{locale === "ja" ? "根拠に基づく、AI時代のデザイン実践体系。" : "Evidence-backed design intelligence for the AI era."}</p>
            </div>
            <p className="footer-path"><code>DESIGN.md</code><span>→</span><code>rule.*</code><span>→</span><code>UI</code><span>→</span><code>verify</code></p>
            <nav aria-label={locale === "ja" ? "フッター" : "Footer"}>
              <Link href={localizePathname("/canon", locale)}>{dictionary.nav.Canon}</Link>
              <Link href={localizePathname("/references", locale)}>{dictionary.nav["Reference Atlas"]}</Link>
              <Link href={localizePathname("/status", locale)}>{dictionary.nav.Status}</Link>
            </nav>
          </footer>
        </div>
      </div>
    </>
  );
}
