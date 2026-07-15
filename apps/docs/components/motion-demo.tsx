"use client";

import { useState } from "react";

type MotionItem = {
  intent: string;
  label: string;
  description: string;
};

export function MotionDemo({
  items,
  replayLabel,
  replayedLabel,
}: {
  items: readonly MotionItem[];
  replayLabel: string;
  replayedLabel: string;
}) {
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState("");

  function replay() {
    setRun((value) => value + 1);
    setStatus(replayedLabel);
  }

  return (
    <div className="motion-lab">
      <div className="motion-lab__toolbar">
        <code>rule.motion.purpose-first</code>
        <button className="quiet-button ads-motion-feedback" type="button" onClick={replay}>
          <span aria-hidden="true">↻</span> {replayLabel}
        </button>
      </div>
      <div className="motion-lab__stage" key={run}>
        {items.map((item, index) => (
          <article
            className={`motion-sample motion-sample--${item.intent} ${
              item.intent === "feedback" ? "ads-motion-feedback" : item.intent === "reveal" ? "ads-motion-reveal" : "ads-motion-enter"
            }`}
            key={`${item.intent}-${index}`}
          >
            <span className="motion-sample__marker" aria-hidden="true" />
            <div>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
            </div>
            <code>{item.intent}</code>
          </article>
        ))}
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
