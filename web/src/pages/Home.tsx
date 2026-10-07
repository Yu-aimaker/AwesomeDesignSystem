import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Bell, Check, ExternalLink } from "lucide-react";
import { Button } from "../ds/components/Button";
import { Input } from "../ds/components/Input";
import { Switch } from "../ds/components/Switch";
import { Badge } from "../ds/components/Badge";
import { useToast } from "../ds/components/Toast";
import { KnobsPanel } from "../layout/KnobsPanel";
import { CodeBlock } from "../layout/Preview";
import { useKnobs, accents } from "../lib/knobs";
import { useTheme } from "../lib/theme";
import { curatedPalettes, fonts, repos, stackLayers, brandCount } from "../lib/data";
import { cx } from "../ds/cx";
import { flagshipSystems } from "../lib/design-systems";
import { FlagshipPoster } from "../layout/FlagshipPoster";

function FormSpecimen() {
  const [notify, setNotify] = useState(true);
  const toast = useToast();
  return (
    <form
      className="flex h-full flex-col gap-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        toast.push({ title: "保存しました", tone: "success" });
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="t-h4 text-ink">請求先</p>
          <p className="t-caption text-ink-secondary">毎月 1 日に送ります</p>
        </div>
        <Badge tone="success">有効</Badge>
      </div>
      <Input label="送付先" type="email" placeholder="billing@example.co.jp" />
      <Switch label="支払い完了時に通知" checked={notify} onChange={setNotify} />
      <div className="mt-auto flex flex-wrap gap-2">
        <Button type="submit">保存</Button>
        <Button variant="secondary">キャンセル</Button>
      </div>
    </form>
  );
}

function TypeSpecimen() {
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex items-baseline justify-between">
        <span className="t-caption text-ink-muted">Geist + Noto Sans JP</span>
        <span className="t-mono text-ink-muted">16 / 1.6</span>
      </div>
      <div>
        <p className="t-display-xl text-ink" style={{ fontSize: "clamp(72px, 9vw, 120px)" }}>
          Aa あ
        </p>
        <p className="t-body mt-2 text-ink-secondary">読みやすさは、字面より行間と幅で決まります。</p>
      </div>
    </div>
  );
}

