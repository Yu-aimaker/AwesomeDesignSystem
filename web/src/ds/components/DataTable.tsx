import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { Column } from "./Table";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface DataColumn<T> extends Column<T> {
  sortable?: boolean;
  /** Value used for sorting. Defaults to the rendered text when it is a string or number. */
  sortValue?: (row: T) => string | number;
}

export interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
  /** Adds a 44px checkbox column with select-all in the header. */
  selectable?: boolean;
  selected?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** Header stays visible while the body scrolls inside maxHeight. */
  stickyHeader?: boolean;
  /** Any CSS length, e.g. "320px". Enables vertical scroll. */
  maxHeight?: string;
  emptyState?: ReactNode;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  className?: string;
}

// Header checkbox without a visible label. Indeterminate when some rows are selected.
function SelectBox({ checked, indeterminate = false, label, onChange }: { checked: boolean; indeterminate?: boolean; label: string; onChange: (next: boolean) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);
  return (
    <span className="relative flex size-5 items-center justify-center">
      <input ref={ref} type="checkbox" aria-label={label} checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-xs" />
      <span
        aria-hidden
        className={cx(
          "pointer-events-none flex size-5 items-center justify-center rounded-xs border bg-surface text-on-primary transition-colors duration-instant ease-out-ds",
          checked || indeterminate ? "border-primary bg-primary" : "border-hairline-strong peer-hover:border-ink-muted",
        )}
      >
        {checked ? (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
        ) : indeterminate ? (
          <span className="h-0.5 w-2.5 rounded-full bg-current" />
        ) : null}
      </span>
    </span>
  );
}

// The Table look (sunken sticky header, hairline rows, tabular figures) plus the
// features a real data view needs: sort with aria-sort and a 16px indicator, a 44px
// checkbox column with select-all, a selected row in --ds-selection, and an empty
// state inside the body so the header stays as context.
export function DataTable<T>({ columns, rows, rowKey, caption, selectable = false, selected, onSelectionChange, stickyHeader = true, maxHeight, emptyState, defaultSort, className }: DataTableProps<T>) {
  const m = useT(dsMessages);
  const id = useId();
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(defaultSort ?? null);
  const [internal, setInternal] = useState<string[]>([]);
  const sel = selected ?? internal;
  const setSel = (next: string[]) => {
    setInternal(next);
    onSelectionChange?.(next);
  };

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = (row: T): string | number => {
      if (col.sortValue) return col.sortValue(row);
      const r = col.render(row);
      return typeof r === "number" || typeof r === "string" ? r : String(r ?? "");
    };
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb), "ja") * dir;
    });
  }, [rows, columns, sort]);

  const toggleSort = (key: string) => {
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
  };

  const allKeys = sorted.map(rowKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => sel.includes(k));
  const someSelected = allKeys.some((k) => sel.includes(k));
  const minWidth = columns.some((c) => c.wrap) ? `${Math.max(40, columns.length * 12)}rem` : undefined;
  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cx("overflow-auto rounded-lg border border-hairline", className)} style={{ maxHeight }}>
      <table className="w-full border-collapse text-sm tabular" style={{ minWidth }}>
        {caption && <caption className="t-caption px-3 py-2 text-left text-ink-muted">{caption}</caption>}
        <thead className={cx(stickyHeader && "sticky top-0 z-[1]")}>
          <tr className="bg-surface-sunken">
            {selectable && (
              <th scope="col" className="w-11 px-3">
                <SelectBox
                  checked={allSelected}
                  indeterminate={someSelected}
                  label={allSelected ? m.deselectAll : m.selectAll}
                  onChange={(next) => setSel(next ? Array.from(new Set([...sel, ...allKeys])) : sel.filter((k) => !allKeys.includes(k)))}
                />
              </th>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const Icon = active ? (sort?.dir === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (sort?.dir === "asc" ? "ascending" : "descending") : c.sortable ? "none" : undefined}
                  className={cx("t-label h-10 px-3 text-left font-medium whitespace-nowrap text-ink-secondary shadow-[inset_0_-1px_0_var(--ds-hairline)]", c.align === "right" && "text-right")}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cx(
                        "-mx-1 inline-flex h-7 items-center gap-1 rounded-sm px-1 transition-colors duration-instant ease-out-ds hover:bg-hairline hover:text-ink",
                        c.align === "right" && "flex-row-reverse",
                        active && "text-ink",
                      )}
                    >
                      {c.header}
                      <Icon className={cx("size-4", active ? "text-ink" : "text-ink-muted")} strokeWidth={1.75} aria-hidden />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={colCount} className="px-3 py-10 text-center">
                {emptyState ?? <span className="t-body-sm text-ink-muted">{m.noRows}</span>}
              </td>
            </tr>
          )}
          {sorted.map((row) => {
            const key = rowKey(row);
            const isSel = sel.includes(key);
            return (
              <tr
                key={key}
                aria-selected={selectable ? isSel : undefined}
                className={cx("border-t border-hairline transition-colors duration-instant", isSel ? "bg-[var(--ds-selection)]" : "hover:bg-canvas-soft")}
              >
                {selectable && (
                  <td className="h-12 w-11 px-3">
                    <SelectBox checked={isSel} label={m.selectRow(String(key))} onChange={(next) => setSel(next ? [...sel, key] : sel.filter((k) => k !== key))} />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={`${id}-${key}-${c.key}`} className={cx("h-12 px-3 text-ink", !c.wrap && "whitespace-nowrap", c.align === "right" && "text-right")}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
