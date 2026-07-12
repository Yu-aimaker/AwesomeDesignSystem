"use client";

import { useId, useState, type ReactNode } from "react";
import { defineMetadata } from "../utils/metadata";
import { Button } from "./Button";

export const overlayMetadata = defineMetadata({ name: "Overlay", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"], states: ["open", "closed"] });

export function Popover({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Button variant="secondary" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>{label}</Button>
      {open ? <div id={id} role="dialog" className="ads-popover" style={{ position: "absolute", top: "calc(100% + 0.5rem)", zIndex: 10 }}>{children}</div> : null}
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <span tabIndex={0} aria-describedby={id}>{children}</span>
      <span role="tooltip" id={id} className="ads-tooltip" style={{ position: "absolute", bottom: "calc(100% + 0.35rem)", whiteSpace: "nowrap" }}>{label}</span>
    </span>
  );
}

export function DropdownMenu({ label, items }: { label: string; items: { id: string; label: string; onSelect?: () => void }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Button variant="secondary" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{label}</Button>
      {open ? (
        <div role="menu" className="ads-menu" style={{ position: "absolute", top: "calc(100% + 0.5rem)", zIndex: 10 }}>
          {items.map((item) => (
            <button key={item.id} role="menuitem" type="button" className="ads-btn ads-btn--ghost ads-btn--sm" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => { item.onSelect?.(); setOpen(false); }}>
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
Popover.metadata = overlayMetadata;
