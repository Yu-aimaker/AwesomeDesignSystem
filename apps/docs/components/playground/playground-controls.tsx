"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Cluster,
  Input,
  Select,
  Stack,
  Switch,
} from "@awesome-ds/react";

const themes = ["light", "dark", "high-contrast"] as const;
const variants = ["primary", "secondary", "ghost", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;

type Theme = (typeof themes)[number];
type Variant = (typeof variants)[number];
type Size = (typeof sizes)[number];

const defaults = {
  theme: "light" as Theme,
  variant: "primary" as Variant,
  size: "md" as Size,
  loading: false,
  disabled: false,
  label: "Launch",
};

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to textarea fallback
    }
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function PlaygroundControls() {
  const [theme, setTheme] = useState<Theme>(defaults.theme);
  const [variant, setVariant] = useState<Variant>(defaults.variant);
  const [size, setSize] = useState<Size>(defaults.size);
  const [loading, setLoading] = useState(defaults.loading);
  const [disabled, setDisabled] = useState(defaults.disabled);
  const [label, setLabel] = useState(defaults.label);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const applyTheme = useCallback((next: Theme) => {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      document.documentElement.setAttribute("data-theme", "light");
    };
  }, [theme]);

  const reset = useCallback(() => {
    setVariant(defaults.variant);
    setSize(defaults.size);
    setLoading(defaults.loading);
    setDisabled(defaults.disabled);
    setLabel(defaults.label);
    applyTheme(defaults.theme);
    setCopyStatus("idle");
  }, [applyTheme]);

  const snippet = useMemo(() => {
    const props = [
      variant !== "primary" ? `variant="${variant}"` : null,
      size !== "md" ? `size="${size}"` : null,
      loading ? "loading" : null,
      disabled ? "disabled" : null,
    ]
      .filter(Boolean)
      .join(" ");
    const open = props ? `<Button ${props}>` : "<Button>";
    return `${open}${label || "Button"}</Button>`;
  }, [variant, size, loading, disabled, label]);

  const onCopy = useCallback(async () => {
    const ok = await copyText(snippet);
    setCopyStatus(ok ? "copied" : "failed");
  }, [snippet]);

  const isLight = theme === "light";

  return (
    <div
      className="playground"
      data-theme={theme}
      style={{
        background: isLight ? "#ffffff" : "var(--color-bg)",
        color: isLight ? "#0f172a" : "var(--color-fg)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h1>Playground</h1>
      <p className="muted" style={{ color: isLight ? "#475569" : undefined }}>
        Safe composition sandbox — allowlisted tokens and components only.
      </p>

      <div className="theme-bar" role="group" aria-label="Theme">
        {themes.map((t) => (
          <button
            key={t}
            type="button"
            className={`ads-btn ads-btn--sm ${theme === t ? "ads-btn--primary" : "ads-btn--secondary"}`}
            aria-pressed={theme === t}
            onClick={() => applyTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <Stack gap={4}>
        <Card title="Controls">
          <Stack gap={3}>
            <Input
              id="playground-label"
              label="Button label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Select
              id="playground-variant"
              label="Variant"
              value={variant}
              onChange={(e) => setVariant(e.target.value as Variant)}
            >
              {variants.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
            <Select
              id="playground-size"
              label="Size"
              value={size}
              onChange={(e) => setSize(e.target.value as Size)}
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Switch id="playground-loading" label="Loading" checked={loading} onChange={setLoading} />
            <Checkbox
              id="playground-disabled"
              label="Disabled"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            <Cluster>
              <Button type="button" variant="secondary" size="sm" onClick={reset}>
                Reset
              </Button>
            </Cluster>
          </Stack>
        </Card>

        <Card title="Preview">
          <div
            style={{
              padding: "var(--space-6)",
              borderRadius: "var(--radius-lg)",
              background: isLight ? "#ffffff" : "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <Button variant={variant} size={size} loading={loading} disabled={disabled}>
              {label || "Button"}
            </Button>
          </div>
        </Card>

        <Card title="Copy output">
          <pre className="code" style={{ background: isLight ? "#f8fafc" : undefined }}>
            {snippet}
          </pre>
          <Cluster>
            <Button type="button" variant="secondary" size="sm" onClick={onCopy}>
              Copy code
            </Button>
            {copyStatus === "copied" ? (
              <span role="status" className="meta">
                Copied
              </span>
            ) : null}
            {copyStatus === "failed" ? (
              <span role="status" className="meta">
                Copy failed — select the snippet manually
              </span>
            ) : null}
          </Cluster>
        </Card>
      </Stack>
    </div>
  );
}
