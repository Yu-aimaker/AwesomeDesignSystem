import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { cx } from "../cx";
import { useT } from "../../i18n/context";
import { dsMessages } from "../../i18n/messages/dsComponents";

export type ToastTone = "neutral" | "success" | "danger";
export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (t: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const icons: Record<ToastTone, typeof Info> = { neutral: Info, success: CheckCircle2, danger: CircleAlert };
const tones: Record<ToastTone, string> = { neutral: "text-ink-secondary", success: "text-success", danger: "text-danger" };

// Toasts live in a polite live region, dismiss after 5 seconds, and use level 2
// elevation. They enter from 8px below with ease-out and leave with opacity only.
export function ToastProvider({ children }: { children: ReactNode }) {
  const m = useT(dsMessages);
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = Date.now() + Math.random();
      setItems((list) => [...list, { ...t, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[calc(100%-32px)] max-w-sm flex-col gap-2">
        {items.map((t) => {
          const Icon = icons[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className={cx(
                "pointer-events-auto flex items-start gap-3 rounded-lg border border-hairline bg-surface p-4 text-ink shadow-2",
                "animate-[toast-in_var(--ds-duration-base)_var(--ds-ease-out)]",
              )}
            >
              <Icon aria-hidden strokeWidth={1.75} className={cx("mt-0.5 size-5 shrink-0", tones[t.tone])} />
              <div className="min-w-0 flex-1">
                <p className="t-label text-ink">{t.title}</p>
                {t.description && <p className="t-caption mt-1 text-ink-secondary">{t.description}</p>}
              </div>
              <button type="button" onClick={() => dismiss(t.id)} aria-label={m.close} className="-m-1 rounded-sm p-1 text-ink-muted hover:text-ink">
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(8px); } }`}</style>
    </ToastContext.Provider>
  );
}
