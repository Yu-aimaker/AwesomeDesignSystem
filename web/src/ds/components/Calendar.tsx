import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../cx";
import { useLocale, useT } from "../../i18n/context";
import { localeMeta } from "../../i18n/locales";
import { dsMessages } from "../../i18n/messages/dsComponents";

export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  /** Month shown first. Defaults to the selected date or today. */
  defaultMonth?: Date;
  min?: Date;
  max?: Date;
  locale?: string;
  /** 0 = Sunday (ja-JP default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  className?: string;
}

export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

// A month grid (role="grid") with roving focus: arrows move a day, PageUp/Down a
// month, Home/End to the week's ends. Labels come from Intl for the given locale,
// so ja-JP reads 2026年9月 and 日 月 火. Today gets an ink ring, the selection an ink fill.
export function Calendar({ value, onChange, defaultMonth, min, max, locale: localeProp, weekStartsOn = 0, className }: CalendarProps) {
  const m = useT(dsMessages);
  const site = useLocale().locale;
  // Without a `locale` prop, follow the site language.
  const locale = localeProp ?? localeMeta[site].tag;
  const id = useId();
  const today = startOfDay(new Date());
  const [month, setMonth] = useState<Date>(() => addMonths(defaultMonth ?? value ?? today, 0));
  const [focused, setFocused] = useState<Date>(() => startOfDay(value ?? today));

  const monthFmt = useMemo(() => new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }), [locale]);
  const weekdayFmt = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const dayFmt = useMemo(() => new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric", weekday: "long" }), [locale]);

  const weekdays = useMemo(() => {
    const base = new Date(2024, 0, 7 + weekStartsOn); // a Sunday (or Monday)
    return Array.from({ length: 7 }, (_, i) => weekdayFmt.format(addDays(base, i)));
  }, [weekdayFmt, weekStartsOn]);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const lead = (first.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(first, -lead);
    const list: Date[] = [];
    for (let i = 0; i < 42; i++) list.push(addDays(start, i));
    // Drop a trailing week that is fully outside the month.
    const lastRow = list.slice(35);
    return lastRow.every((d) => d.getMonth() !== month.getMonth()) ? list.slice(0, 35) : list;
  }, [month, weekStartsOn]);

  const disabled = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || false;

  const moveFocus = (next: Date) => {
    setFocused(next);
    if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) setMonth(addMonths(next, 0));
    requestAnimationFrame(() => {
      document.getElementById(`${id}-${next.toDateString()}`)?.focus();
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const next =
      e.key === "ArrowRight" ? addDays(d, 1)
      : e.key === "ArrowLeft" ? addDays(d, -1)
      : e.key === "ArrowDown" ? addDays(d, 7)
      : e.key === "ArrowUp" ? addDays(d, -7)
      : e.key === "Home" ? addDays(d, -((d.getDay() - weekStartsOn + 7) % 7))
      : e.key === "End" ? addDays(d, 6 - ((d.getDay() - weekStartsOn + 7) % 7))
      : e.key === "PageUp" ? new Date(d.getFullYear(), d.getMonth() - 1, Math.min(d.getDate(), 28))
      : e.key === "PageDown" ? new Date(d.getFullYear(), d.getMonth() + 1, Math.min(d.getDate(), 28))
      : null;
    if (!next) return;
    e.preventDefault();
    moveFocus(next);
  };

  const inMonth = cells.filter((d) => d.getMonth() === month.getMonth());
  const focusTarget = inMonth.find((d) => sameDay(d, focused)) ?? inMonth.find((d) => sameDay(d, value)) ?? inMonth.find((d) => sameDay(d, today)) ?? inMonth[0];

  return (
    <div className={cx("inline-block w-72 rounded-lg border border-hairline bg-surface p-3 text-ink", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={m.previousMonth}
          onClick={() => setMonth(addMonths(month, -1))}
          className="flex size-8 items-center justify-center rounded-md text-ink-secondary transition-colors duration-instant hover:bg-surface-sunken hover:text-ink"
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
        <p id={`${id}-month`} aria-live="polite" className="t-label tabular text-ink">
          {monthFmt.format(month)}
        </p>
        <button
          type="button"
          aria-label={m.nextMonth}
          onClick={() => setMonth(addMonths(month, 1))}
          className="flex size-8 items-center justify-center rounded-md text-ink-secondary transition-colors duration-instant hover:bg-surface-sunken hover:text-ink"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <table role="grid" aria-labelledby={`${id}-month`} className="mt-2 w-full border-separate border-spacing-0.5 text-sm tabular">
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w} scope="col" abbr={w} className="t-caption h-7 font-medium text-ink-muted">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, r) => (
            <tr key={r}>
              {cells.slice(r * 7, r * 7 + 7).map((d) => {
                const outside = d.getMonth() !== month.getMonth();
                const selected = sameDay(d, value);
                const isToday = sameDay(d, today);
                const off = disabled(d);
                return (
                  <td key={d.toDateString()} role="gridcell" aria-selected={selected || undefined} className="p-0">
                    <button
                      type="button"
                      id={`${id}-${d.toDateString()}`}
                      tabIndex={sameDay(d, focusTarget) ? 0 : -1}
                      disabled={off}
                      aria-label={dayFmt.format(d)}
                      aria-current={isToday ? "date" : undefined}
                      aria-pressed={selected}
                      onClick={() => {
                        setFocused(d);
                        if (outside) setMonth(addMonths(d, 0));
                        onChange?.(d);
                      }}
                      onKeyDown={(e) => onKeyDown(e, d)}
                      className={cx(
                        "flex size-9 w-full items-center justify-center rounded-md transition-colors duration-instant ease-out-ds",
                        selected ? "bg-primary font-medium text-on-primary" : "hover:bg-surface-sunken",
                        !selected && outside && "text-ink-muted",
                        !selected && !outside && "text-ink",
                        isToday && !selected && "ring-1 ring-inset ring-hairline-strong",
                        off && "cursor-not-allowed text-ink-disabled hover:bg-transparent",
                      )}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
