import { useId, useMemo, useState, type ReactNode } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { cx } from "../ds/cx";

/**
 * Playground: a live demo on the left, controls on the right, generated code below.
 *
 * Controls describe the state; `children` renders the demo from that state and
 * `code` (optional) turns the state into the snippet shown in the code tab.
 *
 * <Playground
 *   id="button"
 *   title="Button"
 *   caption="1 画面に primary は 1 つ。"
 *   controls={[
 *     { type: "select", key: "variant", label: "variant", options: ["primary", "secondary", "ghost"] },
 *     { type: "range", key: "count", label: "個数", min: 1, max: 4, step: 1 },
 *     { type: "toggle", key: "loading", label: "loading" },
 *   ]}
 *   initial={{ variant: "primary", count: 1, loading: false }}
 *   code={(s) => `<Button variant="${s.variant}" />`}
 * >
 *   {(s) => <Button variant={s.variant} loading={s.loading}>保存</Button>}
 * </Playground>
 */

export type ControlValue = string | number | boolean;
export type PlaygroundState = Record<string, ControlValue>;

export type Control =
  | { type: "range"; key: string; label: string; min: number; max: number; step?: number; unit?: string }
  | { type: "select"; key: string; label: string; options: readonly string[] }
  | { type: "toggle"; key: string; label: string };

export interface PlaygroundProps<S extends PlaygroundState> {
  id?: string;
  title: string;
  /** One line, at most 12 words. Longer explanations belong in the repository. */
  caption?: ReactNode;
  controls?: Control[];
  initial: S;
  code?: (state: S) => string;
  children: (state: S) => ReactNode;
  /** Tailwind classes for the demo pane, e.g. a fixed height. */
  paneClassName?: string;
  /** Optional links shown under the demo (docs, npm, source). */
  links?: Array<{ label: string; href: string }>;
  /** Full implementation, shown in a third tab. */
  source?: string;
  /** Extra footer content (states, tokens). */
  footer?: ReactNode;
  className?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard unavailable
        }
      }}
      className="t-caption inline-flex h-7 items-center gap-1 rounded-sm px-2 text-ink-secondary transition-colors duration-instant hover:bg-surface-sunken hover:text-ink"
    >
      {copied ? <Check className="size-3.5" strokeWidth={1.75} aria-hidden /> : <Copy className="size-3.5" strokeWidth={1.75} aria-hidden />}
      {copied ? "コピーしました" : "コピー"}
    </button>
  );
}

type Tab = "demo" | "code" | "source";
const tabLabel: Record<Tab, string> = { demo: "実物", code: "コード", source: "実装" };

