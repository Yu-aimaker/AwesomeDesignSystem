import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { parseSidebarState, SIDEBAR_COOKIE } from "../lib/sidebar-state";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNavigationDisclosure } from "./mobile-navigation-disclosure";
import { ProofMark } from "./proof-mark";
import { SidebarToggle } from "./sidebar-toggle";
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
  const sidebarState = parseSidebarState((await cookies()).get(SIDEBAR_COOKIE)?.value);
  return (
    <>
      <a className="skip-link" href="#main">{dictionary.shell.skipToContent}</a>
      <div className="shell" data-sidebar-state={sidebarState}>
        <aside className="sidebar" aria-label={dictionary.shell.primary}>
          <div className="rail-heading">
            <div className="brand">
              <Link href={`/${locale}`} className="brand-lockup" aria-label={dictionary.shell.home}>
                <ProofMark className="brand-mark" size={22} />
                <span><strong translate="no">AwesomeDS</strong><small>{dictionary.shell.tagline}</small></span>
              </Link>
            </div>
            <SidebarToggle
              initialState={sidebarState}
              collapseLabel={dictionary.shell.collapseSidebar}
              expandLabel={dictionary.shell.expandSidebar}
            />
            <MobileNavigationDisclosure label={dictionary.shell.navigationMenu}>
              <div className="nav-panel" id="mobile-site-navigation">
                <SiteNav locale={locale} labels={dictionary.nav} ariaLabel={dictionary.shell.site} />
                <div className="rail-utilities rail-utilities--mobile">
                  {controls}
                  <LocaleSwitcher locale={locale} label={dictionary.shell.language} />
                </div>
              </div>
            </MobileNavigationDisclosure>
          </div>
          <div className="desktop-navigation" id="desktop-site-navigation"><SiteNav locale={locale} labels={dictionary.nav} ariaLabel={dictionary.shell.site} /></div>
          <div className="rail-utilities rail-utilities--desktop">
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
      <noscript>
        <style>{`@media (min-width: 68rem) {
          html .shell[data-sidebar-state="collapsed"] { grid-template-columns: var(--docs-rail) minmax(0, 1fr); }
          html .shell[data-sidebar-state="collapsed"] .sidebar { padding: var(--space-6) var(--space-5); }
          html .shell[data-sidebar-state="collapsed"] .rail-heading { flex-direction: row; }
          html .shell[data-sidebar-state="collapsed"] .brand-lockup > span:last-child { display: flex; }
          html .shell[data-sidebar-state="collapsed"] .desktop-navigation { display: block; }
          html .shell[data-sidebar-state="collapsed"] .rail-utilities--desktop { display: flex; }
          html .shell[data-sidebar-state="collapsed"] .sidebar-toggle { display: none; }
        }`}</style>
      </noscript>
    </>
  );
}
