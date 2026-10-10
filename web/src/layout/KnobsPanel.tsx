import { Check, RotateCcw } from "lucide-react";
import { accents, densities, fonts, radii, useKnobs } from "../lib/knobs";
import { cx } from "../ds/cx";
import { useLocale, useT } from "../i18n/context";
import { shellMessages } from "../i18n/messages/shell";

/**
 * The live controls for accent, radius, font pairing and density.
 * `layout="bar"` lays the groups out in a row for the home page,
 * `layout="stack"` stacks them for the header popover.
 */
export function KnobsPanel({ layout = "stack", className }: { layout?: "bar" | "stack"; className?: string }) {
  const { knobs, set, reset, isDefault } = useKnobs();
  const t = useT(shellMessages);
  const { locale } = useLocale();
  const group = "flex flex-col gap-2";
  return (
    <div className={cx(layout === "bar" ? "flex flex-wrap items-start gap-x-8 gap-y-6" : "flex flex-col gap-5", className)}>
      <div className={group}>
        <span className="t-caption text-ink-muted">{t.accent}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.accent}>
          {accents.map((a) => {
            const on = knobs.accent === a.id;
            return (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={a.label[locale]}
                title={a.label[locale]}
                onClick={() => set("accent", a.id)}
                data-accent-chip={a.id}
                className={cx(
                  "flex size-8 items-center justify-center rounded-full border transition-transform duration-fast ease-out-ds hover:scale-105 active:scale-95",
                  on ? "border-ink" : "border-hairline",
                )}
              >
                {on && <Check className="size-4" strokeWidth={2.5} aria-hidden style={{ color: "var(--ds-canvas)" }} />}
              </button>
            );
          })}
          {knobs.accent === "custom" && knobs.custom && (
            <span
              role="radio"
              aria-checked
              aria-label={knobs.custom.label}
              title={knobs.custom.label}
              className="flex size-8 items-center justify-center rounded-full border border-ink"
              style={{ background: "var(--ds-accent)" }}
            >
              <Check className="size-4" strokeWidth={2.5} aria-hidden style={{ color: "var(--ds-canvas)" }} />
            </span>
          )}
        </div>
        {knobs.accent === "custom" && knobs.custom && <span className="t-caption text-ink-secondary">{t.customAccent(knobs.custom.label)}</span>}
      </div>

      <div className={group}>
        <span className="t-caption text-ink-muted">{t.radius}</span>
        <div className="inline-flex rounded-md border border-hairline-strong bg-surface p-0.5" role="radiogroup" aria-label={t.radius}>
          {radii.map((r) => {
            const on = knobs.radius === r.id;
            return (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={on}
                title={r.px}
                onClick={() => set("radius", r.id)}
                className={cx("t-label h-7 rounded-sm px-3 transition-colors duration-instant", on ? "bg-primary text-on-primary" : "text-ink-secondary hover:text-ink")}
              >
                {r.label[locale]}
              </button>
            );
          })}
        </div>
      </div>

      <div className={group}>
        <span className="t-caption text-ink-muted">{t.font}</span>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t.font}>
          {fonts.map((f) => {
            const on = knobs.font === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={on}
                title={f.sample[locale]}
                onClick={() => set("font", f.id)}
                className={cx(
                  "h-8 rounded-full border px-3 text-sm transition-colors duration-instant",
                  on ? "border-ink bg-primary text-on-primary" : "border-hairline-strong text-ink-secondary hover:text-ink",
                )}
              >
                {f.label[locale]}
              </button>
            );
          })}
        </div>
      </div>

      <div className={group}>
        <span className="t-caption text-ink-muted">{t.density}</span>
        <div className="inline-flex rounded-md border border-hairline-strong bg-surface p-0.5" role="radiogroup" aria-label={t.density}>
          {densities.map((d) => {
            const on = knobs.density === d.id;
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={on}
                title={d.note[locale]}
                onClick={() => set("density", d.id)}
                className={cx("t-label h-7 rounded-sm px-3 transition-colors duration-instant", on ? "bg-primary text-on-primary" : "text-ink-secondary hover:text-ink")}
              >
                {d.label[locale]}
              </button>
            );
          })}
        </div>
      </div>

      <div className={cx("flex", layout === "bar" ? "ml-auto self-end" : "")}>
        <button
          type="button"
          onClick={reset}
          disabled={isDefault}
          className="t-caption inline-flex h-8 items-center gap-1 rounded-md px-2 whitespace-nowrap text-ink-secondary transition-colors duration-instant hover:bg-surface-sunken hover:text-ink disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden />
          {t.resetKnobs}
        </button>
      </div>
    </div>
  );
}
