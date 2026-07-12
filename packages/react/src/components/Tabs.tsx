"use client";

import type { ReactNode } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
} from "react-aria-components";
import { defineMetadata } from "../utils/metadata";

export const tabsMetadata = defineMetadata({
  name: "Tabs",
  ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"],
  states: ["selected"],
});

export function Tabs({ items, defaultValue }: { items: { value: string; label: string; content: ReactNode }[]; defaultValue?: string }) {
  const fallback = defaultValue ?? items[0]?.value;
  return (
    <AriaTabs className="ads-tabs" {...(fallback ? { defaultSelectedKey: fallback } : {})} keyboardActivation="automatic">
      <TabList aria-label="Sections" className="ads-tablist">
        {items.map((item) => <Tab key={item.value} id={item.value} className="ads-tab">{item.label}</Tab>)}
      </TabList>
      {items.map((item) => <TabPanel key={item.value} id={item.value} className="ads-tabpanel ads-motion-enter">{item.content}</TabPanel>)}
    </AriaTabs>
  );
}

Tabs.metadata = tabsMetadata;
