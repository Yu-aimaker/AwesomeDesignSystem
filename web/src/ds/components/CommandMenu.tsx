import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Kbd } from "./Kbd";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface CommandItem {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Extra words that match a search but are not shown. */
  keywords?: string[];
  shortcut?: string[];
  onSelect?: () => void;
}

export interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

export interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyText?: string;
}

/** Binds Cmd/Ctrl+K to toggle. Returns [open, setOpen]. */
export function useCommandMenu(initial = false): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState(initial);
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return [open, setOpen];
}

// cmdk shape on a native <dialog>: 48px input, 12px group labels, 40px items,
// level 3 elevation, max width 640, anchored at 20% from the top. Arrows move the
// active item across groups, Enter runs it, Escape closes. Every command here must
// also exist in the visible UI; this is an accelerator, not the only route.
export function CommandMenu({ open, onClose, groups, placeholder: placeholderProp, emptyText: emptyTextProp }: CommandMenuProps) {
  const m = useT(dsMessages);
  const placeholder = placeholderProp ?? m.commandPlaceholder;
  const emptyText = emptyTextProp ?? m.noResults;
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!open && el.open) el.close();
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, items: g.items.filter((it) => it.label.toLowerCase().includes(q) || it.keywords?.some((k) => k.toLowerCase().includes(q))) }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (item: CommandItem) => {
    item.onSelect?.();
    onClose();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (flat.length ? (a + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(0, flat.length - 1));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      run(flat[active]);
    }
  };

  let index = -1;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={m.commandMenu}
      className={cx(
        "fixed top-[20vh] mx-auto w-[calc(100%-32px)] max-w-2xl overflow-hidden rounded-xl border border-hairline bg-surface p-0 text-ink shadow-3",
        "opacity-0 translate-y-2 scale-[0.98]",
        "transition-[opacity,transform,overlay,display] duration-fast ease-in-ds [transition-behavior:allow-discrete]",
        "open:opacity-100 open:translate-y-0 open:scale-100 open:duration-base open:ease-out-ds",
        "starting:open:opacity-0 starting:open:translate-y-2 starting:open:scale-[0.98]",
        "backdrop:opacity-0 open:backdrop:opacity-100 backdrop:transition-opacity backdrop:duration-base starting:open:backdrop:opacity-0",
      )}
    >
      <div className="flex h-12 items-center gap-3 border-b border-hairline px-4">
        <Search className="size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded
          aria-controls={`${id}-list`}
          aria-activedescendant={flat[active] ? `${id}-${flat[active].id}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="h-full flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
        <Kbd>Esc</Kbd>
      </div>
      <div ref={listRef} id={`${id}-list`} role="listbox" aria-label={m.results} className="max-h-[min(60vh,360px)] overflow-y-auto p-2">
        {flat.length === 0 && <p className="t-body-sm px-3 py-8 text-center text-ink-muted">{emptyText}</p>}
        {filtered.map((g) => (
          <div key={g.heading} role="group" aria-label={g.heading} className="mb-1 last:mb-0">
            <p className="t-caption px-2 pt-2 pb-1 font-medium text-ink-muted">{g.heading}</p>
            {g.items.map((it) => {
              index += 1;
              const i = index;
              const isActive = i === active;
              return (
                <div
                  key={it.id}
                  id={`${id}-${it.id}`}
                  role="option"
                  aria-selected={isActive}
                  data-index={i}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => run(it)}
                  className={cx(
                    "flex h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-ink transition-colors duration-instant",
                    isActive && "bg-surface-sunken",
                    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-secondary",
                  )}
                >
                  {it.icon ?? <span className="size-4" aria-hidden />}
                  <span className="flex-1 truncate">{it.label}</span>
                  {it.shortcut && <Kbd keys={it.shortcut} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <footer className="flex items-center gap-4 border-t border-hairline bg-canvas-soft px-4 py-2 text-ink-muted">
        <span className="t-caption inline-flex items-center gap-1.5">
          <Kbd keys={["↑", "↓"]} /> {m.move}
        </span>
        <span className="t-caption inline-flex items-center gap-1.5">
          <Kbd>↵</Kbd> {m.run}
        </span>
      </footer>
    </dialog>
  );
}
