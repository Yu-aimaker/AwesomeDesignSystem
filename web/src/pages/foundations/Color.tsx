import { useState } from "react";
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { PageHeader, Section, SourceList, Why } from "../../layout/Page";
import { contrastRatio, formatRatio, wcagLevel } from "../../lib/contrast";
import { colorValue } from "../../lib/tokens";
import { Badge } from "../../ds/components/Badge";
import { Button } from "../../ds/components/Button";
import { Input } from "../../ds/components/Input";
import { cx } from "../../ds/cx";
import { useT } from "../../i18n/context";
import { colorMessages, type ColorMessages } from "../../i18n/messages/color";

type Mode = "light" | "dark";

const textRoles = ["ink", "ink-secondary", "ink-muted", "ink-disabled", "accent", "success", "warning", "danger"];
const surfaceRoles = ["canvas", "canvas-soft", "surface", "surface-raised", "surface-sunken", "hairline", "hairline-strong", "accent-soft", "selection"];
const statusRoles = [
  { role: "success", soft: "success-soft", icon: CheckCircle2 },
  { role: "warning", soft: "warning-soft", icon: TriangleAlert },
  { role: "danger", soft: "danger-soft", icon: CircleAlert },
  { role: "accent", soft: "accent-soft", icon: Info },
] as const;

const sources = (n: ColorMessages["sourceNotes"]) => [
  { title: "WCAG 2.2 Understanding 1.4.3 Contrast (Minimum)", url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html", note: n.contrast },
  { title: "WCAG 2.2 Understanding 1.4.11 Non-text Contrast", url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html", note: n.nonText },
  { title: "WCAG 2.2 Understanding 1.4.1 Use of Color", url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html", note: n.useOfColor },
  { title: "Material Design 3: Color roles", url: "https://m3.material.io/styles/color/roles", note: n.m3 },
  { title: "Apple HIG: Color", url: "https://developer.apple.com/design/human-interface-guidelines/color", note: n.hig },
  { title: "Radix Colors", url: "https://www.radix-ui.com/colors", note: n.radix },
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
  const t = useT(colorMessages);
  return (
    <div role="radiogroup" aria-label={t.modeGroup} className="inline-flex rounded-md bg-surface-sunken p-0.5">
      {(["light", "dark"] as Mode[]).map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          onClick={() => onChange(m)}
          className={cx("t-label h-8 rounded-sm px-3 transition-colors duration-instant ease-out-ds", mode === m ? "bg-surface text-ink shadow-2" : "text-ink-secondary hover:text-ink")}
        >
          {m === "light" ? t.light : t.dark}
        </button>
      ))}
    </div>
  );
}

export function Color() {
  const [mode, setMode] = useState<Mode>("light");
  const t = useT(colorMessages);
  return (
    <div>
      <PageHeader title={t.title} lead={t.lead} />

      <Section id="roles" title={t.rolesTitle} lead={t.rolesLead}>
        <ModeSwitch mode={mode} onChange={setMode} />
        <div className="mt-6 rounded-lg border p-4 sm:p-6" style={{ background: colorValue(mode, "canvas"), borderColor: colorValue(mode, "hairline") }}>
          <h3 className="t-h4" style={{ color: colorValue(mode, "ink") }}>
            {t.textIcons}
          </h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {textRoles.map((r) => (
              <Swatch key={r} mode={mode} role={r} on="canvas" />
            ))}
          </ul>
          <h3 className="t-h4 mt-8" style={{ color: colorValue(mode, "ink") }}>
            {t.surfacesBorders}
          </h3>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {surfaceRoles.map((r) => (
              <Swatch key={r} mode={mode} role={r} on="canvas" />
            ))}
          </ul>
          <p className="t-caption mt-4" style={{ color: colorValue(mode, "ink-muted") }}>
            {t.rolesNote}
          </p>
        </div>
      </Section>

      <Section id="accent" title={t.accentTitle} lead={t.accentLead}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.link}</p>
            <p className="t-body mt-3 text-ink">
              {t.linkBefore}<a href="#why">{t.linkText}</a>{t.linkAfter}
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.focusRing}</p>
            <div className="mt-3 flex flex-col gap-3">
              <Input label={t.nameLabel} placeholder={t.namePlaceholder} />
              <Button variant="secondary" className="w-fit" style={{ outline: "2px solid var(--ds-focus-ring)", outlineOffset: 2 }}>
                {t.focusedButton}
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.selected}</p>
            <ul className="mt-3 flex flex-col gap-1">
              {t.mailboxes.map((label, i) => (
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
            <p className="t-label text-ink">{t.primaryTitle}</p>
            <div className="mt-3 flex gap-2">
              <Button>{t.save}</Button>
              <Button variant="secondary">{t.cancel}</Button>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">{t.primaryCaption}</p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <p className="t-label text-ink">{t.avoidTitle}</p>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-on-accent">{t.save}</span>
              <span className="inline-flex h-10 items-center rounded-md border border-accent px-4 text-sm font-medium text-accent">{t.cancel}</span>
            </div>
            <p className="t-caption mt-3 text-ink-secondary">{t.avoidCaption}</p>
          </div>
        </div>
      </Section>

      <Section id="status" title={t.statusTitle} lead={t.statusLead}>
        <ul className="grid gap-3 md:grid-cols-2">
          {statusRoles.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.role} className={cx("flex items-start gap-3 rounded-lg border border-hairline p-4", `bg-${s.soft}`)}>
                <Icon className={cx("mt-0.5 size-5 shrink-0", `text-${s.role}`)} strokeWidth={1.75} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="t-label text-ink">{t.status[s.role].label}</p>
                    <Badge tone={s.role as "success" | "warning" | "danger" | "accent"}>{s.role}</Badge>
                  </div>
                  <p className="t-body-sm mt-1 text-ink-secondary">{t.status[s.role].text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="t-body-sm mt-4 max-w-[65ch] text-ink-secondary">
          {t.statusContrast(
            formatRatio(contrastRatio(colorValue("light", "success"), colorValue("light", "canvas"))),
            formatRatio(contrastRatio(colorValue("light", "warning"), colorValue("light", "canvas"))),
            formatRatio(contrastRatio(colorValue("light", "danger"), colorValue("light", "canvas"))),
          )}
        </p>
      </Section>

      <Section id="why" title={t.whyTitle}>
        <Why>
          <p>{t.why1}</p>
          <p>{t.why2}</p>
          <p>
            {t.why3(
              colorValue("dark", "canvas"),
              colorValue("dark", "surface"),
              colorValue("dark", "surface-raised"),
              colorValue("light", "accent"),
              colorValue("dark", "accent"),
            )}
          </p>
          <p>{t.why4}</p>
        </Why>
        <SourceList sources={sources(t.sourceNotes)} />
      </Section>
    </div>
  );
}
