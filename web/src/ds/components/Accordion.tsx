import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../cx";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** single: one open at a time. multiple: any number. */
  type?: "single" | "multiple";
  defaultOpen?: string[];
  /** In single mode, allow closing the open item. */
  collapsible?: boolean;
  onChange?: (open: string[]) => void;
  className?: string;
}

// Headers are real buttons inside headings; Up/Down/Home/End move between them.
// The panel animates height with the grid-template-rows 0fr to 1fr trick, so the
// content is measured by the browser and the motion stays 200ms ease-out.
export function Accordion({ items, type = "single", defaultOpen = [], collapsible = true, onChange, className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (id: string) => {
    const isOpen = open.includes(id);
    let next: string[];
    if (type === "single") next = isOpen ? (collapsible ? [] : open) : [id];
    else next = isOpen ? open.filter((x) => x !== id) : [...open, id];
    setOpen(next);
    onChange?.(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabled.indexOf(index);
    const last = enabled.length - 1;
    const target =
      e.key === "ArrowDown" ? enabled[pos === last ? 0 : pos + 1]
      : e.key === "ArrowUp" ? enabled[pos === 0 ? last : pos - 1]
      : e.key === "Home" ? enabled[0]
      : e.key === "End" ? enabled[last]
      : undefined;
    if (target === undefined) return;
    e.preventDefault();
    refs.current[target]?.focus();
  };

  return (
    <div className={cx("divide-y divide-hairline rounded-lg border border-hairline bg-surface", className)}>
      {items.map((item, i) => {
        const expanded = open.includes(item.id);
        const headerId = `${base}-${item.id}-h`;
        const panelId = `${base}-${item.id}-p`;
        return (
          <div key={item.id}>
            <h3 className="m-0">
              <button
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                id={headerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cx(
                  "flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-ink",
                  "transition-colors duration-instant ease-out-ds hover:bg-canvas-soft",
                  "disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent",
                  i === 0 && "rounded-t-lg",
                  i === items.length - 1 && !expanded && "rounded-b-lg",
                )}
              >
                {item.title}
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.75}
                  className={cx("size-4 shrink-0 text-ink-muted transition-transform duration-base ease-out-ds", expanded && "rotate-180")}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={cx("grid transition-[grid-template-rows] duration-base ease-out-ds", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <div className={cx("t-body-sm px-4 pb-4 text-ink-secondary transition-opacity duration-fast ease-out-ds", expanded ? "opacity-100" : "opacity-0")}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
