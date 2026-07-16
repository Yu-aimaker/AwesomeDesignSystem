"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../lib/navigation";
import {
  type Dictionary,
  type Locale,
  localizePathname,
  stripLocaleFromPathname,
} from "../lib/i18n";

const sections = ["start", "explore", "build", "verify"] as const;

const sectionLabels = {
  en: {
    start: "Start",
    explore: "Explore",
    build: "Build",
    verify: "Verify",
  },
  ja: {
    start: "はじめる",
    explore: "見つける",
    build: "つくる",
    verify: "確かめる",
  },
} as const;

/** Primary top-bar links shown always (compact IA). */
const primaryHrefs = new Set([
  "/",
  "/canon",
  "/components",
  "/motion",
  "/references",
  "/playground",
]);

export function SiteNav({
  locale,
  labels,
  ariaLabel,
}: {
  locale: Locale;
  labels: Dictionary["nav"];
  ariaLabel: string;
}) {
  const pathname = stripLocaleFromPathname(usePathname());
  const primary = nav.filter((item) => primaryHrefs.has(item.href));
  const more = nav.filter((item) => !primaryHrefs.has(item.href));

  return (
    <nav className="nav" aria-label={ariaLabel}>
      <div className="nav-primary">
        {primary.map((item) => {
          const current =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={localizePathname(item.href, locale)}
              prefetch={false}
              aria-current={current ? "page" : undefined}
              className="nav-link"
            >
              {labels[item.label] ?? item.label}
            </Link>
          );
        })}
      </div>

      <details className="nav-more">
        <summary className="nav-more__summary">
          {locale === "ja" ? "すべて" : "All docs"}
        </summary>
        <div className="nav-more__panel">
          {sections.map((section) => {
            const items = more.filter((item) => item.section === section);
            if (!items.length) return null;
            return (
              <div className="nav-group" key={section}>
                <p>{sectionLabels[locale][section]}</p>
                <div>
                  {items.map((item) => {
                    const current =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={localizePathname(item.href, locale)}
                        prefetch={false}
                        aria-current={current ? "page" : undefined}
                      >
                        <span>{labels[item.label] ?? item.label}</span>
                        <i aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
