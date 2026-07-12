"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../lib/navigation";
import { type Dictionary, type Locale, localizePathname, stripLocaleFromPathname } from "../lib/i18n";

export function SiteNav({ locale, labels, ariaLabel }: { locale: Locale; labels: Dictionary["nav"]; ariaLabel: string }) {
  const pathname = stripLocaleFromPathname(usePathname());
  return (
    <nav className="nav" aria-label={ariaLabel}>
      {nav.map((item) => {
        const current = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
        return <Link key={item.href} href={localizePathname(item.href, locale)} aria-current={current ? "page" : undefined}>{labels[item.label] ?? item.label}</Link>;
      })}
    </nav>
  );
}
