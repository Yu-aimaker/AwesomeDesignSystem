import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { brandPalettes, curatedPalettes, palettesMeta, brandCount, type BrandPalette, type CuratedPalette } from "../lib/data";
import { contrast, ensureContrast, onColor } from "../lib/color";
import { colorValue } from "../lib/tokens";
import { useKnobs } from "../lib/knobs";
import { DataNote, FilterBar, FilterChip, GalleryHeader, SearchBox, SectionTitle } from "../layout/Gallery";
import { EmptyState } from "../ds/components/EmptyState";
import { cx } from "../ds/cx";
import { useT } from "../i18n/context";
import { palettesMessages } from "../i18n/messages/palettes";

type Region = "all" | "global" | "jp";
type Temp = "all" | "warm" | "cool" | "neutral";

/** Brand accent adjusted to pass 4.5:1 on white and on near-black, so the whole site can wear it. */
function wearable(p: BrandPalette) {
  const light = ensureContrast(p.accent, colorValue("light", "canvas"));
  const dark = ensureContrast(p.accent, colorValue("dark", "canvas"));
  return { light: light.hex, dark: dark.hex, adjusted: light.adjusted || dark.adjusted };
}

export function Palettes() {
  const { knobs, setCustomAccent, set } = useKnobs();
  const m = useT(palettesMessages);
  const tempLabel: Record<Exclude<Temp, "all">, string> = m.temp;
  const [region, setRegion] = useState<Region>("all");
  const [temp, setTemp] = useState<Temp>("all");
  const [darkFirst, setDarkFirst] = useState(false);
  const [q, setQ] = useState("");

  const activeLabel = knobs.accent === "custom" ? knobs.custom?.label : null;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return brandPalettes.filter(
      (p) => (region === "all" || p.region === region) && (temp === "all" || p.temperature === temp) && (!darkFirst || p.darkFirst) && (!needle || p.name.toLowerCase().includes(needle) || p.accent.includes(needle)),
    );
  }, [region, temp, darkFirst, q]);

  const applyCurated = (p: CuratedPalette) => {
    if (p.id === "awesomeds-blue") set("accent", "blue");
    else if (p.id === "ink") set("accent", "ink");
    else setCustomAccent({ label: p.name, light: p.accent, dark: p.dark.accent });
  };
  const applyBrand = (p: BrandPalette) => {
    const w = wearable(p);
    setCustomAccent({ label: p.name, light: w.light, dark: w.dark });
  };
  const isOn = (label: string, id?: "blue" | "ink") => (id ? knobs.accent === id : knobs.accent === "custom" && activeLabel === label);

  return (
    <div>
      <GalleryHeader title={m.title} lead={m.lead} stat={brandPalettes.length + curatedPalettes.length} statLabel={m.statLabel} />

      {/* Live roles */}
      <section aria-label={m.currentRoles} className="grid grid-cols-3 overflow-hidden rounded-lg border border-hairline">
        {[
          ["canvas", "bg-canvas text-ink", m.canvas],
          ["ink", "bg-primary text-on-primary", m.ink],
          ["accent", "bg-accent text-on-accent", activeLabel ?? m.accent],
        ].map(([id, cls, label]) => (
          <div key={id} className={cx("flex h-40 flex-col justify-between p-5 sm:h-52", cls, id !== "accent" && "border-r border-hairline")}>
            <span className="t-mono opacity-70">{id}</span>
            <span className="t-h3 truncate">{label}</span>
          </div>
        ))}
      </section>

      <section className="mt-16" aria-labelledby="curated">
        <SectionTitle id="curated" count={curatedPalettes.length}>
          {m.curatedTitle}
        </SectionTitle>
        <p className="t-body-sm mt-2 text-ink-secondary">{m.curatedLead}</p>
        <ul className="mt-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))" }}>
          {curatedPalettes.map((p) => {
            const on = isOn(p.name, p.id === "awesomeds-blue" ? "blue" : p.id === "ink" ? "ink" : undefined);
            return (
              <li key={p.id} id={p.id} className="scroll-mt-32">
                <button
                  type="button"
                  onClick={() => applyCurated(p)}
                  aria-pressed={on}
                  title={p.use}
                  className={cx("group flex w-full flex-col overflow-hidden rounded-lg border text-left transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2", on ? "border-ink" : "border-hairline")}
                >
                  <div className="grid h-28 grid-cols-[1fr_auto]" style={{ background: p.canvas }}>
                    <div className="flex flex-col justify-between p-4">
                      <span className="text-3xl font-semibold leading-none" style={{ color: p.accent }}>
                        Aa
                      </span>
                      <span className="t-mono" style={{ color: p.ink }}>
                        {p.accent}
                      </span>
                    </div>
                    <div className="grid w-10 grid-rows-3">
                      <span style={{ background: p.accent }} />
                      <span style={{ background: p.accentHover }} />
                      <span style={{ background: p.accentSoft }} />
                    </div>
                  </div>
                  <div className="flex h-12 items-center justify-between gap-2 px-4" style={{ background: p.dark.canvas, color: p.dark.accent }}>
                    <span className="t-mono">{p.dark.accent}</span>
                    <span className="t-caption tabular" style={{ color: p.dark.ink, opacity: 0.7 }}>
                      {p.contrast.accentOnCanvas} / {p.contrast.darkAccentOnCanvas}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-surface px-4 py-3">
                    <span className="t-h4 truncate text-ink" lang="ja">
                      {p.name}
                    </span>
                    {on && <Check className="size-4 shrink-0 text-ink" strokeWidth={2} aria-hidden />}
                  </div>
                </button>
                <p className="t-caption mt-1.5 px-1 text-ink-muted" lang="ja">
                  {p.use}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="brands">
        <SectionTitle id="brands" count={list.length}>
          {m.brandsTitle}
        </SectionTitle>
        <p className="t-body-sm mt-2 text-ink-secondary">{m.brandsLead(brandCount)}</p>
        <FilterBar className="mt-4">
          {(["all", "global", "jp"] as Region[]).map((r) => (
            <FilterChip key={r} selected={region === r} onSelect={() => setRegion(r)} count={r === "all" ? brandPalettes.length : brandPalettes.filter((p) => p.region === r).length}>
              {r === "all" ? m.all : r === "jp" ? m.japan : m.global}
            </FilterChip>
          ))}
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-hairline sm:block" />
          {(["all", "warm", "cool", "neutral"] as Temp[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={temp === t}
              onClick={() => setTemp(t)}
              className={cx("t-caption h-8 rounded-full px-3 transition-colors duration-instant", temp === t ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:text-ink")}
            >
              {t === "all" ? m.allHues : tempLabel[t]}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={darkFirst}
            onClick={() => setDarkFirst((v) => !v)}
            className={cx("t-caption h-8 rounded-full px-3 transition-colors duration-instant", darkFirst ? "bg-surface-sunken text-ink" : "text-ink-secondary hover:text-ink")}
          >
            {m.darkFirst}
          </button>
          <SearchBox value={q} onChange={setQ} placeholder={m.searchPlaceholder} />
        </FilterBar>

        {list.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={m.notFoundTitle} description={m.notFoundBody} />
          </div>
        ) : (
          <ul className="mt-6 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(150px, 100%), 1fr))" }}>
            {list.map((p) => {
              const on = isOn(p.name);
              const c = contrast(p.accent, p.canvas);
              return (
                <li key={p.id} id={p.id} className="scroll-mt-32">
                  <button
                    type="button"
                    onClick={() => applyBrand(p)}
                    aria-pressed={on}
                    aria-label={m.tryAccent(p.name, p.accent)}
                    title={`${p.name} · ${p.accent}`}
                    className={cx("flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-lg border text-left transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2", on ? "border-ink ring-2 ring-accent ring-offset-2 ring-offset-canvas" : "border-hairline")}
                    style={{ background: p.canvas, color: p.ink }}
                  >
                    <div className="flex items-start justify-between gap-2 p-3">
                      <span className="t-label truncate">{p.name}</span>
                      {on && <Check className="size-4 shrink-0" strokeWidth={2} aria-hidden />}
                    </div>
                    <div className="flex items-end justify-between gap-2 p-3">
                      <span className="t-mono opacity-70">{p.accent}</span>
                      <span className={cx("t-caption tabular", c < 4.5 && "underline decoration-dotted")} title={c < 4.5 ? m.lowContrast : undefined}>
                        {c.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-8 w-full" style={{ background: p.accent }}>
                      <span className="sr-only">accent</span>
                      <span className="block h-full w-full" style={{ color: onColor(p.accent, colorValue("light", "ink"), colorValue("light", "canvas")) }} />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <DataNote updated={palettesMeta.updated}>
        {m.dataNote}
      </DataNote>
    </div>
  );
}
