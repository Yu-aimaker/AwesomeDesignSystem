"use client";

import type { ReactNode } from "react";
import { getComponentMetadata } from "@awesome-ds/core/metadata";

export const accordionMetadata = getComponentMetadata("accordion");
export type AccordionItem = { id: string; title: string; content: ReactNode };
export type AccordionProps = { items: AccordionItem[] };

export function Accordion({ items }: AccordionProps) {
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
