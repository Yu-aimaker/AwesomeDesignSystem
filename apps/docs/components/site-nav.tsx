"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../lib/navigation";
import { type Dictionary, type Locale, localizePathname, stripLocaleFromPathname } from "../lib/i18n";

const sections = ["explore", "build", "practice", "assure"] as const;

const sectionLabels = {
  en: { explore: "Understand", build: "Build", practice: "Practice", assure: "Assure" },
  ja: { explore: "理解する", build: "つくる", practice: "実践する", assure: "確かめる" },
} as const;

export function SiteNav({ locale, labels, ariaLabel }: { locale: Locale; labels: Dictionary["nav"]; ariaLabel: string }) {
  const pathname = stripLocaleFromPathname(usePathname());
  return (
    <nav className="nav" aria-label={ariaLabel}>
      {sections.map((section) => (
        <div className="nav-group" key={section}>
          <p>{sectionLabels[locale][section]}</p>
          <div>
            {nav.filter((item) => item.section === section).map((item) => {
              const current = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
              return <Link key={item.href} href={localizePathname(item.href, locale)} aria-current={current ? "page" : undefined}><span>{labels[item.label] ?? item.label}</span><i aria-hidden="true" /></Link>;
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
