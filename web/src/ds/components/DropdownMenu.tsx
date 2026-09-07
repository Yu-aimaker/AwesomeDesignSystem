import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../cx";

export type MenuItem =
  | {
      id: string;
      label: string;
      icon?: ReactNode;
      shortcut?: string;
      danger?: boolean;
      disabled?: boolean;
      onSelect?: () => void;
    }
  | { type: "separator"; id: string };

export interface DropdownMenuProps {
  trigger: (props: { onClick: () => void; onKeyDown: (e: KeyboardEvent) => void; "aria-haspopup": "menu"; "aria-expanded": boolean; "aria-controls": string; id: string }) => ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  className?: string;
}

// A click-open menu (never hover). Level 2 surface, 4px padding, 32px items.
// Arrows move focus, Home/End jump, typing a letter jumps to a matching item,
// Escape and click-outside close and return focus to the trigger. Destructive
// items sit last in danger.
export function DropdownMenu({ trigger, items, align = "start", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const actionable = items.map((it, i) => ("type" in it || it.disabled ? -1 : i)).filter((i) => i >= 0);

  const focusTrigger = () => root.current?.querySelector<HTMLElement>(`#${CSS.escape(`${id}-trigger`)}`)?.focus();

  const openMenu = (focusIndex: "first" | "last" = "first") => {
    setOpen(true);
    requestAnimationFrame(() => {
      const idx = focusIndex === "first" ? actionable[0] : actionable[actionable.length - 1];
      itemRefs.current[idx]?.focus();
    });
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) focusTrigger();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu("first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu("last");
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    const pos = actionable.indexOf(current);
    const last = actionable.length - 1;
    let next: number | undefined;
    if (e.key === "ArrowDown") next = actionable[pos === last || pos === -1 ? 0 : pos + 1];
    else if (e.key === "ArrowUp") next = actionable[pos <= 0 ? last : pos - 1];
    else if (e.key === "Home") next = actionable[0];
    else if (e.key === "End") next = actionable[last];
    else if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    } else if (e.key === "Tab") {
      setOpen(false);
      return;
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      const q = e.key.toLowerCase();
      const order = [...actionable.slice(pos + 1), ...actionable.slice(0, pos + 1)];
      next = order.find((i) => {
        const it = items[i];
        return !("type" in it) && it.label.toLowerCase().startsWith(q);
      });
    }
    if (next === undefined) return;
    e.preventDefault();
    itemRefs.current[next]?.focus();
  };

  return (
    <div ref={root} className={cx("relative inline-block", className)}>
      {trigger({
        id: `${id}-trigger`,
        onClick: () => (open ? close(false) : openMenu()),
        onKeyDown: onTriggerKeyDown,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": `${id}-menu`,
      })}
      {open && (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-trigger`}
          onKeyDown={onMenuKeyDown}
          className={cx(
            "absolute top-full z-10 mt-2 min-w-48 rounded-lg border border-hairline bg-surface p-1 text-ink shadow-2",
            align === "end" ? "right-0" : "left-0",
            "animate-[menu-in_var(--ds-duration-fast)_var(--ds-ease-out)]",
          )}
        >
          {items.map((it, i) => {
            if ("type" in it) return <div key={it.id} role="separator" className="my-1 h-px bg-hairline" />;
            return (
              <button
                key={it.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={it.disabled}
                onClick={() => {
                  it.onSelect?.();
                  close();
                }}
                className={cx(
                  "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm whitespace-nowrap",
                  "transition-colors duration-instant ease-out-ds",
                  "hover:bg-surface-sunken focus-visible:bg-surface-sunken",
                  "disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent",
                  it.danger ? "text-danger" : "text-ink",
                  "[&_svg]:size-4 [&_svg]:shrink-0",
                )}
              >
                <span className={cx("flex size-4 items-center justify-center", !it.danger && "text-ink-secondary")}>{it.icon}</span>
                <span className="flex-1">{it.label}</span>
                {it.shortcut && <span className="t-caption font-mono text-ink-muted">{it.shortcut}</span>}
              </button>
            );
          })}
        </div>
      )}
      <style>{`@keyframes menu-in { from { opacity: 0; transform: translateY(-4px); } }`}</style>
    </div>
  );
}
