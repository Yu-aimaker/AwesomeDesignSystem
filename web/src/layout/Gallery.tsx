import { type ReactNode } from "react";
import { Search } from "lucide-react";
import { Chip } from "../ds/components/Chip";
import { cx } from "../ds/cx";

/**
 * Shared chrome for the gallery pages (fonts, palettes, components, motion,
 * stack, rankings): a headline with one big number, a sticky filter row and
 * small helpers. Text stays at one line each; the visuals carry the page.
 */

export function GalleryHeader({ title, lead, stat, statLabel, children }: { title: string; lead: string; stat?: number | string; statLabel?: string; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div className="min-w-0">
        <h1 className="t-display text-ink">{title}</h1>
        <p className="t-body-lg mt-3 max-w-[40ch] text-ink-secondary">{lead}</p>
        {children}
      </div>
      {stat !== undefined && (
        <p className="flex items-baseline gap-2 text-ink">
          <span className="t-display-xl tabular" style={{ fontSize: "clamp(56px, 8vw, 104px)" }}>
            {stat}
          </span>
          {statLabel && <span className="t-label text-ink-secondary">{statLabel}</span>}
        </p>
      )}
    </header>
  );
}

/** Sticks under the site header. Children are chips, a search box, a sort control. */
export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("sticky top-16 z-30 -mx-4 flex flex-wrap items-center gap-2 border-b border-hairline bg-canvas/90 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6", className)}>{children}</div>
  );
}

export function FilterChip({ selected, onSelect, children, count }: { selected: boolean; onSelect: () => void; children: ReactNode; count?: number }) {
  return (
    <Chip selected={selected} onSelectedChange={() => onSelect()} size="sm">
      {children}
      {count !== undefined && <span className={cx("t-mono tabular", selected ? "text-on-primary/70" : "text-ink-muted")}>{count}</span>}
    </Chip>
  );
}

export function SearchBox({ value, onChange, placeholder = "検索", className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={cx("relative ml-auto flex h-8 min-w-40 items-center", className)}>
      <Search className="pointer-events-none absolute left-2.5 size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-full border border-hairline-strong bg-surface pr-3 pl-8 text-sm text-ink placeholder:text-ink-muted"
      />
    </label>
  );
}

/** A small mono tag, for states and token names. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("t-mono inline-flex h-6 items-center rounded-xs bg-surface-sunken px-1.5 text-ink-secondary", className)}>{children}</span>;
}

export function SectionTitle({ id, children, count }: { id: string; children: ReactNode; count?: number }) {
  return (
    <h2 id={id} className="t-h2 flex items-baseline gap-3 text-ink">
      {children}
      {count !== undefined && <span className="t-mono tabular text-ink-muted">{count}</span>}
    </h2>
  );
}

/** One-line note about where the data comes from. */
export function DataNote({ updated, children }: { updated?: string; children: ReactNode }) {
  return (
    <p className="t-caption mt-10 text-ink-muted">
      {children}
      {updated && <> 更新 {updated}。</>}
    </p>
  );
}