function PaletteSpecimen() {
  const { knobs } = useKnobs();
  const accent = accents.find((a) => a.id === knobs.accent);
  return (
    <div className="grid h-full grid-rows-[1fr_auto]">
      <div className="grid grid-cols-3">
        <div className="border-r border-hairline bg-canvas" />
        <div className="bg-primary" />
        <div className="bg-accent" />
      </div>
      <div className="grid grid-cols-3 border-t border-hairline">
        {["canvas", "ink", accent?.id ?? "accent"].map((n) => (
          <span key={n} className="t-mono px-3 py-2 text-ink-muted">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function MotionSpecimen() {
  const [done, setDone] = useState(false);
  return (
    <div className="flex h-full flex-col items-start justify-between gap-4 p-6">
      <span className="t-caption text-ink-muted">200ms · ease-out · 4px</span>
      <button
        type="button"
        onClick={() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        }}
        className={cx(
          "inline-flex h-12 items-center gap-2 rounded-md px-5 text-base font-medium transition-[transform,background-color,color] duration-fast ease-out-ds active:scale-[0.98]",
          done ? "bg-success-soft text-success" : "bg-primary text-on-primary hover:bg-primary-hover",
        )}
      >
        <span className={cx("grid size-5 place-items-center transition-transform duration-base ease-out-ds", done ? "scale-100" : "scale-0")}>
          <Check className="size-5" strokeWidth={2.5} aria-hidden />
        </span>
        <span className={cx("transition-[margin] duration-base ease-out-ds", done ? "" : "-ml-7")}>{done ? "送信しました" : "送信"}</span>
      </button>
    </div>
  );
}

function StatsSpecimen() {
  const rows = [
    ["月間アクティブ", "12,480", "+4.2%", true],
    ["解約率", "1.8%", "-0.3pt", true],
    ["平均応答", "184ms", "+12ms", false],
  ] as const;
  return (
    <ul className="grid h-full grid-rows-3 divide-y divide-hairline">
      {rows.map(([k, v, d, good]) => (
        <li key={k} className="flex items-center justify-between gap-4 px-6">
          <span className="t-body-sm text-ink-secondary">{k}</span>
          <span className="flex items-baseline gap-3">
            <span className="t-h3 tabular text-ink">{v}</span>
            <span className={cx("t-caption tabular", good ? "text-success" : "text-warning")}>{d}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function DarkSpecimen() {
  const { setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme("dark")}
      aria-label="ダークモードにする"
      className="h-full w-full cursor-pointer border-0 bg-canvas p-6 text-left text-ink"
      data-theme="dark"
      style={{ colorScheme: "dark" }}
    >
      <div className="flex h-full flex-col justify-between rounded-lg border border-hairline bg-surface p-4">
        <div className="flex items-center justify-between">
          <span className="t-label">通知</span>
          <Bell className="size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
        </div>
        <p className="t-body-sm text-ink-secondary">面は暗いほど下、明るいほど上。影は使いません。</p>
        <span className="t-caption text-accent">ダークモードを見る</span>
      </div>
    </button>
  );
}

const galleries: Array<{ to: string; title: string; caption: string; visual: React.ReactNode }> = [
  {
    to: "/fonts",
    title: "フォント",
    caption: `${fonts.length} 書体。使用数は ${brandCount} 社から実測`,
    visual: (
      <div className="grid h-full grid-cols-2 grid-rows-2 place-items-center p-5 text-ink" aria-hidden>
        <span className="text-4xl font-semibold" style={{ fontFamily: '"Geist Variable", sans-serif' }}>Ag</span>
        <span className="text-4xl font-semibold" style={{ fontFamily: '"Inter Variable", sans-serif' }}>Ag</span>
        <span className="text-4xl font-semibold" style={{ fontFamily: '"Manrope Variable", sans-serif' }}>Ag</span>
        <span className="text-4xl font-semibold" style={{ fontFamily: '"Source Serif 4 Variable", serif' }}>Ag</span>
      </div>
    ),
  },
  {
    to: "/palettes",
    title: "パレット",
    caption: `${brandCount} 社の実測配色。クリックで試着`,
    visual: (
      <div className="grid h-full grid-cols-6 gap-1.5 p-5" aria-hidden>
        {curatedPalettes.slice(0, 12).map((p) => (
          <span key={p.id} className="aspect-square rounded-sm" style={{ background: p.accent }} />
        ))}
      </div>
    ),
  },
  {
    to: "/components",
    title: "コンポーネント",
    caption: "48 の部品。props を触って確かめる",
    visual: (
      <div className="flex h-full flex-col justify-center gap-3 p-5" aria-hidden>
        <div className="flex gap-2">
          <span className="h-8 rounded-md bg-primary px-3 text-sm leading-8 text-on-primary">保存</span>
          <span className="h-8 rounded-md border border-hairline-strong px-3 text-sm leading-8 text-ink">戻る</span>
        </div>
        <span className="h-8 rounded-md border border-hairline-strong bg-surface" />
        <div className="flex gap-2">
          <span className="h-5 w-9 rounded-full bg-primary" />
          <span className="size-5 rounded-xs border-2 border-ink" />
          <span className="size-5 rounded-full border-2 border-ink" />
        </div>
      </div>
    ),
  },
  {
    to: "/motion",
    title: "モーション",
    caption: "35 デモ。Motion、GSAP、three.js、Lottie",
    visual: (
      <div className="flex h-full items-center justify-center gap-3 p-5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-10 rounded-lg bg-ink motion-safe:animate-[home-bob_1.8s_var(--ds-ease-in-out-ds)_infinite]"
            style={{ animationDelay: `${i * 160}ms`, opacity: 1 - i * 0.3 }}
          />
        ))}
        <style>{`@keyframes home-bob { 0%,100% { transform: translateY(6px) } 50% { transform: translateY(-6px) } }`}</style>
      </div>
    ),
  },
  {
    to: "/stack",
    title: "スタック",
    caption: `${stackLayers.length} 層。採用 1 つと代替の「いつ」`,
    visual: (
      <div className="flex h-full flex-col justify-center gap-1.5 p-5" aria-hidden>
        {[92, 76, 60, 44, 30].map((w) => (
          <span key={w} className="h-3 rounded-xs bg-ink" style={{ width: `${w}%`, opacity: w / 100 }} />
        ))}
      </div>
    ),
  },
  {
    to: "/rankings",
    title: "ランキング",
    caption: `${repos.length} の OSS をスターで。毎週更新`,
    visual: (
      <div className="t-mono flex h-full flex-col justify-center gap-2 p-5" aria-hidden>
        {[["shadcn/ui", 95], ["motion", 70], ["three.js", 100]].map(([n, w]) => (
          <div key={n as string} className="flex items-center gap-2">
            <span className="w-16 truncate text-ink-muted">{n}</span>
            <span className="h-2 rounded-xs bg-accent" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    ),
  },
];

const cell = "overflow-hidden rounded-lg border border-hairline bg-surface";

export function Home() {
  return (
    <div className="flex flex-col gap-24 lg:gap-32">
      <section aria-labelledby="hero" className="flex flex-col gap-10">
        <div>
          <h1 id="hero" className="t-display-xl text-ink">
            AwesomeDS
          </h1>
          <p className="t-body-lg mt-4 max-w-[48ch] text-ink-secondary">白地、黒文字、アクセント 1 色。AI が書く UI の既定値。</p>
        </div>
        <div className="rounded-lg border border-hairline bg-canvas-soft p-5 sm:p-6">
          <p className="t-label mb-4 text-ink">触って変える。サイト全体が追従します。</p>
          <KnobsPanel layout="bar" />
        </div>
      </section>

      <section aria-labelledby="specimens" className="flex flex-col gap-6">
        <h2 id="specimens" className="t-h2 text-ink">
          実物
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-[minmax(280px,auto)_minmax(200px,auto)]">
          <div className={cx(cell, "md:col-span-3")}>
            <FormSpecimen />
          </div>
          <div className={cx(cell, "md:col-span-3")}>
            <TypeSpecimen />
          </div>
          <div className={cx(cell, "md:col-span-2")}>
            <PaletteSpecimen />
          </div>
          <div className={cx(cell, "md:col-span-2")}>
            <MotionSpecimen />
          </div>
          <div className={cx(cell, "md:col-span-2")}>
            <DarkSpecimen />
          </div>
          <div className={cx(cell, "md:col-span-6 lg:col-span-6")}>
            <StatsSpecimen />
          </div>
        </div>
      </section>

      <section aria-labelledby="galleries" className="flex flex-col gap-6">
        <h2 id="galleries" className="t-h2 text-ink">
          ギャラリー
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="group flex h-64 flex-col overflow-hidden rounded-lg border border-hairline bg-surface text-ink no-underline transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2"
            >
              <div className="relative min-h-0 flex-1 bg-canvas-soft">
                <div className="absolute inset-0">{g.visual}</div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-4">
                <div className="min-w-0">
                  <p className="t-h4">{g.title}</p>
                  <p className="t-caption truncate text-ink-secondary">{g.caption}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-ink-muted transition-transform duration-fast ease-out-ds group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="guidelines" className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="guidelines" className="t-h2 text-ink">
              ガイドライン
            </h2>
            <p className="t-body mt-2 max-w-[48ch] text-ink-secondary">世界をリードするデザインシステムへの入口。</p>
          </div>
          <Link
            to="/sources"
            className="t-label hidden shrink-0 items-center gap-1 text-ink-secondary no-underline hover:text-ink sm:inline-flex"
          >
            すべて見る
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {flagshipSystems.slice(0, 4).map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="group flex min-w-0 items-center gap-3 rounded-lg border border-hairline bg-surface p-3 text-ink no-underline transition-[transform,box-shadow] duration-fast ease-out-ds hover:-translate-y-0.5 hover:shadow-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span className="relative size-10 shrink-0 overflow-hidden rounded-md border border-hairline">
                <FlagshipPoster system={s} variant="thumb" />
              </span>
              <span className="min-w-0">
                <span className="t-label block truncate text-ink">{s.nameJa ?? s.name}</span>
                <span className="t-caption block truncate text-ink-muted">{s.domain}</span>
              </span>
              <ExternalLink className="ml-auto size-4 shrink-0 text-ink-muted transition-colors group-hover:text-ink" strokeWidth={1.75} aria-hidden />
            </a>
          ))}
        </div>
        <Link
          to="/sources"
          className="t-label inline-flex items-center gap-1 text-ink-secondary no-underline hover:text-ink sm:hidden"
        >
          すべて見る
          <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </section>

      <section aria-labelledby="install" className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <h2 id="install" className="t-h2 text-ink">
            使う
          </h2>
          <p className="t-body mt-3 text-ink-secondary">Claude Code に入れると、UI を書くたびにこの規則が参照されます。</p>
          <CodeBlock className="mt-4" code={"/plugin marketplace add Yu-aimaker/Awesome-Design-Systems-Claude\n/plugin install awesome-ds@awesome-design-systems"} />
        </div>
        <div className="min-w-0">
          <p className="t-h4 text-ink lg:mt-12">プラグインなしで</p>
          <p className="t-body mt-3 text-ink-secondary">DESIGN.md を置いて、トークンを読み込むだけ。</p>
          <CodeBlock className="mt-4" code={'@import "tailwindcss";\n@import "./AwesomeDS/tokens/tokens.css";\n@import "./AwesomeDS/tokens/tailwind.css";'} />
        </div>
      </section>
    </div>
  );
}
