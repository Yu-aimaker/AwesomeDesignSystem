import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "../i18n/router";
import { useLocale, useT } from "../i18n/context";
import { shellMessages, type ShellMessages } from "../i18n/messages/shell";
import type { Locale } from "../i18n/locales";
import { ArrowRight, Search } from "lucide-react";
import { sidebar } from "../lib/nav";
import { Kbd } from "../ds/components/Kbd";
import { cx } from "../ds/cx";

interface Item {
  id: string;
  label: string;
  hint?: string;
  group: string;
  to: string;
  /** Other names that match like the label (Japanese names for English component ids). */
  aliases?: string;
}

interface Group {
  name: string;
  items: Item[];
}

const MAX_RESULTS = 50;

// Component names stay in English on the site; these let a Japanese query find them.
const componentAliases: Record<string, string> = {
  button: "ボタン", "dropdown-menu": "ドロップダウン メニュー", input: "入力欄 テキストフィールド", textarea: "テキストエリア 複数行",
  select: "セレクト 選択", combobox: "コンボボックス オートコンプリート", "tag-input": "タグ入力", slider: "スライダー",
  "file-upload": "ファイル アップロード", "date-picker": "日付 デートピッカー", rating: "評価 星", checkbox: "チェックボックス",
  radio: "ラジオボタン", switch: "スイッチ トグル", "segmented-control": "セグメント", "toggle-group": "トグルグループ",
  chip: "チップ フィルター", calendar: "カレンダー", tabs: "タブ", breadcrumb: "パンくず", pagination: "ページネーション ページ送り",
  stepper: "ステッパー 手順", "nav-bar": "ナビゲーションバー ナビ", dialog: "ダイアログ モーダル", sheet: "シート ドロワー",
  "command-menu": "コマンドメニュー コマンドパレット", popover: "ポップオーバー", tooltip: "ツールチップ", toast: "トースト 通知",
  alert: "アラート 警告", progress: "プログレス 進捗", spinner: "スピナー 読み込み", skeleton: "スケルトン 読み込み",
  "empty-state": "空の状態", "error-state": "エラー", table: "テーブル 表", "data-table": "データテーブル 表",
  "stat-tile": "数値 KPI", badge: "バッジ", avatar: "アバター", "avatar-group": "アバターグループ", timeline: "タイムライン",
  card: "カード", "media-card": "メディアカード", accordion: "アコーディオン 折りたたみ", divider: "区切り線", link: "リンク", kbd: "キー",
};

// Registries and data files are optional at build time: the glob is empty
// until they exist, and a failing import only removes those entries.
const loaders = import.meta.glob(["../ds/registry.tsx", "../demos/registry.tsx", "../ds/data/fonts.json", "../ds/data/palettes.json"]);

async function loadExtra(t: ShellMessages, locale: Locale): Promise<Item[]> {
  const out: Item[] = [];
  for (const [path, load] of Object.entries(loaders)) {
    try {
      const mod = (await load()) as Record<string, unknown>;
      if (path.endsWith("ds/registry.tsx") && typeof mod.componentsFor === "function") {
        for (const c of (mod.componentsFor as (l: Locale) => Array<{ id: string; name: string; caption?: string }>)(locale)) {
          out.push({ id: `c-${c.id}`, label: c.name, hint: c.caption, group: t.groupComponents, to: `/components#${c.id}`, aliases: componentAliases[c.id] });
        }
      } else if (path.endsWith("demos/registry.tsx") && typeof mod.getDemos === "function") {
        for (const d of (mod.getDemos as (l: Locale) => Array<{ id: string; name: string; caption?: string }>)(locale)) {
          out.push({ id: `m-${d.id}`, label: d.name, hint: d.caption, group: t.groupMotion, to: `/motion#${d.id}` });
        }
      } else if (path.endsWith("fonts.json")) {
        const data = (mod.default ?? mod) as { fonts?: Array<{ id: string; name: string; usedBy?: Array<{ name: string }> }> };
        for (const f of data.fonts ?? []) out.push({ id: `f-${f.id}`, label: f.name, hint: f.usedBy?.slice(0, 3).map((u) => u.name).join(", "), group: t.groupFonts, to: `/fonts#${f.id}` });
      } else if (path.endsWith("palettes.json")) {
        const data = (mod.default ?? mod) as { brand?: Array<{ id: string; name: string; accent?: string }> };
        for (const p of data.brand ?? []) out.push({ id: `p-${p.id}`, label: p.name, hint: p.accent, group: t.groupPalettes, to: `/palettes#${p.id}` });
      }
    } catch {
      // optional source, skip
    }
  }
  return out;
}

/** Case, width (NFKC) and kana folded, so "ぼたん", "ボタン" and "ﾎﾞﾀﾝ" match each other. */
function fold(s: string): string {
  return s.normalize("NFKC").toLowerCase().replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
}

/** Lower is better; null means no match. A label match always outranks a hint match. */
function score(item: Item, needle: string): number | null {
  const names = [item.label, ...(item.aliases?.split(" ") ?? [])].map(fold);
  if (names.some((n) => n === needle)) return 0;
  if (names.some((n) => n.startsWith(needle))) return 1;
  if (names.some((n) => n.includes(needle))) return 2;
  if (fold(`${item.hint ?? ""} ${item.group}`).includes(needle)) return 3;
  return null;
}

