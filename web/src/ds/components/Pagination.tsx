import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../cx";

export interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  /** Pages shown on each side of the current one. */
  siblings?: number;
  size?: "sm" | "md";
  className?: string;
}

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
}

// Builds 1 … 4 5 6 … 20. The ellipsis only appears when it hides two or more pages.
export function pageItems(page: number, total: number, siblings: number): Array<number | "gap"> {
  const window = siblings * 2 + 5;
  if (total <= window) return range(1, total);
  const left = Math.max(2, page - siblings);
  const right = Math.min(total - 1, page + siblings);
  const items: Array<number | "gap"> = [1];
  if (left > 3) items.push("gap");
  else items.push(...range(2, left - 1));
  items.push(...range(left, right));
  if (right < total - 2) items.push("gap");
  else items.push(...range(right + 1, total - 1));
  items.push(total);
  return items;
}

// Buttons at control size, the current page filled with ink and marked with
// aria-current. Prev and next are icon buttons with labels; they disable at the ends.
export function Pagination({ page, total, onChange, siblings = 1, size = "md", className }: PaginationProps) {
  const h = size === "sm" ? "h-8 min-w-8 px-2 text-sm" : "h-10 min-w-10 px-3 text-sm";
  const base = cx(
    "inline-flex items-center justify-center rounded-md border font-medium leading-none tabular",
    "transition-colors duration-instant ease-out-ds active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0",
    h,
  );
  const idle = "border-transparent text-ink-secondary hover:bg-surface-sunken hover:text-ink";
  const current = "border-primary bg-primary text-on-primary";
  return (
    <nav aria-label="ページ" className={className}>
      <ul className="flex items-center gap-1">
        <li>
          <button type="button" aria-label="前のページ" disabled={page <= 1} onClick={() => onChange(page - 1)} className={cx(base, idle)}>
            <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        </li>
        {pageItems(page, total, siblings).map((item, i) =>
          item === "gap" ? (
            <li key={`gap-${i}`} aria-hidden className={cx("inline-flex items-center justify-center text-ink-muted", h)}>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-current={item === page ? "page" : undefined}
                aria-label={`${item} ページ`}
                onClick={() => onChange(item)}
                className={cx(base, item === page ? current : idle)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button type="button" aria-label="次のページ" disabled={page >= total} onClick={() => onChange(page + 1)} className={cx(base, idle)}>
            <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
}
