"use client";

import { cx, stateAttributes } from "@awesome-ds/core";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { defineMetadata } from "../utils/metadata";

export const iconButtonMetadata = defineMetadata({
  name: "IconButton",
  ruleIds: ["rule.a11y.wcag-aa", "rule.components.state-matrix"],
  states: ["idle", "disabled", "loading"],
});

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  loading?: boolean;
  children: ReactNode;
};

export function IconButton({ label, loading, disabled, className, children, type = "button", ...rest }: IconButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  return (
    <button type={type} aria-label={label} className={cx("ads-icon-btn", "ads-focus-ring", className)} disabled={isDisabled} {...stateAttributes({ disabled: isDisabled, loading })} {...rest}>
      {children}
    </button>
  );
}
IconButton.metadata = iconButtonMetadata;