function search(all: Item[], q: string): Group[] {
  const needle = fold(q.trim());
  const ranked = needle
    ? all
        .map((item, order) => ({ item, order, s: score(item, needle) }))
        .filter((r): r is { item: Item; order: number; s: number } => r.s !== null)
        .sort((a, b) => a.s - b.s || a.order - b.order)
        .map((r) => r.item)
    : all;
  const groups = new Map<string, Item[]>();
  for (const item of ranked.slice(0, MAX_RESULTS)) {
    const list = groups.get(item.group);
    if (list) list.push(item);
    else groups.set(item.group, [item]);
  }
  return [...groups].map(([name, items]) => ({ name, items }));
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  // Registry entries are cached per locale; switching language reloads them in that language.
  const [extra, setExtra] = useState<{ locale: Locale; items: Item[] } | null>(null);
  const navigate = useNavigate();
  const t = useT(shellMessages);
  const { locale } = useLocale();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      if (extra?.locale !== locale) void loadExtra(t, locale).then((items) => setExtra({ locale, items }));
    }
    if (!open && el.open) el.close();
  }, [open, extra?.locale, locale, t]);

  const base: Item[] = useMemo(
    () => sidebar.flatMap((g) => g.items.map((i) => ({ id: `n-${i.to}`, label: i.label[locale], hint: i.hint?.[locale], group: g.label[locale], to: i.to }))),
    [locale],
  );

  const groups = useMemo(() => search([...base, ...(extra?.locale === locale ? extra.items : [])], q), [q, base, extra, locale]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const current = flat[Math.min(active, flat.length - 1)];

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active, groups]);

  const go = (item: Item) => {
    onClose();
    navigate(item.to);
  };

  const optionId = (item: Item) => `${id}-${item.id}`;
  let index = -1;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={t.search}
      className="palette w-[calc(100%-32px)] max-w-[640px] overflow-hidden rounded-xl border border-hairline bg-surface p-0 text-ink shadow-3"
    >
      <div className="flex h-12 items-center gap-3 border-b border-hairline pr-2 pl-4 pointer-coarse:h-14">
        <Search className="size-4 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded
          aria-controls={`${id}-list`}
          aria-activedescendant={current ? optionId(current) : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="go"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            const n = flat.length;
            if (e.key === "ArrowDown" && n) {
              e.preventDefault();
              setActive((a) => (a + 1) % n);
            } else if (e.key === "ArrowUp" && n) {
              e.preventDefault();
              setActive((a) => (a - 1 + n) % n);
            } else if (e.key === "Enter" && current) {
              e.preventDefault();
              go(current);
            }
          }}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchTerm}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-muted"
        />
        <button
          type="button"
          onClick={onClose}
          className="t-caption shrink-0 rounded-sm px-2 py-1 text-ink-muted transition-colors duration-instant hover:bg-canvas-soft hover:text-ink pointer-coarse:min-h-11 pointer-coarse:px-3"
        >
          <span className="pointer-coarse:hidden">
            <Kbd>esc</Kbd>
          </span>
          <span className="hidden pointer-coarse:inline">{t.paletteClose}</span>
          <span className="sr-only pointer-coarse:hidden">{t.paletteClose}</span>
        </button>
      </div>
      <div ref={listRef} id={`${id}-list`} role="listbox" aria-label={t.results} className="palette-list overflow-y-auto overscroll-contain p-2">
        {flat.length === 0 && <p className="t-body-sm px-3 py-8 text-center text-ink-muted">{t.noResults}</p>}
        {groups.map((g) => (
          <div key={g.name} role="group" aria-label={g.name} className="mb-2 last:mb-0">
            <p aria-hidden className="t-caption px-3 pt-2 pb-1 text-ink-muted">
              {g.name}
            </p>
            {g.items.map((item) => {
              index += 1;
              const i = index;
              const isActive = item === current;
              return (
                <div
                  key={item.id}
                  id={optionId(item)}
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => i !== active && setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(item)}
                  className={cx(
                    "flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors duration-instant pointer-coarse:min-h-11",
                    isActive && "bg-surface-sunken",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="t-body-sm block truncate text-ink">{item.label}</span>
                    {item.hint && <span className="t-caption block truncate text-ink-muted">{item.hint}</span>}
                  </span>
                  <ArrowRight className={cx("size-4 shrink-0 text-ink-muted", !isActive && "invisible")} strokeWidth={1.75} aria-hidden />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <footer className="flex items-center gap-4 border-t border-hairline bg-canvas-soft px-4 py-2 text-ink-muted pointer-coarse:hidden">
        <span className="t-caption inline-flex items-center gap-1.5">
          <Kbd keys={["↑", "↓"]} /> {t.paletteMove}
        </span>
        <span className="t-caption inline-flex items-center gap-1.5">
          <Kbd>↵</Kbd> {t.paletteOpen}
        </span>
        <span className="t-caption inline-flex items-center gap-1.5">
          <Kbd>esc</Kbd> {t.paletteClose}
        </span>
      </footer>
    </dialog>
  );
}
