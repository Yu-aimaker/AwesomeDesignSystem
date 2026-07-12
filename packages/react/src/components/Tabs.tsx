"use client";

import { useState, type ReactNode } from "react";
import { defineMetadata } from "../utils/metadata";

export const tabsMetadata = defineMetadata({ name: "Tabs", ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"], states: ["selected"] });

export function Tabs({ items, defaultValue }: { items: { value: string; label: string; content: ReactNode }[]; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? items[0]?.value ?? "");
  const active = items.find((i) => i.value === value) ?? items[0];
  return (
    <div className="ads-tabs">
      <div role="tablist" aria-label="Sections" className="ads-tablist">
        {items.map((item) => (
          <button key={item.value} role="tab" type="button" className="ads-tab" aria-selected={item.value === value} id={"tab-" + item.value} aria-controls={"panel-" + item.value} onClick={() => setValue(item.value)}>
            {item.label}
          </button>
        ))}
      </div>
      {active ? <div role="tabpanel" id={"panel-" + active.value} aria-labelledby={"tab-" + active.value} className="ads-motion-enter">{active.content}</div> : null}
    </div>
  );
}
Tabs.metadata = tabsMetadata;
