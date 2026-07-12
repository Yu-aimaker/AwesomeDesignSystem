"use client";

import { cx } from "@awesome-ds/core";
import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { defineMetadata } from "../utils/metadata";
import { Button } from "./Button";

export const dialogMetadata = defineMetadata({ name: "Dialog", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"], states: ["open", "closed"] });

export function Dialog({ open, onClose, title, children, danger = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; danger?: boolean }) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="ads-dialog-backdrop" role="presentation" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} className={cx("ads-dialog", "ads-motion-enter")} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <h2 id={titleId}>{title}</h2>
        <div>{children}</div>
        <div className="ads-cluster" style={{ marginTop: "var(--space-4)" }}>
          <Button variant={danger ? "danger" : "primary"} onClick={onClose}>{danger ? "Confirm" : "Close"}</Button>
          {danger ? <Button variant="ghost" onClick={onClose}>Cancel</Button> : null}
        </div>
      </div>
    </div>
  );
}
export function AlertDialog(props: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return <Dialog {...props} danger />;
}
Dialog.metadata = dialogMetadata;
