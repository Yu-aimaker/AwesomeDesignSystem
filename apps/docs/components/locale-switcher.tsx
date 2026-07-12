"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { type Locale, localizePathname, locales } from "../lib/i18n";

const names: Record<Locale, string> = { en: "English", ja: "日本語" };

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const suffix = window.location.search + window.location.hash;
    for (const anchor of navRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-locale]") ?? []) {
      anchor.href = localizePathname(pathname + suffix, anchor.dataset.locale as Locale);
    }
  }, [pathname]);
  return (
    <nav ref={navRef} className="locale-switcher" aria-label={label}>
      {locales.map((target) => (
        <a
          key={target}
          href={localizePathname(pathname, target)}
          hrefLang={target}
          lang={target}
          data-locale={target}
          aria-current={target === locale ? "page" : undefined}
        >
          {names[target]}
        </a>
      ))}
    </nav>
  );
}
