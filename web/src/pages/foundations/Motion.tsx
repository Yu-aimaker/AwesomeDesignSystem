import { useState } from "react";
import { MotionConfig } from "motion/react";
import { PageHeader, Section } from "../../layout/Page";
import { Button } from "../../ds/components/Button";
import { Switch } from "../../ds/components/Switch";
import { SpringDragDemo } from "../../demos/MotionDemos";
import { durations, easings } from "../../lib/tokens";

const curves = [
  { name: "ease-out (token)", value: "var(--ds-ease-out)" },
  { name: "ease (CSS default)", value: "ease" },
  { name: "linear", value: "linear" },
];

export function Motion() {
  const [key, setKey] = useState(0);
  const [reduced, setReduced] = useState(false);
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div data-reduced-motion={reduced ? "true" : undefined}>
        <PageHeader title="モーション" lead="短く、ease-out で、ユーザーの操作に結びつける。" />
        <Section id="tokens" title="トークン">
          <ul className="t-mono grid gap-1 text-ink md:grid-cols-2">
            {durations.map((d) => (
              <li key={d.name}>
                duration-{d.name}: {d.value}
              </li>
            ))}
            {easings.map((e) => (
              <li key={e.name}>
                ease-{e.name}: {e.css}
              </li>
            ))}
          </ul>
        </Section>
        <Section id="reduced" title="reduced-motion の切り替え">
          <Switch label="このページのモーションを減らす" checked={reduced} onChange={setReduced} />
        </Section>
        <Section id="easing" title="イージング比較">
          <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
            再生
          </Button>
          <div key={key} className="mt-4 grid gap-4 md:grid-cols-3">
            {curves.map((c) => (
              <div key={c.name} className="rounded-lg border border-hairline bg-surface p-4">
                <p className="t-mono text-ink-muted">{c.name}</p>
                <div className="mt-3 h-10 w-10 rounded-md bg-primary" style={{ animation: `demo-enter var(--ds-duration-slower) ${c.value} both` }} />
              </div>
            ))}
          </div>
          <style>{`@keyframes demo-enter { from { opacity: 0; transform: translateY(8px); } }`}</style>
        </Section>
        <Section id="spring" title="スプリング">
          <SpringDragDemo />
        </Section>
      </div>
    </MotionConfig>
  );
}
