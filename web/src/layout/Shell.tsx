import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ExternalLink, Menu, Monitor, Moon, Sun, X } from "lucide-react";
import { repoUrl, sidebar, topNav } from "../lib/nav";
import { useTheme, type ThemePreference } from "../lib/theme";
import { cx } from "../ds/cx";
import { ToastProvider } from "../ds/components/Toast";
import { ScrollProgress } from "./ScrollProgress";

const themeOrder: ThemePreference[] = ["light", "dark", "system"];
const themeLabel: Record<ThemePreference, string> = { light: "ライト", dark: "ダーク", system: "OS 設定に従う" };
const themeIcon: Record<ThemePreference, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = themeIcon[theme];
  const next = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`テーマ: ${themeLabel[theme]}。次は${themeLabel[next]}`}
      title={`テーマ: ${themeLabel[theme]}`}
      className="flex size-10 items-center justify-center rounded-md text-ink-secondary transition-colors duration-instant ease-out-ds hover:bg-surface-sunken hover:text-ink"
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
    </button>
  );
}

function SidebarTree({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="セクション" className="flex flex-col gap-6">
      {sidebar.map((group) => (
        <div key={group.label}>
          <p className="t-label mb-2 px-3 text-ink-muted">{group.label}</p>
          <ul className="flex flex-col gap-px">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cx(
                      "t-body-sm flex h-9 items-center rounded-md px-3 no-underline transition-colors duration-instant ease-out-ds",
                      isActive ? "bg-surface-sunken font-medium text-ink" : "text-ink-secondary hover:bg-surface-sunken hover:text-ink",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function MobileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label="ナビゲーション"
      className="sheet m-0 h-dvh max-h-dvh w-[min(320px,85vw)] max-w-none border-r border-hairline bg-canvas p-0 text-ink"
    >
      <div className="flex h-16 items-center justify-between border-b border-hairline px-4">
        <span className="t-label text-ink">AwesomeDS</span>
        <button type="button" onClick={onClose} aria-label="閉じる" className="flex size-10 items-center justify-center rounded-md text-ink-secondary hover:bg-surface-sunken hover:text-ink">
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <div className="overflow-y-auto p-4">
        <SidebarTree onNavigate={onClose} />
      </div>
    </dialog>
  );
}

export function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    if (!location.hash) window.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  return (
    <ToastProvider>
      <a href="#main" className="sr-only rounded-md bg-primary px-3 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
        本文へ移動
      </a>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-2 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="メニューを開く"
            className="-ml-2 flex size-10 items-center justify-center rounded-md text-ink-secondary hover:bg-surface-sunken hover:text-ink lg:hidden"
          >
            <Menu className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
          <Link to="/" className="t-label mr-4 text-ink no-underline">
            AwesomeDS
          </Link>
          <nav aria-label="メイン" className="hidden min-w-0 flex-1 items-center gap-1 md:flex">
            {topNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    "t-label shrink-0 rounded-md px-3 py-2 no-underline transition-colors duration-instant ease-out-ds",
                    isActive || (item.to.startsWith("/foundations") && location.pathname.startsWith("/foundations"))
                      ? "bg-surface-sunken text-ink"
                      : "text-ink-secondary hover:bg-surface-sunken hover:text-ink",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="t-label flex h-10 items-center gap-1 rounded-md px-3 text-ink-secondary no-underline transition-colors duration-instant ease-out-ds hover:bg-surface-sunken hover:text-ink"
            >
              GitHub
              <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
        <ScrollProgress />
      </header>

      <MobileSheet open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-16 max-h-[calc(100dvh-64px)] overflow-y-auto border-r border-hairline px-3 py-8">
            <SidebarTree />
          </div>
        </aside>
        <main id="main" className="min-w-0 px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-hairline">
        <div className="t-caption mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-6 text-ink-muted sm:px-6">
          <span>AwesomeDS v0.1.0. このサイト自体が AwesomeDS で作られています。</span>
          <a href={repoUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </ToastProvider>
  );
}
