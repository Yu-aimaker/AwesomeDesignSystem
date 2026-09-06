import { useState } from "react";
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { contrastRatio, formatRatio, wcagLevel } from "../../lib/contrast";
import { colorValue } from "../../lib/tokens";
import { Badge } from "../../ds/components/Badge";
import { Button } from "../../ds/components/Button";
import { Input } from "../../ds/components/Input";
import { cx } from "../../ds/cx";

type Mode = "light" | "dark";

const textRoles = ["ink", "ink-secondary", "ink-muted", "ink-disabled", "accent", "success", "warning", "danger"];
const surfaceRoles = ["canvas", "canvas-soft", "surface", "surface-raised", "surface-sunken", "hairline", "hairline-strong", "accent-soft", "selection"];
const statusRoles = [
  { role: "success", soft: "success-soft", label: "成功", icon: CheckCircle2, text: "保存しました" },
  { role: "warning", soft: "warning-soft", label: "注意", icon: TriangleAlert, text: "残り 3 日で期限が切れます" },
  { role: "danger", soft: "danger-soft", label: "エラー", icon: CircleAlert, text: "接続できませんでした。再試行してください" },
  { role: "accent", soft: "accent-soft", label: "情報", icon: Info, text: "新しいバージョンがあります" },
];

const sources = [
  { title: "WCAG 2.2 Understanding 1.4.3 Contrast (Minimum)", url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html", note: "本文 4.5:1、大きな文字 3:1" },
  { title: "WCAG 2.2 Understanding 1.4.11 Non-text Contrast", url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html", note: "UI 部品の境界 3:1" },
  { title: "WCAG 2.2 Understanding 1.4.1 Use of Color", url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html", note: "色だけで意味を伝えない" },
  { title: "Material Design 3: Color roles", url: "https://m3.material.io/styles/color/roles", note: "ロールで参照する考え方" },
  { title: "Apple HIG: Color", url: "https://developer.apple.com/design/human-interface-guidelines/color", note: "システムカラーと状態色の扱い" },
  { title: "Radix Colors", url: "https://www.radix-ui.com/colors", note: "ダークモードの明度設計" },
];

function Swatch({ mode, role, on }: { mode: Mode; role: string; on: string }) {
  const hex = colorValue(mode, role);
  const bg = colorValue(mode, on);
  const ratio = contrastRatio(hex, bg);
  const level = wcagLevel(ratio);
  return (
    <li className="flex items-center gap-3 rounded-md border p-3" style={{ background: bg, borderColor: colorValue(mode, "hairline") }}>
      <span aria-hidden className="size-10 shrink-0 rounded-md border" style={{ background: hex, borderColor: colorValue(mode, "hairline-strong") }} />
      <div className="min-w-0 flex-1">
        <p className="t-mono truncate" style={{ color: colorValue(mode, "ink") }}>
          {role}
        </p>
        <p className="t-mono" style={{ color: colorValue(mode, "ink-muted") }}>
          {hex}
        </p>
      </div>
      <div className="text-right">
        <p className="t-mono tabular" style={{ color: colorValue(mode, "ink") }}>
          {formatRatio(ratio)}
        </p>
        <p className="t-caption" style={{ color: level === "Fail" ? colorValue(mode, "danger") : colorValue(mode, "ink-muted") }}>
          {level}
        </p>
      </div>
    </li>
  );
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div role="radiogroup" aria-label="表示モード" className="inline-flex rounded-md bg-surface-sunken p-0.5">
      {(["light", "dark"] as Mode[]).map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          onClick={() => onChange(m)}
          className={cx("t-label h-8 rounded-sm px-3 transition-colors duration-instant ease-out-ds", mode === m ? "bg-surface text-ink shadow-2" : "text-ink-secondary hover:text-ink")}
        >
          {m === "light" ? "ライト" : "ダーク"}
        </button>
      ))}
    </div>
  );
}

