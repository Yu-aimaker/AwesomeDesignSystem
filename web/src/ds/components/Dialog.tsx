import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

// The native <dialog> element gives focus trapping, Escape to close, inert
// background and a top-layer backdrop for free. Enter 300ms ease-out, exit
// 150ms ease-in (exit is faster than enter).
export function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (outside the panel) closes.
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      className={[
        "m-auto w-[calc(100%-32px)] max-w-md rounded-xl border border-hairline bg-surface p-0 text-ink shadow-3",
        "opacity-0 translate-y-2 scale-[0.98]",
        "transition-[opacity,transform,overlay,display] duration-fast ease-in-ds [transition-behavior:allow-discrete]",
        "open:opacity-100 open:translate-y-0 open:scale-100 open:duration-slow open:ease-out-ds",
        "starting:open:opacity-0 starting:open:translate-y-2 starting:open:scale-[0.98]",
        "backdrop:opacity-0 open:backdrop:opacity-100 backdrop:transition-opacity backdrop:duration-slow starting:open:backdrop:opacity-0",
      ].join(" ")}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="t-h3 text-ink">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="t-body-sm mt-1 text-ink-secondary">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="閉じる" className="-mt-1 -mr-2 px-2">
            <X strokeWidth={1.75} />
          </Button>
        </div>
        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </dialog>
  );
}
