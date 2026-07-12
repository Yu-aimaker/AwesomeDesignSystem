"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type Locale, localizePathname, locales } from "../lib/i18n";

const names: Record<Locale, string> = { en: "English", ja: "日本語" };

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const [locationSuffix, setLocationSuffix] = useState("");

  useEffect(() => {
    setLocationSuffix(window.location.search + window.location.hash);
  }, [pathname]);

  return (
    <nav className="locale-switcher" aria-label={label}>
      {locales.map((target) => (
        <a
          key={target}
          href={localizePathname(pathname + locationSuffix, target)}
          hrefLang={target}
          lang={target}
          aria-current={target === locale ? "page" : undefined}
        >
          {names[target]}
        </a>
      ))}
    </nav>
  );
}
