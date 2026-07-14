"use client";

import { useState } from "react";
import { persistTheme } from "../lib/client-theme";

const themes = ["light", "dark", "high-contrast"] as const;

export type DocsTheme = (typeof themes)[number];

export function ThemeControls({ labels, initialTheme }: { labels: { label: string; light: string; dark: string; highContrast: string }; initialTheme: DocsTheme }) {
  const [theme, setTheme] = useState<DocsTheme>(initialTheme);

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
          onClick={() => apply(t)}
        >
          {t === "high-contrast" ? labels.highContrast : labels[t]}
        </button>
      ))}
    </div>
  );
}