export function Playground<S extends PlaygroundState>({ id, title, caption, controls = [], initial, code, children, paneClassName, links, source, footer, className }: PlaygroundProps<S>) {
  const [state, setState] = useState<S>(initial);
  const [tab, setTab] = useState<Tab>("demo");
  const tabs: Tab[] = ["demo", ...(code ? (["code"] as Tab[]) : []), ...(source ? (["source"] as Tab[]) : [])];
  const base = useId();
  const snippet = useMemo(() => (code ? code(state) : ""), [code, state]);
  const set = (key: string, value: ControlValue) => setState((s) => ({ ...s, [key]: value }));
  const dirty = JSON.stringify(state) !== JSON.stringify(initial);

  return (
    <article id={id} className={cx("scroll-mt-20 overflow-hidden rounded-lg border border-hairline bg-surface", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline px-5 py-4">
        <div className="min-w-0">
          <h3 className="t-h4 text-ink">{title}</h3>
          {caption && <p className="t-body-sm mt-0.5 text-ink-secondary">{caption}</p>}
        </div>
        {tabs.length > 1 && (
          <div role="tablist" aria-label={`${title} の表示`} className="flex shrink-0 gap-1 rounded-md bg-surface-sunken p-0.5">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                id={`${base}-${t}`}
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cx("t-label h-7 rounded-sm px-3 transition-colors duration-instant ease-out-ds", tab === t ? "bg-surface text-ink shadow-2" : "text-ink-secondary hover:text-ink")}
              >
                {tabLabel[t]}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className={cx("grid", controls.length > 0 && "lg:grid-cols-[minmax(0,1fr)_240px]")}>
        <div role="tabpanel" aria-labelledby={`${base}-${tab}`} className="min-w-0">
          {tab === "demo" ? (
            <div className={cx("flex min-h-56 items-center justify-center overflow-x-auto p-6 sm:p-8", paneClassName)}>{children(state)}</div>
          ) : (
            <div>
              <div className="flex justify-end border-b border-hairline bg-canvas-soft px-2 py-1">
                <CopyButton text={tab === "code" ? snippet : source ?? ""} />
              </div>
              <div className="code-pane">
                <pre>
                  <code>{tab === "code" ? snippet : source}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {controls.length > 0 && (
          <aside aria-label="コントロール" className="flex flex-col gap-4 border-t border-hairline bg-canvas-soft p-5 lg:border-t-0 lg:border-l">
            {controls.map((c) => {
              const cid = `${base}-${c.key}`;
              const v = state[c.key];
              if (c.type === "range") {
                return (
                  <label key={c.key} htmlFor={cid} className="flex flex-col gap-1.5">
                    <span className="flex items-baseline justify-between">
                      <span className="t-label text-ink">{c.label}</span>
                      <span className="t-mono tabular text-ink-secondary">
                        {String(v)}
                        {c.unit ?? ""}
                      </span>
                    </span>
                    <input
                      id={cid}
                      type="range"
                      min={c.min}
                      max={c.max}
                      step={c.step ?? 1}
                      value={Number(v)}
                      onChange={(e) => set(c.key, Number(e.target.value))}
                      className="accent-accent h-6 w-full"
                    />
                  </label>
                );
              }
              if (c.type === "select") {
                return (
                  <label key={c.key} htmlFor={cid} className="flex flex-col gap-1.5">
                    <span className="t-label text-ink">{c.label}</span>
                    <select
                      id={cid}
                      value={String(v)}
                      onChange={(e) => set(c.key, e.target.value)}
                      className="h-9 rounded-md border border-hairline-strong bg-surface px-2 text-sm text-ink"
                    >
                      {c.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              }
              return (
                <label key={c.key} htmlFor={cid} className="flex items-center justify-between gap-3">
                  <span className="t-label text-ink">{c.label}</span>
                  <button
                    id={cid}
                    type="button"
                    role="switch"
                    aria-checked={Boolean(v)}
                    onClick={() => set(c.key, !v)}
                    className={cx(
                      "relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-fast ease-out-ds",
                      v ? "border-primary bg-primary" : "border-hairline-strong bg-surface-sunken",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cx(
                        "absolute top-0.5 left-0.5 size-[18px] rounded-full bg-surface shadow-2 transition-transform duration-fast ease-out-ds",
                        Boolean(v) && "translate-x-4 bg-on-primary",
                      )}
                    />
                  </button>
                </label>
              );
            })}
            {dirty && (
              <button
                type="button"
                onClick={() => setState(initial)}
                className="t-caption mt-auto inline-flex items-center gap-1 self-start text-ink-secondary hover:text-ink"
              >
                <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden />
                初期値に戻す
              </button>
            )}
          </aside>
        )}
      </div>

      {((links && links.length > 0) || footer) && (
        <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline px-5 py-3">
          {footer}
          {links && links.length > 0 && (
            <span className="ml-auto flex flex-wrap gap-x-4 gap-y-1">
              {links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="t-caption">
                  {l.label}
                </a>
              ))}
            </span>
          )}
        </footer>
      )}
    </article>
  );
}

/** Full-width visual block with a one-line caption. */
export function Specimen({ caption, children, className, id }: { caption?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <figure id={id} className={cx("scroll-mt-20", className)}>
      <div className="overflow-hidden rounded-lg border border-hairline bg-surface">{children}</div>
      {caption && <figcaption className="t-caption mt-2 text-ink-secondary">{caption}</figcaption>}
    </figure>
  );
}

/** Two panes side by side: what to do and what to avoid. */
export function Compare({ good, bad, goodLabel = "採用", badLabel = "避ける", className }: { good: ReactNode; bad: ReactNode; goodLabel?: string; badLabel?: string; className?: string }) {
  return (
    <div className={cx("grid gap-4 md:grid-cols-2", className)}>
      <div className="rounded-lg border border-hairline bg-surface p-6">
        <p className="t-label mb-4 text-ink">{goodLabel}</p>
        {good}
      </div>
      <div className="rounded-lg border border-dashed border-hairline-strong bg-canvas-soft p-6">
        <p className="t-label mb-4 text-ink-muted">{badLabel}</p>
        {bad}
      </div>
    </div>
  );
}

/** Responsive tile wall for galleries. */
export function Wall({ children, min = 240, className }: { children: ReactNode; min?: number; className?: string }) {
  return (
    <div className={cx("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))` }}>
      {children}
    </div>
  );
}
