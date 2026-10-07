import { Fragment } from "react";
import { ChevronRight, Ellipsis } from "lucide-react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Collapse the middle into an ellipsis when there are more items than this. */
  maxItems?: number;
  className?: string;
}

// 14px, ink-secondary links, a 16px chevron between, the current page in ink
// with aria-current. Long trails keep the first and the last two items.
export function Breadcrumb({ items, maxItems, className }: BreadcrumbProps) {
  const m = useT(dsMessages);
  const collapse = maxItems !== undefined && items.length > maxItems && maxItems >= 3;
  const shown: Array<BreadcrumbItem | "ellipsis"> = collapse ? [items[0], "ellipsis", ...items.slice(items.length - (maxItems - 1))] : items;
  return (
    <nav aria-label={m.breadcrumb} className={cx("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {shown.map((item, i) => {
          const last = i === shown.length - 1;
          return (
            <Fragment key={item === "ellipsis" ? "ellipsis" : `${item.label}-${i}`}>
              <li className="flex items-center">
                {item === "ellipsis" ? (
                  <span aria-hidden className="inline-flex h-7 items-center px-1 text-ink-muted">
                    <Ellipsis className="size-4" strokeWidth={1.75} />
                  </span>
                ) : last || !item.href ? (
                  <span aria-current={last ? "page" : undefined} className={cx("inline-flex h-7 items-center rounded-sm px-1", last ? "font-medium text-ink" : "text-ink-secondary")}>
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className="inline-flex h-7 items-center rounded-sm px-1 text-ink-secondary no-underline transition-colors duration-instant ease-out-ds hover:bg-surface-sunken hover:text-ink"
                  >
                    {item.label}
                  </a>
                )}
              </li>
              {!last && (
                <li aria-hidden className="text-ink-muted">
                  <ChevronRight className="size-4" strokeWidth={1.75} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
