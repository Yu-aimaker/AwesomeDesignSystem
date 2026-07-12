"use client";

import { useMemo, useState } from "react";
import { Button, Card, Input, Stack, Switch, Badge } from "@awesome-ds/react";
import type { Dictionary } from "../../lib/i18n";

const themes = ["light", "dark", "high-contrast"] as const;
const variants = ["primary", "secondary", "ghost", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;

const defaults = {
  theme: "light" as (typeof themes)[number],
  variant: "primary" as (typeof variants)[number],
  size: "md" as (typeof sizes)[number],
  label: "Launch",
  loading: false,
  disabled: false,
  showBadge: true,
};

export function PlaygroundControls({ labels }: { labels: Dictionary["playground"] }) {
  const [theme, setTheme] = useState(defaults.theme);
  const [variant, setVariant] = useState(defaults.variant);
  const [size, setSize] = useState(defaults.size);
  const [label, setLabel] = useState(defaults.label);
  const [loading, setLoading] = useState(defaults.loading);
  const [disabled, setDisabled] = useState(defaults.disabled);
  const [showBadge, setShowBadge] = useState(defaults.showBadge);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const snippet = useMemo(
    () =>
      [
        `// theme: ${theme}`,
        `<Button variant="${variant}" size="${size}"${loading ? " loading" : ""}${disabled ? " disabled" : ""}>`,
        `  ${label || "Button"}`,
        `</Button>`,
        showBadge ? `<Badge tone="accent">Preview</Badge>` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [theme, variant, size, label, loading, disabled, showBadge],
  );

  function applyTheme(t: (typeof themes)[number]) {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    window.localStorage.setItem("ads-theme", t);
  }

  function reset() {
    setTheme(defaults.theme);
    setVariant(defaults.variant);
    setSize(defaults.size);
    setLabel(defaults.label);
    setLoading(defaults.loading);
    setDisabled(defaults.disabled);
    setShowBadge(defaults.showBadge);
    applyTheme(defaults.theme);
    setCopyState("idle");
  }

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const ta = document.createElement("textarea");
        ta.value = snippet;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="playground-root" data-theme={theme}>
      <h1>{labels.title}</h1>
      <p className="muted">{labels.intro}</p>
      <div className="theme-bar" role="group" aria-label={labels.theme}>
        {themes.map((t) => (
          <button key={t} type="button" className="ads-btn ads-btn--secondary ads-btn--sm" aria-pressed={theme === t} onClick={() => applyTheme(t)}>{t}</button>
        ))}
      </div>
      <Stack gap={4}>
        <Card title={labels.controls}>
          <Input id="label" label={labels.buttonLabel} value={label} onChange={(e) => setLabel(e.target.value)} />
          <label className="ads-field">
            <span className="ads-label">{labels.variant}</span>
            <select className="ads-select" value={variant} onChange={(e) => setVariant(e.target.value as typeof variant)} aria-label={labels.variant}>
              {variants.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label className="ads-field">
            <span className="ads-label">{labels.size}</span>
            <select className="ads-select" value={size} onChange={(e) => setSize(e.target.value as typeof size)} aria-label={labels.size}>
              {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <Switch id="loading" label={labels.loading} checked={loading} onChange={setLoading} />
          <Switch id="disabled" label={labels.disabled} checked={disabled} onChange={setDisabled} />
          <Switch id="badge" label={labels.showBadge} checked={showBadge} onChange={setShowBadge} />
          <div className="ads-cluster">
            <Button variant="secondary" onClick={reset}>{labels.reset}</Button>
            <Button variant="secondary" onClick={copy}>{copyState === "copied" ? labels.copied : copyState === "failed" ? labels.copyFailed : labels.copyCode}</Button>
          </div>
        </Card>
        <Card title={labels.preview}>
          <div className="ads-cluster">
            <Button variant={variant} size={size} loading={loading} disabled={disabled}>{label || "Button"}</Button>
            {showBadge ? <Badge tone="accent">{labels.preview}</Badge> : null}
          </div>
        </Card>
        <Card title={labels.output}>
          <pre className="code">{snippet}</pre>
        </Card>
      </Stack>
    </div>
  );
}
