"use client";

import type { ReactNode } from "react";
import { defineMetadata } from "../utils/metadata";

export const accordionMetadata = defineMetadata({ name: "Accordion", ruleIds: ["rule.a11y.wcag-aa", "rule.motion.purpose-first"], states: ["expanded", "collapsed"] });

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
