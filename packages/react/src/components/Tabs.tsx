"use client";

import type { ReactNode } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
} from "react-aria-components";
import { getComponentMetadata } from "@awesome-ds/core/metadata";

export const tabsMetadata = getComponentMetadata("tabs");

export type TabItem = { value: string; label: string; content: ReactNode };
export type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  ariaLabel?: string;
};

export function Tabs({ items, defaultValue, ariaLabel = "Sections" }: TabsProps) {
  const fallback = defaultValue ?? items[0]?.value;
  return (
    <AriaTabs className="ads-tabs" {...(fallback ? { defaultSelectedKey: fallback } : {})} keyboardActivation="automatic">
      <TabList aria-label={ariaLabel} className="ads-tablist">
        {items.map((item) => <Tab key={item.value} id={item.value} className="ads-tab">{item.label}</Tab>)}
      </TabList>
      {items.map((item) => <TabPanel key={item.value} id={item.value} className="ads-tabpanel ads-motion-enter">{item.content}</TabPanel>)}
    </AriaTabs>
  );
}

Tabs.metadata = tabsMetadata;
