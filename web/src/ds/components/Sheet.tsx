import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cx } from "../cx";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: "right" | "bottom";
  children?: ReactNode;
  footer?: ReactNode;
}

// A side panel on the native <dialog>: focus trap, Escape, inert background and a
// top-layer backdrop come free. It slides 8px (never from off-screen), 300ms
// ease-out in, 150ms ease-in out. Right: 480px wide, full height, radius on the
// inner edge only. Bottom: full width with a 16px top radius (mobile default).
export function Sheet({ open, onClose, title, description, side = "right", children, footer }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const right = side === "right";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="sheet-title"
      aria-describedby={description ? "sheet-description" : undefined}
      className={cx(
        "fixed m-0 flex max-h-none flex-col border-hairline bg-surface p-0 text-ink shadow-3",
        right
          ? "top-0 right-0 bottom-0 left-auto h-dvh w-[min(480px,100vw-32px)] max-w-none rounded-l-xl border-l translate-x-2"
          : "top-auto right-0 bottom-0 left-0 max-h-[85dvh] w-full max-w-none rounded-t-xl border-t translate-y-2",
        "opacity-0 transition-[opacity,transform,overlay,display] duration-fast ease-in-ds [transition-behavior:allow-discrete]",
        "open:translate-x-0 open:translate-y-0 open:opacity-100 open:duration-slow open:ease-out-ds",
        right ? "starting:open:translate-x-2" : "starting:open:translate-y-2",
        "starting:open:opacity-0",
        "backdrop:opacity-0 open:backdrop:opacity-100 backdrop:transition-opacity backdrop:duration-slow starting:open:backdrop:opacity-0",
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5">
        <div className="min-w-0">
          <h2 id="sheet-title" className="t-h3 text-ink">
            {title}
          </h2>
          {description && (
            <p id="sheet-description" className="t-body-sm mt-1 text-ink-secondary">
              {description}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="閉じる" className="-mt-1 -mr-2 px-2">
          <X strokeWidth={1.75} />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-hairline px-6 py-4">{footer}</footer>}
    </dialog>
  );
}
