import type { ReactNode } from "react";
import { cx } from "../cx";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  /** Allow the cell to wrap. Default is nowrap; the table scrolls sideways instead. */
  wrap?: boolean;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
  className?: string;
}

// Header on surface-sunken, 1px hairline between rows, tabular figures so
// numbers align. Cells do not wrap; a narrow screen scrolls the table sideways.
export function Table<T>({ columns, rows, rowKey, caption, className }: TableProps<T>) {
  // Wrapping columns need room to wrap; below that the whole table scrolls sideways.
  const minWidth = columns.some((c) => c.wrap) ? `${Math.max(40, columns.length * 12)}rem` : undefined;
  return (
    <div className={cx("overflow-x-auto rounded-lg border border-hairline", className)}>
      <table className="w-full border-collapse text-sm tabular" style={{ minWidth }}>
        {caption && <caption className="t-caption px-3 py-2 text-left text-ink-muted">{caption}</caption>}
        <thead>
          <tr className="bg-surface-sunken">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cx("t-label h-10 px-3 text-left font-medium whitespace-nowrap text-ink-secondary", c.align === "right" && "text-right")}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-hairline transition-colors duration-instant hover:bg-canvas-soft">
              {columns.map((c) => (
                <td key={c.key} className={cx("h-12 px-3 text-ink", !c.wrap && "whitespace-nowrap", c.align === "right" && "text-right")}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
