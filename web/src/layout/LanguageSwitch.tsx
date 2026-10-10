import { Link as RRLink, useLocation } from "react-router";
import { useLocale } from "../i18n/context";
import { localeMeta, localizePath, locales } from "../i18n/locales";
import { shellMessages } from "../i18n/messages/shell";
import { cx } from "../ds/cx";

/**
 * One real link per other locale, pointing at the same page. A link (not a
 * toggle) so it works with the keyboard, middle-click and without JS state,
 * and carries `hreflang` / `lang` for assistive tech.
 */
export function LanguageSwitch({ variant = "compact", className }: { variant?: "compact" | "full" | "inline"; className?: string }) {
  const { locale, path } = useLocale();
  const { search, hash } = useLocation();
  const others = locales.filter((l) => l !== locale);
  return (
    <>
      {others.map((l) => {
        const meta = localeMeta[l];
        // Label in the target language, so it matches lang= on the link (screen readers switch voice).
        const label = shellMessages[l].switchTo(meta.autonym);
        return (
          <RRLink
            key={l}
            to={`${localizePath(path, l)}${search}${hash}`}
            hrefLang={meta.tag}
            lang={meta.tag}
            aria-label={label}
            title={label}
            className={cx(
              variant === "inline"
                ? undefined
                : variant === "compact"
                ? "t-label flex h-10 min-w-10 items-center justify-center rounded-md px-2 text-ink-secondary uppercase no-underline transition-colors duration-instant ease-out-ds hover:bg-surface-sunken hover:text-ink"
                : "t-body-sm flex h-9 items-center rounded-md px-3 text-ink-secondary no-underline transition-colors duration-instant hover:bg-surface-sunken hover:text-ink",
              className,
            )}
          >
            {variant === "compact" ? l : meta.autonym}
          </RRLink>
        );
      })}
    </>
  );
}
