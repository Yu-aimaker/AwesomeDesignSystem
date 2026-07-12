"use client";

import type { ReactNode } from "react";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover as AriaPopover,
  Tooltip as AriaTooltip,
  TooltipTrigger,
} from "react-aria-components";
import { getComponentMetadata } from "../contracts";

export const overlayMetadata = getComponentMetadata("popover");

export function Popover({ label, children }: { label: string; children: ReactNode }) {
  return (
    <DialogTrigger>
      <AriaButton className="ads-btn ads-btn--secondary ads-btn--md">{label}</AriaButton>
      <AriaPopover className="ads-popover" placement="bottom start">
        <AriaDialog aria-label={label}>{children}</AriaDialog>
      </AriaPopover>
    </DialogTrigger>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <TooltipTrigger delay={0} closeDelay={0}>
      <AriaButton className="ads-tooltip-trigger" aria-label={label}>{children}</AriaButton>
      <AriaTooltip className="ads-tooltip" placement="top">{label}</AriaTooltip>
    </TooltipTrigger>
  );
}

export type DropdownMenuItem = {
  id: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
};

export function DropdownMenu({ label, items }: { label: string; items: DropdownMenuItem[] }) {
  return (
    <MenuTrigger>
      <AriaButton className="ads-btn ads-btn--secondary ads-btn--md">{label}</AriaButton>
      <AriaPopover className="ads-menu-popover" placement="bottom start">
        <Menu
          className="ads-menu"
          aria-label={label}
          disabledKeys={items.filter((item) => item.disabled).map((item) => item.id)}
          onAction={(key) => items.find((item) => item.id === String(key))?.onSelect?.()}
        >
          {items.map((item) => (
            <MenuItem id={item.id} key={item.id} className="ads-menu-item">{item.label}</MenuItem>
          ))}
        </Menu>
      </AriaPopover>
    </MenuTrigger>
  );
}

Popover.metadata = overlayMetadata;
