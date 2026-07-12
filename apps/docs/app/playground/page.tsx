"use client";

import { useMemo, useState } from "react";
import { Button, Card, Input, Stack, Switch } from "@awesome-ds/react";

const themes = ["light", "dark", "high-contrast"] as const;

export default function PlaygroundPage() {
  const [theme, setTheme] = useState<(typeof themes)[number]>("light");
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("Launch");
  const snippet = useMemo(
    () => `<Button loading={${loading}}>{${JSON.stringify(label)}}</Button>`,
    [loading, label],
  );

  return (
    <div data-theme={theme}>
      <h1>Playground</h1>
      <p className="muted">Safe composition sandbox — allowlisted tokens and components only.</p>
      <div className="theme-bar">
        {themes.map((t) => (
          <button key={t} type="button" className="ads-btn ads-btn--secondary ads-btn--sm" onClick={() => {
            setTheme(t);
            document.documentElement.setAttribute("data-theme", t);
          }}>{t}</button>
        ))}
      </div>
      <Stack gap={4}>
        <Card title="Controls">
          <Input id="label" label="Button label" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Switch id="loading" label="Loading state" checked={loading} onChange={setLoading} />
        </Card>
        <Card title="Preview">
          <Button loading={loading}>{label || "Button"}</Button>
        </Card>
        <Card title="Copy output">
          <pre className="code">{snippet}</pre>
        </Card>
      </Stack>
    </div>
  );
}
