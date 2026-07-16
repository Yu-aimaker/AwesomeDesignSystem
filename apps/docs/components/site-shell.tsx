import Link from "next/link";
import { getDictionary, localizePathname } from "../lib/i18n";
import { getRequestLocale } from "../lib/i18n-server";
import { AdsCharacter } from "./ads-character";
import { CmyMark } from "./cmy-mark";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNavigationDisclosure } from "./mobile-navigation-disclosure";
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
  const isJa = locale === "ja";

  return (
    <>
      <a className="skip-link" href="#main">
        {dictionary.shell.skipToContent}
      </a>

      <div className="shell">
        <header className="site-header">
          <div className="site-header__inner">
            <div className="brand">
              <Link
                href={`/${locale}`}
                className="brand-lockup"
                aria-label={dictionary.shell.home}
              >
                <CmyMark className="brand-mark" size={32} />
                <span>
                  <strong translate="no">AwesomeDS</strong>
                  <small>{dictionary.shell.tagline}</small>
                </span>
              </Link>
            </div>

            <div className="site-header__desktop">
              <SiteNav
                locale={locale}
                labels={dictionary.nav}
                ariaLabel={dictionary.shell.site}
              />
            </div>

            <div className="site-header__actions">
              <div className="site-header__utilities site-header__utilities--desktop">
                {controls}
                <LocaleSwitcher locale={locale} label={dictionary.shell.language} />
              </div>
              <Link
                className="header-cta"
                href={localizePathname("/canon", locale)}
              >
                {isJa ? "体系を読む" : "Enter the Canon"}
              </Link>
              <MobileNavigationDisclosure label={dictionary.shell.navigationMenu}>
                <div className="nav-panel" id="mobile-site-navigation">
                  <SiteNav
                    locale={locale}
                    labels={dictionary.nav}
                    ariaLabel={dictionary.shell.site}
                  />
                  <div className="site-header__utilities site-header__utilities--mobile">
                    {controls}
                    <LocaleSwitcher locale={locale} label={dictionary.shell.language} />
                  </div>
                </div>
              </MobileNavigationDisclosure>
            </div>
          </div>
        </header>

        <main id="main" className="main">
          {children}
        </main>

        <footer className="site-footer">
          <div className="site-footer__brand">
            <Link href={`/${locale}`} className="footer-brand" translate="no">
              <CmyMark size={28} breathe={false} />
              AwesomeDS
            </Link>
            <p>
              {isJa
                ? "AIに美意識を。根拠つきで、遊び心つきで。"
                : "Taste for AI agents — with receipts, and a little joy."}
            </p>
          </div>

          <div className="site-footer__mascot" aria-hidden="true">
            <AdsCharacter mood="cheer" size={88} />
          </div>

          <nav
            className="site-footer__nav"
            aria-label={isJa ? "フッター" : "Footer"}
          >
            <Link href={localizePathname("/canon", locale)}>
              {dictionary.nav.Canon}
            </Link>
            <Link href={localizePathname("/components", locale)}>
              {dictionary.nav.Components}
            </Link>
            <Link href={localizePathname("/motion", locale)}>
              {dictionary.nav.Motion}
            </Link>
            <Link href={localizePathname("/references", locale)}>
              {dictionary.nav["Reference Atlas"]}
            </Link>
            <Link href={localizePathname("/status", locale)}>
              {dictionary.nav.Status}
            </Link>
            <Link href={localizePathname("/reports", locale)}>
              {dictionary.nav.Reports}
            </Link>
          </nav>

          <p className="footer-path">
            <code>DESIGN.md</code>
            <span>→</span>
            <code>rule.*</code>
            <span>→</span>
            <code>UI</code>
            <span>→</span>
            <code>verify</code>
          </p>
        </footer>
      </div>
    </>
  );
}
