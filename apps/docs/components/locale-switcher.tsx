"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { type Locale, localeConfig, localizePathname, locales } from "../lib/i18n";

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const suffix = (query ? `?${query}` : "") + window.location.hash;
    for (const anchor of navRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-locale]") ?? []) {
      anchor.href = localizePathname(pathname + suffix, anchor.dataset.locale as Locale);
    }
  }, [pathname, query]);
  return (
    <nav ref={navRef} className="locale-switcher" aria-label={label}>
      {locales.map((target) => (
        <a
          key={target}
          href={localizePathname(`${pathname}${query ? `?${query}` : ""}`, target)}
          hrefLang={target}
          lang={target}
          data-locale={target}
          aria-current={target === locale ? "page" : undefined}
        >
          {localeConfig[target].name}
        </a>
      ))}
    </nav>
  );
}
