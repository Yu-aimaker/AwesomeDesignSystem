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

type CalibratorLabels = {
  hint: string;
  selectLabel: string;
  calibrating: string;
  calibrated: string;
  stageSource: string;
  stageRule: string;
  stageArtifact: string;
  stageVerdict: string;
  verified: string;
  needsReview: string;
  openLabel: string;
};

/**
 * The signature AwesomeDS moment: a live "proof instrument". Pick a design intent
 * and it calibrates through the real evidence graph — source → rule → artifact →
 * verdict — driven by an ember calibration sweep. Each stage is a real link.
 * Reduced motion collapses the sweep to an instant, fully-lit readout.
 */
export function ProofCalibrator({
  labels,
  traces,
  healthy,
}: {
  labels: CalibratorLabels;
  traces: EvidenceTrace[];
  healthy: boolean;
}) {
  const railId = useId();
  const [activeId, setActiveId] = useState(traces[0]?.id ?? "");
  // runId restarts the CSS sweep animation on every selection.
  const [runId, setRunId] = useState(0);
  const active = traces.find((trace) => trace.id === activeId) ?? traces[0];

  if (!active) return null;

  const select = (id: string) => {
    setActiveId(id);
    setRunId((value) => value + 1);
  };

  const stages = [
    { n: "01", kind: labels.stageSource, value: active.reference.title, href: active.reference.href, mono: false },
    { n: "02", kind: labels.stageRule, value: active.rule.id, href: active.rule.href, mono: true },
    { n: "03", kind: labels.stageArtifact, value: active.artifact.title, href: active.artifact.href, mono: false },
  ];

  return (
    <section className="calibrator" aria-label={labels.selectLabel}>
      {/* Industrial signature: the giant PROOF wordmark on a measuring plane. */}
      <div className="calibrator__stage" aria-hidden="true">
        <span className="calibrator__word">PROOF</span>
        <span className="calibrator__ruler" />
      </div>

      <div className="calibrator__console">
        <div className="calibrator__intents" role="group" aria-label={labels.selectLabel}>
          {traces.map((trace, index) => (
            <button
              type="button"
              key={trace.id}
              aria-pressed={trace.id === active.id}
              aria-controls={railId}
              onClick={() => select(trace.id)}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{trace.intent}</span>
            </button>
          ))}
        </div>

        <div className="calibrator__readout" id={railId} aria-live="polite">
          <p className="calibrator__hint">{labels.hint}</p>
          <ol className="calibrator__rail" key={runId}>
            {stages.map((stage, index) => (
              <li
                className="calibrator__stage-row"
                key={stage.n}
                style={{ "--i": index } as React.CSSProperties}
              >
                <Link href={stage.href}>
                  <span className="calibrator__stage-index" aria-hidden="true">{stage.n}</span>
                  <span className="calibrator__stage-body">
                    <small>{stage.kind}</small>
                    {stage.mono ? <code>{stage.value}</code> : <strong>{stage.value}</strong>}
                  </span>
                  <span className="calibrator__stage-open" aria-hidden="true">{labels.openLabel} ↗</span>
                </Link>
              </li>
            ))}
            <li className="calibrator__stage-row calibrator__verdict" style={{ "--i": 3 } as React.CSSProperties}>
              <span className="calibrator__stage-index" aria-hidden="true">04</span>
              <span className="calibrator__stage-body">
                <small>{labels.stageVerdict}</small>
                <strong>{healthy ? labels.verified : labels.needsReview}</strong>
              </span>
              {/* One controlled surprise: on each selection the ember "acquires
                  the target" — a functional completion cue that the trace fully
                  resolved. Calm, on-brand, and honest about health. Reduced motion
                  shows it pre-registered; the accessible verdict is the label. */}
              <span
                className={`calibrator__lock${healthy ? "" : " calibrator__lock--attention"}`}
                aria-hidden="true"
              >
                <span className="calibrator__lock-ember" aria-hidden="true" />
                <span className="calibrator__lock-target" aria-hidden="true" />
              </span>
            </li>
            <li className="calibrator__sweep" aria-hidden="true" />
          </ol>
        </div>
      </div>
    </section>
  );
}
