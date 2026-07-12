"use client";

import type { ReactNode } from "react";
import { getComponentMetadata } from "../contracts";

export const accordionMetadata = getComponentMetadata("accordion");

export function Accordion({ items }: { items: { id: string; title: string; content: ReactNode }[] }) {
  return (
    <div className="ads-accordion">
      {items.map((item) => (
        <details key={item.id} className="ads-motion-expand">
          <summary>{item.title}</summary>
          <div>{item.content}</div>
        </details>
      ))}
    </div>
  );
}
Accordion.metadata = accordionMetadata;
