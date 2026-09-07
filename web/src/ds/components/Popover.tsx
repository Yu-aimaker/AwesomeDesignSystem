import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "../cx";

export interface PopoverProps {
  trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-controls": string }) => ReactNode;
  children: ReactNode;
  className?: string;
}

// Level 2: hairline plus the popover shadow. Opens below the trigger, moves 4px.
// Closes on Escape and on click outside. Focus is not trapped (this is not a dialog).
export function Popover({ trigger, children, className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  return (
    <div ref={root} className="relative inline-block">
      {trigger({ onClick: () => setOpen((v) => !v), "aria-expanded": open, "aria-controls": id })}
      {open && (
        <div
          id={id}
          role="dialog"
          className={cx(
            "absolute top-full left-0 z-10 mt-2 min-w-56 rounded-lg border border-hairline bg-surface p-4 text-ink shadow-2",
            "animate-[popover-in_var(--ds-duration-fast)_var(--ds-ease-out)]",
            className,
          )}
        >
          {children}
        </div>
      )}
      <style>{`@keyframes popover-in { from { opacity: 0; transform: translateY(-4px); } }`}</style>
    </div>
  );
}
