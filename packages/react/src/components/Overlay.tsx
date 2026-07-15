"use client";

import { Children, isValidElement, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
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
  Link as AriaLink,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { cx, stateAttributes } from "@awesome-ds/core/runtime";
import { getComponentMetadata } from "@awesome-ds/core/metadata";
import { Button, type ButtonProps } from "./Button";
import { IconButton, type IconButtonProps } from "./IconButton";
import { Link, type LinkProps } from "./Link";

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

const fallbackEventNames = new Set([
  "onBlur", "onClick", "onFocus", "onKeyDown", "onKeyUp", "onMouseDown", "onMouseEnter",
  "onMouseLeave", "onMouseUp", "onPointerDown", "onPointerEnter", "onPointerLeave", "onPointerUp",
  "onTouchEnd", "onTouchStart",
]);

function safeFallbackProps(props: Record<string, unknown>) {
  const allowed = new Set([
    "accessKey", "autoFocus", "form", "formAction", "formEncType", "formMethod", "formNoValidate",
    "formTarget", "id", "name", "tabIndex", "title", "type", "value",
  ]);
  return Object.fromEntries(Object.entries(props).filter(([key]) =>
    allowed.has(key) || key.startsWith("aria-") || key.startsWith("data-") || fallbackEventNames.has(key),
  ));
}

function textFallback(value: ReactNode): string {
  let text = "";
  Children.forEach(value, (item) => {
    if (typeof item === "string" || typeof item === "number") text += String(item);
    else if (isValidElement<{ children?: ReactNode }>(item)) text += textFallback(item.props.children);
  });
  return text.trim() || "?";
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  let trigger: ReactNode;
  if (isValidElement<ButtonProps>(children) && children.type === Button) {
    const { children: content, variant = "primary", size = "md", loading = false, disabled, className, ...domProps } = children.props;
    const isDisabled = Boolean(disabled || loading);
    trigger = (
      <AriaButton
        {...stateAttributes({ disabled: isDisabled, loading, state: loading ? "loading" : disabled ? "disabled" : "idle" })}
        {...domProps as unknown as AriaButtonProps}
        className={cx("ads-btn", `ads-btn--${variant}`, `ads-btn--${size}`, "ads-focus-ring", className)}
        isDisabled={isDisabled}
      >
        {loading ? <span className="ads-spinner" aria-hidden="true" /> : null}
        <span>{content}</span>
      </AriaButton>
    );
  } else if (isValidElement<IconButtonProps>(children) && children.type === IconButton) {
    const { children: content, label: triggerLabel, loading = false, disabled, className, ...domProps } = children.props;
    const isDisabled = Boolean(disabled || loading);
    trigger = (
      <AriaButton
        {...stateAttributes({ disabled: isDisabled, loading })}
        {...domProps as unknown as AriaButtonProps}
        aria-label={triggerLabel}
        className={cx("ads-icon-btn", "ads-focus-ring", className)}
        isDisabled={isDisabled}
      >
        {content}
      </AriaButton>
    );
  } else if (isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(children) && children.type === "button") {
    const { children: content, disabled, className, ...domProps } = children.props;
    trigger = <AriaButton {...domProps as unknown as AriaButtonProps} className={className ?? "ads-tooltip-trigger"} isDisabled={Boolean(disabled)}>{content}</AriaButton>;
  } else if (isValidElement<LinkProps>(children) && children.type === Link) {
    const { children: content, className, ...domProps } = children.props;
    trigger = <AriaLink {...domProps as unknown as AriaLinkProps} className={cx("ads-link", className)}>{content}</AriaLink>;
  } else if (isValidElement<AnchorHTMLAttributes<HTMLAnchorElement>>(children) && children.type === "a") {
    const { children: content, className, href = "#", ...domProps } = children.props;
    trigger = <AriaLink {...domProps as unknown as AriaLinkProps} href={href} className={className ?? "ads-tooltip-trigger"}>{content}</AriaLink>;
  } else if (isValidElement<Record<string, unknown>>(children)) {
    const props = safeFallbackProps(children.props);
    const content = textFallback(children.props.children as ReactNode);
    if (typeof children.props.href === "string") {
      trigger = <AriaLink {...props as unknown as AriaLinkProps} href={children.props.href} data-tooltip-trigger-fallback="">{content}</AriaLink>;
    } else {
      trigger = <AriaButton {...props as unknown as AriaButtonProps} data-tooltip-trigger-fallback="">{content}</AriaButton>;
    }
  } else {
    trigger = <AriaButton className="ads-tooltip-trigger">{children}</AriaButton>;
  }
  return (
    <TooltipTrigger delay={0} closeDelay={0}>
      {trigger}
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
Tooltip.metadata = getComponentMetadata("tooltip");
DropdownMenu.metadata = getComponentMetadata("dropdown-menu");
