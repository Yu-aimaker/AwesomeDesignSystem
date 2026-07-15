"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { persistTheme, THEME_CHANGE_EVENT } from "../lib/client-theme";

const themes = ["light", "dark", "high-contrast"] as const;

export type DocsTheme = (typeof themes)[number];

export function ThemeControls({ labels, initialTheme }: { labels: { label: string; light: string; dark: string; highContrast: string }; initialTheme: DocsTheme }) {
  const [theme, setTheme] = useState<DocsTheme>(initialTheme);
  const hydrated = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    function syncTheme(event: Event) {
      const next = (event as CustomEvent<string>).detail;
      if (themes.includes(next as DocsTheme)) setTheme(next as DocsTheme);
    }

    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
  }, []);

  function apply(next: (typeof themes)[number]) {
    setTheme(next);
    persistTheme(next);
  }

  return (
    <div className="theme-bar" role="group" aria-label={labels.label}>
      {themes.map((t) => (
        <button
          key={t}
          type="button"
          className="ads-btn ads-btn--secondary ads-btn--sm"
          aria-pressed={theme === t}
          disabled={!hydrated}
          onClick={() => apply(t)}
        >
          {t === "high-contrast" ? labels.highContrast : labels[t]}
        </button>
      ))}
    </div>
  );
}

function subscribeToHydration() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}
