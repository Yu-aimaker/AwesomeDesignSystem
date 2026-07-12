"use client";

import { useEffect, useState } from "react";

const themes = ["light", "dark", "high-contrast"] as const;

export function ThemeControls({ labels }: { labels: { label: string; light: string; dark: string; highContrast: string } }) {
  const [theme, setTheme] = useState<(typeof themes)[number]>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("ads-theme") as (typeof themes)[number] | null;
    if (stored && themes.includes(stored)) {
      document.documentElement.setAttribute("data-theme", stored);
      queueMicrotask(() => setTheme(stored));
    }
  }, []);

  function apply(next: (typeof themes)[number]) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("ads-theme", next);
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
