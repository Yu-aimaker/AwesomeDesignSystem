import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Calendar } from "./Calendar";
import { cx } from "../cx";
import { useLocale, useT } from "../../i18n/context";
import { localeMeta } from "../../i18n/locales";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
  helper?: string;
  error?: string;
  placeholder?: string;
  min?: Date;
  max?: Date;
  locale?: string;
  disabled?: boolean;
  className?: string;
}

// An input-shaped button that opens the Calendar in a level 2 popover. The value
// is formatted with Intl (2026年9月7日 for ja-JP). Escape and click-outside close,
// focus returns to the button, and a clear button empties the field.
export function DatePicker({ value, onChange, label, helper, error, placeholder: placeholderProp, min, max, locale: localeProp, disabled = false, className }: DatePickerProps) {
  const m = useT(dsMessages);
  const site = useLocale().locale;
  const locale = localeProp ?? localeMeta[site].tag;
  const placeholder = placeholderProp ?? m.selectDate;
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }), [locale]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={root} className={cx("relative flex flex-col gap-1.5", className)}>
      <span id={`${id}-label`} className="t-label text-ink">
        {label}
      </span>
      <div className="relative">
        <button
          ref={button}
          type="button"
          id={id}
          aria-labelledby={`${id}-label ${id}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={cx(
            "flex h-10 w-full items-center gap-2 rounded-md border bg-surface pr-9 pl-3 text-left text-sm",
            "transition-colors duration-instant ease-out-ds hover:border-ink-muted",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-disabled",
            error ? "border-danger" : "border-hairline-strong",
            value ? "text-ink" : "text-ink-muted",
          )}
        >
          <CalendarDays className="size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
          <span className="flex-1 truncate tabular">{value ? fmt.format(value) : placeholder}</span>
        </button>
        {value && !disabled && (
          <button
            type="button"
            aria-label={m.clearDate}
            onClick={() => {
              onChange(null);
              button.current?.focus();
            }}
            className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-ink-muted transition-colors duration-instant hover:bg-surface-sunken hover:text-ink"
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="t-caption text-danger">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="t-caption text-ink-muted">
          {helper}
        </p>
      ) : null}
      {open && (
        <div
          id={`${id}-panel`}
          role="dialog"
          aria-label={label}
          className="absolute top-full left-0 z-10 mt-1 animate-[datepicker-in_var(--ds-duration-fast)_var(--ds-ease-out)]"
        >
          <Calendar
            value={value}
            min={min}
            max={max}
            locale={locale}
            onChange={(d) => {
              onChange(d);
              setOpen(false);
              button.current?.focus();
            }}
            className="shadow-2"
          />
        </div>
      )}
      <style>{`@keyframes datepicker-in { from { opacity: 0; transform: translateY(-4px); } }`}</style>
    </div>
  );
}