export function Color() {
  const [mode, setMode] = useState<Mode>("light");
  return (
    <div>
      <PageHeader title="カラー" lead="色は色相ではなくロールで指定します。コンポーネントから hex を直接参照することはありません。" />

      <Section id="roles" title="ロールとコントラスト比" lead="各ロールの値と、canvas に対する WCAG コントラスト比をコード上で計算して表示しています。">
        <ModeSwitch mode={mode} onChange={setMode} />
        <div className="mt-6 rounded-lg border p-4 sm:p-6" style={{ background: colorValue(mode, "canvas"), borderColor: colorValue(mode, "hairline") }}>
          <h3 className="t-h4" style={{ color: colorValue(mode, "ink") }}>
            テキスト、アイコン
          </h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {textRoles.map((r) => (
              <Swatch key={r} mode={mode} role={r} on="canvas" />
            ))}
          </ul>
          <h3 className="t-h4 mt-8" style={{ color: colorValue(mode, "ink") }}>
            面と境界
          </h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {surfaceRoles.map((r) => (
              <Swatch key={r} mode={mode} role={r} on="canvas" />
            ))}
          </ul>
          <p className="t-caption mt-4" style={{ color: colorValue(mode, "ink-muted") }}>
            面と境界の比は参考値です。基準は文字 4.5:1、大きな文字と UI 部品の境界 3:1（WCAG 1.4.3、1.4.11）。ink-disabled と hairline は意図的に基準未満です。無効状態と装飾線には基準が適用されません。
          </p>
        </div>
      </Section>

      <Section id="accent" title="アクセントの使いどころ" lead="アクセントはリンク、フォーカスリング、選択状態の 3 つだけ。ボタンの塗りには使いません。">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">リンク</p>
            <p className="t-body mt-3 text-ink">
              詳しくは <a href="#why">理由のセクション</a> を読んでください。文中でアクセントが出るのはここだけです。
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">フォーカスリング</p>
            <div className="mt-3 flex flex-col gap-3">
              <Input label="名前" placeholder="Tab で移動してみてください" />
              <Button variant="secondary" className="w-fit" style={{ outline: "2px solid var(--ds-focus-ring)", outlineOffset: 2 }}>
                フォーカス中の見え方
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">選択中の項目</p>
            <ul className="mt-3 flex flex-col gap-1">
              {["受信箱", "送信済み", "下書き"].map((label, i) => (
                <li
                  key={label}
                  aria-current={i === 1 ? "true" : undefined}
                  className={cx("t-body-sm flex h-9 items-center rounded-md px-3", i === 1 ? "bg-accent-soft text-accent" : "text-ink-secondary")}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">主要アクション: ink on canvas</p>
            <div className="mt-3 flex gap-2">
              <Button>保存</Button>
              <Button variant="secondary">キャンセル</Button>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">黒いボタンは画面のどこにあっても主要な操作だと分かります。アクセントは温存されます。</p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">避ける例: アクセント塗りのボタン</p>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-on-accent">保存</span>
              <span className="inline-flex h-10 items-center rounded-md border border-accent px-4 text-sm font-medium text-accent">キャンセル</span>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">リンクとボタンが同じ色になり、どれが押せてどれが移動なのか区別できなくなります。</p>
          </div>
        </div>
      </Section>

      <Section id="status" title="状態色" lead="成功、注意、エラー、情報。色に必ずアイコンかラベルを添えます。色だけが意味を持つ場面は作りません。">
        <ul className="grid gap-3 md:grid-cols-2">
          {statusRoles.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.role} className={cx("flex items-start gap-3 rounded-lg border border-hairline p-4", `bg-${s.soft}`)}>
                <Icon className={cx("mt-0.5 size-5 shrink-0", `text-${s.role}`)} strokeWidth={1.75} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="t-label text-ink">{s.label}</p>
                    <Badge tone={s.role as "success" | "warning" | "danger" | "accent"}>{s.role}</Badge>
                  </div>
                  <p className="t-body-sm mt-1 text-ink-secondary">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="t-body-sm mt-4 max-w-[65ch] text-ink-secondary">
          light の状態色は白背景で {formatRatio(contrastRatio(colorValue("light", "success"), colorValue("light", "canvas")))}（success）、
          {formatRatio(contrastRatio(colorValue("light", "warning"), colorValue("light", "canvas")))}（warning）、
          {formatRatio(contrastRatio(colorValue("light", "danger"), colorValue("light", "canvas")))}（danger）です。文字色として使えます。
        </p>
      </Section>

      <Section id="why" title="なぜこの選択か">
        <Why>
          <p>
            ニュートラルは青みも暖色もない純粋なグレーです。ブランドカラーがどんな色相でも、下地の色と喧嘩しません。ink-secondary は白地で 7.6:1、ink-muted は 4.7:1 なので、補助的な文字でも本文基準を満たします。
          </p>
          <p>
            アクセントを 1 色に絞り、しかも「リンク、フォーカス、選択」にだけ使うのは、アクセントが現れたときに意味を持たせるためです。主要ボタンまで青にすると、押せるものと移動するものの区別が色でつかなくなります。
          </p>
          <p>
            ダークモードは色相を反転せず、明度だけを反転します。面は上に重なるほど明るくなります（#0a0a0a、#141414、#1a1a1a）。アクセントは暗い背景でのコントラストを保つために明るくしています（#2f5bea から #7a9cff）。
          </p>
          <p>
            状態色にアイコンかラベルを添えるのは WCAG 1.4.1 の要求です。色覚特性によっては success と danger の区別がつきません。
          </p>
        </Why>
        <SourceList sources={sources} />
      </Section>
    </div>
  );
}
