import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Link, NavLink } from "../i18n/router";
import { useLocale, useT } from "../i18n/context";
import { shellMessages } from "../i18n/messages/shell";
import { LanguageSwitch } from "./LanguageSwitch";
import { ExternalLink, Menu, Monitor, Moon, Search, SlidersHorizontal, Sun, X } from "lucide-react";
import { repoUrl, sidebar, topNav } from "../lib/nav";
import { useTheme, type ThemePreference } from "../lib/theme";
import { useKnobs } from "../lib/knobs";
import { cx } from "../ds/cx";
import { ToastProvider } from "../ds/components/Toast";
import { Popover } from "../ds/components/Popover";
import { ScrollProgress } from "./ScrollProgress";
import { KnobsPanel } from "./KnobsPanel";
import { CommandPalette } from "./CommandPalette";
import { ErrorBoundary } from "./ErrorBoundary";

const themeOrder: ThemePreference[] = ["light", "dark", "system"];
const themeIcon: Record<ThemePreference, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };

const iconButton =
  "flex size-10 items-center justify-center rounded-md text-ink-secondary transition-colors duration-instant ease-out-ds hover:bg-surface-sunken hover:text-ink";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useT(shellMessages);
  const themeLabel = t.theme;
  const Icon = themeIcon[theme];
  const next = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
  return (
    <button type="button" onClick={() => setTheme(next)} aria-label={t.themeLabel(themeLabel[theme], themeLabel[next])} title={t.themeTitle(themeLabel[theme])} className={iconButton}>
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
    </button>
  );
}

function KnobsButton() {
  const { isDefault } = useKnobs();
  const t = useT(shellMessages);
  return (
    <Popover
      trigger={(p) => (
        <button type="button" {...p} aria-label={t.adjust} title={t.adjustTitle} className={cx(iconButton, "relative")}>
          <SlidersHorizontal className="size-5" strokeWidth={1.75} aria-hidden />
          {!isDefault && <span aria-hidden className="absolute top-2 right-2 size-1.5 rounded-full bg-accent" />}
        </button>
      )}
      className="w-[min(360px,90vw)]"
      align="end"
    >
      <KnobsPanel layout="stack" />
    </Popover>
  );
}

function MobileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = useT(shellMessages);
  const { locale } = useLocale();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return (
    <dialog
      id="mobile-nav"
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={t.navigation}
      className="sheet m-0 h-dvh max-h-dvh w-[min(320px,85vw)] max-w-none border-r border-hairline bg-canvas p-0 text-ink"
    >
      <div className="flex h-16 items-center justify-between border-b border-hairline px-4">
        <span className="t-label text-ink">AwesomeDS</span>
        <button type="button" onClick={onClose} aria-label={t.close} className={iconButton}>
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <nav aria-label={t.sections} className="flex flex-col gap-6 overflow-y-auto p-4">
        {sidebar.map((group) => (
          <div key={group.label.en}>
            <p className="t-caption mb-2 px-3 text-ink-muted">{group.label[locale]}</p>
            <ul className="flex flex-col gap-px">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cx("t-body-sm flex h-9 items-center rounded-md px-3 no-underline transition-colors duration-instant", isActive ? "bg-surface-sunken font-medium text-ink" : "text-ink-secondary hover:bg-surface-sunken hover:text-ink")
                    }
                  >
                    {item.label[locale]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="t-caption mb-2 px-3 text-ink-muted">{t.language}</p>
          <LanguageSwitch variant="full" />
        </div>
      </nav>
    </dialog>
  );
}

export function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();
  const t = useT(shellMessages);
  const { locale } = useLocale();

  useEffect(() => {
    setMenuOpen(false);
    if (!location.hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = decodeURIComponent(location.hash.slice(1));
    let frames = 0;
    let raf = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
      if (frames++ < 60) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ToastProvider>
      <a href="#main" className="sr-only rounded-md bg-primary px-3 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
        {t.skipToMain}
      </a>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-1 px-4 sm:px-6">
          <button type="button" onClick={() => setMenuOpen(true)} aria-label={t.openMenu} aria-expanded={menuOpen} aria-controls="mobile-nav" className={cx(iconButton, "-ml-2 xl:hidden")}>
            <Menu className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
          <Link to="/" className="mr-3 flex items-baseline gap-2 text-ink no-underline">
            <span className="t-label">AwesomeDS</span>
            <span className="t-caption hidden text-ink-muted sm:inline">v0.4</span>
          </Link>
          <nav aria-label={t.mainNav} className="hidden min-w-0 flex-1 items-center gap-0.5 xl:flex">
            {topNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    "t-label shrink-0 rounded-md px-2.5 py-2 no-underline transition-colors duration-instant ease-out-ds",
                    isActive ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:bg-surface-sunken hover:text-ink",
                  )
                }
              >
                {item.label[locale]}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-0.5">
            <button type="button" onClick={() => setPaletteOpen(true)} aria-label={t.openSearch} title={t.searchTitle} className={iconButton}>
              <Search className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
            <KnobsButton />
            <ThemeToggle />
            <LanguageSwitch />
            <a href={repoUrl} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className={cx(iconButton, "hidden sm:flex")}>
              <ExternalLink className="size-5" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
        <ScrollProgress />
      </header>

      <MobileSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <main id="main" className="mx-auto min-w-0 max-w-[1280px] px-4 py-10 sm:px-6 lg:py-14">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="border-t border-hairline">
        <div className="t-caption mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-4 py-6 text-ink-muted sm:px-6">
          <span>{t.footerNote}</span>
          <span className="flex gap-4">
            <Link to="/sources">{t.footerGuidelines}</Link>
            <Link to="/about">{t.footerAbout}</Link>
            <LanguageSwitch variant="inline" />
            <a href={repoUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </span>
        </div>
      </footer>
    </ToastProvider>
  );
}
