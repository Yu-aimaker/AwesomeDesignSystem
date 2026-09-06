import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../cx";

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

// WAI-ARIA tabs with roving tabindex: Left/Right/Home/End move the active tab.
// The indicator is a 2px ink underline; the accent is not used for selection here
// because selection already reads from weight and position.
export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (id: string, focusIndex?: number) => {
    setActive(id);
    onChange?.(id);
    if (focusIndex !== undefined) refs.current[focusIndex]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    select(tabs[next].id, next);
  };

  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 border-b border-hairline">
        {tabs.map((t, i) => {
          const selected = t.id === current?.id;
          return (
            <button
              key={t.id}
              ref={(el) => { refs.current[i] = el; }}
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                "-mb-px h-10 rounded-t-md px-3 text-sm transition-colors duration-instant ease-out-ds",
                selected ? "border-b-2 border-ink font-medium text-ink" : "border-b-2 border-transparent text-ink-secondary hover:text-ink",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {current && (
        <div role="tabpanel" id={`${base}-panel-${current.id}`} aria-labelledby={`${base}-tab-${current.id}`} tabIndex={0} className="pt-4">
          {current.content}
        </div>
      )}
    </div>
  );
}
