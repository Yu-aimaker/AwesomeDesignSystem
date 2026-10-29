import { type ReactNode } from "react";
import { Search } from "lucide-react";
import { Chip } from "../ds/components/Chip";
import { cx } from "../ds/cx";
import { useT } from "../i18n/context";
import { shellMessages } from "../i18n/messages/shell";

/**
 * Shared chrome for the gallery pages (fonts, palettes, components, motion,
 * stack, rankings): a headline with one big number, a sticky filter row and
 * small helpers. Text stays at one line each; the visuals carry the page.
 */

export function GalleryHeader({ title, lead, stat, statLabel, children }: { title: string; lead: string; stat?: number | string; statLabel?: string; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end gap-x-10 gap-y-4 lg:mb-10">
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
    <div className={cx("sticky top-16 z-30 -mx-5 flex flex-wrap items-center gap-2 border-b border-hairline bg-canvas px-5 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8", className)}>{children}</div>
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

export function SearchBox({ value, onChange, placeholder: placeholderProp, className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  const t = useT(shellMessages);
  const placeholder = placeholderProp ?? t.searchShort;
  return (
    <label className={cx("relative ml-auto flex h-8 min-w-0 pointer-coarse:h-11 w-full items-center sm:w-auto sm:min-w-40", className)}>
      <Search className="pointer-events-none absolute left-2.5 size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-full border border-hairline-strong bg-surface pr-3 pl-8 text-sm text-ink placeholder:text-ink-muted pointer-coarse:h-11 pointer-coarse:text-base"
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
  const t = useT(shellMessages);
  return (
    <p className="t-caption mt-10 measure text-ink-muted">
      {children}
      {updated && <> {t.updated(updated)}</>}
    </p>
  );
}
