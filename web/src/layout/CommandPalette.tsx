import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search } from "lucide-react";
import { sidebar } from "../lib/nav";
import { cx } from "../ds/cx";

interface Item {
  id: string;
  label: string;
  hint?: string;
  group: string;
  to: string;
}

// Registries and data files are optional at build time: the glob is empty
// until they exist, and a failing import only removes those entries.
const loaders = import.meta.glob(["../ds/registry.tsx", "../demos/registry.tsx", "../ds/data/fonts.json", "../ds/data/palettes.json"]);

async function loadExtra(): Promise<Item[]> {
  const out: Item[] = [];
  for (const [path, load] of Object.entries(loaders)) {
    try {
      const mod = (await load()) as Record<string, unknown>;
      if (path.endsWith("ds/registry.tsx") && Array.isArray(mod.components)) {
        for (const c of mod.components as Array<{ id: string; name: string; caption?: string }>) {
          out.push({ id: `c-${c.id}`, label: c.name, hint: c.caption, group: "コンポーネント", to: `/components#${c.id}` });
        }
      } else if (path.endsWith("demos/registry.tsx") && Array.isArray(mod.demos)) {
        for (const d of mod.demos as Array<{ id: string; name: string; caption?: string }>) {
          out.push({ id: `m-${d.id}`, label: d.name, hint: d.caption, group: "モーション", to: `/motion#${d.id}` });
        }
      } else if (path.endsWith("fonts.json")) {
        const data = (mod.default ?? mod) as { fonts?: Array<{ id: string; name: string; usedBy?: Array<{ name: string }> }> };
        for (const f of data.fonts ?? []) out.push({ id: `f-${f.id}`, label: f.name, hint: f.usedBy?.slice(0, 3).map((u) => u.name).join(", "), group: "フォント", to: `/fonts#${f.id}` });
      } else if (path.endsWith("palettes.json")) {
        const data = (mod.default ?? mod) as { brand?: Array<{ id: string; name: string; accent?: string }> };
        for (const p of data.brand ?? []) out.push({ id: `p-${p.id}`, label: p.name, hint: p.accent, group: "パレット", to: `/palettes#${p.id}` });
      }
    } catch {
      // optional source, skip
    }
  }
  return out;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [extra, setExtra] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      if (extra.length === 0) void loadExtra().then(setExtra);
    }
    if (!open && el.open) el.close();
  }, [open, extra.length]);

  const base: Item[] = useMemo(
    () => sidebar.flatMap((g) => g.items.map((i) => ({ id: `n-${i.to}`, label: i.label, hint: i.hint, group: g.label, to: i.to }))),
    [],
  );

  const items = useMemo(() => {
    const all = [...base, ...extra];
    const needle = q.trim().toLowerCase();
    const list = needle ? all.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(needle)) : all;
    return list.slice(0, 40);
  }, [q, base, extra]);

  const go = (item: Item) => {
    onClose();
    const [path, hash] = item.to.split("#");
    navigate(path);
    if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label="検索"
      className="palette m-0 w-[min(640px,92vw)] max-w-none rounded-xl border border-hairline bg-surface p-0 text-ink shadow-3"
    >
      <div className="flex h-12 items-center gap-3 border-b border-hairline px-4">
        <Search className="size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && items[active]) {
              e.preventDefault();
              go(items[active]);
            }
          }}
          placeholder="ページ、コンポーネント、フォント、パレットを検索"
          aria-label="検索語"
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted"
        />
        <kbd className="t-caption hidden rounded-xs border border-hairline px-1.5 py-0.5 text-ink-muted sm:block">esc</kbd>
      </div>
      <ul role="listbox" aria-label="結果" className="max-h-[60vh] overflow-y-auto p-2">
        {items.length === 0 && <li className="t-body-sm px-3 py-6 text-center text-ink-muted">一致する項目がありません</li>}
        {items.map((item, i) => (
          <li key={item.id} role="option" aria-selected={i === active}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(item)}
              className={cx(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors duration-instant",
                i === active ? "bg-surface-sunken" : "hover:bg-canvas-soft",
              )}
            >
              <span className="t-caption w-24 shrink-0 text-ink-muted">{item.group}</span>
              <span className="t-body-sm min-w-0 flex-1 truncate text-ink">
                {item.label}
                {item.hint && <span className="ml-2 text-ink-muted">{item.hint}</span>}
              </span>
              <ArrowRight className="size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
