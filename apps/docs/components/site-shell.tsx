import Link from "next/link";
import { nav } from "../lib/content";

export function SiteShell({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath?: string;
}) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="shell">
        <aside className="sidebar" aria-label="Primary">
          <div className="brand">
            <strong>AwesomeDS</strong>
            <span className="meta">Evidence-backed design bible</span>
          </div>
          <nav className="nav" aria-label="Site">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={currentPath === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main id="main" className="main">
          {children}
        </main>
      </div>
    </>
  );
}
