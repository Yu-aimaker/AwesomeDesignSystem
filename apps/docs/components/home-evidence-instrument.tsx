"use client";

import Link from "next/link";
import { useId, useState } from "react";

export type EvidenceTrace = {
  id: string;
  intent: string;
  reference: { title: string; href: string };
  rule: { id: string; title: string; href: string };
  artifact: { title: string; href: string };
};

export function HomeEvidenceInstrument({
  label,
  selectLabel,
  verifiedLabel,
  sourceLabel,
  ruleLabel,
  outputLabel,
  verificationLabel,
  verificationValue,
  verificationHealthy,
  traces,
}: {
  label: string;
  selectLabel: string;
  verifiedLabel: string;
  sourceLabel: string;
  ruleLabel: string;
  outputLabel: string;
  verificationLabel: string;
  verificationValue: string;
  verificationHealthy: boolean;
  traces: EvidenceTrace[];
}) {
  const panelId = useId();
  const [activeId, setActiveId] = useState(traces[0]?.id ?? "");
  const active = traces.find((trace) => trace.id === activeId) ?? traces[0];

  if (!active) return null;

  return (
    <aside className="evidence-instrument" aria-label={label}>
      <header className="evidence-instrument__header">
        <span>{label}</span>
        <span className="status-label"><i className="status-dot" aria-hidden="true" />{verifiedLabel}</span>
      </header>
      <div className="evidence-instrument__body">
        <div className="evidence-instrument__selector" role="group" aria-label={selectLabel}>
          {traces.map((trace, index) => (
            <button
              type="button"
              aria-controls={panelId}
              aria-pressed={trace.id === active.id}
              key={trace.id}
              onClick={() => setActiveId(trace.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{trace.intent}</span>
            </button>
          ))}
        </div>
        <div className="evidence-instrument__trace" id={panelId} aria-live="polite">
          <p><span>{selectLabel}</span><strong>{active.intent}</strong></p>
          <ol>
            <li>
              <Link href={active.reference.href}>
                <span>01</span>
                <span><small>{sourceLabel}</small><strong>{active.reference.title}</strong></span>
                <i aria-hidden="true">↗</i>
              </Link>
            </li>
            <li>
              <Link href={active.rule.href}>
                <span>02</span>
                <span><small>{ruleLabel}</small><code>{active.rule.id}</code></span>
                <i aria-hidden="true">↗</i>
              </Link>
            </li>
            <li>
              <Link href={active.artifact.href}>
                <span>03</span>
                <span><small>{outputLabel}</small><strong>{active.artifact.title}</strong></span>
                <i aria-hidden="true">↗</i>
              </Link>
            </li>
            <li className="evidence-instrument__verification">
              <span>04</span>
              <span><small>{verificationLabel}</small><strong>{verificationValue}</strong></span>
              <i className={`status-dot${verificationHealthy ? "" : " status-dot--attention"}`} aria-hidden="true" />
            </li>
          </ol>
        </div>
      </div>
    </aside>
  );
}
