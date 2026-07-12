"use client";

import type { ReactNode } from "react";
import { getComponentMetadata } from "../contracts";
import { Button } from "./Button";

export const statusMetadata = getComponentMetadata("empty-state");

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return <section className="ads-card">{title ? <h3>{title}</h3> : null}{children}</section>;
}
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="ads-callout" aria-label={title}><strong>{title}</strong><div>{children}</div></aside>;
}
export function Skeleton({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return <span className="ads-skeleton" style={{ width, height }} aria-hidden="true" />;
}
export function Spinner({ label = "Loading" }: { label?: string }) {
  return <span className="ads-spinner" role="status" aria-label={label} />;
}
export function Progress({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="ads-visually-hidden">{label}: {clamped}%</div>
      <div className="ads-progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label}><span style={{ width: clamped + "%" }} /></div>
    </div>
  );
}
export function Toast({ children }: { children: ReactNode }) {
  return <div className="ads-toast" role="status">{children}</div>;
}
export function EmptyState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return <div className="ads-empty"><h3>{title}</h3><p>{description}</p>{actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}</div>;
}
export function ErrorState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return <div className="ads-error-state" role="alert"><h3>{title}</h3><p>{description}</p>{actionLabel ? <Button variant="danger" onClick={onAction}>{actionLabel}</Button> : null}</div>;
}
EmptyState.metadata = getComponentMetadata("empty-state");
ErrorState.metadata = getComponentMetadata("error-state");
