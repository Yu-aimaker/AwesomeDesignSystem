import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  placeholder?: string;
  helper?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

// A filterable listbox (APG combobox, list autocomplete). Typing filters; Down
// and Up move the active option (aria-activedescendant), Enter picks, Escape
// closes and restores the label. Use this over Select when the list needs search.
export function Combobox({ options, value, onChange, label, placeholder: placeholderProp, helper, emptyText: emptyTextProp, disabled = false, className }: ComboboxProps) {
  const m = useT(dsMessages);
  const placeholder = placeholderProp ?? m.comboboxPlaceholder;
  const emptyText = emptyTextProp ?? m.noMatches;
  const id = useId();
  const selected = options.find((o) => o.value === value) ?? null;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) setQuery(selected?.label ?? "");
  }, [selected, open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q && q !== selected?.label.toLowerCase() ? options.filter((o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q)) : options;
    return list;
  }, [options, query, selected]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    const idx = filtered.findIndex((o) => o.value === value);
    setActive(idx >= 0 ? idx : 0);
  };

  const pick = (o: ComboboxOption) => {
    if (o.disabled) return;
    onChange(o.value);
    setQuery(o.label);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return openList();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActive(filtered.length - 1);
    } else if (e.key === "Enter") {
      if (open && filtered[active]) {
        e.preventDefault();
        pick(filtered[active]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setQuery(selected?.label ?? "");
      } else if (query) {
        setQuery("");
        onChange(null);
      }
    }
  };

  const listId = `${id}-list`;
  const activeId = open && filtered[active] ? `${id}-opt-${filtered[active].value}` : undefined;

  return (
    <div ref={root} className={cx("relative flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="t-label text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-describedby={helper ? `${id}-helper` : undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            if (!open) setOpen(true);
            if (e.target.value === "") onChange(null);
          }}
          onFocus={openList}
          onClick={openList}
          onKeyDown={onKeyDown}
          className={cx(
            "h-10 w-full rounded-md border border-hairline-strong bg-surface pr-9 pl-3 text-sm text-ink pointer-coarse:text-base",
            "transition-colors duration-instant ease-out-ds hover:border-ink-muted",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-disabled",
          )}
        />
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className={cx("pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted transition-transform duration-fast ease-out-ds", open && "rotate-180")}
        />
      </div>
      {helper && (
        <p id={`${id}-helper`} className="t-caption text-ink-muted">
          {helper}
        </p>
      )}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className={cx(
            "absolute top-full left-0 z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-hairline bg-surface p-1 shadow-2",
            "animate-[combobox-in_var(--ds-duration-fast)_var(--ds-ease-out)]",
          )}
        >
          {filtered.length === 0 && <li className="t-body-sm px-3 py-2 text-ink-muted">{emptyText}</li>}
          {filtered.map((o, i) => {
            const isActive = i === active;
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${o.value}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled || undefined}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(o)}
                className={cx(
                  "flex min-h-9 cursor-pointer items-center gap-2 rounded-md px-2 text-sm text-ink transition-colors duration-instant",
                  isActive && "bg-surface-sunken",
                  o.disabled && "cursor-not-allowed text-ink-disabled",
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col py-1.5">
                  <span className="truncate">{o.label}</span>
                  {o.description && <span className="t-caption truncate text-ink-muted">{o.description}</span>}
                </span>
                {isSelected && <Check className="size-4 shrink-0 text-ink" strokeWidth={2} aria-hidden />}
              </li>
            );
          })}
        </ul>
      )}
      <style>{`@keyframes combobox-in { from { opacity: 0; transform: translateY(-4px); } }`}</style>
    </div>
  );
}
